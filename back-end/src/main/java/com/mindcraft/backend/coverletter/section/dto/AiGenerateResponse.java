package com.mindcraft.backend.coverletter.section.dto;

import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * FastAPI AI 서버로부터 받는 응답.
 * FastAPI CoverLetterGenerateResponse와 1:1 (answer만).
 */
public record AiGenerateResponse(
        String answer,
        @SerializedName("selected_node_ids") List<String> selectedNodeIds,
        @SerializedName("context_node_ids") List<String> contextNodeIds
) {
}