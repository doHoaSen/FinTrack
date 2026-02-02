package doHoaSen.FinTrack.expenseStatistics.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import doHoaSen.FinTrack.expenseStatistics.service.ExpenseStatsService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/expenses/stats")
public class ExpenseStatsController {

    final ExpenseStatsService expenseStatsService;
    final ExpenseQueryRepository expenseQueryRepository;

    @GetMapping("/monthly")
    public ApiResponse<List<MonthlyStatsDto>> monthly(
            @RequestParam int year,
            @AuthenticationPrincipal CustomUserDetails customUserDetails
            ){
        return ApiResponse.success(
                "월별 소비 통계 조회 성공",
                expenseQueryRepository.getMonthlyStats(customUserDetails.getId(), year)
        );
    }

    @GetMapping("/weekday")
    public ApiResponse<List<WeekdayStatsDto>> weekday(
            @AuthenticationPrincipal CustomUserDetails customUserDetails
    ){
        return ApiResponse.success(
                "요일별 소비 통계 조회 성공",
                expenseQueryRepository.getWeekdayStats(customUserDetails.getId(), YearMonth.now())
        );
    }

    @GetMapping("/hourly")
    public ApiResponse<List<HourlyStatsDto>> hourly(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ApiResponse.success(
                "시간대별 소비 통계 조회 성공",
                expenseQueryRepository.getHourlyStats(user.getId(), YearMonth.now())
        );
    }
}
