import React, { useState } from 'react';
import faqs from '../../data/faqs';

// 수정된 부분: <details>/<summary> 방식(브라우저 기본 아코디언, 여러 개 동시에 열림)에서
// Help.jsx와 똑같은 방식(React state로 열림 인덱스 하나만 관리, 클릭하면 하나만 열리고
// 나머지는 자동으로 닫힘)으로 교체
// 이유: HELP 페이지의 FAQ 열고 닫히는 방식을 MainPage FAQ에도 동일하게 적용해달라는 요청
function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      className="section faq-section"
      id="faq"
      style={{ background: '#fff' }}
    >
      <div className="section-label">FAQ</div>
      <h2 className="section-title">자주 묻는 질문</h2>
      <p className="section-sub">
        MindCraft 이용 전 궁금하신 점을 확인해보세요.
      </p>

      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className={`faq-item ${openIndex === idx ? 'open' : ''}`}
          >
            <button className="faq-question" onClick={() => toggle(idx)}>
              <span>{faq.question}</span>
              <span className="faq-chevron">{openIndex === idx ? '−' : '+'}</span>
            </button>
            {openIndex === idx && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Faq;