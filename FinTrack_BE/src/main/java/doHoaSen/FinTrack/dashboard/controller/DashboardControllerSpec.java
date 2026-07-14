package doHoaSen.FinTrack.dashboard.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.dashboard.dto.DashboardResponse;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Dashboard", description = "대시보드 단일 조회 API")
public interface DashboardControllerSpec {

    @Operation(summary = "대시보드 조회", description = "예산 현황, 최근 거래, 소비 패턴 등 대시보드에 필요한 데이터를 한 번에 조회합니다.")
    ApiResponse<DashboardResponse> getDashboard(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
