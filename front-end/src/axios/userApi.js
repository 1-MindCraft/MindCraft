import ApiURL from './ApiURL';
import axios from 'axios';
import jwtAxios from '../utils/JwtUtil';

// 회원가입
const register = async (userData) => {
  const response = await axios.post(`${ApiURL}/auth/register`, userData);
  return response.data;
};

// 로그인
const login = async (loginParam) => {
  const form = new FormData();
  form.append('email', loginParam.email);
  form.append('password', loginParam.password);

  const response = await axios.post(`${ApiURL}/auth/login`, form);
  return response.data;
};

// 내 정보 조회
const getMyInfo = async () => {
  const response = await jwtAxios.get(`${ApiURL}/users/me`);
  return response.data;
};

// 내 정보 수정
const updateMyInfo = async (userData) => {
  const response = await jwtAxios.patch(`${ApiURL}/users/me`, userData);
  return response.data;
};

// 회원 탈퇴
const deleteMe = async (password) => {
  const response = await jwtAxios.delete(`${ApiURL}/users/me`, {
    data: { password },
  });

  return response.data;
};

export { register, login, getMyInfo, updateMyInfo, deleteMe };
