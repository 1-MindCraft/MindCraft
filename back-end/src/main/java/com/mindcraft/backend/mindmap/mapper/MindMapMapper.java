package com.mindcraft.backend.mindmap.mapper;

import com.mindcraft.backend.mindmap.dto.MindMapResponseDto;
import com.mindcraft.backend.mindmap.dto.MindMapSaveDto;
import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MindMapMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(source = "mindMapId", target = "id")
    MindMap mindMapSaveDtoToMindMap(MindMapSaveDto mindMapSaveDto);

    @Mapping(source = "id", target = "mindMapId")
    MindMapResponseDto mindMapToMindMapResponseDto(MindMap mindMap);
}
