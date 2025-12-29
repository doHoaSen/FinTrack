package doHoaSen.FinTrack.user.controller;

import doHoaSen.FinTrack.global.response.ApiResponse;
import doHoaSen.FinTrack.user.dto.UserRegisterRequest;
import doHoaSen.FinTrack.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 이메일 중복 확인
    @GetMapping("/check-email-duplicate")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestParam String email){
        boolean exists = userService.checkEmailDuplicate(email);
        return ResponseEntity.ok(ApiResponse.success("이메일 중복 확인 완료", exists));
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody UserRegisterRequest request){
        userService.register(request);
        return ResponseEntity.status(201).body(ApiResponse.success("회원가입이 완료되었습니다.", null));
    }
}
