import useLoginStore from '../zustand/loginState';
/*
  로그인 사용자 정보를 조회하는 사용자 정의 Hook(Custom Hook)입니다.
  반환 정보
  - email    : 로그인 사용자 이메일
  - isLogin  : 로그인 여부
*/
const useLoginState = () => {
  // Zustand Store에서 loginState 객체를 조회합니다.
  const loginState = useLoginStore((state) => state.loginState);
  // 로그인 사용자 이메일입니다.
  const email = loginState.email;
  // 로그인 사용자 아이디입니다.
  const name = loginState.name;
  const isLogin = !!loginState.accessToken;
  return {
    email,
    name,
    isLogin,
  };
};
// 다른 컴포넌트에서 사용할 수 있도록 내보냅니다.
export default useLoginState;
