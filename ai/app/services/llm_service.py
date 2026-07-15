"""
app/services/llm_service.py

OpenAI 호출 통로 (structured output).
- 프롬프트(system/user)를 받아 LLM을 호출하고, LLMOutput(Pydantic)으로 검증된 결과 반환.
- OpenAI에서 나는 여러 에러를 LLMGenerationError 하나로 묶어 올림 → 라우터에서 422로 변환하기 쉬움.
"""

import httpx
from openai import (
    OpenAI,
    APIError,
    APIConnectionError,
    AuthenticationError,
    NotFoundError,
    RateLimitError,
    LengthFinishReasonError,
)

from app.core.config import settings
from app.schemas.coverletter import LLMOutput
from app.schemas.keyword import KeywordExtractResponse


class LLMGenerationError(Exception):
    """LLM 생성 중 발생한 오류. 라우터에서 잡아 HTTP 422로 변환한다."""


# 주의!!!!!!!!!!!!!! [연습용 임시방편] SSL 검증 비활성화
# 교육장/사내망의 SSL 검사(self-signed cert) 때문에 로컬에서 연결이 막혀 임시로 끔.
# AWS 배포 시에는 이 문제가 없으므로 http_client 인자를 제거하고 기본값(verify=True)으로 되돌릴 것.
# TODO: 배포 전 verify=False 원복 (보안 위험)
_http_client = httpx.Client(verify=False)

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    http_client=_http_client,
)


def generate_section(system_prompt: str, user_prompt: str) -> LLMOutput:
    """
    자소서 본문 생성.

    Args:
        system_prompt: 모델 역할/규칙 지시 (문체, 창의성 허용 여부 등)
        user_prompt:   실제 데이터 (문항 + 노드 내용 + 회사 컨텍스트)

    Returns:
        LLMOutput: { answer: str } 형태로 검증된 객체

    Raises:
        LLMGenerationError: 인증/모델/네트워크/길이초과/거부 등 모든 생성 실패
    """
    try:
        completion = client.chat.completions.parse(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=LLMOutput,  
        )
    except AuthenticationError as e:
        # API 키가 틀렸거나 없음 (.env 확인)
        raise LLMGenerationError("OpenAI 인증 실패: API 키를 확인하세요.") from e
    
    except NotFoundError as e:
        # 모델명 오타 또는 접근 불가 (예: gpt-5.4-mini 존재하지 않음)
        raise LLMGenerationError(f"모델을 찾을 수 없습니다: {settings.LLM_MODEL}") from e
    
    except LengthFinishReasonError as e:
        # 응답이 max_tokens 한계로 잘려서 JSON이 완성되지 못함
        raise LLMGenerationError("생성 길이 초과로 응답이 잘렸습니다.") from e
    
    except RateLimitError as e:
        # 요청 한도 초과 (잠시 후 재시도)
        raise LLMGenerationError("요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.") from e
    
    except APIConnectionError as e:
        # 네트워크 문제로 OpenAI 서버에 못 붙음 (SSL 검사 환경 등)
        raise LLMGenerationError("OpenAI 서버 연결에 실패했습니다.") from e
    
    except APIError as e:
        # 위에서 안 걸린 나머지 OpenAI API 오류 (반드시 마지막에)
        raise LLMGenerationError(f"OpenAI API 오류: {e}") from e

    message = completion.choices[0].message

    # 안전 필터 등으로 모델이 답변을 거부하면 parsed가 없음
    if message.refusal:
        raise LLMGenerationError(f"모델이 응답을 거부했습니다: {message.refusal}")

    # message.parsed 는 이미 LLMOutput 인스턴스 (JSON 파싱/검증 완료 상태)
    return message.parsed

def extract_keywords_llm(system_prompt: str, user_prompt: str) -> KeywordExtractResponse:
    """
    마인드맵 노드별 키워드 추출.

    Args:
        system_prompt: 키워드 추출 규칙 (개수, 성격 등)
        user_prompt:   마인드맵 노드 트리 텍스트

    Returns:
        KeywordExtractResponse: { nodes: [{id, keywords}] }

    Raises:
        LLMGenerationError: 생성 실패 (에러 처리는 generate_section과 동일)
    """
    try:
        completion = client.chat.completions.parse(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=KeywordExtractResponse,
        )
    except AuthenticationError as e:
        raise LLMGenerationError("OpenAI 인증 실패: API 키를 확인하세요.") from e

    except NotFoundError as e:
        raise LLMGenerationError(f"모델을 찾을 수 없습니다: {settings.LLM_MODEL}") from e

    except LengthFinishReasonError as e:
        raise LLMGenerationError("생성 길이 초과로 응답이 잘렸습니다.") from e

    except RateLimitError as e:
        raise LLMGenerationError("요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.") from e

    except APIConnectionError as e:
        raise LLMGenerationError("OpenAI 서버 연결에 실패했습니다.") from e

    except APIError as e:
        raise LLMGenerationError(f"OpenAI API 오류: {e}") from e

    message = completion.choices[0].message

    if message.refusal:
        raise LLMGenerationError(f"모델이 응답을 거부했습니다: {message.refusal}")

    return message.parsed