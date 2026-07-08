import jwtAxios  from "../utils/JwtUtil";
import ApiURL from "./ApiURL";

// 자소서 마스터 조회/생성 (JWT 사용자 기준, 없으면 생성)
export const getOrCreateCoverLetter = async () =>{
    const res = await jwtAxios.get(`${ApiURL}/coverletters`);
    return res.data;
};

// 자소서 상세조회
export const getCoverLetterDetail = async (coverLetterId) => {
    const res = await jwtAxios.get(`${ApiURL}/coverletters/${coverLetterId}`);
    return res.data;
};

// 자소서 마스터 정보 수정
export const updateCoverLetter = async (coverLetterId, dto) => {
    const res = await jwtAxios.put(`${ApiURL}/coverletters/${coverLetterId}`, dto);
    return res.data;
};