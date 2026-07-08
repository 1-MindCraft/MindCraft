package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.repository.CoverLetterRepository;
import com.mindcraft.backend.coverletter.section.entity.CoverLetterSection;
import com.mindcraft.backend.coverletter.section.repository.CoverLetterSectionRepository;
import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.mindmap.repository.MindMapRepository;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterServiceImpl implements CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final CoverLetterSectionRepository coverLetterSectionRepository;
    private final MindMapRepository mindMapRepository;
    private final UserRepository userRepository;

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
    @Override
    @Transactional
    public CoverLetterDto getOrCreate(Long userId) {
        MindMap mindMap = mindMapRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "마인드맵이 먼저 있어야 자소서를 만들 수 있습니다. userId = " + userId));

        Optional<CoverLetter> result = coverLetterRepository.findByMindmapId(mindMap.getId());
        if (result.isPresent()) {
            CoverLetter coverLetter = result.get();
            List<CoverLetterSection> sections =
                    coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetter.getId());
            return entityToDto(coverLetter, sections);
        }
        return createCoverLetter(mindMap.getId(), userId);
    }

    private CoverLetterDto createCoverLetter(Long mindmapId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다. userId = " + userId));

        try {
            CoverLetter coverLetter = new CoverLetter();
            coverLetter.setUser(user);
            coverLetter.setMindmapId(mindmapId);
            coverLetterRepository.save(coverLetter);
            log.info("자소서 생성 완료 coverLetter = " + coverLetter);
            return entityToDto(coverLetter, List.of());
        } catch (DataIntegrityViolationException e) {
            // 거의 동시에 다른 요청이 먼저 생성한 경우 (유니크 제약 위반)
            // → 새로 만들지 않고, 이미 생성된 걸 다시 조회해서 반환
            log.warn("자소서 생성 경합 발생, 기존 자소서 재조회: mindmapId = {}", mindmapId);
            CoverLetter existing = coverLetterRepository.findByMindmapId(mindmapId)
                    .orElseThrow(() -> e);
            List<CoverLetterSection> sections =
                    coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(existing.getId());
            return entityToDto(existing, sections);
        }
    }

    // 상세조회 ( API 문서 : GET /coverletters/{id})
    // coverletter 자신의 id로 자소서 + 항목 목록을 찾음 없으면 Optional.empty()
    @Override
    public Optional<CoverLetterDto> findById(Long id) {
        return coverLetterRepository.findById(id)
                .map(coverLetter -> {
                    List<CoverLetterSection> sections =
                            coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetter.getId());
                    return entityToDto(coverLetter, sections);
                });
    }


    // 수정 대상은 이제 coverletter 자신의 id (dto,getId()) 로 찾음
    // GET (getOrCreate) 응답에는 이미 id가 들어있으니까 프론트는 그 id를 그대로
    // PUT /coverletters/{id} 로 보내면 된다

    @Override
    @Transactional
    public boolean update(CoverLetterDto dto) {

        Optional<CoverLetter> result = coverLetterRepository.findById(dto.getId());
        if (result.isPresent()) {
            CoverLetter coverLetter = result.get();

            if (dto.getTitle() != null) {
                coverLetter.setTitle(dto.getTitle());
            }

            if (dto.getCompanyName() != null) {
                coverLetter.setCompanyName(dto.getCompanyName());
            }

            if (dto.getCompanyIdeal() != null) {
                coverLetter.setCompanyIdeal(dto.getCompanyIdeal());
            }

            if (dto.getJobDescription() != null) {
                coverLetter.setJobDescription(dto.getJobDescription());
            }
            return true;
        }
        return false;
    }
}
