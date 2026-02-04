package doHoaSen.FinTrack.dashboard.service;

import doHoaSen.FinTrack.dashboard.dto.DashboardResponse;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseFeedback.service.ExpenseFeedbackService;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseStatsRepository;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import doHoaSen.FinTrack.target.service.TargetService;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseStatsRepository expenseStatsRepository;
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseFeedbackService expenseFeedbackService;
    private final TargetService targetService;
    private final UserRepository userRepository;

    public DashboardResponse generateDashboard(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자 없음"));

        int joinedYear = user.getCreatedAt().getYear();

        int year = YearMonth.now().getYear();
        YearMonth now = YearMonth.now();


        // 차트용 통계 (없으면 빈 리스트)
        var monthlyStats = safeList(
                expenseQueryRepository.getMonthlyStats(userId, year)
        );

        var weekdayStats = safeList(
                expenseQueryRepository.getWeekdayStats(userId, now)
        );

        var hourlyStats = safeList(
                expenseQueryRepository.getHourlyStats(userId, now)
        );

        var categoryTotals = expenseStatsRepository.getCategoryTotals(userId, now);

        // 목표 (없어도 정상)
        var optionalTarget = targetService.getCurrentTarget(userId);
        long usedThisMonth = expenseStatsRepository.getMonthlyTotal(userId, now);
        TargetResponse target = TargetResponse.of(optionalTarget, usedThisMonth);

        // 피드백 (내부에서 신규 사용자 방어 완료)
        FeedbackResponse feedback = expenseFeedbackService.generate(userId);

        return DashboardResponse.builder()
                .joinedYear(joinedYear)
                .monthlyStats(monthlyStats)
                .weekdayStats(weekdayStats)
                .hourlyStats(hourlyStats)
                .categoryTotals(categoryTotals)
                .target(target)
                .feedback(feedback)
                .build();
    }

    /** null 방어 유틸 */
    private <T> java.util.List<T> safeList(java.util.List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }
}
