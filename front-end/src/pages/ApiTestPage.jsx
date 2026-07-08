import React from 'react';
import {
  register,
  login,
  getMyInfo,
  updateMyInfo,
  deleteMe,
} from '../axios/userApi';
import { getCookie, removeCookie, setCookie } from '../utils/cookieUtil';
import { getMindMap, saveMindMap } from '../axios/mindMapApi';

import { getOrCreateCoverLetter, getCoverLetterDetail, } from '../axios/coverLetterApi';
import { createSection, deleteSection, getSectionList, } from '../axios/sectionApi';

function ApiTestPage() {
  const testRegister = async () => {
    try {
      const rdata = await register({
        email: 'test123@ex.com',
        password: 'pwd1234',
        name: '테스트',
      });
      console.log('register 성공:', rdata);
    } catch (error) {
      console.log('register 실패:', error.response?.data || error);
    }
  };

  const testLogin = async () => {
    try {
      const rdata = await login({
        email: 'test123@ex.com',
        password: 'pwd1234',
      });
      console.log('login 성공:', rdata);

      // 로그인 성공하면 바로 쿠키에 저장 (jwtAxios 테스트를 위해 필요)
      setCookie('user', rdata, 1);
    } catch (error) {
      console.log('login 실패:', error.response?.data || error);
    }
  };

  const testGetMyInfo = async () => {
    try {
      const rdata = await getMyInfo();
      console.log('getMyInfo 성공:', rdata);
    } catch (error) {
      console.log('getMyInfo 실패:', error.response?.data || error);
    }
  };

  const testUpdateMyInfo = async () => {
    try {
      const rdata = await updateMyInfo({ password: 'newpwd123' });
      console.log('updateMyInfo 성공:', rdata);
    } catch (error) {
      console.log('updateMyInfo 실패:', error.response?.data || error);
    }
  };

  const testDeleteMe = async () => {
    try {
      const rdata = await deleteMe('newpwd123');
      removeCookie('user');
      console.log('deleteMe 성공:', rdata);
    } catch (error) {
      console.log('deleteMe 실패:', error.response?.data || error);
    }
  };

  const checkCookie = () => {
    console.log('현재 쿠키(user):', getCookie('user'));
  };

  const testGetMindMap = async () => {
    try {
      const rdata = await getMindMap();
      const parseNodes = JSON.parse(rdata.nodes);
      const mindMap = { ...rdata, nodes: parseNodes };
      console.log('get MindMap 성공: ', mindMap);
    } catch (error) {
      console.log('get MindMap 실패: ', error.response?.data || error);
    }
  };

  const testSaveMindMap = async () => {
    try {
      const rdata = await saveMindMap(9, '테스트 제목', [
        {
          id: '1-root',
          data: { depth: 0, label: '테스트' },
          position: { x: 400, y: 0 },
        },
        {
          id: 'n2',
          data: { depth: 0, label: '테스트', parentId: '1-root' },
          position: { x: 400, y: 100 },
        },
      ]); // saveMindMap이 인자를 받으니 테스트용 값 전달

      const parseNodes = JSON.parse(rdata.nodes);
      const mindMap = { ...rdata, nodes: parseNodes };
      console.log('save MindMap 성공: ', mindMap);
    } catch (error) {
      console.log('save MindMap 실패: ', error.response?.data || error);
    }
  };

  // ===== 자소서 마스터 =====
  const testGetCoverLetter = async () => {
    try {
      const rdata = await getOrCreateCoverLetter();
      console.log('자소서 조회/생성 성공:', rdata);
    } catch (error) {
      console.log('자소서 조회/생성 실패:', error.response?.data || error);
    }
  };

  const testGetDetail = async () => {
    try {
      const rdata = await getCoverLetterDetail(21); 
      console.log('상세조회 성공:', rdata);
    } catch (error) {
      console.log('상세조회 실패:', error.response?.data || error);
    }
  };


  // ===== 문항,AI =====
  const testGetSectionList = async () => {
    try {
      const rdata = await getSectionList(21);
      console.log('문항 목록 성공:', rdata);
    } catch (error) {
      console.log('문항 목록 실패:', error.response?.data || error);
    }
  };

  const testCreateSection = async () => {
    try {
      const rdata = await createSection(21, {
        question: '지원 동기를 작성해줘',
        writingStyle: '간결하고 명확한 문체',
        maxChars: 500,
        allowCreativity: false,
        sourceNode: [
          { id: '1-root', data: { label: '프로젝트 경험', parentId: null, depth: 0 } },
        ],
      });
      console.log('문항 추가 성공:', rdata);
    } catch (error) {
      console.log('문항 추가 실패:', error.response?.data || error);
    }
  };

  const testDeleteSection = async () => {
    try {
      const rdata = await deleteSection(21, 12); 
      console.log('문항 삭제 성공:', rdata);
    } catch (error) {
      console.log('문항 삭제 실패:', error.response?.data || error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>API 테스트 페이지 (임시)</h1>
      <button onClick={testRegister}>회원가입 테스트</button>
      <br />
      <button onClick={testLogin}>로그인 테스트</button>
      <br />
      <button onClick={testGetMyInfo}>내 정보 조회 테스트</button>
      <br />
      <button onClick={testUpdateMyInfo}>내 정보 수정 테스트</button>
      <br />
      <button onClick={testDeleteMe}>회원 탈퇴 테스트</button>
      <br />
      <button onClick={checkCookie}>쿠키 확인</button>
      <br />
      <button onClick={testGetMindMap}>마인드맵 조회(혹은 최초 생성)</button>
      <br />
      <button onClick={testSaveMindMap}>마인드맵 저장</button>
      <hr />

      <h1>자소서 마스터</h1>
      <button onClick={testGetCoverLetter}>자소서 조회/생성</button>
      <br />
      <button onClick={testGetDetail}>자소서 상세조회</button>
      <br />
      <hr />
      <h1>문항 & AI</h1>
      <button onClick={testGetSectionList}>문항 목록 조회</button>
      <br />
      <button onClick={testCreateSection}>문항 추가 (+AI)</button>
      <br />
      <button onClick={testDeleteSection}>문항 삭제</button>
    </div>
  );
}

export default ApiTestPage;
