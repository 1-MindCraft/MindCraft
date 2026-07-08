import axios from 'axios';
import { getCookie, setCookie, removeCookie } from './cookieUtil';
import ApiURL from '../axios/ApiURL';

const jwtAxios = axios.create();

// Access Token 재발급
const refreshJWT = async (accessToken, refreshToken) => {
  const header = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  //  백엔드: GET /users/refresh?refreshToken=...~
  const res = await axios.get(
    `${ApiURL}/users/refresh?refreshToken=${refreshToken}`,
    header
  );
  return res.data;
};

// 요청 전: 쿠키의 accessToken을 헤더에 첨부
const beforeRequest = (config) => {
  const userInfo = getCookie('user');
  if (!userInfo) {
    return Promise.reject({
      response: {
        data: {
          error: 'REQUIRE_LOGIN',
        },
      },
    });
  }
  config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
  return config;
};

const requestError = (error) => Promise.reject(error);
const successResponse = (res) => res;

/*
  응답 실패 처리
  처리 순서
  1. 서버에서 전달한 오류 정보를 확인합니다.
  2. Access Token 만료 여부를 검사합니다.
  3. Access Token이 만료된 경우 Refresh Token으로 토큰을 재발급합니다.
  4. 쿠키에 새로운 토큰을 저장합니다.
  5. 원래 요청에 새로운 Access Token을 설정합니다.
  6. 원래 요청을 다시 전송합니다.
  7. 권한 오류(403)인 경우 403 페이지로 이동합니다.
  8. 그 외의 오류는 그대로 반환합니다.
*/

// 응답 실패: access 만료면 재발급 후 재요청
const failResponse = async (error) => {
  const errorData = error.response?.data;
  const originalRequest = error.config;

  // 백엔드: access 만료 시 401 + { error: "ERROR_ACCESS_TOKEN" }
  if (
    errorData?.error === 'ERROR_ACCESS_TOKEN' ||
    errorData?.error === 'Expired'
  ) {

    const userCookieValue = getCookie('user');
    
    if (!userCookieValue) {
      return Promise.reject(error);
    }

    try {
      const result = await refreshJWT(
        userCookieValue.accessToken,
        userCookieValue.refreshToken
      );

      // 새 토큰으로 쿠키 갱신
      userCookieValue.accessToken = result.accessToken;
      userCookieValue.refreshToken = result.refreshToken;
      setCookie('user', userCookieValue, 1);

      // 원래 요청 헤더 교체 후 재전송
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
      return jwtAxios(originalRequest);
    } catch (refreshError) {
      // refresh도 만료 → 로그인 페이지로
      removeCookie('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }

  // 인가 거부(403) → 403 페이지
  if (error.response?.status === 403 && window.location.pathname !== '/403') {
    window.location.href = '/403';
  }

  return Promise.reject(error);
};

jwtAxios.interceptors.request.use(beforeRequest, requestError);
jwtAxios.interceptors.response.use(successResponse, failResponse);

export default jwtAxios;
