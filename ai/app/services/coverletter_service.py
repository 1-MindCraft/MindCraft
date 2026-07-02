from app.schemas.coverletter import (
    CoverLetterGenerateRequest,
    CoverLetterGenerateResponse,
)
from app.prompts.coverletter import build_prompts
from app.services.llm_service import generate_section

def generate_coverletter(req: CoverLetterGenerateRequest) -> CoverLetterGenerateResponse:
    """
    자소서 섹션 본문 생성.
    Args:
        req: 회사 정보 + 문항 + 옵션 + 마인드맵 노드
    Returns:
        CoverLetterGenerateResponse: { answer }
    Raises:
        LLMGenerationError: 생성 실패 (라우터에서 422로 변환)
    """
    # 프롬프트 생성 
    system_prompt, user_prompt = build_prompts(req)

    # OpenAI 호출
    # 실패 시 LLMGenerationError가 그대로 위로 전파됨
    llm_output = generate_section(system_prompt, user_prompt)

    # 응답 스키마로 정리해 반환
    return CoverLetterGenerateResponse(answer=llm_output.answer)
    
