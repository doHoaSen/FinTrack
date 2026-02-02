const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export function normalizeWeekdayStats(
  stats: { weekday: number; amount: number }[]
) {
  // weekday: 1~7 (월~일) 기준
  return Array.from({ length: 7 }, (_, i) => {
    const weekday = i + 1;
    const found = stats.find(s => s.weekday === weekday);
    return {
      day: WEEK_LABELS[i],
      amount: found?.amount ?? 0,
    };
  });
}
