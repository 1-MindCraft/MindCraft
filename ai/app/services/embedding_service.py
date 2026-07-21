"""
RAG 노드 선별
    문항과 마인드맵 노드들의 임베딩 유사도를 계산해 
    관련 높은 노드만 골라낸다.
    선발된 노드 + 조상을 포함해 트리 맥락을 유지한 노드 집합을 반환.

설계
    임베딩: OpenAI text-embedding-3-small
    유사도: 코사인 (numpy, 인메모리 )
    후보: parentId 있는 노드
    선별: 상위 TOP_K + 임계값 다 미달이면 최소 상위 1개 보장하게
    검색: 문항 / 직무 / 회사 3축 독립 임베딩 후 가중합
    쿼리: 짧은 문항 제목은 LLM으로 서술문 확장 후 임베딩
"""

from typing import List, Tuple, Dict

import httpx
import numpy as np
from openai import OpenAI, APIError

from app.core.config import settings
from app.schemas.coverletter import MindMapNode


# llm_service와 동일한 SSL 우회 (교육장 환경). 배포 시 원복.
_http_client = httpx.Client(verify=False)
_client = OpenAI(api_key=settings.OPENAI_API_KEY, http_client=_http_client)

EMBEDDING_MODEL = "text-embedding-3-small"
TOP_K = 4                    # 선별 최대 개수
SIMILARITY_THRESHOLD = 0.25   # 이 미만은 관련 없음으로 제외

# 3축 검색 가중치 (합 1.0)
#   문항: 무엇을 묻는가          -> 어떤 소재가 문항에 답이 되는가
#   직무: 어떤 역량이 필요한가    -> 그 중 직무와 맞닿은 소재 우대
#   회사: 어떤 인재를 원하는가    -> 최종 우선순위 보정
# 쿼리 문자열을 합치지 않고 축을 분리한 이유:
#   문자열을 합치면 텍스트 길이가 곧 영향력이 되어,
#   짧은 문항("취미")이 긴 직무설명에 압도당함. 축 분리로 지분을 고정.
QUESTION_WEIGHT = 0.5
JOB_WEIGHT = 0.3
COMPANY_WEIGHT = 0.2

# 쿼리 확장: 짧은 문항 제목("지원동기")은 임베딩 변별력이 낮아
# LLM으로 "어떤 경험이 필요한 문항인가"를 서술문으로 펼쳐 함께 임베딩한다.
QUERY_EXPANSION_MODEL = "gpt-4o-mini"
QUERY_EXPANSION_TIMEOUT = 5.0

# 문항 문자열 -> 확장 결과. 프로세스 생명주기 동안 유지(문항은 재사용이 잦음).
_expansion_cache: Dict[str, str] = {}

_EXPANSION_SYSTEM = (
    "너는 자기소개서 문항을 검색 쿼리로 확장하는 도우미다. "
    "주어진 문항에 답하려면 지원자의 어떤 경험, 활동, 역량이 필요한지 "
    "한국어 1~2문장으로 서술하라. "
    "문항을 설명하거나 되묻지 말고, 필요한 경험의 종류를 구체적인 명사 위주로 서술하라."
)


class EmbeddingError(Exception):
    """임베딩 생성 실패. 라우터에서 잡아 처리."""


def _build_node_embedding_text(node: MindMapNode, id_map: Dict[str, MindMapNode]) -> str:
    """
    노드 하나를 임베딩할 텍스트 생성.
    계층 경로 + keywords 포함.
    예) "수학 성적이 좋았음 > 수학올림피아드 우승 (keywords: 수학, 올림피아드)"
    """
    # 루트까지 조상 경로 수집
    path = []
    cur = node
    visited = set()  # 순환 방지
    while cur is not None and cur.id not in visited:
        visited.add(cur.id)
        path.append(cur.topic)
        cur = id_map.get(cur.parentId) if cur.parentId else None
    path.reverse()  # 루트 → 현재 순

    # 루트(사용자 이름)는 모든 노드에 공통이라 변별력 없음 → 제외
    if len(path) > 1:
        path = path[1:]

    text = " > ".join(path)
    if node.keywords:
        text += f" (keywords: {', '.join(node.keywords)})"
    return text


def _embed(texts: List[str]) -> np.ndarray:
    """텍스트 리스트 → 임베딩 배열 (배치 1회 호출)."""
    try:
        res = _client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    except APIError as e:
        raise EmbeddingError(f"임베딩 생성 실패: {e}") from e
    return np.array([d.embedding for d in res.data], dtype=np.float32)


def _cosine_sim(query_vec: np.ndarray, node_vecs: np.ndarray) -> np.ndarray:
    """query 1개 vs node 여러 개 코사인 유사도."""
    q_norm = query_vec / (np.linalg.norm(query_vec) + 1e-8)
    n_norms = node_vecs / (np.linalg.norm(node_vecs, axis=1, keepdims=True) + 1e-8)
    return n_norms @ q_norm


def _collect_ancestors(node: MindMapNode, id_map: Dict[str, MindMapNode]) -> List[str]:
    """노드의 조상 id들 (루트까지)."""
    ancestors = []
    cur = id_map.get(node.parentId) if node.parentId else None
    visited = set()
    while cur is not None and cur.id not in visited:
        visited.add(cur.id)
        ancestors.append(cur.id)
        cur = id_map.get(cur.parentId) if cur.parentId else None
    return ancestors


