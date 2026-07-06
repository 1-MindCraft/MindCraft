import React from 'react';
import './Privacy.css';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';

function PrivacyPage() {
  return (
    <div className="privacy-page">
      {/* 상단 바 */}
      <header className="privacy-header">
        <div className="privacy-header-logo">
          <img src={LOGO_SRC} alt="" className="privacy-logo-img" />
          <span className="privacy-logo-text">MIND <span>CRAFT</span></span>
        </div>
        <button className="privacy-close-btn" onClick={() => window.close()}>
          닫기 ✕
        </button>
      </header>

      {/* 본문 */}
      <main className="privacy-body">
        <h1 className="privacy-title">마인드크래프트 개인정보처리방침</h1>
        <p className="privacy-intro">
          마인드크래프트(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
          이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
          처리방침을 수립·공개합니다. 이 방침은 개인정보보호위원회의 「개인정보 처리방침 작성지침」
          (2026. 4. 24. 개정) 및 「개인정보 처리방침 표준(안)」(2026. 2.)의 기재 항목을 참고하여
          작성되었습니다.
        </p>

        <section className="privacy-section">
          <h2>제1조 (개인정보의 처리 목적)</h2>
          <p>
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는 아래의 목적
            이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」
            제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.
          </p>
          <ol className="privacy-list">
            <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
            <li>마인드맵 기반 자기소개서 작성 서비스 제공 및 AI를 이용한 초안 생성 기능 제공</li>
            <li>공지사항 전달, 불만·민원 처리 등 원활한 의사소통 경로 확보</li>
            <li>서비스 부정이용 방지, 비인가 사용 방지 등 서비스 안정성 확보</li>
            <li>신규 서비스 개발 및 서비스 품질 개선을 위한 통계·분석</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제2조 (처리하는 개인정보의 항목 및 수집 방법)</h2>
          <ol className="privacy-list">
            <li>
              <strong>필수 항목</strong> — 이름, 이메일 주소, 비밀번호(암호화 저장)
            </li>
            <li>
              <strong>소셜 로그인 이용 시</strong> — 연동한 서비스(구글, 카카오, 네이버)가 제공하는
              범위 내에서 계정 식별자(ID), 이메일, 닉네임 등 프로필 정보
            </li>
            <li>
              <strong>서비스 이용 과정에서 생성되는 정보</strong> — 마인드맵 작성 데이터, 자기소개서
              초안 내용, 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 및 브라우저 정보
            </li>
          </ol>
          <p className="privacy-note">
            개인정보는 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력하고 동의함으로써 수집되며,
            소셜 로그인 연동 시에는 해당 서비스로부터 제공받는 방식으로 수집됩니다.
          </p>
        </section>

        <section className="privacy-section">
          <h2>제3조 (14세 미만 아동의 개인정보 처리에 관한 사항)</h2>
          <p>
            회사는 만 14세 미만 아동의 회원가입을 제한하고 있으며, 만 14세 미만 아동의 개인정보를
            수집하지 않습니다. 향후 만 14세 미만 아동을 대상으로 한 서비스를 제공하게 될 경우,
            법정대리인의 동의를 받는 절차를 별도로 마련하여 이 방침에 반영하겠습니다.
          </p>
        </section>

        <section className="privacy-section">
          <h2>제4조 (개인정보의 처리 및 보유기간)</h2>
          <ol className="privacy-list">
            <li>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 원칙적으로 처리
              목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
            </li>
            <li>
              회원 탈퇴 시 이용자의 마인드맵 및 자기소개서 데이터는 즉시 삭제됩니다. 다만, 관련
              법령에 따라 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한
              기간 동안 회원정보를 보관합니다.
              <ol className="privacy-sublist">
                <li>계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li>서비스 이용 관련 로그인 기록 : 3개월 (통신비밀보호법)</li>
              </ol>
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제5조 (개인정보의 파기절차 및 방법)</h2>
          <ol className="privacy-list">
            <li>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
              때에는 지체없이 해당 개인정보를 파기합니다.
            </li>
            <li>
              전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
              삭제하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제6조 (개인정보의 제3자 제공에 관한 사항)</h2>
          <p>
            회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 아래의 경우에는
            예외로 하며, 「개인정보 보호법」 제17조에 근거합니다.
          </p>
          <ol className="privacy-list">
            <li>정보주체로부터 별도의 동의를 받은 경우</li>
            <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제7조 (개인정보 처리업무의 위탁에 관한 사항)</h2>
          <p>
            회사는 서비스 제공을 위하여 아래와 같이 개인정보 처리업무를 외부 전문업체에 위탁하고
            있습니다. 회사는 「개인정보 보호법」 제26조에 따라 위탁계약 체결 시 수탁자가 개인정보를
            안전하게 처리하는지를 감독하며, 위탁업무의 내용이나 수탁자가 변경될 경우 지체 없이 이
            방침을 통해 공개합니다.
          </p>
          <ol className="privacy-list">
            <li>클라우드 인프라 운영 및 데이터 보관 — 클라우드 서비스 제공업체</li>
            <li>AI 기반 자기소개서 초안 생성 — AI 모델 제공업체</li>
          </ol>
          <p className="privacy-note">
            위 항목의 구체적인 수탁자명은 계약 체결 및 서비스 정식 운영 시점에 확정하여 이 방침에
            명시할 예정입니다.
          </p>
        </section>

        <section className="privacy-section">
          <h2>제8조 (개인정보의 국외 이전에 관한 사항)</h2>
          <p>
            회사는 자기소개서 초안 생성을 위해 이용자가 입력한 마인드맵 데이터를 AI 모델 제공업체에
            전달하여 처리할 수 있으며, 이용하는 AI 모델 제공업체의 서버가 국외에 소재하는 경우
            개인정보가 국외로 이전될 수 있습니다. 이 경우 회사는 「개인정보 보호법」 제28조의8에
            따라 이전되는 개인정보 항목, 이전받는 자의 국가·명칭·연락처, 이전 목적 및 보유·이용기간
            등을 별도로 고지하고 필요한 동의를 받습니다.
          </p>
        </section>

        <section className="privacy-section">
          <h2>제9조 (자동화된 결정에 관한 사항)</h2>
          <p>
            회사는 이용자가 마인드맵에 입력한 정보를 바탕으로 AI가 자기소개서 초안을 자동으로
            생성하는 기능을 제공합니다. 이는 사람의 개입 없이 인공지능 기술로 결과물을 도출하는
            처리에 해당하며, 다음과 같은 사항을 안내합니다.
          </p>
          <ol className="privacy-list">
            <li>AI는 이용자가 마인드맵에 직접 입력한 정보(경험, 역량, 가치관 등)를 바탕으로 문항별 초안을 생성하며, 이용자가 설정한 문체·글자 수·창의적 제작 허용 여부 등의 옵션이 결과에 반영됩니다.</li>
            <li>AI가 생성한 초안은 참고용 자료이며, 최종 자기소개서의 내용에 대한 수정·확정 권한은 전적으로 이용자에게 있습니다.</li>
            <li>이용자는 AI가 생성한 결과에 대해 이의를 제기하거나 설명을 요구할 수 있으며, 회사는 정당한 사유가 있는 경우 이용자가 요청한 사항에 대해 재처리 등 필요한 조치를 취합니다.</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제10조 (개인정보의 안전성 확보조치에 관한 사항)</h2>
          <p>회사는 「개인정보 보호법」 제29조에 따라 다음과 같은 안전성 확보조치를 취하고 있습니다.</p>
          <ol className="privacy-list">
            <li>비밀번호는 암호화하여 저장·관리하고 있어 본인만이 알 수 있으며, 중요한 데이터는 저장 및 전송 시 암호화하는 등의 별도 보안기능을 사용합니다.</li>
            <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위해 보안 프로그램을 설치하고 주기적으로 갱신·점검합니다.</li>
            <li>개인정보를 취급하는 직원을 최소화하며, 개인정보를 처리하는 임직원을 대상으로 개인정보보호 의무를 명확히 하고 있습니다.</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제11조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
          <ol className="privacy-list">
            <li>회사는 이용자에게 맞춤화된 서비스 제공을 위해 쿠키(cookie)를 사용합니다.</li>
            <li>이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 발생할 수 있습니다.</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제12조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
          <ol className="privacy-list">
            <li>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등 「개인정보 보호법」 제35조부터 제37조까지의 권리를 행사할 수 있습니다.</li>
            <li>제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치합니다.</li>
            <li>정보주체가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제13조 (개인정보 보호책임자)</h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
            불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="privacy-contact-box">
            <div className="privacy-contact-row">
              <span className="privacy-contact-label">개인정보 보호책임자</span>
              <span>마인드크래프트 운영팀</span>
            </div>
            <div className="privacy-contact-row">
              <span className="privacy-contact-label">이메일</span>
              <span>privacy@mindcraft.example.com</span>
            </div>
          </div>
          <p className="privacy-note">
            정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보보호 관련 문의, 불만처리,
            피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있으며, 회사는 정보주체의
            문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
          </p>
        </section>

        <section className="privacy-section">
          <h2>제14조 (정보주체의 권익침해에 대한 구제방법)</h2>
          <p>
            정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
            개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
            개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
          </p>
          <ol className="privacy-list">
            <li>개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청 사이버수사과 : (국번없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청 사이버수사국 : (국번없이) 182 (ecrm.cyber.go.kr)</li>
          </ol>
        </section>

        <section className="privacy-section">
          <h2>제15조 (개인정보 처리방침의 변경에 관한 사항)</h2>
          <p>
            이 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용의 추가·삭제 및 수정이
            있을 시에는 개정 최소 7일 전부터 서비스 내 공지사항을 통하여 고지할 것입니다. 다만,
            정보주체의 권리에 중대한 변경이 발생할 경우에는 최소 30일 전에 고지합니다.
          </p>
        </section>

        <section className="privacy-section privacy-appendix">
          <h2>부칙</h2>
          <p>이 개인정보처리방침은 2026-07-15부터 시행합니다.</p>
        </section>

        <p className="privacy-disclaimer">
          ※ 본 문서는 개인정보보호위원회의 「개인정보 처리방침 작성지침」(2026. 4. 24. 개정) 및
          「개인정보 처리방침 표준(안)」(2026. 2.)의 기재 항목 구조를 참고하여 작성된 초안이며,
          법률 자문을 대체하지 않습니다. 실제 서비스 운영 전 위탁업체명, 국외이전 대상국가,
          담당자 연락처 등 구체적인 사항을 확정하고, 법률 전문가의 검토를 받으시길 권장합니다.
        </p>
      </main>
    </div>
  );
}

export default PrivacyPage;
