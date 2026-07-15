import { create } from 'zustand';
import { getMindMap, saveMindMap as saveMindMapApi, extractKeywords as extractKeywordsApi } from '../axios/mindMapApi';

const useMindMapStore = create((set, get) => ({
  mindMapId: null,
  title: '',
  nodes: [],

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
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

      set({
        mindMapId: rdata.mindMapId,
        title: rdata.title,
        nodes: parsedNodes,
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
      const rdata = await saveMindMapApi(mindMapId, title, nodes);
      console.log(rdata);
      return true;
    } catch (error) {
      console.log('save MindMap 실패: ', error.response?.data || error);
      throw error;
    }
  },

  // 키워드 추출 (AI) — 전체 노드를 보내고 노드별 keywords를 받아 주입
  extractKeywords: async () => {
    const { nodes } = get();
    try {
      const rdata = await extractKeywordsApi(nodes);

      // id로 매칭해서 각 노드의 data.keywords에 주입
      const keywordMap = new Map(
        (rdata.nodes || []).map((n) => [n.id, n.keywords])
      );

      set((state) => ({
        nodes: state.nodes.map((node) => {
          const keywords = keywordMap.get(node.id);
          return keywords
            ? { ...node, data: { ...node.data, keywords } }
            : node;
        }),
      }));

      return true;
    } catch (error) {
      console.log('키워드 추출 실패: ', error.response?.data || error);
      throw error;
    }
  },
}));

export default useMindMapStore;