def _expand_question(question: str) -> str:
    """
    문항을 검색용 서술문으로 확장. 원문 + 확장문을 함께 반환.
    실패하면 원문 그대로 반환(생성 흐름을 막지 않는다).
    """
    q = (question or "").strip()
    if not q:
        return question

    cached = _expansion_cache.get(q)
    if cached is not None:
        return cached

    try:
        res = _client.chat.completions.create(
            model=QUERY_EXPANSION_MODEL,
            messages=[
                {"role": "system", "content": _EXPANSION_SYSTEM},
                {"role": "user", "content": f"문항: {q}"},
            ],
            temperature=0.0,
            max_tokens=120,
            timeout=QUERY_EXPANSION_TIMEOUT,
        )
        expanded = (res.choices[0].message.content or "").strip()
    except Exception as e:
        # 확장은 품질 개선 목적이므로 실패해도 검색 자체는 진행한다.
        print(f"[쿼리 확장 실패] {type(e).__name__}: {e} -> 원문 사용")
        return question

    if not expanded:
        return question

    merged = f"{q}\n{expanded}"
    _expansion_cache[q] = merged
    return merged


def _build_question_query(question: str) -> str:
    """문항 축: '무엇을 묻는가'. 짧은 문항은 서술문으로 확장해 변별력 확보."""
    return _expand_question(question)


def _build_job_query(job_description: str | None) -> str:
    """직무 축: '어떤 역량·경험이 필요한가'."""
    return f"직무: {job_description}" if job_description else ""


def _build_company_query(company_name: str, company_ideal: str | None) -> str:
    """회사 축: '어떤 인재를 원하는가'."""
    parts = []
    if company_name:
        parts.append(f"회사: {company_name}")
    if company_ideal:
        parts.append(f"인재상: {company_ideal}")
    return "\n".join(parts) if parts else ""


def select_relevant_nodes(
    question: str,
    nodes: List[MindMapNode],
    company_name: str = "",
    company_ideal: str | None = None,
    job_description: str | None = None,
) -> Tuple[List[MindMapNode], List[str], List[str]]:
    """
    문항과 관련 높은 노드 선별 (3축 가중 검색).

    최종점수 = 0.5*문항유사도 + 0.3*직무유사도 + 0.2*회사유사도
    비어 있는 축(직무/회사 미입력)은 가중치를 나머지 축에 비례 재분배.
    """
    id_map = {n.id: n for n in nodes}

    # 선별 후보 = parentId 있는 노드 (루트 제외)
    candidates = [n for n in nodes if n.parentId is not None]

    # 후보 없으면(노드가 루트뿐 등) 전체 노드 그대로 반환
    if not candidates:
        all_ids = [n.id for n in nodes]
        return nodes, all_ids, all_ids

    # 축 구성: (축 이름, 쿼리, 기본 가중치)
    axes = [
        ("문항", _build_question_query(question), QUESTION_WEIGHT),
        ("직무", _build_job_query(job_description), JOB_WEIGHT),
        ("회사", _build_company_query(company_name, company_ideal), COMPANY_WEIGHT),
    ]
    active = [(name, q, w) for name, q, w in axes if q]

    # 전 축이 비면(문항까지 빈 문자열) 선별 불가 → 전체 반환
    if not active:
        all_ids = [n.id for n in nodes]
        return nodes, all_ids, all_ids

    # 살아있는 축끼리 가중치 정규화 (합 1.0)
    weight_sum = sum(w for _, _, w in active)
    norm_weights = [w / weight_sum for _, _, w in active]

    node_texts = [_build_node_embedding_text(n, id_map) for n in candidates]

    # 쿼리들 + 노드들 한 번에 임베딩 (API 1회 호출)
    queries = [q for _, q, _ in active]
    all_vecs = _embed(queries + node_texts)
    node_vecs = all_vecs[len(queries):]

    # 축별 유사도 계산
    axis_sims: Dict[str, np.ndarray] = {}
    final_sims = np.zeros(len(candidates), dtype=np.float32)
    for i, ((name, _, _), weight) in enumerate(zip(active, norm_weights)):
        sims = _cosine_sim(all_vecs[i], node_vecs)
        axis_sims[name] = sims
        final_sims += weight * sims

    # 로그·정렬용: 비활성 축은 0으로 채움
    zeros = np.zeros(len(candidates), dtype=np.float32)
    q_sims = axis_sims.get("문항", zeros)
    j_sims = axis_sims.get("직무", zeros)
    c_sims = axis_sims.get("회사", zeros)

    # 최종점수 내림차순 정렬
    ranked = sorted(
        zip(candidates, final_sims, q_sims, j_sims, c_sims, node_texts),
        key=lambda x: x[1],
        reverse=True,
    )

    # TODO: 디버깅용 출력. 배포 시 제거
    print("\n=== 노드별 유사도 (최종 | 문항 | 직무 | 회사) ===")
    for (name, q, _), weight in zip(active, norm_weights):
        print(f"[{name} x{weight:.2f}] {q!r}")
    for cand, final, q, j, c, text in ranked:
        print(f"{final:.3f} | {q:.3f} | {j:.3f} | {c:.3f}  {text}")
    print("===============================================\n")

    # 임계값 넘는 것 중 상위 TOP_K, 다 미달이면 상위 1개 보장
    selected = [item[0] for item in ranked if item[1] >= SIMILARITY_THRESHOLD][:TOP_K]
    if not selected:
        selected = [ranked[0][0]]

    selected_ids = [n.id for n in selected]

    # 선별 노드 + 조상 확장
    context_ids: set[str] = set()
    for node in selected:
        context_ids.add(node.id)
        context_ids.update(_collect_ancestors(node, id_map))

    # 원본 노드 순서 유지하며 context 노드 구성
    context_nodes = [n for n in nodes if n.id in context_ids]

    return context_nodes, selected_ids, list(context_ids)