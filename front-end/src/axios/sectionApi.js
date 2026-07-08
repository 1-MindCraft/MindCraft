import jwtAxios from "../utils/JwtUtil";
import ApiURL from "./ApiURL";

// 문항 목록 조회
export const getSectionList = async (coverLetterId) => {
    const res = await jwtAxios.get(`${ApiURL}/coverletters/${coverLetterId}/sections`);
    return res.data;
};

// 문항 추가
export const createSection = async (coverLetterId, sectionData) => {
    const res = await jwtAxios.post(
        `${ApiURL}/coverletters/${coverLetterId}/sections`,
        sectionData
    );
    return res.data;
};

// 문항 삭제
export const deleteSection = async (coverLetterId, sectionId) => {
    const res = await jwtAxios.delete(
        `${ApiURL}/coverletters/${coverLetterId}/sections/${sectionId}`
    );
    return res.data;
};