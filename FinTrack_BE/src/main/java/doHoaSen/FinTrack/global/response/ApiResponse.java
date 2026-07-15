package doHoaSen.FinTrack.global.response;

import doHoaSen.FinTrack.global.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data){
        return new ApiResponse<>(true, null, message, data);
    }

    public static <T> ApiResponse<T> failure(ErrorCode errorCode){
        return new ApiResponse<>(false, errorCode.name(), errorCode.getMessage(), null);
    }

    public static <T> ApiResponse<T> failure(ErrorCode errorCode, String message){
        return new ApiResponse<>(false, errorCode.name(), message, null);
    }
}
