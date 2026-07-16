// 노드 배경색 / 엣지색을 한 규칙으로 계산 (여러 컴포넌트에서 공유)

export function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h, s, l = (mx + mn) / 2;
    if (mx === mn) { h = s = 0; }
    else {
        const d = mx - mn;
        s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        switch (mx) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

// depth만큼 명도를 올린 배경색 (한 단계당 +13%, 상한 88%)
export function nodeBackground(hex, depth) {
    const [h, s, l] = hexToHsl(hex);
    const bgL = Math.min(l + depth * 13, 88);
    return `hsl(${h}, ${s}%, ${bgL}%)`;
}

// 노드 스타일 — 배경은 연한 틴트, 테두리는 진한 색, 글자는 검/흰(모드 따라)
// depth로 갈수록 배경은 더 하얘지고 테두리는 더 밝아짐 (부모 진하고 자식 연하게)
// 색으로 꽉 채우지 않고 "연한 배경 + 진한 테두리"라 가독성 좋고 눈이 편함
export function nodeStyle(hex, depth, isDark = false) {
    const [h, s, l] = hexToHsl(hex);
    const borderL = Math.min(l + depth * 11, 72);
    const bgL = Math.min(89 + depth * 2.5, 97);
    return {
        background: isDark
            ? `hsl(${h}, ${Math.max(s - 30, 12)}%, ${Math.max(20 - depth * 2, 12)}%)`
            : `hsl(${h}, ${Math.max(s - 22, 15)}%, ${bgL}%)`,
        border: `1.5px solid hsl(${h}, ${s}%, ${borderL}%)`,
        color: nodeDefaultTextColor(isDark),  
    };
}

export const DEFAULT_NODE_COLOR = '#2563eb';

// 노드 기본 글자색
// 다크모드 대응도 여기 고치면됨
export function nodeDefaultTextColor(isDark = false) {
    return isDark ? '#f1f5f9' : '#1f2937';
}

// 키워드 칩 색 — 배경은 아주 연하게(거의 흰색), 글자·테두리는 노드 색 계열
// 이유: 칩이 노드 위에서 밝고 산뜻하게 떠 보이도록. 꽉 찬 색이 아니라 연한 배지 스타일
export function chipColors(hex, depth) {
    const [h, s, l] = hexToHsl(hex);
    return {
        background: `hsl(${h}, ${Math.max(s - 20, 15)}%, 96%)`,   // 거의 흰색(연한 틴트)
        color: `hsl(${h}, ${s}%, 32%)`,                            // 글자는 진한 노드 색
        border: `1px solid hsl(${h}, ${Math.max(s - 15, 20)}%, 85%)`, // 테두리 연하게
    };
}
// 배경 밝기에 맞춘 글자색
export function nodeTextColor(hex, depth) {
    const [h, s, l] = hexToHsl(hex);
    const bgL = Math.min(l + depth * 13, 88);
    return bgL > 62 ? `hsl(${h}, ${Math.max(s - 10, 20)}%, 25%)` : '#fff';
}