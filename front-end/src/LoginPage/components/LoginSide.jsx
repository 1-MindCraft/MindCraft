import React from 'react';
import LOGO_SRC from '../../MainPage/image/MindCraft-Logo1.png';

function LoginSide() {
  return (
    <div className="login-side">
      <img src={LOGO_SRC} alt="" className="login-side-logo" />
      <span className="login-side-text">
        MIND <span>CRAFT</span>
      </span>
    </div>
  );
}

export default LoginSide;