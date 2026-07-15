// 추가된 부분 [2026-07-15]: 이 파일 전체가 새로 추가된 파일입니다
// 이유: 자소서 편집화면 [ 생성하기 ] 오버레이에 쓸 TextShimmerWave 컴포넌트.
// 사용자가 준 공식 소스(motion-primitives)를 이 프로젝트 환경에 맞게 변환함:
//  - .tsx(TypeScript) → .jsx로 변환, Props 타입 정의 등 TS 전용 문법 전부 제거
//  - 원본은 "@/lib/utils"의 cn(clsx + tailwind-merge)을 쓰지만, 이 프로젝트엔
//    Tailwind/clsx가 없어서 falsy 값만 걸러내는 간단한 cn()을 이 파일 안에 직접 정의
//  - Tailwind 유틸리티 클래스(relative inline-block [perspective:500px] 등)는
//    같은 이름의 실제 CSS 클래스로 옮겨서 text-shimmer-wave.css에 정의함
// ⚠️ 이 컴포넌트는 "motion" 패키지(예전 이름: framer-motion)가 필요합니다.
//    프로젝트에 아직 설치돼 있지 않다면 아래 명령어로 설치해주세요:
//      npm install motion
import { motion } from 'motion/react';
import './text-shimmer-wave.css';

// 추가된 부분 [2026-07-15]: cn 유틸 대체
// 이유: 원본의 "@/lib/utils" cn(clsx + tailwind-merge) 대신, Tailwind가 없는 이
// 프로젝트에서는 falsy 값만 걸러내고 공백으로 합치는 간단한 버전이면 충분해서 대체함
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function TextShimmerWave({
  children,
  as: Component = 'p',
  className,
  duration = 1,
  baseColor,
  shimmerColor,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  style,
}) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      // 수정된 부분 [2026-07-15]: Tailwind 클래스 "relative inline-block [perspective:500px]"를
      // 동일한 효과의 CSS 클래스 "text-shimmer-wave"로 대체 (text-shimmer-wave.css에 정의)
      // before: className={cn("relative inline-block [perspective:500px]", className)}
      // after:
      className={cn('text-shimmer-wave', className)}
      style={{
        ...style,
        '--base-color':
          baseColor ?? 'color-mix(in oklab, currentColor 55%, transparent)',
        '--base-gradient-color': shimmerColor ?? 'currentColor',
      }}
    >
      {children.split('').map((char, i) => {
        const delay = (i * duration * (1 / spread)) / children.length;
        return (
          <motion.span
            key={i}
            // 수정된 부분 [2026-07-15]: Tailwind 클래스를 "text-shimmer-wave-char" CSS 클래스로 대체
            // before: className={cn("inline-block whitespace-pre [transform-style:preserve-3d]")}
            // after:
            className="text-shimmer-wave-char"
            initial={{
              translateZ: 0,
              scale: 1,
              rotateY: 0,
              color: 'var(--base-color)',
            }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: [
                'var(--base-color)',
                'var(--base-gradient-color)',
                'var(--base-color)',
              ],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatDelay: (children.length * 0.05) / spread,
              delay,
              ease: 'easeInOut',
              ...transition,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}

export default TextShimmerWave;
