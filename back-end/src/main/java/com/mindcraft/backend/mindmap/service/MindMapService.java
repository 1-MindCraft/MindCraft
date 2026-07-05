package com.mindcraft.backend.mindmap.service;

import com.mindcraft.backend.mindmap.entity.MindMap;

public interface MindMapService {
    MindMap getOrCreateMindMap(long userId);

    MindMap saveMindMap(MindMap mindMap, long userId);
}
