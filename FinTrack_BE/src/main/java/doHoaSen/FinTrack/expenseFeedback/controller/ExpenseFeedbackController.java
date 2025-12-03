package doHoaSen.FinTrack.expenseFeedback.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.expenseFeedback.service.ExpenseFeedbackService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/expenses/feedback")
@RequiredArgsConstructor
public class ExpenseFeedbackController {

    private final ExpenseFeedbackService feedbackService;

    @GetMapping
    public ApiResponse<FeedbackResponse> getFeedback(
            @AuthenticationPrincipal CustomUserDetails user
            ){
        FeedbackResponse response = feedbackService.generate(user.getId());
        return ApiResponse.success("지출 피드백 생성 성공", response);
    }
}
