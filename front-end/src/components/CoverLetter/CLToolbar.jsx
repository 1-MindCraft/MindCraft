import React from 'react';
// 수정된 부분: HAND_SRC(드래그 도구 아이콘) import 삭제
// 이유: 아래에서 드래그 도구 버튼 자체를 지웠기 때문에 더 이상 필요 없어짐

// 수정된 부분: 함수 컴포넌트 시작 부분에 있던 useState 3개(tool, zoom, activeColor)와
// COLORS 배열, handleZoom 함수를 전부 삭제
// 이유: CLMindMap이 읽기 전용(ReadOnly)으로 바뀌면서, 이 상태들이 제어하던
// 드래그/선택 도구·확대축소·색상 선택 버튼들이 전부 의미 없어졌기 때문

// 추가된 부분: navLabel/onNav prop 추가, showSettingsToggle prop 추가
// 이유: 자소서 마스터 화면 ↔ 자소서 편집 화면을 오가는 버튼을 툴바에 넣어야 하고(navLabel/onNav),
// 마스터 화면에는 CLSettings(생성 설정) 자체가 없으니 그 토글 버튼을 숨길 수 있어야 해서(showSettingsToggle) 추가
function CLToolbar({ onSettingsToggle, settingsOpen, navLabel, onNav, showSettingsToggle = true, className = '' }) {
  return (
    <div className={`cl-toolbar ${className}`}>
      {/* 추가된 부분: 왼쪽에 이동/돌아가기 버튼 자리 추가
          이유: 자소서 마스터 화면일 땐 "→ 자소서 편집으로 이동", 편집 화면일 땐
          "← 자소서 마스터로 돌아가기"가 여기 뜨도록 함 (navLabel이 없으면 아무것도 안 보임) */}
      <div className="cl-toolbar-left">
        {navLabel && (
          <>
            <div className="mm-toolbar-divider" />
            <button className="cl-btn-nav" onClick={onNav}>
              {navLabel}
            </button>
          </>
        )}
      </div>

      {/* 수정된 부분: 원래 여기 있던 도구 버튼들(드래그/선택, 실행취소/다시실행,
          확대·축소, 색상 점, 테마)을 전부 삭제하고 빈 스페이서만 남김
          이유: 마인드맵이 읽기 전용이라 편집 도구 자체가 필요 없어짐.

          다만 이 div(flex:1)를 완전히 없애면 아래 "생성 설정" 버튼이
          오른쪽 끝에 붙어있게 해주던 여백이 사라지므로, 내용은 비우되
          div는 스페이서 용도로 그대로 남김 */}
      <div className="cl-toolbar-center" />

      {/* 수정된 부분: showSettingsToggle이 false면 "생성 설정" 버튼 자체를 안 그림
          이유: 자소서 마스터 화면에는 CLSettings 패널이 없어서 이 토글 버튼도 필요 없음 */}
      {showSettingsToggle && (
        <div className="cl-toolbar-right">
          <div className="mm-toolbar-divider" />
          <button
            className={`cl-btn-settings ${settingsOpen ? 'active' : ''}`}
            onClick={onSettingsToggle}
          >
            ✦ 생성 설정
          </button>
        </div>
      )}
    </div>
  );
}

export default CLToolbar;