package com.mindcraft.backend.mindmap.service;

import com.google.gson.Gson;
import com.mindcraft.backend.global.exception.InvalidMindMapException;
import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.mindmap.repository.MindMapRepository;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MindMapServiceImpl implements MindMapService{

    private final MindMapRepository mindMapRepository;
    private final UserService userService;

    @Override
    @Transactional
    public MindMap getOrCreateMindMap(long userId) {
        User user = userService.getMyInfo(userId);
        // 마인드맵 있는지 조회
        Optional<MindMap> optionalMindMap = mindMapRepository.findByUserId(userId);
        // 있으면 그거 반환
        if (optionalMindMap.isPresent()) {
            return optionalMindMap.get();
        }
        // 없으면 생성
        try {
            return createMindMap(user);
        } catch (DataIntegrityViolationException e) {
            // 거의 동시에 다른 요청이 먼저 생성한 경우 (유니크 제약 위반)
            // → 새로 만들지 않고, 이미 생성된 걸 다시 조회해서 반환
            log.warn("마인드 맵 생성 경합 발생, 기존 마인드맵 재조회: userId = {}", userId);
            return mindMapRepository.findByUserId(userId)
                    .orElseThrow(() -> e);
        }
    }

    @Override
    public MindMap saveMindMap(MindMap mindMap, long userId) {
        User user = userService.getMyInfo(userId);

        MindMap findMindMap = mindMapRepository.findById(mindMap.getId())
                .orElseThrow(() -> new InvalidMindMapException("유효하지 않은 마인드맵입니다."));

        if (!user.getId().equals(findMindMap.getUser().getId())) {
            throw new InvalidMindMapException("본인의 마인드맵만 수정할 수 있습니다.");
        }

        findMindMap.setTitle(mindMap.getTitle());
        findMindMap.setUser(user);
        findMindMap.setNodes(mindMap.getNodes());
        findMindMap.setUpdatedAt(LocalDateTime.now());

        return mindMapRepository.save(findMindMap);
    }

    private MindMap createMindMap(User user) {

        Map<String, Object> position = new HashMap<>();
        position.put("x", 400);
        position.put("y", 0);

        Map<String, Object> data = new HashMap<>();
        data.put("label", user.getName());
        data.put("parentId", null);
        data.put("depth", 0);

        Map<String, Object> rootNode = new HashMap<>();
        rootNode.put("id", user.getId() + "-root-node");
        rootNode.put("position", position);
        rootNode.put("data", data);

        Gson gson = new Gson();
        String defaultNode = gson.toJson(List.of(rootNode));

        MindMap mindMap = new MindMap();
        mindMap.setUser(user);
        mindMap.setTitle(user.getName() + "의 마인드 맵");
        mindMap.setNodes(defaultNode);
        mindMap.setCreatedAt(LocalDateTime.now());
        mindMap.setUpdatedAt(LocalDateTime.now());

        return mindMapRepository.save(mindMap);
    }
}
