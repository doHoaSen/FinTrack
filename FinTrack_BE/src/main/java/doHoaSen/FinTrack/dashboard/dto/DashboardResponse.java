package doHoaSen.FinTrack.dashboard.dto;

import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter @Builder
public class DashboardResponse {
    private int joinedYear; // 가입 연도 (추가)

    // 통계 API 결과''
    private List<MonthlyStatsDto> monthlyStats;
    private List<WeekdayStatsDto> weekdayStats;
    private List<HourlyStatsDto> hourlyStats;

    // 목표 데이터
    private TargetResponse target;

    // 통합 피드백
    private FeedbackResponse feedback;
}
