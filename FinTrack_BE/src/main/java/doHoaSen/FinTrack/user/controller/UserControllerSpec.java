package doHoaSen.FinTrack.user.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.user.dto.UserRegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "User", description = "회원가입·이메일 중복 확인·회원 탈퇴 API")
public interface UserControllerSpec {

    @Operation(summary = "이메일 중복 확인", description = "회원가입 전 이메일 사용 가능 여부를 확인합니다.")
    ResponseEntity<ApiResponse<Boolean>> checkEmail(
            @Parameter(description = "중복 확인할 이메일", example = "user@example.com") String email
    );

    @Operation(summary = "회원가입", description = "신규 계정을 생성합니다. 6개월 이내 탈퇴한 계정과 같은 이메일이면 기존 비밀번호 확인 후 복구됩니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "PASSWORD_CONFIRM_MISMATCH: 비밀번호가 일치하지 않습니다. / "
                            + "EMAIL_ALREADY_EXISTS: 이미 사용 중인 이메일입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> register(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "회원가입 정보")
            UserRegisterRequest request
    );

    @Operation(summary = "회원 탈퇴", description = "로그인한 사용자의 계정을 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "USER_NOT_FOUND: 사용자를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<?> withdraw(
            @Parameter(hidden = true) CustomUserDetails user
    );
}
