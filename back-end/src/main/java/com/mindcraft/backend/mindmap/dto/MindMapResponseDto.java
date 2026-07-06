package com.mindcraft.backend.mindmap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MindMapResponseDto {
    private long mindMapId;
    private String title;
    private String nodes;
}
