package doHoaSen.FinTrack.target.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expenseFeedback.repository.ExpenseFeedbackRepository;
import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.target.dto.TargetRequest;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import doHoaSen.FinTrack.target.entity.Target;
import doHoaSen.FinTrack.target.service.TargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/targets")
@RequiredArgsConstructor
public class TargetController {

    private final TargetService targetService;
    private final ExpenseFeedbackRepository expenseFeedbackRepository;

    /** 목표 생성 또는 수정 */
    @PostMapping
    public ApiResponse<TargetResponse> upsertTarget(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TargetRequest request
    ) {
        Target target = targetService.upsertTarget(user.getId(), request.getAmount());
        Long used = expenseFeedbackRepository.getMonthlyTotal(user.getId(), YearMonth.now());

        return ApiResponse.success("목표 설정 완료", TargetResponse.of(target, used));
    }

    /** 이번 달 목표 조회 */
    @GetMapping
    public ApiResponse<TargetResponse> getTarget(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Target target = targetService.getCurrentTarget(user.getId()).orElse(null);
        Long used = expenseFeedbackRepository.getMonthlyTotal(user.getId(), YearMonth.now());

        return ApiResponse.success("목표 조회 성공", TargetResponse.of(target, used));
    }

    /** 목표 수정 */
    @PutMapping
    public ApiResponse<TargetResponse> updateTarget(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TargetRequest request
    ) {
        Target target = targetService.updateTarget(user.getId(), request.getAmount());
        Long used = expenseFeedbackRepository.getMonthlyTotal(user.getId(), YearMonth.now());

        return ApiResponse.success("목표 수정 완료", TargetResponse.of(target, used));
    }

    /** 목표 삭제 */
    @DeleteMapping
    public ApiResponse<?> deleteTarget(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        targetService.deleteCurrentTarget(user.getId());
        return ApiResponse.success("이번 달 목표가 삭제되었습니다.", "");
    }
}
