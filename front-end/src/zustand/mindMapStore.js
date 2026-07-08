import { create } from 'zustand';
import { getMindMap, saveMindMap } from '../axios/mindMapApi';

const useMindMapStore = create((set, get) => ({
  mindMapId: null,
  title: '',
  nodes: [],
  edges: [],

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
    })),

  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === 'function' ? updater(state.edges) : updater,
    })),

  setTitle: (title) => set({ title }),

  // 조회 (또는 최초 생성)
  fetchMindMap: async () => {
    try {
      const rdata = await getMindMap();
      console.log('조회 성공', rdata);
      const parsedNodes = JSON.parse(rdata.nodes).map((node) => ({
        ...node,
        type: 'mapNode',
      }));

      const parsedEdges = parsedNodes
        .filter((node) => node.data.parentId)
        .map((node) => ({
          id: `${node.data.parentId}-${node.id}`,
          source: node.data.parentId,
          target: node.id,
        }));

      set({
        mindMapId: rdata.mindMapId,
        title: rdata.title,
        nodes: parsedNodes,
        edges: parsedEdges,
      });
    } catch (error) {
      console.log('get MindMap 실패: ', error.response?.data || error);
      throw error;
    }
  },

  // 저장
  saveMindMap: async () => {
    const { mindMapId, title, nodes } = get();
    try {
      const rdata = await saveMindMap(mindMapId, title, nodes);
      console.log(rdata);
      return true;
    } catch (error) {
      console.log('save MindMap 실패: ', error.response?.data || error);
      throw error;
    }
  },
}));

export default useMindMapStore;
