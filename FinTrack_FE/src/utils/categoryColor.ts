// CVD-safe 카테고리 팔레트 (adjacent ΔE 24.2, 8색 이상은 색만으로 구분하지 않도록 순서 고정)
export const CATEGORY_COLOR_PALETTE = [
  "#2a78d6", // blue
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
  "#e87ba4", // magenta
  "#eb6834", // orange
];

const STORAGE_KEY = "fintrack:categoryColors";

function readColorMap(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeColorMap(map: Record<number, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// 최초 조회 시 팔레트에서 색상을 배정하고 localStorage에 고정한다.
export function getCategoryColor(categoryId: number): string {
  const map = readColorMap();
  if (map[categoryId]) return map[categoryId];

  const assigned = CATEGORY_COLOR_PALETTE[categoryId % CATEGORY_COLOR_PALETTE.length];
  map[categoryId] = assigned;
  writeColorMap(map);
  return assigned;
}

export function setCategoryColor(categoryId: number, color: string) {
  const map = readColorMap();
  map[categoryId] = color;
  writeColorMap(map);
}
