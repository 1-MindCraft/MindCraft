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

  return (
    <div style={{ padding: 20 }}>
      <h2>API 테스트 페이지 (임시)</h2>
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
    </div>
  );
}

export default ApiTestPage;
