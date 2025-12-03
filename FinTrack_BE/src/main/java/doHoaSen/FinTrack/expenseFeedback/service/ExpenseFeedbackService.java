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

import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ExpenseFeedbackService {
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseFeedbackRepository expenseFeedbackRepository;
    private final TargetService targetService;

    private static final Set<String> FIXED = Set.of("월세", "관리비", "보험", "정기구독", "통신비");

    public FeedbackResponse generate(Long userId){
        FeedbackResponse response = new FeedbackResponse();

        // 데이터 준비
        Map<String, Long> category = expenseFeedbackRepository.getCategoryTotals(userId);
        List<DayExpense> daily = expenseFeedbackRepository.getDailyTotals(userId);

        response.setMonthlyTrend(monthlyTrend(userId));
        response.setWeekdayPattern(weekdayPattern(userId));
        response.setHourlyPattern(hourlyPattern(userId));
        response.setCategoryPattern(categoryPattern(category));
        response.setTargetProgress(targetProgress(userId));

        // 확장 5개
        response.setFixedVsVariable(fixedVsVariable(category));
        response.setCategoryConcentration(categoryConcentration(category));
        response.setDailyAverageTrend(dailyAverageTrend(daily, expenseFeedbackRepository.getLastMonthDailyAverage(userId)));
        response.setSpikeDetection(spike(daily));
        response.setOverSpendSequence(overSpendSequence(daily));

        return response;
    }


    private String monthlyTrend(Long userId) {
        YearMonth now = YearMonth.now();
        YearMonth last = now.minusMonths(1);

        long thisMonth = expenseFeedbackRepository.getMonthlyTotal(userId, now);
        long lastMonth = expenseFeedbackRepository.getMonthlyTotal(userId, last);

        if (lastMonth == 0)
            return "첫 달 소비라 전월 대비 분석은 제공되지 않습니다.";

        long diff = thisMonth - lastMonth;
        double rate = diff * 100.0 / lastMonth;

        if (diff > 0) return "지난달 대비 " + (int)rate + "% 지출이 증가했습니다.";
        return "지난달 대비 지출이 감소했습니다.";
    }

    private String weekdayPattern(Long userId) {
        var stats = expenseQueryRepository.getWeekdayStats(userId);
        if(stats.isEmpty()) return "요일별 지출 데이터가 없습니다.";

        var max = stats.stream().max(Comparator.comparing(WeekdayStatsDto::getAmount)).get();
        return max.getWeekday() + "요일 소비가 가장 많습니다.";
    }

    private String hourlyPattern(Long userId) {
        var stats = expenseQueryRepository.getHourlyStats(userId);
        if (stats.isEmpty()) return "시간대 지출 데이터가 부족합니다.";

        var max = stats.stream().max(Comparator.comparing(HourlyStatsDto::getAmount)).get();
        return max.getHour() + "시 지출이 가장 많습니다.";
    }

    private String categoryPattern(Map<String, Long> map){
        if(map.isEmpty()) return "카테고리 지출 데이터가 없습니다.";

        var max = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();
        return max.getKey() + " 지출이 가장 많습니다.";
    }

    private String targetProgress(Long userId) {
        var target = targetService.getCurrentTarget(userId);
        if (target == null) return "이번 달 목표가 설정되어 있지 않습니다.";

        long used = expenseFeedbackRepository.getMonthlyTotal(userId, YearMonth.now());
        double percent = used * 100.0 / target.getTargetAmount();

        return "현재 목표 대비 " + String.format("%.1f", percent) + "% 지출했습니다.";
    }

    private String fixedVsVariable(Map<String, Long> map){
        long fixedSum = 0, variableSum = 0;

        for (var entry: map.entrySet()){
            if (FIXED.contains(entry.getKey())) fixedSum += entry.getValue();
            else variableSum += entry.getValue();
        }

        if (fixedSum + variableSum == 0) return "지출 데이터 없음";

        double rate = fixedSum * 100.0 / (fixedSum + variableSum);
        if (rate > 50)
            return "고정 지출 비율이 높습니다 (" + (int)rate + "%). 소비 유연성이 낮습니다.";
        return "고정 지출 비율이 적절한 수준입니다.";
    }

    private String categoryConcentration(Map<String, Long> map){
        if (map.isEmpty()) return "카테고리 데이터 없음";

        long total = map.values().stream().mapToLong(Long::longValue).sum();
        var max = map.entrySet().stream().max(Map.Entry.comparingByValue()).get();

        double percent = max.getValue() * 100.0 / total;

        if (percent > 40)
            return max.getKey() + " 카테고리가 " + String.format("%.1f", percent) + "%로 과도하게 높습니다.";
        return max.getKey() + " 지출이 가장 많지만 집중도는 정상 범위입니다.";
    }

    public String dailyAverageTrend(List<DayExpense> daily, Double lastAvg) {
        if (daily.isEmpty()) return "일별 지출 데이터 없음.";

        long total = daily.stream().mapToLong(DayExpense::getTotal).sum();
        double avg = total / (double) daily.size();

        if (lastAvg == null)
            return "지난달 데이터가 없어 비교 불가.";

        double diff = avg - lastAvg;
        if (diff > 0) return "일평균 지출이 지난달보다 " + (int) diff + "원 증가했습니다.";
        return "일평균 지출이 지난달보다 감소했습니다.";
    }

    public String spike(List<DayExpense> daily) {
        if (daily.isEmpty()) return "스파이크 분석 불가.";

        var max = daily.stream().max(Comparator.comparing(DayExpense::getTotal)).get();
        return max.getDate() + " 지출(" + max.getTotal() + "원)이 가장 높습니다.";
    }

    public String overSpendSequence(List<DayExpense> list) {
        if (list.size() < 3) return "데이터 부족.";

        int streak = 0;
        for (int i = 1; i < list.size(); i++) {
            if (list.get(i).getTotal() > list.get(i - 1).getTotal())
                streak++;
            else
                streak = 0;
        }

        if (streak >= 4)
            return "최근 " + (streak+1) + "일 연속 지출 증가! 과소비 위험!";
        if (streak >= 2)
            return "최근 " + (streak+1) + "일 연속 지출 증가 중입니다.";
        return "지출 증가 패턴 없음.";
    }
}
