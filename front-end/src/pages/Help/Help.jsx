import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';
import AppHeader from '../../components/common/AppHeader';

const FAQS = [
  {
    q: '마인드맵으로 어떻게 자기소개서를 만들 수 있나요?',
    a: '마인드맵 편집 화면에서 경험, 역량, 가치관 등을 노드로 자유롭게 입력한 뒤, 자기소개서 화면으로 이동해 생성 설정에서 문항·문체·글자 수 등을 선택하고 [생성하기] 버튼을 누르면 AI가 초안을 만들어드려요.',
  },
  {
    q: '작성 중인 마인드맵은 자동으로 저장되나요?',
    a: '툴바 또는 캔버스 우측 하단의 저장 버튼을 눌러 저장할 수 있어요. 저장 시각은 헤더/툴바에 함께 표시됩니다.',
  },
  {
    q: 'AI가 생성한 초안을 수정할 수 있나요?',
    a: '네. AI가 생성한 내용은 참고용 초안이며, 문항 제목과 본문 내용 모두 자유롭게 수정하실 수 있어요.',
  },
  {
    q: '완성된 자기소개서는 어떻게 내보낼 수 있나요?',
    a: '자기소개서 편집 화면 상단의 PDF 또는 DOCX 버튼을 눌러 원하는 형식으로 내보낼 수 있어요.',
  },
  {
    q: '다크 모드는 어떻게 켜나요?',
    a: '화면 우측 상단의 프로필 아이콘을 클릭한 뒤 "테마 설정"에서 라이트 모드와 다크 모드를 선택할 수 있어요.',
  },
];

function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="help-page">
      {/* 상단 바 */}
      <AppHeader actionLabel="← 돌아가기" onAction={() => navigate(-1)} />

      <div className="help-body">
        <h1 className="help-title">도움말</h1>
        <p className="help-sub">마인드크래프트를 이용하시면서 궁금한 점을 확인해보세요.</p>

        <div className="help-faq-list">
          {FAQS.map((item, idx) => (
            <div key={idx} className={`help-faq-item ${openIndex === idx ? 'open' : ''}`}>
              <button className="help-faq-question" onClick={() => toggle(idx)}>
                <span>{item.q}</span>
                <span className="help-faq-chevron">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="help-faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default HelpPage;