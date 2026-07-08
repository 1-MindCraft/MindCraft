import { create } from 'zustand';
import { getCookie } from '../utils/cookieUtil';

/*
  로그인 하지 않은 상태에서 사용할 기본 회원 정보 객체
*/
const initState = {
  email: '', // 회원 이메일
  name: '', // 회원 이름
  accessToken: '', // Access Token
  refreshToken: '', //Refresh Token
};

/*
  쿠키에 저장된 회원 정보를 읽어오는 함수
*/
const loadUserCookie = () => {
  const userInfo = getCookie('user');

  if (userInfo && userInfo.name) {
    userInfo.name = decodeURIComponent(userInfo.name);
  }

  // 회원 정보 반환
  return userInfo;
};

/*
  Zustand Store 생성

  create()는 전역 상태(store)를 생성하는 함수

  set : 상태를 변경하는 함수
*/
const useLoginStore = create((set) => ({
  /*
    애플리케이션 시작 시 쿠키에 저장된 회원 정보를 읽어옴

    쿠키가 존재하면 해당 정보를 사용하고,
    없으면 initState를 기본값으로 사용함
  */
  loginState: loadUserCookie() || initState,

  /*
    로그인 성공 시 회원 정보를 저장함
    
    사용 예)
      setLoginState(userData);
  */
  setLoginState: (data) =>
    set((state) => ({
      loginState: typeof data === 'function' ? data(state.loginState) : data,
    })),

  /*
      로그아웃 시 로그인 정보를 초기화함

      사용 예)
        resetState();
    */
  resetState: () => {
    set({
      loginState: initState,
    });
  },
}));

// 다른 컴포넌트에서 사용할 수 있도록 export
export default useLoginStore;
