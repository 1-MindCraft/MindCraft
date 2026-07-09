import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
import PDF_SRC from '../../assets/pdf.png';
import DOCX_SRC from '../../assets/docx.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';
// 수정된 부분: 프론트에서 직접 만들던 utils/coverLetterExport(jsPDF+html2canvas+docx) import를
// 백엔드 호출 함수로 교체
// 이유: 이제 PDF/DOCX를 백엔드(OpenPDF/Apache POI)가 실제 텍스트로 만들어주므로,
// 프론트는 그 결과 파일을 받아서 다운로드만 시켜주면 됨
import { exportCoverLetterAsPdf, exportCoverLetterAsDocx } from '../../axios/coverLetterApi';
import { downloadFromResponse } from '../../utils/downloadFromResponse';

// title/onTitleChange가 내려오면(자소서 생성 요청과 제목을 공유해야 하는 경우) 그걸 그대로 사용하고,
// 안 내려오면(단독으로 쓰는 경우) 기존처럼 내부 상태로 동작
// 수정된 부분: sections prop을 coverLetterId prop으로 교체
// 이유: 이제 백엔드가 coverLetterId 하나만 받아서 자기 DB에서 title/sections를 직접 조회해
// PDF/DOCX를 만들어주므로, 프론트가 문항 데이터를 따로 들고 넘길 필요가 없어짐
function CLHeader({ userName = '프로젝트 매니저 지원', onBackToMindMap, title, onTitleChange, coverLetterId }) {
  const [internalTitle, setInternalTitle] = useState(userName);
  const isControlled = title !== undefined && onTitleChange !== undefined;
  const currentTitle = isControlled ? title : internalTitle;
  const setTitle = isControlled ? onTitleChange : setInternalTitle;

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // PDF/DOCX 생성 중 상태 — 응답 오는 동안 중복 클릭 방지 + "내보내는 중" 표시용
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (!currentTitle.trim()) setTitle(userName);
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') {
      setTitle(userName);
      setIsEditing(false);
    }
  };

  // onBackToMindMap이 없으면 기본적으로 마인드맵 편집 경로로 이동
  const handleBack = () => {
    if (onBackToMindMap) {
      onBackToMindMap();
    } else {
      navigate('/mindmap');
    }
  };

  // 수정된 부분: PDF 다운로드 핸들러가 프론트 생성 로직 대신 백엔드 API를 호출하도록 변경
  // 이유: 백엔드에 GET /coverletters/{id}/export/pdf 엔드포인트가 새로 생겼기 때문
  const handleExportPdf = async () => {
    if (isExportingPdf || !coverLetterId) return;
    setIsExportingPdf(true);
    try {
      const res = await exportCoverLetterAsPdf(coverLetterId);
      downloadFromResponse(res, `${currentTitle || '자기소개서'}.pdf`);
    } catch (error) {
      console.error('PDF 내보내기 실패:', error);
      alert('PDF를 만드는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 수정된 부분: DOCX 다운로드 핸들러도 동일하게 백엔드 API 호출로 변경
  const handleExportDocx = async () => {
    if (isExportingDocx || !coverLetterId) return;
    setIsExportingDocx(true);
    try {
      const res = await exportCoverLetterAsDocx(coverLetterId);
      downloadFromResponse(res, `${currentTitle || '자기소개서'}.docx`);
    } catch (error) {
      console.error('DOCX 내보내기 실패:', error);
      alert('DOCX를 만드는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <AppHeader
      logoAreaWidth="260px"
      center={
        <div className="cl-doc-title">
          {isEditing ? (
            <input
              ref={inputRef}
              className="mm-title-input"
              value={currentTitle}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleConfirm}
              onKeyDown={handleKeyDown}
              maxLength={40}
            />
          ) : (
            <span className="mm-user-name">{currentTitle}</span>
          )}
          <button
            className="mm-icon-btn mm-icon-img-btn"
            onClick={() => setIsEditing((p) => !p)}
          >
            <img
              src={PENCIL_SRC}
              alt="편집"
              style={{
                width: '14px',
                height: '14px',
                objectFit: 'contain',
                display: 'block',
                opacity: 0.55,
              }}
            />
          </button>
        </div>
      }
      right={
        <div className="cl-header-right">
          <button className="cl-btn-back" onClick={handleBack}>
            ← 마인드맵 편집으로 돌아가기
          </button>
          {/* 수정된 부분: onClick이 이제 백엔드 export API를 호출함 (기존엔 프론트에서 직접 생성) */}
          <button className="cl-btn-pdf" onClick={handleExportPdf} disabled={isExportingPdf}>
            <img src={PDF_SRC} alt="PDF" className="cl-file-icon" />{' '}
            {isExportingPdf ? '내보내는 중...' : 'PDF'}
          </button>
          <button className="cl-btn-docx" onClick={handleExportDocx} disabled={isExportingDocx}>
            <img src={DOCX_SRC} alt="DOCX" className="cl-file-icon" />{' '}
            {isExportingDocx ? '내보내는 중...' : 'DOCX'}
          </button>
          <ProfileDropdown userName="마인드크래프트 회원" />
        </div>
      }
    />
  );
}

export default CLHeader;