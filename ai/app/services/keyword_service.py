"""
마인드맵 노드 키워드 추출
- 프롬프트 조립 -> LLM 호출 -> 결과 검증 후 반환
- LLM이 없는 id를 지어내거나 노드를 빼뜨릴 수 있으니 입력 노드 기준으로 결괄르 정규화
"""

from app.prompts.keyword import build_keyword_prompts
from app.schemas.keyword import (
    KeywordExtractRequest,
    KeywordExtractResponse,
    NodeKeywords,
)
from app.services.llm_service import extract_keywords_llm

MAX_KEYWORDS_PER_NODE = 2

def extract_keywords(req: KeywordExtractRequest) -> KeywordExtractResponse:
    """
    마인드맵 전체 노드의 키워드를 한 번의 LLM 호출로 추출
    
    Returns:
        KeywordExtractResponse: 입력 노드와 1:1 대응하는 키워드 결과
    
    LLMGenerationError: LLM 호출 실패 -> 라우터로 422로
    """
    system_prompt, user_prompt = build_keyword_prompts(req.source_node)

    llm_result = extract_keywords_llm(system_prompt, user_prompt)

    # LLM 결과를 id -> keywords 로 매핑 (없는 id를 지어냈다면 여기서 걸러짐)
    valid_ids = {node.id for node in req.source_node}
    keyword_map = {
        item.id: item.keywords
        for item in llm_result.nodes
        if item.id in valid_ids
    }

    # 입력 노드 순서를 기준으로 결과 재구성
    #  LLM이 빠뜨린 노드는 빈 배열로 채움
    #  개수 초과분은 잘라냄 (Pydantic max_length가 있지만 방어적으로 한 번 더)
    nodes = [
        NodeKeywords(
            id=node.id,
            keywords=keyword_map.get(node.id, [])[:MAX_KEYWORDS_PER_NODE],
        )
        for node in req.source_node
    ]

    return KeywordExtractResponse(nodes=nodes) 