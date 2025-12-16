package doHoaSen.FinTrack.dashboard.service;

import doHoaSen.FinTrack.dashboard.dto.DashboardResponse;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseFeedback.repository.ExpenseFeedbackRepository;
import doHoaSen.FinTrack.expenseFeedback.service.ExpenseFeedbackService;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ExpenseQueryRepository expenseQueryRepository;
    private final ExpenseFeedbackService expenseFeedbackService;
    private final TargetService targetService;
    private final ExpenseFeedbackRepository expenseFeedbackRepository;

    public DashboardResponse generateDashboard(Long userId){
        var monthlyStats = expenseQueryRepository.getMonthlyStats(userId, YearMonth.now().getYear());
        var weekdayStats = expenseQueryRepository.getWeekdayStats(userId);
        var hourlyStats = expenseQueryRepository.getHourlyStats(userId);

        var optionalTarget = targetService.getCurrentTarget(userId);
        long usedThisMonth = expenseFeedbackRepository.getMonthlyTotal(userId, YearMonth.now());

        TargetResponse target = TargetResponse.of(optionalTarget, usedThisMonth);

        FeedbackResponse feedback = expenseFeedbackService.generate(userId);
        return DashboardResponse.builder()
                .monthlyStats(monthlyStats)
                .weekdayStats(weekdayStats)
                .hourlyStats(hourlyStats)
                .target(target)
                .feedback(feedback)
                .build();
    }
}
