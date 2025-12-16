package doHoaSen.FinTrack.expenseFeedback.service;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseFeedback.repository.ExpenseFeedbackRepository;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpenseFeedbackService {
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseFeedbackRepository expenseFeedbackRepository;
    private final TargetService targetService;

    private static final Set<String> FIXED = Set.of("월세", "관리비", "보험", "정기구독", "통신비");

    public FeedbackResponse generate(Long userId){

        Map<String, Long> category = expenseFeedbackRepository.getCategoryTotals(userId);
        List<DayExpense> daily = expenseFeedbackRepository.getDailyTotals(userId);

        FeedbackResponse.FeedbackResponseBuilder builder = FeedbackResponse.builder();

        builder.monthlyTrend(monthlyTrend(userId));
        builder.weekdayPattern(weekdayPattern(userId));
        builder.hourlyPattern(hourlyPattern(userId));
        builder.categoryPattern(categoryPattern(category));
        builder.targetProgress(targetProgress(userId));

        builder.fixedVsVariable(fixedVsVariable(category));
        builder.categoryPattern(categoryPattern(category));
        builder.dailyAverageTrend(dailyAverageTrend(daily, expenseFeedbackRepository.getLastMonthDailyAverage(userId)));
        builder.spikeDetection(spikeDetection(daily));
        builder.overSpendSequence(overSpendSequence(daily));

        builder.weekCompare(weekCompare(userId));
        builder.weeklyAverageTrend(weeklyAverageTrend(userId));

        return builder.build();
    }



    /** 2) 전월 대비 분석 */
    private FeedbackResponse.MonthlyTrend monthlyTrend(Long userId) {
        YearMonth now = YearMonth.now();
        YearMonth last = now.minusMonths(1);

        long thisMonth = expenseFeedbackRepository.getMonthlyTotal(userId, now);
        long lastMonth = expenseFeedbackRepository.getMonthlyTotal(userId, last);

        if (lastMonth == 0) {
            return FeedbackResponse.MonthlyTrend.builder()
                    .status("firstMonth")
                    .currentMonth(thisMonth)
                    .lastMonth(0L)
                    .percentDiff(null)
                    .message("첫 달 소비라 전월 대비 분석은 제공되지 않습니다.")
                    .build();
        }

        long diff = thisMonth - lastMonth;
        double rate = diff * 100.0 / lastMonth;

        return FeedbackResponse.MonthlyTrend.builder()
                .status(rate > 0 ? "increase" : "decrease")
                .currentMonth(thisMonth)
                .lastMonth(lastMonth)
                .percentDiff(rate)
                .message(rate > 0
                        ? String.format("지난달 대비 %.1f%% 지출이 증가했습니다.", rate)
                        : String.format("지난달 대비 %.1f%% 지출이 감소했습니다.", Math.abs(rate)))
                .build();
    }

    /** 3) 요일 패턴 */
    private FeedbackResponse.WeekdayPattern weekdayPattern(Long userId) {
        var stats = expenseQueryRepository.getWeekdayStats(userId);
        if (stats.isEmpty()) {
            return FeedbackResponse.WeekdayPattern.builder()
                    .message("요일별 지출 데이터가 없습니다.")
                    .build();
        }

        var peak = stats.stream().max(Comparator.comparing(WeekdayStatsDto::getAmount)).get();

        return FeedbackResponse.WeekdayPattern.builder()
                .peakDay(peak.getWeekday())
                .peakAmount(peak.getAmount())
                .message(String.format("%s요일 소비가 가장 많습니다.", toKoreanWeekday(peak.getWeekday())))
                .build();
    }

    private String toKoreanWeekday(int isoDay) {
        return switch (isoDay) {
            case 1 -> "월";
            case 2 -> "화";
            case 3 -> "수";
            case 4 -> "목";
            case 5 -> "금";
            case 6 -> "토";
            case 7 -> "일";
            default -> "알 수 없음";
        };
    }

    /** 4) 시간대 패턴 */
    private FeedbackResponse.HourlyPattern hourlyPattern(Long userId) {
        var stats = expenseQueryRepository.getHourlyStats(userId);
        if (stats.isEmpty()) {
            return FeedbackResponse.HourlyPattern.builder()
                    .message("시간대별 지출 데이터가 없습니다.")
                    .build();
        }

        var peak = stats.stream()
                .max(Comparator.comparing(HourlyStatsDto::getAmount))
                .get();

        return FeedbackResponse.HourlyPattern.builder()
                .peakHour(peak.getHour())
                .amount(peak.getAmount())
                .message(String.format("%s 소비가 가장 많습니다.", toKoreanHour(peak.getHour())))
                .build();
    }

    private String toKoreanHour(int hour) {
        if (hour == 0) return "오전 12시";
        if (hour == 12) return "오후 12시";

        if (hour < 12) return "오전 " + hour + "시";
        return "오후 " + (hour - 12) + "시";
    }


    /** 5) 카테고리 패턴 */
    private FeedbackResponse.CategoryPattern categoryPattern(Map<String, Long> map){
        if (map.isEmpty()) {
            return FeedbackResponse.CategoryPattern.builder()
                    .message("카테고리 지출 데이터가 없습니다.")
                    .build();
        }

        long total = map.values().stream().mapToLong(v -> v).sum();
        var top = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();

        double ratio = top.getValue() * 100.0 / total;

        return FeedbackResponse.CategoryPattern.builder()
                .topCategory(top.getKey())
                .amount(top.getValue())
                .ratio(ratio)
                .message(String.format(
                        "이번 달에는 %s 지출이 가장 높습니다. 전체 소비의 약 %.1f%%를 차지합니다.",
                        top.getKey(), ratio
                ))
                .build();
    }


    /** 6) 목표 진행률 */
    private FeedbackResponse.TargetProgress targetProgress(Long userId) {
        var target = targetService.getCurrentTarget(userId).orElse(null);

        long used = expenseFeedbackRepository.getMonthlyTotal(userId, YearMonth.now());

        // 목표 없음
        if (target == null) {
            return FeedbackResponse.TargetProgress.builder()
                    .targetAmount(null)
                    .usedAmount(used)
                    .ratio(null)
                    .message("이번 달 목표가 설정되어 있지 않습니다.")
                    .build();
        }

        Long targetAmount = target.getTargetAmount();
        double percent = used * 100.0 / targetAmount;

        return FeedbackResponse.TargetProgress.builder()
                .targetAmount(targetAmount)
                .usedAmount(used)
                .ratio(percent)
                .message(String.format("현재 목표 대비 %.1f%% 지출했습니다.", percent))
                .build();
    }

    /** 7) 고정 vs 변동 지출 */
    private FeedbackResponse.FixedVsVariable fixedVsVariable(Map<String, Long> map) {
        long fixed = 0, variable = 0;

        for (var e : map.entrySet()) {
            if (FIXED.contains(e.getKey())) fixed += e.getValue();
            else variable += e.getValue();
        }

        double total = fixed + variable;
        if (total == 0) {
            return FeedbackResponse.FixedVsVariable.builder()
                    .message("지출 데이터 없음.")
                    .build();
        }

        return FeedbackResponse.FixedVsVariable.builder()
                .fixedTotal(fixed)
                .variableTotal(variable)
                .fixedRatio(fixed * 100.0 / total)
                .variableRatio(variable * 100.0 / total)
                .message("고정 지출과 변동 지출 비율을 계산했습니다.")
                .build();
    }

    /** 8) 하루 평균 */
    private FeedbackResponse.DailyAverageTrend dailyAverageTrend(List<DayExpense> daily, Double lastAvg) {
        if (daily.isEmpty()) {
            return FeedbackResponse.DailyAverageTrend.builder()
                    .message("일별 지출 데이터가 부족합니다.")
                    .build();
        }

        double avg = daily.stream().mapToLong(DayExpense::getTotal).average().orElse(0);

        if (lastAvg == null) {
            return FeedbackResponse.DailyAverageTrend.builder()
                    .currentAvg(avg)
                    .message("지난달 평균 데이터가 없어 비교할 수 없습니다.")
                    .build();
        }

        double diff = avg - lastAvg;

        return FeedbackResponse.DailyAverageTrend.builder()
                .currentAvg(avg)
                .lastMonthAvg(lastAvg)
                .diff(diff)
                .message(String.format("하루 평균 지출이 지난달보다 %.1f원 %s했습니다.",
                        Math.abs(diff), diff > 0 ? "증가" : "감소"))
                .build();
    }

    /** 9) 스파이크 탐지 */
    private FeedbackResponse.SpikeDetection spikeDetection(List<DayExpense> daily) {
        if (daily.isEmpty()) {
            return FeedbackResponse.SpikeDetection.builder()
                    .message("스파이크 분석 불가.")
                    .build();
        }

        var max = daily.stream().max(Comparator.comparing(DayExpense::getTotal)).get();

        return FeedbackResponse.SpikeDetection.builder()
                .date(max.getDate().toString())
                .amount(max.getTotal())
                .message(String.format(
                        "%s에 %,d원을 사용해 가장 많은 지출이 발생했습니다.",
                        formatDate(max.getDate()),
                        max.getTotal()))
                .build();
    }

    /** 10) 연속 증가 탐지 */
    private FeedbackResponse.OverSpendSequence overSpendSequence(List<DayExpense> daily) {
        if (daily.size() < 3) {
            return FeedbackResponse.OverSpendSequence.builder()
                    .message("데이터 부족.")
                    .build();
        }

        int streak = 0;
        for (int i = 1; i < daily.size(); i++) {
            if (daily.get(i).getTotal() > daily.get(i - 1).getTotal()) streak++;
            else streak = 0;
        }

        int days = streak + 1;

        return FeedbackResponse.OverSpendSequence.builder()
                .streak(days)
                .message(days >= 4
                        ? "최근 " + days + "일 연속 지출 증가! 과소비 위험!"
                        : "최근 " + days + "일 연속 지출 증가 중입니다.")
                .build();
    }

    /** 11) 주간 총지출 비교 기능 */
    private FeedbackResponse.WeekCompare weekCompare(Long userId) {

        LocalDate thisWeekStart = getThisWeekStart();
        LocalDate lastWeekStart = getLastWeekStart();

        long thisWeek = expenseFeedbackRepository.getThisWeekTotal(userId, thisWeekStart);
        long lastWeek = expenseFeedbackRepository.getLastWeekTotal(userId, lastWeekStart);

        if (lastWeek == 0)
            return FeedbackResponse.WeekCompare.builder()
                    .thisWeek(thisWeek)
                    .lastWeek(lastWeek)
                    .message("지난주 데이터가 없어 비교가 어렵습니다.")
                    .build();

        double diff = (thisWeek - lastWeek) * 100.0 / lastWeek;

        return FeedbackResponse.WeekCompare.builder()
                .thisWeek(thisWeek)
                .lastWeek(lastWeek)
                .diffPercent(diff)
                .message(String.format(
                        "지난주 대비 총 지출 금액이 %.1f%% %s했습니다.",
                        Math.abs(diff),
                        diff > 0 ? "증가" : "감소"
                ))
                .build();
    }


    /** 12) 주간 일평균 소비 비교 기능 */
    private FeedbackResponse.WeeklyAverageTrend weeklyAverageTrend(Long userId) {

        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        long thisWeek = expenseFeedbackRepository.getThisWeekTotal(userId, weekStart);

        LocalDate lastWeekStart = getLastWeekStart();


        long lastWeek = expenseFeedbackRepository.getLastWeekTotal(userId, lastWeekStart);

        double thisAvg = thisWeek / 7.0;
        double lastAvg = lastWeek / 7.0;

        if (lastWeek == 0)
            return FeedbackResponse.WeeklyAverageTrend.builder()
                    .thisWeekAvg(thisAvg)
                    .message("지난주 데이터 부족해 비교할 수 없습니다.")
                    .build();

        double diff = (thisAvg - lastAvg) * 100.0 / lastAvg;

        return FeedbackResponse.WeeklyAverageTrend.builder()
                .thisWeekAvg(thisAvg)
                .lastWeekAvg(lastAvg)
                .diffPercent(diff)
                .message(String.format(
                        "이번 주 하루 평균 소비는 지난주보다 %.1f%% %s했습니다.",
                        Math.abs(diff),
                        diff > 0 ? "증가" : "감소"
                ))
                .build();
    }


    /** 📌 이번 주 월요일 */
    private LocalDate getThisWeekStart() {
        LocalDate today = LocalDate.now();
        return today.minusDays(today.getDayOfWeek().getValue() - 1);   // 월=1
    }

    /** 📌 지난 주 월요일 */
    private LocalDate getLastWeekStart() {
        return getThisWeekStart().minusWeeks(1);
    }


    private String formatMoney(Long amount) {
        if (amount == null) return "0원";
        return String.format("%,d원", amount);
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "";
        return String.format("%d월 %d일", date.getMonthValue(), date.getDayOfMonth());
    }


}
