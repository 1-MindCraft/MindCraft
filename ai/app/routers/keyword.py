"""
POST /mindmaps/keywords - 마인드맵 노드 키워드 추출.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.keyword import KeywordExtractRequest, KeywordExtractResponse
from app.services.keyword_service import extract_keywords
from app.services.llm_service import LLMGenerationError

router = APIRouter(tags=["keyword"])


@router.post("/mindmaps/keywords", response_model=KeywordExtractResponse)
def extract_keywords_endpoint(req: KeywordExtractRequest) -> KeywordExtractResponse:
    """마인드맵 전체 노드의 키워드를 추출한다."""
    try:
        return extract_keywords(req)
    except LLMGenerationError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e