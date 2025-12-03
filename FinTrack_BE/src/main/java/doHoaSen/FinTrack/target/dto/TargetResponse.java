package doHoaSen.FinTrack.target.dto;

import doHoaSen.FinTrack.target.entity.Target;
import lombok.Getter;

@Getter
public class TargetResponse {
    private Long targetAmount;
    private Integer year;
    private Integer month;

    public static TargetResponse from(Target t){
        TargetResponse response = new TargetResponse();
        response.targetAmount = t.getTargetAmount();
        response.year = t.getYear();
        response.month = t.getMonth();
        return response;
    }
}
