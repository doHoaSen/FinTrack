package doHoaSen.FinTrack.auth.service;

import doHoaSen.FinTrack.auth.dto.LoginRequest;
import doHoaSen.FinTrack.auth.dto.LoginResponse;
import doHoaSen.FinTrack.auth.security.JwtProvider;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import static doHoaSen.FinTrack.auth.exception.AuthErrorCode.AUTH_ACCOUNT_NOT_FOUND;
import static doHoaSen.FinTrack.auth.exception.AuthErrorCode.AUTH_INVALID_REFRESH_TOKEN;
import static doHoaSen.FinTrack.auth.exception.AuthErrorCode.AUTH_PASSWORD_MISMATCH;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResponse login (LoginRequest request){
        // 이메일 확인
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new BadRequestException(AUTH_ACCOUNT_NOT_FOUND));

        // 비밀번호 일치 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadRequestException(AUTH_PASSWORD_MISMATCH);
        }

        // JWT 발급
        String accessToken = jwtProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail());

        // 응답 반환
        return new LoginResponse(
                user.getName(),
                user.getEmail(),
                accessToken,
                refreshToken);

    }

    public String refresh(String refreshToken){
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new BadRequestException(AUTH_INVALID_REFRESH_TOKEN);
        }
        String email = jwtProvider.getEmailFromToken(refreshToken);
        return jwtProvider.generateAccessToken(email);
    }
}
