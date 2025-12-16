package doHoaSen.FinTrack.dashboard.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.dashboard.dto.DashboardResponse;
import doHoaSen.FinTrack.dashboard.service.DashboardService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(
            @AuthenticationPrincipal CustomUserDetails user
            ){
        DashboardResponse result = dashboardService.generateDashboard(user.getId());
        return ApiResponse.success("대시보드 조회 성공", result);
    }
}
