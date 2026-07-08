import React from 'react';
// 수정된 부분: HAND_SRC(드래그 도구 아이콘) import 삭제
// 이유: 아래에서 드래그 도구 버튼 자체를 지웠기 때문에 더 이상 필요 없어짐

// 수정된 부분: 함수 컴포넌트 시작 부분에 있던 useState 3개(tool, zoom, activeColor)와
// COLORS 배열, handleZoom 함수를 전부 삭제
// 이유: CLMindMap이 읽기 전용(ReadOnly)으로 바뀌면서, 이 상태들이 제어하던
// 드래그/선택 도구·확대축소·색상 선택 버튼들이 전부 의미 없어졌기 때문
function CLToolbar({ onSettingsToggle, settingsOpen }) {
  return (
    <div className="cl-toolbar">
      {/* 수정된 부분: 원래 여기 있던 도구 버튼들(드래그/선택, 실행취소/다시실행,
          확대·축소, 색상 점, 테마)을 전부 삭제하고 빈 스페이서만 남김
          이유: 마인드맵이 읽기 전용이라 편집 도구 자체가 필요 없어짐.
          
          다만 이 div(flex:1)를 완전히 없애면 아래 "생성 설정" 버튼이
          오른쪽 끝에 붙어있게 해주던 여백이 사라지므로, 내용은 비우되
          div는 스페이서 용도로 그대로 남김 */}
      <div className="cl-toolbar-center" />

      {/* 그대로 유지: "✦ 생성 설정" 버튼은 마인드맵 편집과 무관하게
          CLSettings(자소서 생성 패널)를 여닫는 실제 기능이라 삭제하지 않음 */}
      <div className="cl-toolbar-right">
        <div className="mm-toolbar-divider" />
        <button
          className={`cl-btn-settings ${settingsOpen ? 'active' : ''}`}
          onClick={onSettingsToggle}
        >
          ✦ 생성 설정
        </button>
      </div>
    </div>
  );
}

export default CLToolbar;