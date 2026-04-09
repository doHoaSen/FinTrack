package doHoaSen.FinTrack.expenseFeedback.service;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseStatsRepository;
import doHoaSen.FinTrack.expenseStatistics.service.ExpenseStatsService;
import doHoaSen.FinTrack.target.entity.Target;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseFeedbackService {

    private final ExpenseStatsService statisticsService;
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseStatsRepository chartStatsRepository;
    private final TargetService targetService;

    public FeedbackResponse generate(Long userId) {

        YearMonth now = YearMonth.now();
        LocalDate today = LocalDate.now();

        Long thisMonth = statisticsService.getMonthlyTotal(userId, now);
        Long lastMonth = statisticsService.getMonthlyTotal(userId, now.minusMonths(1));
        List<DayExpense> daily = statisticsService.getDailyTotals(userId, now);
        List<DayExpense> lastMonthDaily = statisticsService.getDailyTotals(userId, now.minusMonths(1));
        Map<String, Long> categoryTotals = statisticsService.getCategoryTotals(userId, now);
        Map<String, Long> lastMonthCategoryTotals = statisticsService.getCategoryTotals(userId, now.minusMonths(1));
        long[] fixedVar = statisticsService.getFixedVsVariable(userId, now);

        // 주간 비교 (이번 주 월요일 기준 ISO)
        LocalDate thisWeekStart = today.with(DayOfWeek.MONDAY);
        LocalDate lastWeekStart = thisWeekStart.minusWeeks(1);
        Long thisWeek = statisticsService.getWeekTotal(userId, thisWeekStart);
        Long lastWeek = statisticsService.getWeekTotal(userId, lastWeekStart);

        Optional<Target> targetOpt = targetService.getCurrentTarget(userId);

        return FeedbackResponse.builder()
                .monthlyTrend(buildMonthlyTrend(thisMonth, lastMonth))
                .weekdayPattern(buildWeekdayPattern(expenseQueryRepository.getWeekdayStats(userId, now)))
                .hourlyPattern(buildHourlyPattern(expenseQueryRepository.getHourlyStats(userId, now)))
                .categoryPattern(buildCategoryPattern(categoryTotals))
                .targetProgress(buildTargetProgress(targetOpt, thisMonth, today, now))
                .fixedVsVariable(buildFixedVariable(fixedVar))
                .categoryConcentration(buildCategoryConcentration(categoryTotals))
                .dailyAverageTrend(buildDailyAverageTrend(daily, lastMonthDaily, now))
                .spikeDetection(buildSpikeDetection(daily))
                .overSpendSequence(buildOverSpendSequence(daily))
                .weekCompare(buildWeekCompare(thisWeek, lastWeek))
                .weeklyAverageTrend(buildWeeklyAverageTrend(thisWeek, lastWeek, today))
                .categoryMonthlyCompare(buildCategoryMonthlyCompare(categoryTotals, lastMonthCategoryTotals))
                .build();
    }

    // ─────────────────────────────────────────────
    // 기존 빌더 (메시지 문구 고도화)
    // ─────────────────────────────────────────────

    private FeedbackResponse.MonthlyTrend buildMonthlyTrend(long current, long last) {
        if (last == 0) {
            return FeedbackResponse.MonthlyTrend.builder()
                    .status("first")
                    .currentMonth(current)
                    .message("첫 달 소비 데이터가 충분하지 않아 비교 분석은 제공되지 않습니다.")
                    .build();
        }

        double rate = (current - last) * 100.0 / last;
        return FeedbackResponse.MonthlyTrend.builder()
                .status(rate > 0 ? "increase" : "decrease")
                .currentMonth(current)
                .lastMonth(last)
                .percentDiff(rate)
                .message(String.format("전월 대비 %.1f%% %s했습니다.",
                        Math.abs(rate), rate > 0 ? "증가" : "감소"))
                .build();
    }

    private FeedbackResponse.WeekdayPattern buildWeekdayPattern(List<WeekdayStatsDto> stats) {
        if (stats == null || stats.isEmpty()) {
            return FeedbackResponse.WeekdayPattern.builder()
                    .message("아직 지출 내역이 없습니다. 첫 지출을 등록해보세요!")
                    .build();
        }

        var peak = stats.stream()
                .max(Comparator.comparing(WeekdayStatsDto::getAmount))
                .get();

        // ISO 기준: 1=월 ~ 7=일
        String[] days = {"", "월", "화", "수", "목", "금", "토", "일"};
        int idx = peak.getWeekday();
        String dayName = (idx >= 1 && idx <= 7) ? days[idx] : String.valueOf(idx);

        return FeedbackResponse.WeekdayPattern.builder()
                .peakDay(peak.getWeekday())
                .peakAmount(peak.getAmount())
                .message(String.format("%s요일 소비가 가장 많습니다. 해당 요일 지출을 주의해보세요.", dayName))
                .build();
    }

    private FeedbackResponse.HourlyPattern buildHourlyPattern(List<HourlyStatsDto> stats) {
        if (stats == null || stats.isEmpty()) {
            return FeedbackResponse.HourlyPattern.builder()
                    .message("아직 지출 시간이 기록되지 않았습니다.")
                    .build();
        }

        var peak = stats.stream()
                .max(Comparator.comparing(HourlyStatsDto::getAmount))
                .get();

        return FeedbackResponse.HourlyPattern.builder()
                .peakHour(peak.getHour())
                .amount(peak.getAmount())
                .message(String.format("%d시대 지출이 가장 많습니다. 퇴근 후 충동 구매 패턴일 수 있으니 주의해보세요!", peak.getHour()))
                .build();
    }

    private FeedbackResponse.CategoryPattern buildCategoryPattern(Map<String, Long> map) {
        if (map.isEmpty()) {
            return FeedbackResponse.CategoryPattern.builder()
                    .message("카테고리 데이터가 없습니다.")
                    .build();
        }

        var top = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();
        long total = map.values().stream().mapToLong(v -> v).sum();
        double ratio = top.getValue() * 100.0 / total;

        return FeedbackResponse.CategoryPattern.builder()
                .topCategory(top.getKey())
                .amount(top.getValue())
                .ratio(ratio)
                .message(String.format("%s 지출이 이번 달 전체의 %.1f%%입니다.", top.getKey(), ratio))
                .build();
    }

    private FeedbackResponse.FixedVsVariable buildFixedVariable(long[] fv) {
        long fixed = fv[0];
        long variable = fv[1];
        long total = fixed + variable;

        if (total == 0) {
            return FeedbackResponse.FixedVsVariable.builder()
                    .message("지출 데이터가 없습니다.")
                    .build();
        }

        double fixedRatio = fixed * 100.0 / total;
        String message = fixedRatio >= 50
                ? String.format("고정 지출이 %.1f%%로 높습니다. 생활 비용 최적화가 어려울 수 있습니다.", fixedRatio)
                : String.format("고정 지출 %.1f%%, 변동 지출 %.1f%%입니다.", fixedRatio, 100 - fixedRatio);

        return FeedbackResponse.FixedVsVariable.builder()
                .fixedTotal(fixed)
                .variableTotal(variable)
                .fixedRatio(fixedRatio)
                .variableRatio(variable * 100.0 / total)
                .message(message)
                .build();
    }

    // ─────────────────────────────────────────────
    // 신규 빌더 7개
    // ─────────────────────────────────────────────

    /** FR-10 목표 달성률 + 예산 초과 예측 */
    private FeedbackResponse.TargetProgress buildTargetProgress(
            Optional<Target> targetOpt, long usedAmount, LocalDate today, YearMonth now) {

        if (targetOpt.isEmpty()) {
            return FeedbackResponse.TargetProgress.builder()
                    .usedAmount(usedAmount)
                    .message("이번 달 목표가 설정되지 않았습니다.")
                    .build();
        }

        long targetAmount = targetOpt.get().getTargetAmount();
        double ratio = targetAmount == 0 ? 0 : usedAmount * 100.0 / targetAmount;

        // 선형 예측: 일평균 소비 × 월 전체 일수
        int dayOfMonth = today.getDayOfMonth();
        int daysInMonth = now.lengthOfMonth();

        String message;
        if (ratio >= 100) {
            message = String.format("목표를 %,d원 초과했습니다. 지출을 줄여보세요!", usedAmount - targetAmount);
        } else {
            long projectedTotal = usedAmount * daysInMonth / dayOfMonth;
            if (projectedTotal > targetAmount) {
                long dailyAvg = usedAmount / dayOfMonth;
                long remaining = targetAmount - usedAmount;
                long daysLeft = dailyAvg == 0 ? (daysInMonth - dayOfMonth) : remaining / dailyAvg;
                long overDay = Math.min(dayOfMonth + daysLeft, daysInMonth);
                message = String.format("이번 달 소비 속도라면 %d일에 목표 금액을 초과할 것으로 예상됩니다.", overDay);
            } else if (ratio >= 80) {
                message = String.format("목표 금액의 %.1f%%를 사용했습니다. 절약이 필요합니다!", ratio);
            } else if (ratio >= 50) {
                message = String.format("목표 대비 %.1f%% 사용했습니다.", ratio);
            } else {
                message = String.format("목표 대비 %.1f%% 사용했습니다. 절약 중이에요!", ratio);
            }
        }

        return FeedbackResponse.TargetProgress.builder()
                .targetAmount(targetAmount)
                .usedAmount(usedAmount)
                .ratio(ratio)
                .achieved(ratio >= 100)
                .message(message)
                .build();
    }

    /** 카테고리 집중도 — 50% 이상이면 분산 소비 권고 */
    private FeedbackResponse.CategoryConcentration buildCategoryConcentration(Map<String, Long> map) {
        if (map.isEmpty()) {
            return FeedbackResponse.CategoryConcentration.builder()
                    .message("카테고리 데이터가 없습니다.")
                    .build();
        }

        var top = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();
        long total = map.values().stream().mapToLong(v -> v).sum();
        double ratio = top.getValue() * 100.0 / total;

        String message = ratio >= 50
                ? String.format("지출의 %.1f%%가 %s에 집중되어 있습니다. 분산 소비를 고려해보세요.", ratio, top.getKey())
                : String.format("지출의 %.1f%%가 %s입니다.", ratio, top.getKey());

        return FeedbackResponse.CategoryConcentration.builder()
                .topCategory(top.getKey())
                .amount(top.getValue())
                .ratio(ratio)
                .message(message)
                .build();
    }

    /** 일평균 소비 추이 — 이번 달 vs 지난달 */
    private FeedbackResponse.DailyAverageTrend buildDailyAverageTrend(
            List<DayExpense> daily, List<DayExpense> lastMonthDaily, YearMonth now) {

        if (daily.isEmpty()) {
            return FeedbackResponse.DailyAverageTrend.builder()
                    .message("이번 달 지출 데이터가 없습니다.")
                    .build();
        }

        int elapsedDays = LocalDate.now().getDayOfMonth();
        double currentAvg = daily.stream().mapToLong(DayExpense::getTotal).sum() * 1.0 / elapsedDays;

        if (lastMonthDaily.isEmpty()) {
            return FeedbackResponse.DailyAverageTrend.builder()
                    .currentAvg(currentAvg)
                    .message(String.format("하루 평균 %,.0f원 소비 중입니다.", currentAvg))
                    .build();
        }

        int lastMonthDays = now.minusMonths(1).lengthOfMonth();
        double lastMonthAvg = lastMonthDaily.stream().mapToLong(DayExpense::getTotal).sum() * 1.0 / lastMonthDays;
        double diff = currentAvg - lastMonthAvg;

        return FeedbackResponse.DailyAverageTrend.builder()
                .currentAvg(currentAvg)
                .lastMonthAvg(lastMonthAvg)
                .diff(diff)
                .message(String.format("하루 평균 %,.0f원 소비 중이며, 지난달 대비 하루 %,.0f원 %s했습니다.",
                        currentAvg, Math.abs(diff), diff > 0 ? "증가" : "감소"))
                .build();
    }

    /** 지출 스파이크 탐지 — 평균의 1.5배 초과 날을 감지 */
    private FeedbackResponse.SpikeDetection buildSpikeDetection(List<DayExpense> daily) {
        if (daily.isEmpty()) {
            return FeedbackResponse.SpikeDetection.builder()
                    .message("이번 달 지출 데이터가 없습니다.")
                    .build();
        }

        double avg = daily.stream().mapToLong(DayExpense::getTotal).average().orElse(0);

        var spike = daily.stream()
                .filter(d -> d.getTotal() > avg * 1.5)
                .max(Comparator.comparing(DayExpense::getTotal))
                .orElse(null);

        if (spike == null) {
            return FeedbackResponse.SpikeDetection.builder()
                    .message("이번 달 급격한 지출 급등은 없었습니다.")
                    .build();
        }

        return FeedbackResponse.SpikeDetection.builder()
                .date(spike.getDate().toString())
                .amount(spike.getTotal())
                .message(String.format("%d일 지출(₩%,d)이 평소보다 높았습니다. 큰 소비가 반복되지 않는지 확인하세요.",
                        spike.getDate().getDayOfMonth(), spike.getTotal()))
                .build();
    }

    /** 연속 지출 증가 감지 — 3일 이상 연속 증가 시 경고 */
    private FeedbackResponse.OverSpendSequence buildOverSpendSequence(List<DayExpense> daily) {
        if (daily.size() < 2) {
            return FeedbackResponse.OverSpendSequence.builder()
                    .streak(0)
                    .message("연속 지출 패턴을 분석하기엔 데이터가 부족합니다.")
                    .build();
        }

        int maxStreak = 1, streak = 1;
        for (int i = 1; i < daily.size(); i++) {
            if (daily.get(i).getTotal() > daily.get(i - 1).getTotal()) {
                streak++;
                maxStreak = Math.max(maxStreak, streak);
            } else {
                streak = 1;
            }
        }

        String message = maxStreak >= 3
                ? String.format("최근 %d일간 지출이 연속 증가하고 있습니다. 과소비 신호입니다.", maxStreak)
                : "연속적인 지출 증가 패턴은 감지되지 않았습니다.";

        return FeedbackResponse.OverSpendSequence.builder()
                .streak(maxStreak)
                .message(message)
                .build();
    }

    /** 이번 주 vs 지난주 총 지출 비교 */
    private FeedbackResponse.WeekCompare buildWeekCompare(long thisWeek, long lastWeek) {
        if (lastWeek == 0) {
            return FeedbackResponse.WeekCompare.builder()
                    .thisWeek(thisWeek)
                    .message("지난주 데이터가 없어 비교가 어렵습니다.")
                    .build();
        }

        double diff = (thisWeek - lastWeek) * 100.0 / lastWeek;
        return FeedbackResponse.WeekCompare.builder()
                .thisWeek(thisWeek)
                .lastWeek(lastWeek)
                .diffPercent(diff)
                .message(String.format("이번 주 지출은 지난주 대비 %.1f%% %s했습니다.",
                        Math.abs(diff), diff > 0 ? "증가" : "감소"))
                .build();
    }

    /** FR-06 카테고리별 전월 비교 — 변화율 상위 3개 */
    private List<FeedbackResponse.CategoryMonthlyCompare> buildCategoryMonthlyCompare(
            Map<String, Long> thisMonth, Map<String, Long> lastMonth) {

        if (thisMonth.isEmpty() || lastMonth.isEmpty()) return List.of();

        return thisMonth.entrySet().stream()
                .filter(e -> lastMonth.containsKey(e.getKey()))
                .map(e -> {
                    String cat = e.getKey();
                    long current = e.getValue();
                    long prev = lastMonth.get(cat);
                    double rate = (current - prev) * 100.0 / prev;
                    String message = String.format("%s: 전월 대비 %.1f%% %s했습니다.",
                            cat, Math.abs(rate), rate > 0 ? "증가" : "감소");
                    return FeedbackResponse.CategoryMonthlyCompare.builder()
                            .categoryName(cat)
                            .thisMonth(current)
                            .lastMonth(prev)
                            .changeRate(rate)
                            .message(message)
                            .build();
                })
                .sorted(Comparator.comparingDouble(c -> -Math.abs(c.getChangeRate())))
                .limit(3)
                .collect(Collectors.toList());
    }

    /** 이번 주 하루 평균 vs 지난주 하루 평균 */
    private FeedbackResponse.WeeklyAverageTrend buildWeeklyAverageTrend(
            long thisWeek, long lastWeek, LocalDate today) {

        // 이번 주 경과 일수: 월(1) ~ 일(7)
        int daysThisWeek = today.getDayOfWeek().getValue();
        double thisAvg = thisWeek * 1.0 / daysThisWeek;
        double lastAvg = lastWeek / 7.0;
        double diff = thisAvg - lastAvg;

        if (lastWeek == 0) {
            return FeedbackResponse.WeeklyAverageTrend.builder()
                    .thisWeekAvg(thisAvg)
                    .message(String.format("이번 주 하루 평균 %,.0f원 소비 중입니다.", thisAvg))
                    .build();
        }

        return FeedbackResponse.WeeklyAverageTrend.builder()
                .thisWeekAvg(thisAvg)
                .lastWeekAvg(lastAvg)
                .diffPercent(diff)
                .message(String.format("이번 주 하루 평균 %,.0f원, 지난주 대비 %,.0f원 %s했습니다.",
                        thisAvg, Math.abs(diff), diff > 0 ? "증가" : "감소"))
                .build();
    }
}
