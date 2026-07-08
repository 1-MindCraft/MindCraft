import { useCallback } from 'react';
import { login } from '../axios/userApi';
import { getCookie, setCookie, removeCookie } from '../utils/cookieUtil';
import { useNavigation } from './useNavigation';
import useLoginStore from '../zustand/loginState';

export const useLoginActions = () => {
  const { moveToMain } = useNavigation();
  const setLoginState = useLoginStore((state) => state.setLoginState);
  const resetState = useLoginStore((state) => state.resetState);

  const saveAsCookie = useCallback(
    (data) => {
      const userData = {
        // id: data.id,
        email: data.email,
        name: data.name,
        // roleNames: data.roleNames,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
      console.log(userData);
      setCookie('user', userData, 1);
      console.log('저장 후', getCookie('user'));
      setLoginState(userData);
    },
    [setLoginState]
  );

  const doLogin = useCallback(
    async (loginParam) => {
      const result = await login(loginParam);
      console.log('로그인 후 result = (useLoginActions)', result);
      console.log('accessToken =', result.accessToken);
      console.log('refreshToken =', result.refreshToken);
      saveAsCookie(result);
      return result;
    },
    [saveAsCookie]
  );

  const doLogout = useCallback(() => {
    removeCookie('user');
    resetState();
    alert('로그아웃 되었습니다!');
    moveToMain();
  }, [resetState, moveToMain]);

  const updateLoginName = useCallback(
    (newName) => {
      setLoginState((prev) => ({ ...prev, name: newName }));
    },
    [setLoginState]
  );

  return { doLogin, saveAsCookie, doLogout, updateLoginName };
};
