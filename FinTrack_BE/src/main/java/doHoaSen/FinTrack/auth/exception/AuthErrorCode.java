package doHoaSen.FinTrack.auth.exception;

import doHoaSen.FinTrack.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum AuthErrorCode implements ErrorCode {

    AUTH_ACCOUNT_NOT_FOUND(HttpStatus.BAD_REQUEST, "존재하지 않거나 탈퇴한 계정입니다."),
    AUTH_PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),
    AUTH_INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "유효하지 않은 refresh token입니다."),
    AUTH_REFRESH_TOKEN_MISSING(HttpStatus.BAD_REQUEST, "refresh token이 없습니다.");

    private final HttpStatus status;
    private final String message;

    AuthErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
