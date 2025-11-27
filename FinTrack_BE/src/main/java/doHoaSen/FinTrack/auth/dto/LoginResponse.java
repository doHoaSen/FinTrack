package doHoaSen.FinTrack.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String name;
    private String email;
    private String accessToken;
    private String refreshToken;
}
