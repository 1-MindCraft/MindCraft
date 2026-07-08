package com.mindcraft.backend.coverletter.section.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.mindcraft.backend.coverletter.section.dto.AiGenerateResponse;
import com.mindcraft.backend.coverletter.section.dto.AiNodeDto;
import com.mindcraft.backend.coverletter.section.dto.ReactNode;
import com.mindcraft.backend.coverletter.section.mapper.NodeFlattener;
import com.mindcraft.backend.global.exception.AiGenerationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AiCoverLetterService {

    private final Gson gson = new Gson();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    private final String aiServerBaseUrl;

    public AiCoverLetterService(@Value("${ai.server.base-url}") String aiServerBaseUrl) {
        this.aiServerBaseUrl = aiServerBaseUrl;
    }

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
        List<AiNodeDto> flattenedNodes = NodeFlattener.flatten(reactNodes);

        Map<String, Object> requestPayload = new LinkedHashMap<>();
        requestPayload.put("company_name", companyName);
        requestPayload.put("company_ideal", companyIdeal);
        requestPayload.put("job_description", jobDescription);
        requestPayload.put("question", question);
        requestPayload.put("writing_style", writingStyle);
        requestPayload.put("max_chars", maxChars);
        requestPayload.put("allow_creativity", allowCreativity);
        requestPayload.put("source_node", flattenedNodes);

        String requestJson = gson.toJson(requestPayload);
        log.info("AI request payload coverLetterId={} request={}", coverLetterId, requestJson);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServerBaseUrl + "/coverletters/" + coverLetterId + "/sections"))
                .timeout(Duration.ofSeconds(60))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("AI server response error. status={} body={}", response.statusCode(), response.body());
                throw new AiGenerationException(
                        "AI 자소서 생성 실패: status=" + response.statusCode() + ", body=" + response.body()
                );
            }

            AiGenerateResponse parsedResponse = gson.fromJson(response.body(), AiGenerateResponse.class);

            if (parsedResponse == null || parsedResponse.answer() == null) {
                throw new AiGenerationException("AI server returned an empty response.");
            }

            return parsedResponse.answer();
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AiGenerationException("AI 자소서 생성 중 통신 오류가 발생했습니다.", e);
        } catch (JsonSyntaxException e) {
            throw new AiGenerationException("AI 응답 JSON 파싱에 실패했습니다.", e);
        }
    }
}
