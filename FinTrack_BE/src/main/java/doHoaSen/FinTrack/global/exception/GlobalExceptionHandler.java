package doHoaSen.FinTrack.global.exception;

import doHoaSen.FinTrack.global.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // @Valid 유효성 검증 실패 시
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex){
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.status(CommonErrorCode.VALIDATION_ERROR.getStatus())
                .body(ApiResponse.failure(CommonErrorCode.VALIDATION_ERROR, errorMessage));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>>handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(CommonErrorCode.INVALID_ARGUMENT.getStatus())
                .body(ApiResponse.failure(CommonErrorCode.INVALID_ARGUMENT, ex.getMessage()));

    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex){
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity
                .status(CommonErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(ApiResponse.failure(CommonErrorCode.INTERNAL_SERVER_ERROR));
    }
}
