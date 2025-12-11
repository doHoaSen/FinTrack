package doHoaSen.FinTrack.target.dto;

import lombok.Getter;
import jakarta.validation.constraints.NotNull;

@Getter
public class TargetRequest {

    @NotNull(message = "목표 금액은 필수입니다.")
    private Long amount;
}
