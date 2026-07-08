// npm install react-cookie
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);

  return cookies.set(name, value, {
    path: '/',
    expires: expires,
  });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const removeCookie = (name, path = '/') => {
  cookies.remove(name, { path });
  console.log('삭제되었는지 쿠키 확인 : ', getCookie('user'));
};
