package doHoaSen.FinTrack.user.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.user.dto.UserRegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "User", description = "회원가입·이메일 중복 확인·회원 탈퇴 API")
public interface UserControllerSpec {

    @Operation(summary = "이메일 중복 확인", description = "회원가입 전 이메일 사용 가능 여부를 확인합니다.")
    ResponseEntity<ApiResponse<Boolean>> checkEmail(
            @Parameter(description = "중복 확인할 이메일", example = "user@example.com") String email
    );

    @Operation(summary = "회원가입", description = "신규 계정을 생성합니다.")
    ResponseEntity<ApiResponse<Void>> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "회원가입 정보")
            UserRegisterRequest request
    );

    @Operation(summary = "회원 탈퇴", description = "로그인한 사용자의 계정을 삭제합니다.")
    ApiResponse<?> withdraw(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
