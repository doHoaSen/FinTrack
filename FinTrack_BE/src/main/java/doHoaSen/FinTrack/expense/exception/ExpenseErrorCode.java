package doHoaSen.FinTrack.expense.exception;

import doHoaSen.FinTrack.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExpenseErrorCode implements ErrorCode {

    EXPENSE_NOT_FOUND(HttpStatus.NOT_FOUND, "지출 내역을 찾을 수 없습니다."),
    EXPENSE_FORBIDDEN(HttpStatus.FORBIDDEN, "본인의 지출만 수정 가능합니다."),
    EXPENSE_CATEGORY_NOT_FOUND(HttpStatus.BAD_REQUEST, "존재하지 않는 카테고리입니다."),
    EXPENSE_TIME_REQUIRED(HttpStatus.BAD_REQUEST, "지출 시각은 필수입니다.");

    private final HttpStatus status;
    private final String message;

    ExpenseErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
