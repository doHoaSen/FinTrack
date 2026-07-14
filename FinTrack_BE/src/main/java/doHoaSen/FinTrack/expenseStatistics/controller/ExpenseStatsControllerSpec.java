package doHoaSen.FinTrack.expenseStatistics.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "ExpenseStatistics", description = "월별·요일별·시간대별 지출 통계 API")
public interface ExpenseStatsControllerSpec {

    @Operation(summary = "월별 소비 통계 조회", description = "지정한 연도의 월별 지출 합계를 조회합니다.")
    ApiResponse<List<MonthlyStatsDto>> monthly(
            @Parameter(description = "조회 연도", example = "2026") int year,
            @Parameter(hidden = true) CustomUserDetails customUserDetails
    );

    @Operation(summary = "요일별 소비 통계 조회", description = "이번 달 요일별 지출 합계를 조회합니다.")
    ApiResponse<List<WeekdayStatsDto>> weekday(
            @Parameter(hidden = true) CustomUserDetails customUserDetails
    );

    @Operation(summary = "시간대별 소비 통계 조회", description = "이번 달 시간대별 지출 합계를 조회합니다.")
    ApiResponse<List<HourlyStatsDto>> hourly(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
