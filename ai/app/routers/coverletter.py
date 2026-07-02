"""
자소서 생성 API 엔드포인트 (HTTP 계층).
- 요청/응답 스키마 검증은 FastAPI가 담당
- 실제 생성 로직은 coverletter_service에 위임
- 서비스에서 올라온 LLMGenerationError를 HTTP 422로 변환
"""
from fastapi import APIRouter, HTTPException, status

from app.schemas.coverletter import (
    CoverLetterGenerateRequest,
    CoverLetterGenerateResponse,
)
from app.services.coverletter_service import generate_coverletter
from app.services.llm_service import LLMGenerationError

router = APIRouter(
    prefix="/coverletters",
    tags=["CoverLetter"],
)


@router.post(
    "/{id}/sections",
    response_model=CoverLetterGenerateResponse,
    status_code=status.HTTP_200_OK,
)
def generate_cover_letter_api(
    id: int,   # 경로 계약상 존재. 저장/id 발급은 Spring 담당이라 여기선 미사용
    request: CoverLetterGenerateRequest,
) -> CoverLetterGenerateResponse:
    """
    Spring이 조립한 요청(회사정보 + 문항 + 옵션 + 평탄화된 노드)을 받아
    자소서 본문(answer)을 생성해 반환한다. FastAPI는 저장하지 않는다(stateless).
    """
    try:
        return generate_coverletter(request)
    except LLMGenerationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        ) from e