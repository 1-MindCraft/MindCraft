import jwtAxios from '../utils/JwtUtil';
import ApiURL from './ApiURL';

// 마인드맵 url
const mindMapURL = `${ApiURL}/mindmaps`;

// 마인드맵 조회 요청
// 요청 바디, 쿼리 스트링 없음
// 응답 형태
/*
  {
    "mindMapId" : "1",
    "title": "000의 마인드 맵",
    "nodes":
      "[
        {
          \"id\": \"6-root-node\",
          \"data\":
            {
                \"depth\": 0,
                \"label\": \"테스3\"
            },
          \"position\":
            {
                \"x\": 400,
                \"y\": 0
            }
        }
      ]"
  }
  */
// 응답을 역직렬화한 뒤, nodes를 또 다시 역직렬화 해야함
const getMindMap = async () => {
  const response = await jwtAxios.get(mindMapURL);
  return response.data;
};

// 마인드맵 저장 요청
// (body) mindmapId, title, nodes
// mindmapId, title, nodes 모두 상태 관리 중
// mId, title, nodes state를 인자로 전달받아서 객체 만들어서 전달
const saveMindMap = async (mindMapId, title, nodes) => {
  const reqData = {
    mindMapId,
    title,
    nodes: JSON.stringify(nodes),
  };

  const response = await jwtAxios.put(mindMapURL, reqData);

  return response.data;
};

export { getMindMap, saveMindMap };
