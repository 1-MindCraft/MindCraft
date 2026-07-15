package com.mindcraft.backend.mindmap.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.mindcraft.backend.coverletter.section.dto.AiNodeDto;
import com.mindcraft.backend.coverletter.section.dto.ReactNode;
import com.mindcraft.backend.coverletter.section.mapper.NodeFlattener;
import com.mindcraft.backend.global.exception.AiGenerationException;
import com.mindcraft.backend.mindmap.dto.AiKeywordResponse;
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

/**
 * FastAPI 키워드 추출 서버 호출.
 * AiCoverLetterService와 동일한 HttpClient + Gson 패턴 (HTTP/1.1 고정).
 */
@Service
@Slf4j
public class AiKeywordService {

    private final Gson gson = new Gson();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();
    private final String aiServerBaseUrl;

    public AiKeywordService(@Value("${ai.server.base-url}") String aiServerBaseUrl) {
        this.aiServerBaseUrl = aiServerBaseUrl;
    }

    public AiKeywordResponse extractKeywords(List<ReactNode> reactNodes) {
        List<AiNodeDto> flattenedNodes = NodeFlattener.flatten(reactNodes);

        Map<String, Object> requestPayload = new LinkedHashMap<>();
        requestPayload.put("source_node", flattenedNodes);

        String requestJson = gson.toJson(requestPayload);
        log.info("AI keyword request payload={}", requestJson);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServerBaseUrl + "/mindmaps/keywords"))
                .timeout(Duration.ofSeconds(60))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("AI keyword server error. status={} body={}", response.statusCode(), response.body());
                throw new AiGenerationException(
                        "키워드 추출 실패: status=" + response.statusCode() + ", body=" + response.body()
                );
            }

            AiKeywordResponse parsedResponse = gson.fromJson(response.body(), AiKeywordResponse.class);

            if (parsedResponse == null || parsedResponse.getNodes() == null) {
                throw new AiGenerationException("AI server returned an empty response.");
            }

            return parsedResponse;
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AiGenerationException("키워드 추출 중 통신 오류가 발생했습니다.", e);
        } catch (JsonSyntaxException e) {
            throw new AiGenerationException("AI 응답 JSON 파싱에 실패했습니다.", e);
        }
    }
}