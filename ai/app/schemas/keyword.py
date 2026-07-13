from typing import List

from pydantic import BaseModel, Field

from app.schemas.coverletter import MindMapNode

# -- Request (Spring -> FastAPI) --
class KeywordExtractRequest(BaseModel):
    # 마인드맵 전체 노드를 받아 각 노드의 키워드 추출

    source_node: List[MindMapNode] = Field(
        ..., min_length=1, description="키워드를 추출할 마인드맵 노드 목록"
    )

class NodeKeywords(BaseModel):
    # 노드 하나의 키워드 결과.

    id: str = Field(..., description="노드 ID (입력받은 id 그대로)")
    keywords: List[str] = Field(
        ..., max_length=3, description="해당 노드의 키워드 (0~3개, 루트 등은 빈 배열)"
    )


class KeywordExtractResponse(BaseModel):
    # LLM 출력 겸 FastAPI 응답 (구조가 같아 하나로 씀)

    nodes: List[NodeKeywords] = Field(
        default_factory=list, description="노드별 키워드 결과"
    )