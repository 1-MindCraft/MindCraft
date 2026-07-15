package com.mindcraft.backend.mindmap.dto;

import com.mindcraft.backend.coverletter.section.dto.ReactNode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class KeywordExtractRequestDto {
    private List<ReactNode> nodes;
}
