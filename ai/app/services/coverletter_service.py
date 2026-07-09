from app.schemas.coverletter import (
    CoverLetterGenerateRequest,
    CoverLetterGenerateResponse,
)
from app.prompts.coverletter import build_prompts
from app.services.llm_service import generate_section
from app.services.embedding_service import select_relevant_nodes

def generate_coverletter(req: CoverLetterGenerateRequest) -> CoverLetterGenerateResponse:
    """
    자소서 섹션 본문 생성 (v2: RAG 노드 선별)
    
    v1: 전체 노드를 프롬프트에 전달
    v2: 문항 + 회사컨텍스트와 관련 높은 노드만 선별해 전달,
        선별 결과를 응답에 포함 (프론트 하이라이트에 뛰울거라)
    """
    # 1. RAG: 관련 노드 선별 (선별 노드 + 조상 = context)
    context_nodes, selected_ids, context_ids = select_relevant_nodes(
        question=req.question,
        nodes=req.source_node,
        company_name=req.company_name,
        company_ideal=req.company_ideal,
        job_description=req.job_description,
    )

    # 선별된 노드로 프롬프트 구성
    #     req를 직접 수정하지 않고 source_node만 교체한 복사본 사용
    rag_req = req.model_copy(update={"source_node" : context_nodes})
    system_prompt, user_prompt = build_prompts(rag_req)

    # OpenAI 호출 (실패 시 LLMGenerationError 전파)
    llm_output = generate_section(system_prompt, user_prompt)

    # 응답
    return CoverLetterGenerateResponse(
        answer=llm_output.answer,
        selected_node_ids=selected_ids,
        context_node_ids=context_ids,
    )
    
