from typing import List, Optional

from pydantic import BaseModel, Field

# 들어온 노드 데이터(JSON)이 제대로 생겼는지 검사 + 코드에 쓰기 편하게 객체로 바꿔주는 클래스
class MindMapNode(BaseModel):
    """
    마인드맵 노드. 저장/전달 포맷은 외부 API 문서 기준.
    예) { "id": "1", "parentId": "root", "topic": "프로젝트" }
    """


    id: str = Field(..., description="노드 ID")
    topic: str = Field(..., min_length=1, description="노드 주제/내용 (마인드맵 topic)")
    parentId: Optional[str] = Field(None, description="부모 노드 ID (root는 None)")
    keywords: Optional[List[str]] = Field(
        default=None, description="AI 키워드 추출 결과 (선택)"
    )

# --------- Request (Spring -> FastAPI) ---------
class CoverLetterGenerateRequest(BaseModel):


    # 자소서 마스터에서 가져오는 회사/직무 컨텍스트 (Spring이 채워서 전달)
    company_name: str = Field(..., min_length=1, description="지원 회사명")
    company_ideal: Optional[str] = Field(None, description="회사 인재상")
    job_description: Optional[str] = Field(None, description="직무 설명")

    # 문항 + 옵션
    question: str = Field(..., min_length=1, description="자소서 문항 (예: '지원 동기')")
    writing_style: str = Field(
        default="간결하고 명확한 문체",
        max_length=100,
        description="문체 (프론트 선택/입력값을 프롬프트에 사용자 데이터로 삽입)",
    )
    
    max_chars: int = Field(default=500, ge=200, le=2000, description="생성 본문 글자 수 상한")
    allow_creativity: bool = Field(
        default=False,
        description="노드에 없는 내용 추론/확장 허용 ('AI 창의적 보완' 체크박스)",
    )

    # 근거가 될 마인드맵 노드 JSON (외부 API의 source_node와 동일한 노드 객체들)
    source_node: List[MindMapNode] = Field(
        ..., min_length=1, description="자소서 작성에 사용할 마인드맵 노드 목록"
    )


# --------- LLM 구조화 출력 (OpenAI response_format) ---------

class LLMOutput(BaseModel):
    """LLM이 직접 반환하는 형태."""

    answer: str = Field(..., description="생성된 자소서 본문")


# ---------- Response (FastAPI -> Spring) ----------

class CoverLetterGenerateResponse(BaseModel):


    answer: str = Field(..., description="AI가 생성한 자소서 본문")