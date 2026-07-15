package com.mindcraft.backend.coverletter.section.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CoverLetterSectionDto {

    private Long id;
    private Long coverLetterId;

    private String question;
    private String answer;
    private List<ReactNode> sourceNode;
    private String writingStyle;
    private Integer maxChars;
    private Boolean allowCreativity;

    private List<String> selectedNodeIds;
    private List<String> contextNodeIds;
}
