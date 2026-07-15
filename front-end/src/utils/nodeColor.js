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

// 배경 밝기에 맞춘 글자색
export function nodeTextColor(hex, depth) {
    const [h, s, l] = hexToHsl(hex);
    const bgL = Math.min(l + depth * 13, 88);
    return bgL > 62 ? `hsl(${h}, ${Math.max(s - 10, 20)}%, 25%)` : '#fff';
}