"""
마인드맵 노드 키워드 추출 프롬프트.
- 노드 트리 텍스트 + 규칙을 조립해 LLM에 넘긴다.
- 핵심 규칙: '구체적 활동/분야' + '드러나는 역량'을 섞어서 뽑을 것.
    범용어만 나열하면 모든 노드가 비슷해져서
    RAG 유사도 계산 시 변별력이 사라진다.
"""

from collections import defaultdict
from typing import List

from app.schemas.coverletter import MindMapNode


def build_keyword_node_text(nodes: List[MindMapNode]) -> str:

    children = defaultdict(list)
    all_ids = {n.id for n in nodes}

    for n in nodes:
        # 부모가 목록에 없으면(고아 노드) 루트로 취급
        parent = n.parentId if n.parentId in all_ids else None
        children[parent].append(n)

    lines: List[str] = []

    def walk(parent_id, depth: int) -> None:
        for node in children[parent_id]:
            indent = "  " * depth
            lines.append(f"{indent}- [{node.id}] {node.topic}")
            walk(node.id, depth + 1)

    walk(None, 0)
    return "\n".join(lines)


def build_keyword_system_prompt() -> str:
    """키워드 추출 규칙."""
    return (
        "당신은 자기소개서 작성을 돕는 마인드맵 분석 도우미입니다.\n"
        "사용자의 마인드맵 각 노드에서, 그 경험이 드러내는 특성을 키워드로 추출하세요.\n\n"
        "[추출 규칙]\n"
        "- 노드마다 키워드는 2개로 추출하세요.\n"
        "- 키워드는 '구체적 활동/분야'와 '드러나는 역량'을 함께 담아야 합니다. "
        "추상적인 역량어만 나열하면 모든 노드가 비슷해져 구분이 되지 않습니다.\n"
        "  - 나쁜 예: \"수영 대회 출전\" → [\"끈기\", \"열정\", \"도전\"]\n"
        "  - 좋은 예: \"수영 대회 출전\" → [\"수영\", \"체력관리\", \"끈기\"]\n"
        "- 루트 노드(사람 이름 등)처럼 경험이 아닌 노드는 keywords를 빈 배열([])로 두세요.\n"
        "- 부모 노드의 맥락을 참고해 판단하세요. "
        "(예: \"개발 경험 > 팀 프로젝트\"의 '팀 프로젝트'는 개발 맥락의 협업입니다)\n"
        "- 입력받은 모든 노드를 빠짐없이, id를 그대로 반환하세요. id를 임의로 생성하지 마세요.\n"
        "- 키워드는 한국어 명사구로, 각 10자 이내로 간결하게 작성하세요."
    )


def build_keyword_user_prompt(node_text: str) -> str:
    """실제 노드 데이터."""
    return (
        "다음은 사용자의 마인드맵입니다. 각 노드의 키워드를 추출하세요.\n\n"
        "[마인드맵]\n"
        f"{node_text}"
    )


def build_keyword_prompts(nodes: List[MindMapNode]) -> tuple[str, str]:
    """(system, user) 튜플 반환. 라우터/서비스에서 이것만 호출하면 됨."""
    node_text = build_keyword_node_text(nodes)
    return build_keyword_system_prompt(), build_keyword_user_prompt(node_text)