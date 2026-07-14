package doHoaSen.FinTrack.auth.controller;

import doHoaSen.FinTrack.auth.dto.LoginRequest;
import doHoaSen.FinTrack.auth.dto.UserInfoResponse;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

@Tag(name = "Auth", description = "로그인·로그아웃·토큰 재발급 API (httpOnly 쿠키 기반)")
public interface AuthControllerSpec {

    @Operation(summary = "로그인", description = "로그인 성공 시 access_token/refresh_token을 httpOnly 쿠키로 내려줍니다.")
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
    ResponseEntity<ApiResponse<Void>> refresh(
            @Parameter(hidden = true) HttpServletRequest request,
            @Parameter(hidden = true) HttpServletResponse response
    );
}
