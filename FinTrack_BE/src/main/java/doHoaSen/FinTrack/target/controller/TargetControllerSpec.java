package doHoaSen.FinTrack.target.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.target.dto.TargetRequest;
import doHoaSen.FinTrack.target.dto.TargetResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Target", description = "이번 달 지출 목표 설정·조회·수정·삭제 API")
public interface TargetControllerSpec {

    @Operation(summary = "목표 생성 또는 수정", description = "이번 달 지출 목표 금액이 없으면 생성하고, 있으면 수정합니다.")
    ApiResponse<TargetResponse> upsertTarget(
            @Parameter(hidden = true) CustomUserDetails user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "목표 금액")
            TargetRequest request
    );

    @Operation(summary = "이번 달 목표 조회", description = "이번 달 지출 목표와 현재까지 사용 금액을 조회합니다.")
    ApiResponse<TargetResponse> getTarget(
            @Parameter(hidden = true) CustomUserDetails user
    );

    @Operation(summary = "목표 수정", description = "이번 달 지출 목표 금액을 수정합니다.")
    ApiResponse<TargetResponse> updateTarget(
            @Parameter(hidden = true) CustomUserDetails user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 목표 금액")
            TargetRequest request
    );

    @Operation(summary = "목표 삭제", description = "이번 달 지출 목표를 삭제합니다.")
    ApiResponse<?> deleteTarget(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
