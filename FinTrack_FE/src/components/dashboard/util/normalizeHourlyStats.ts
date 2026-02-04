export type HourlyStat = {
    hour: number;
    amount: number;
}

export function normalizeHourlyStats(
  stats: { hour: number; amount: number }[]
) {
  return Array.from({ length: 24 }, (_, h) => {
    const found = stats.find(s => s.hour === h);
    return {
      hour: `${h}시`,
      amount: found?.amount ?? 0,
    };
  });
}
