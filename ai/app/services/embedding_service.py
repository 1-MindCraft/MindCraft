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


class EmbeddingError(Exception):
    """임베딩 생성 실패. 라우터에서 잡아 처리."""


def _build_node_embedding_text(node: MindMapNode, id_map: Dict[str, MindMapNode]) -> str:
    """
    노드 하나를 임베딩할 텍스트 생성.
    계층 경로 + keywords 포함.
    예) "고등학교 > 수학 성적이 좋았음 > 수학올림피아드 우승 (keywords: 수학, 올림피아드)"
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

def _build_query_text(
    question: str,
    company_name: str,
    company_ideal: str | None,
    job_description: str | None,
) -> str:
    """유사도 쿼리 텍스트: 문항 + 회사 컨텍스트."""
    parts = [question]
    if company_name:
        parts.append(f"회사: {company_name}")
    if company_ideal:
        parts.append(f"인재상: {company_ideal}")
    if job_description:
        parts.append(f"직무: {job_description}")
    return "\n".join(parts)

def select_relevant_nodes(
    question: str,
    nodes: List[MindMapNode],
    company_name: str = "",
    company_ideal: str | None = None,
    job_description: str | None = None,
    
) -> Tuple[List[MindMapNode], List[str], List[str]]:
    """
    문항과 관련 높은 노드 선별.

    Returns:
        (context_nodes, selected_ids, context_ids)
        - context_nodes: 선별 노드 + 조상 포함, 프롬프트에 넘길 노드들
        - selected_ids:  직접 선별된 노드 id (네온사인 강조)
        - context_ids:   조상 포함 전체 id
    """
    id_map = {n.id: n for n in nodes}

    # 선별 후보 = parentId 있는 노드 (루트 제외)
    candidates = [n for n in nodes if n.parentId is not None]

    # 후보 없으면(노드가 루트뿐 등) 전체 노드 그대로 반환 
    if not candidates:
        all_ids = [n.id for n in nodes]
        return nodes, all_ids, all_ids

    # 임베딩: 문항 + 후보 노드들
    query_text = _build_query_text(question, company_name, company_ideal, job_description)

    node_texts = [_build_node_embedding_text(n, id_map) for n in candidates]
    all_vecs = _embed([query_text] + node_texts)   # question 대신 query_text
    q_vec, node_vecs = all_vecs[0], all_vecs[1:]

    sims = _cosine_sim(q_vec, node_vecs)

    # 유사도 내림차순 정렬
    ranked = sorted(zip(candidates, sims), key=lambda x: x[1], reverse=True)

    # 유사도 내림차순 정렬
    ranked = sorted(zip(candidates, sims), key=lambda x: x[1], reverse=True)

    # TODK: 배포 전 제거 점수 확인용 로그
    print("\n=== 노드별 유사도 ===")
    for n, s in ranked:
        print(f"{s:.3f}  {n.topic}")
    print("====================\n")

    # 임계값 넘는 것 중 상위 TOP_K
    selected = [n for n, s in ranked if s >= SIMILARITY_THRESHOLD][:TOP_K]

    # 임계값 넘는 것 중 상위 TOP_K
    selected = [n for n, s in ranked if s >= SIMILARITY_THRESHOLD][:TOP_K]

    # 다 미달이면 최소 상위 1개는 보장 (빈 선별 방지)
    if not selected:
        selected = [ranked[0][0]]

    selected_ids = [n.id for n in selected]

    # 선별 노드 + 조상 포함 → context
    context_id_set = set(selected_ids)
    for n in selected:
        context_id_set.update(_collect_ancestors(n, id_map))

    context_nodes = [n for n in nodes if n.id in context_id_set]
    context_ids = [n.id for n in context_nodes]

    return context_nodes, selected_ids, context_ids

