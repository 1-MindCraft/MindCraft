package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;

import java.util.List;

public interface CoverLetterService {

    /*
     * (API 문서 반영) GET /coverletters
     * mindmapId를 URL에 넣지 않고, userId로 그 사용자의 mindmap을 먼저 찾은 뒤
     * 그 mindmap에 속한 coverletter를 조회/생성한다.
     *
     * user : mindmap = 1:1, mindmap : coverletter = 1:1 이므로,
     * 결국 userId 하나만 알아도 그 사람의 자소서까지 정확히 하나로 도달할 수 있다.
     * (mindmap 패키지의 MindMapController.getMindMap()이 이미 이 방식 — id 없이
     *  로그인한 사용자 기준으로만 동작 — 을 쓰고 있어서 그대로 맞췄다.)
     *
     * 지금은 로그인/JWT가 없어서 userId를 그대로 파라미터로 받지만,
     * 나중에 @AuthenticationPrincipal이 붙으면 그 자리를 대체하면 된다.
     */
//    CoverLetterDto getOrCreate(Long userId);



    CoverLetterSummaryDto createCoverLetter(CoverLetter coverLetter, long userId, long mindMapId);

    void deleteCoverLetter(long userId, long coverLetterId);

    List<CoverLetterSummaryDto> getAllCoverLetters(long userId);

    CoverLetterDetailDto getDetailById(long userId, long coverLetterId);

    CoverLetterSummaryDto updateCoverLetter(CoverLetter coverLetter, long userId, long coverLetterId);
}
