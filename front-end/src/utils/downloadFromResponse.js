// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: 백엔드가 만들어준 파일(Blob)을 실제로 "다운로드"시키는 로직이
// PDF/DOCX 양쪽에서 똑같이 필요해서 공용 함수로 뺐음

// axiosResponse: jwtAxios가 반환한 전체 응답 객체 (res.data가 Blob, res.headers에 파일명 정보 있음)
// fallbackFilename: 서버 응답 헤더에서 파일명을 못 읽어올 경우 대신 쓸 이름
export function downloadFromResponse(axiosResponse, fallbackFilename) {
  const blob = axiosResponse.data;

  // 추가된 부분: Content-Disposition 헤더에서 실제 파일명을 꺼내는 로직
  // 이유: 서버가 filename*=UTF-8''... 형식으로 파일명을 내려주므로, 그걸 그대로 쓰면
  // 프론트에서 제목을 또 계산할 필요 없이 서버와 파일명이 항상 일치함.
  // (브라우저 CORS 설정에 따라 이 헤더를 못 읽어올 수도 있어서, 실패하면 fallback 사용)
  let filename = fallbackFilename;
  const disposition = axiosResponse.headers?.['content-disposition'];
  if (disposition) {
    const match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (match?.[1]) {
      filename = decodeURIComponent(match[1]);
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 메모리 누수 방지
}