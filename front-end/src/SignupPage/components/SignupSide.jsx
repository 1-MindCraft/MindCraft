import React from 'react';
import LOGO_SRC from '../../MainPage/image/MindCraft-Logo1.png';

function SignupSide({ theme = 'blue' }) {
  return (
    <div className={`login-side signup-side--${theme}`}>
      <img src={LOGO_SRC} alt="" className="login-side-logo" />
      <span className="login-side-text">
        MIND <span>CRAFT</span>
      </span>
    </div>
  );
}

export default SignupSide;
