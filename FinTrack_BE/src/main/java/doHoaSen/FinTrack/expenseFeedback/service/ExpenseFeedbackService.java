package doHoaSen.FinTrack.expenseFeedback.service;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseStatsRepository;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseStatsRepository;
import doHoaSen.FinTrack.expenseStatistics.service.ExpenseStatsService;
import doHoaSen.FinTrack.expenseStatistics.service.ExpenseStatsService;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseFeedbackService {

    private final ExpenseStatsService statisticsService;
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseStatsRepository chartStatsRepository;
    private final TargetService targetService;

    public FeedbackResponse generate(Long userId) {

        YearMonth now = YearMonth.now();

        Long thisMonth = statisticsService.getMonthlyTotal(userId, now);
        Long lastMonth = statisticsService.getMonthlyTotal(userId, now.minusMonths(1));
        List<DayExpense> daily = statisticsService.getDailyTotals(userId, now);
        Map<String, Long> categoryTotals = statisticsService.getCategoryTotals(userId, now);
        long[] fixedVar = statisticsService.getFixedVsVariable(userId, now);

        return FeedbackResponse.builder()
                .monthlyTrend(buildMonthlyTrend(thisMonth, lastMonth))
                .weekdayPattern(buildWeekdayPattern(expenseQueryRepository.getWeekdayStats(userId)))
                .hourlyPattern(buildHourlyPattern(expenseQueryRepository.getHourlyStats(userId)))
                .categoryPattern(buildCategoryPattern(categoryTotals))
                .fixedVsVariable(buildFixedVariable(fixedVar))
                .build();
    }

    private FeedbackResponse.MonthlyTrend buildMonthlyTrend(long current, long last) {

        if (last == 0) {
            return FeedbackResponse.MonthlyTrend.builder()
                    .status("first")
                    .currentMonth(current)
                    .message("아직 비교할 이전 지출이 없습니다.")
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

        return FeedbackResponse.WeekdayPattern.builder()
                .peakDay(peak.getWeekday())
                .peakAmount(peak.getAmount())
                .message("요일별 소비 패턴을 분석했습니다.")
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
                .message("시간대별 소비 패턴을 분석했습니다.")
                .build();
    }


    private FeedbackResponse.CategoryPattern buildCategoryPattern(Map<String, Long> map) {
        if (map.isEmpty())
            return FeedbackResponse.CategoryPattern.builder()
                    .message("카테고리 데이터 없음")
                    .build();

        var top = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();
        long total = map.values().stream().mapToLong(v -> v).sum();

        return FeedbackResponse.CategoryPattern.builder()
                .topCategory(top.getKey())
                .amount(top.getValue())
                .ratio(top.getValue() * 100.0 / total)
                .message("카테고리 소비 분석 완료")
                .build();
    }

    private FeedbackResponse.FixedVsVariable buildFixedVariable(long[] fv) {
        long fixed = fv[0];
        long variable = fv[1];
        long total = fixed + variable;

        if (total == 0)
            return FeedbackResponse.FixedVsVariable.builder()
                    .message("지출 데이터 없음")
                    .build();

        return FeedbackResponse.FixedVsVariable.builder()
                .fixedTotal(fixed)
                .variableTotal(variable)
                .fixedRatio(fixed * 100.0 / total)
                .variableRatio(variable * 100.0 / total)
                .message("고정/변동 지출 분석 완료")
                .build();
    }
}
