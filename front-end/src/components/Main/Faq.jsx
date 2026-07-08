import React from 'react';
import faqs from '../../data/faqs';

function Faq() {
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
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <div className="faq-answer">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default Faq;
