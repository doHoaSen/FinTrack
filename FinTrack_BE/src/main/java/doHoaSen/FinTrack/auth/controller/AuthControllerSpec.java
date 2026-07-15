package doHoaSen.FinTrack.auth.controller;

import doHoaSen.FinTrack.auth.dto.LoginRequest;
import doHoaSen.FinTrack.auth.dto.UserInfoResponse;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

@Tag(name = "Auth", description = "로그인·로그아웃·토큰 재발급 API (httpOnly 쿠키 기반)")
public interface AuthControllerSpec {

    @Operation(summary = "로그인", description = "로그인 성공 시 access_token/refresh_token을 httpOnly 쿠키로 내려줍니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "AUTH_ACCOUNT_NOT_FOUND: 존재하지 않거나 탈퇴한 계정입니다. / "
                            + "AUTH_PASSWORD_MISMATCH: 비밀번호가 일치하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<UserInfoResponse>> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "로그인 정보")
            LoginRequest request,
            @Parameter(hidden = true) HttpServletResponse response
    );

    @Operation(summary = "로그아웃", description = "access_token/refresh_token 쿠키를 만료시킵니다.")
    ResponseEntity<ApiResponse<Void>> logout(
            @Parameter(hidden = true) HttpServletResponse response
    );

    @Operation(summary = "토큰 재발급", description = "refresh_token 쿠키로 access_token을 재발급합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "AUTH_REFRESH_TOKEN_MISSING: refresh token이 없습니다. / "
                            + "AUTH_INVALID_REFRESH_TOKEN: 유효하지 않은 refresh token입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> refresh(
            @Parameter(hidden = true) HttpServletRequest request,
            @Parameter(hidden = true) HttpServletResponse response
    );
}
