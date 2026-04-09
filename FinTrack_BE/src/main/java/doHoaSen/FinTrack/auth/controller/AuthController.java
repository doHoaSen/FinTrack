package doHoaSen.FinTrack.auth.controller;

import doHoaSen.FinTrack.auth.dto.LoginRequest;
import doHoaSen.FinTrack.auth.dto.LoginResponse;
import doHoaSen.FinTrack.auth.dto.UserInfoResponse;
import doHoaSen.FinTrack.auth.service.AuthService;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.global.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserInfoResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        LoginResponse loginData = authService.login(request);

        // access_token: 30분 세션 쿠키
        response.addHeader(HttpHeaders.SET_COOKIE,
                buildCookie("access_token", loginData.getAccessToken(), 60 * 30));

        // refresh_token: 자동 로그인 체크 시 7일 아니면 세션 쿠키
        long refreshMaxAge = request.isAutoLogin() ? 60 * 60 * 24 * 7 : -1;
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie("refresh_token",
                loginData.getRefreshToken(), refreshMaxAge));

        return ResponseEntity.ok(ApiResponse.success("로그인 성공",
                new UserInfoResponse(loginData.getName(),
                        loginData.getEmail())));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
            response.addHeader(HttpHeaders.SET_COOKIE,
                    buildCookie("access_token", "", 0));
            response.addHeader(HttpHeaders.SET_COOKIE,
                    buildCookie("refresh_token", "", 0));
            return ResponseEntity.ok(ApiResponse.success("로그아웃 완료", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null){
            for (Cookie cookie: cookies){
                if ("refresh_token".equals(cookie.getName())){
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if (refreshToken == null){
            throw new BadRequestException("refresh token이 없습니다.");
        }

        String newAccessToken = authService.refresh(refreshToken);
        response.addHeader(HttpHeaders.SET_COOKIE,
                buildCookie("access_token", newAccessToken, 60 * 30));
        return ResponseEntity.ok(ApiResponse.success("토큰 재발급 성공", null));
    }

    private String buildCookie(String name, String value, long maxAge){
        ResponseCookie.ResponseCookieBuilder builder =
                ResponseCookie.from(name, value)
                        .httpOnly(true)
                        .path("/")
                        .sameSite("Lax")
                        .secure(cookieSecure);

        if (maxAge >= 0){
            builder.maxAge(maxAge);
        }

        return builder.build().toString();
    }

}
