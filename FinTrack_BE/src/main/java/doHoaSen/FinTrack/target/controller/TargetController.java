package doHoaSen.FinTrack.target.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.target.dto.TargetRequest;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import doHoaSen.FinTrack.target.entity.Target;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/target")
@RequiredArgsConstructor
public class TargetController {
    private final TargetService targetService;

    @GetMapping
    public ApiResponse<TargetResponse> getTarget(@AuthenticationPrincipal CustomUserDetails user) {
        Target target = targetService.getCurrentTarget(user.getId()).orElse(null);
        if (target == null) {
            return ApiResponse.success("이번 달 목표가 설정되어 있지 않습니다.", null);
        }
        return ApiResponse.success("목표 조회 성공", TargetResponse.from(target));
    }

    // 목표 등록/수정
    @PostMapping
    public ApiResponse<TargetResponse> setTarget(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody TargetRequest req) {

        Target target = targetService.upsertTarget(user.getId(), req.getTargetAmount());
        return ApiResponse.success("목표 설정 성공", TargetResponse.from(target));
    }
}
