package com.mindcraft.backend.coverletter.section.service;

import com.mindcraft.backend.global.exception.AiGenerationException;
import com.mindcraft.backend.coverletter.section.dto.AiGenerateRequest;
import com.mindcraft.backend.coverletter.section.dto.AiGenerateResponse;
import com.mindcraft.backend.coverletter.section.dto.AiNodeDto;
import com.mindcraft.backend.coverletter.section.dto.ReactNode;
import com.mindcraft.backend.coverletter.section.mapper.NodeFlattener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * FastAPI AI 서버 연동 서비스 (AI 도메인).
 *
 * 역할:
 *  1. React 원본 노드 → FastAPI 노드 평탄화
 *  2. FastAPI 자소서 생성 API 호출 (RestClient)
 *  3. answer 반환 / 실패 시 AiGenerationException
 *
 * 저장/DB는 담당하지 않음 (호출한 쪽에서 처리).
 */
@Service
public class AiCoverLetterService {

    private final RestClient aiRestClient;

    // RestClientConfig에서 만든 aiRestClient 빈 주입
    public AiCoverLetterService(RestClient aiRestClient) {
        this.aiRestClient = aiRestClient;
    }

    /**
     * 자소서 본문(answer) 생성.
     *
     * @param coverLetterId 경로용 id (FastAPI는 저장 안 하지만 계약상 경로에 필요)
     * @param companyName 회사명
     * @param companyIdeal 인재상 (nullable)
     * @param jobDescription 직무 (nullable)
     * @param question 자소서 문항
     * @param writingStyle 문체
     * @param maxChars 최대 글자수
     * @param allowCreativity AI 창의적 보완 허용
     * @param reactNodes 친구가 넘긴 React 원본 노드
     * @return 생성된 자소서 본문
     */
    public String generateAnswer(
            Long coverLetterId,
            String companyName,
            String companyIdeal,
            String jobDescription,
            String question,
            String writingStyle,
            int maxChars,
            boolean allowCreativity,
            List<ReactNode> reactNodes
    ) {
        // 1. 평탄화 (React 노드 → FastAPI 노드)
        List<AiNodeDto> flattenedNodes = NodeFlattener.flatten(reactNodes);

        // 2. FastAPI 요청 DTO 조립
        AiGenerateRequest request = new AiGenerateRequest(
                companyName,
                companyIdeal,
                jobDescription,
                question,
                writingStyle,
                maxChars,
                allowCreativity,
                flattenedNodes
        );

        // 3. FastAPI 호출
        try {
            AiGenerateResponse response = aiRestClient.post()
                    .uri("/coverletters/{id}/sections", coverLetterId)
                    .body(request)
                    .retrieve()
                    .body(AiGenerateResponse.class);

            if (response == null || response.answer() == null) {
                throw new AiGenerationException("AI 서버가 빈 응답을 반환했습니다.");
            }

            return response.answer();

        } catch (AiGenerationException e) {
            throw e;  // 위에서 던진 건 그대로
        } catch (Exception e) {
            // 연결 실패, 422, 타임아웃 등 모든 호출 오류
            throw new AiGenerationException("AI 자소서 생성 중 오류가 발생했습니다.", e);
        }
    }
}