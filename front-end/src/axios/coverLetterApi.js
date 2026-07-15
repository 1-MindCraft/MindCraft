import jwtAxios  from "../utils/JwtUtil";
import ApiURL from "./ApiURL";

// 추가된 부분: 자소서 마스터 목록 조회 (V2, 1:N)
// 이유: 백엔드 GET /coverletters가 이제 "조회 또는 생성" 단건이 아니라 배열을 반환하도록 바뀌어서,
// 이름도 그 의미에 맞게 getCoverLetterList로 바꿈 (기존 getOrCreateCoverLetter는 삭제)
export const getCoverLetterList = async () => {
    const res = await jwtAxios.get(`${ApiURL}/coverletters`);
    return res.data;
};

// 추가된 부분: 자소서 마스터 신규 생성 (V2, 1:N)
// 이유: V1엔 없던 POST 엔드포인트가 새로 생겨서, 그걸 호출하는 함수도 새로 추가
export const createCoverLetter = async (dto) => {
    const res = await jwtAxios.post(`${ApiURL}/coverletters`, dto);
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

// 2026-07-14 추가된 부분: 선택된 자소서 마스터 삭제 API 호출
// 이유: 자소서 마스터 화면에서 현재 선택된 마스터만 삭제하기 위해 기존 DELETE /coverletters/{id}를 호출함
export const deleteCoverLetter = async (coverLetterId) => {
    const res = await jwtAxios.delete(`${ApiURL}/coverletters/${coverLetterId}`);
    return res.data;
};
