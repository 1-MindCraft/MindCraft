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

// 추가된 부분: PDF 다운로드
// 이유: 백엔드에 export 엔드포인트가 새로 생겨서, 프론트에서 직접 만들던(jsPDF+html2canvas) 방식 대신
// 서버가 만들어준 실제 파일을 받아오는 방식으로 바꿈. responseType: 'blob'이 핵심 —
// 이게 없으면 axios가 바이너리 데이터를 텍스트로 잘못 해석해서 파일이 깨짐
export const exportCoverLetterAsPdf = async (coverLetterId) => {
    const res = await jwtAxios.get(`${ApiURL}/coverletters/${coverLetterId}/export/pdf`, {
        responseType: 'blob',
    });
    return res; // 수정된 부분: res.data(Blob)뿐 아니라 헤더(파일명)도 써야 해서 res 전체를 반환
};

// 추가된 부분: DOCX 다운로드 (이유는 위 PDF와 동일)
export const exportCoverLetterAsDocx = async (coverLetterId) => {
    const res = await jwtAxios.get(`${ApiURL}/coverletters/${coverLetterId}/export/docx`, {
        responseType: 'blob',
    });
    return res;
};