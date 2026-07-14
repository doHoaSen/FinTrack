package doHoaSen.FinTrack.expenseFeedback.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expenseFeedback.dto.FeedbackResponse;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "ExpenseFeedback", description = "지출 패턴 기반 피드백(목표 진행률, 카테고리 쏠림, 지출 급증 등) API")
public interface ExpenseFeedbackControllerSpec {

    @Operation(summary = "지출 피드백 생성", description = "목표 진행률, 카테고리 집중도, 지출 급증 감지 등 지출 패턴 기반 피드백을 생성합니다.")
    ApiResponse<FeedbackResponse> getFeedback(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
