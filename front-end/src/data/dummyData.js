const initialNodes = [
  {
    id: 'n1',
    position: { x: 400, y: 0 },
    data: { label: '홍길동', parentId: null, depth: 0 },
  },
  // 취미
  {
    id: 'n2',
    position: { x: 200, y: 120 },
    data: { label: '취미', parentId: 'n1', depth: 1 },
  },
  {
    id: 'n3',
    position: { x: 100, y: 240 },
    data: { label: '축구', parentId: 'n2', depth: 2 },
  },
  {
    id: 'n4',
    position: { x: 250, y: 240 },
    data: { label: '게임', parentId: 'n2', depth: 2 },
  },
  // 중학교때
  {
    id: 'n5',
    position: { x: 450, y: 120 },
    data: { label: '중학교때', parentId: 'n1', depth: 1 },
  },
  {
    id: 'n6',
    position: { x: 350, y: 240 },
    data: { label: '축구부 부장', parentId: 'n5', depth: 2 },
  },
  {
    id: 'n7',
    position: { x: 520, y: 240 },
    data: { label: '독서 동아리', parentId: 'n5', depth: 2 },
  },
  // 존경하는 사람
  {
    id: 'n8',
    position: { x: 680, y: 120 },
    data: { label: '존경하는 사람', parentId: 'n1', depth: 1 },
  },
  {
    id: 'n9',
    position: { x: 680, y: 240 },
    data: { label: '이순신', parentId: 'n8', depth: 2 },
  },
].map((node) => ({ ...node, type: 'mapNode' }));

const initialEdges = [
  { id: 'n1-n2', source: 'n1', target: 'n2' },
  { id: 'n2-n3', source: 'n2', target: 'n3' },
  { id: 'n2-n4', source: 'n2', target: 'n4' },
  { id: 'n1-n5', source: 'n1', target: 'n5' },
  { id: 'n5-n6', source: 'n5', target: 'n6' },
  { id: 'n5-n7', source: 'n5', target: 'n7' },
  { id: 'n1-n8', source: 'n1', target: 'n8' },
  { id: 'n8-n9', source: 'n8', target: 'n9' },
];

export { initialNodes, initialEdges };
