import { useSearchParams } from 'react-router-dom';
import { useLoginActions } from '../../hooks/useLoginActions';
import { useNavigation } from '../../hooks/useNavigation';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import ApiURL from '../../axios/ApiURL';

function OAuth2CallbackPage() {
  const [searchParam] = useSearchParams();
  const { saveAsCookie } = useLoginActions();
  const { moveToPath } = useNavigation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const accessToken = searchParam.get('accessToken');
    const refreshToken = searchParam.get('refreshToken');
    const error = searchParam.get('error');

    if (error) {
      alert('소셜 로그인에 실패했습니다.');
      moveToPath('/');
      return;
    }

    if (!accessToken || !refreshToken) {
      moveToPath('/');
      return;
    }

    // access Token 가지고 getMyInfo 호출해서 정보 가져오기 -> 그 다음 쿠키에 저장
    axios
      .get(`${ApiURL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const userInfo = res.data;

        saveAsCookie({
          email: userInfo.email,
          name: userInfo.name,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        alert('로그인 성공!');

        window.history.replaceState({}, '', '/oauth2/callback');
        moveToPath('/mindmap');
      })
      .catch(() => {
        alert('사용자 정보를 불러오지 못했습니다.');
        moveToPath('/');
      });
  }, [searchParam, saveAsCookie, moveToPath]);

  return null;
}

export default OAuth2CallbackPage;
