package doHoaSen.FinTrack.category.exception;

import doHoaSen.FinTrack.global.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CategoryErrorCode implements ErrorCode {

    CATEGORY_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 존재하는 카테고리입니다."),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다."),
    CATEGORY_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "수정 권한이 없습니다."),
    CATEGORY_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다."),
    CATEGORY_TARGET_FORBIDDEN(HttpStatus.FORBIDDEN, "대상 카테고리에 대한 권한이 없습니다."),
    CATEGORY_DEFAULT_NOT_EDITABLE(HttpStatus.BAD_REQUEST, "기본 카테고리는 수정할 수 없습니다."),
    CATEGORY_DEFAULT_NOT_DELETABLE(HttpStatus.BAD_REQUEST, "기본 카테고리는 삭제할 수 없습니다."),
    CATEGORY_NAME_DUPLICATE(HttpStatus.BAD_REQUEST, "이미 존재하는 카테고리 이름입니다."),
    CATEGORY_IN_USE(HttpStatus.BAD_REQUEST, "이 카테고리를 사용하는 지출이 있어 삭제할 수 없습니다."),
    CATEGORY_SAME_AS_TARGET(HttpStatus.BAD_REQUEST, "같은 카테고리로 변경할 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    CategoryErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
