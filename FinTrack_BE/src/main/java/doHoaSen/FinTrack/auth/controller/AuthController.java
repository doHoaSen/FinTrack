package doHoaSen.FinTrack.auth.controller;

import doHoaSen.FinTrack.auth.dto.LoginRequest;
import doHoaSen.FinTrack.auth.dto.LoginResponse;
import doHoaSen.FinTrack.auth.service.AuthService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(){
        // 클라이언트 측에서 토큰 삭제
        return ResponseEntity.ok(ApiResponse.success("로그아웃 완료", null));
    }
}
