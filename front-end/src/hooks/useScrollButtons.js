import { useState, useEffect } from 'react';

/**
 * 스크롤 위치에 따라 "탑 버튼"과 "플로팅 CTA 버튼"의 노출 여부를 계산하는 훅
 *
 * - topBtn: 스크롤이 중간 지점(threshold)을 지나면 true
 * - floatCta: 중간 지점은 지났지만, 맨 아래(bottomOffset px 이내)에는
 *             도달하지 않았을 때만 true
 */
function useScrollButtons({ threshold = 0.5, bottomOffset = 80 } = {}) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showFloatCta, setShowFloatCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const isPastMiddle = window.scrollY > docHeight * threshold;
      const isNearBottom = window.scrollY >= docHeight - bottomOffset;

      setShowTopBtn(isPastMiddle);
      setShowFloatCta(isPastMiddle && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, bottomOffset]);

  return { showTopBtn, showFloatCta };
}

export default useScrollButtons;
