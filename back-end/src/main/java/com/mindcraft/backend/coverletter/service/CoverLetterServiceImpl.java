package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.mapper.CoverLetterMapper;
import com.mindcraft.backend.coverletter.repository.CoverLetterRepository;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.section.service.CoverLetterSectionService;
import com.mindcraft.backend.global.exception.AccessDeniedException;
import com.mindcraft.backend.global.exception.InvalidCoverLetterException;
import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.mindmap.service.MindMapService;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterServiceImpl implements CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final CoverLetterMapper mapper;
    private final UserService userService;
    private final MindMapService mindMapService;
    private final CoverLetterSectionService coverLetterSectionService;

    /*
        mindmap : coverletter | 1 : 1
        이 메서드의 mindmapId는 무조건 그 마인드맵에 속하는 자소서는 반드시 하나 라는 전제

        그렇기에 findByMindmapId 결과는
        데이터가 있으면 그대로 반환하고
        없으면 만들어서 반환하는 형식인거다

        나중에 V2 에서 1 : N 방식으로 접근한다면
        여러 개 중에서 어떤 것을 줄지에 대한 추가 조건을 기입할 필요가 있음

        userId는 새로 만들 때만 실제로 쓰임 ( User FK => nullable = false 라서 필요함 )
        이미 데이터가 있는 경우라면 저장된 coverLetter.getUser()를 쓴다

        (API 문서 반영) GET /coverletters
        userId로 그 사용자의 mindmap을 먼저 찾고(user:mindmap = 1:1),
        그 mindmap.id를 mindmapId 삼아 coverletter를 조회/생성한다(mindmap:coverletter = 1:1).

        마인드맵 자체가 없으면(아직 마인드맵 편집을 한 번도 안 한 사용자) 자소서를
        만들 근거가 없으므로 예외를 던진다 — 마인드맵은 이 서비스가 만드는 대상이 아니라
        mindmap 패키지(MindMapService.getOrCreateMindMap)가 책임지는 영역이기 때문이다.
     */
//    @Override
//    @Transactional
//    public CoverLetterDto getOrCreate(Long userId) {
//        MindMap mindMap = mindMapRepository.findByUserId(userId)
//                .orElseThrow(() -> new IllegalArgumentException(
//                        "마인드맵이 먼저 있어야 자소서를 만들 수 있습니다. userId = " + userId));
//
//        Optional<CoverLetter> result = coverLetterRepository.findByMindmapId(mindMap.getId());
//        if (result.isPresent()) {
//            CoverLetter coverLetter = result.get();
//            List<CoverLetterSection> sections =
//                    coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetter.getId());
//            return entityToDto(coverLetter, sections);
//        }
//        return createCoverLetter(mindMap.getId(), userId);
//    }

    // 생성
    @Override
    @Transactional
    public CoverLetterSummaryDto createCoverLetter(CoverLetter coverLetter, long userId, long mindMapId) {
        User user = userService.getMyInfo(userId);
        MindMap mindMap = mindMapService.getMindMap(userId, mindMapId);

        coverLetter.setUser(user);
        coverLetter.setMindMap(mindMap);

        CoverLetter savedCoverLetter = coverLetterRepository.save(coverLetter);
        return mapper.coverLetterToCoverLetterSummaryDto(savedCoverLetter);
    }


    // 전체 조회
    @Override
    public List<CoverLetterSummaryDto> getAllCoverLetters(long userId) {
        List<CoverLetter> allByUserId = coverLetterRepository.findAllByUserId(userId);
        return allByUserId.stream()
                .map(mapper::coverLetterToCoverLetterSummaryDto)
                .collect(Collectors.toList());
    }

    // 하나 조회
    @Override
    public CoverLetterDetailDto getDetailById(long userId, long coverLetterId) {
        CoverLetter coverLetter = verifiedCoverLetterWithUserId(userId, coverLetterId);
        // section 가져오기
        List<CoverLetterSectionDto> sectionList = coverLetterSectionService.getList(coverLetterId);

        return mapper.coverLetterToCoverLetterDetailDto(coverLetter, sectionList);
    }

    // 수정
    @Override
    @Transactional
    public CoverLetterSummaryDto updateCoverLetter(CoverLetter coverLetter, long userId, long coverLetterId) {
        CoverLetter findCoverLetter = verifiedCoverLetterWithUserId(userId, coverLetterId);
        findCoverLetter.setTitle(coverLetter.getTitle());
        findCoverLetter.setCompanyName(coverLetter.getCompanyName());
        findCoverLetter.setCompanyIdeal(coverLetter.getCompanyIdeal());
        findCoverLetter.setJobDescription(coverLetter.getJobDescription());
        findCoverLetter.setUpdatedAt(LocalDateTime.now());

        CoverLetter savedCoverLetter = coverLetterRepository.save(findCoverLetter);
        return mapper.coverLetterToCoverLetterSummaryDto(savedCoverLetter);
    }

    // 삭제
    @Override
    @Transactional
    public void deleteCoverLetter(long userId, long coverLetterId) {
        CoverLetter coverLetter = verifiedCoverLetterWithUserId(userId, coverLetterId);

        coverLetterRepository.delete(coverLetter);
    }

    private CoverLetter verifiedCoverLetterWithUserId(long userId, long coverLetterId) {
        CoverLetter coverLetter = coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new InvalidCoverLetterException("문서를 찾을 수 없습니다."));

        if(!coverLetter.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("본인의 자소서 마스터가 아닙니다.");
        }

        return coverLetter;
    }
}
