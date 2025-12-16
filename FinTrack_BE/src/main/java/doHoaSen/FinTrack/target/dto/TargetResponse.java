package doHoaSen.FinTrack.target.dto;

import doHoaSen.FinTrack.target.entity.Target;
import lombok.Builder;
import lombok.Getter;

import java.util.Optional;

@Getter
@Builder
public class TargetResponse {

    private Long targetAmount;   // 목표 금액
    private Long usedAmount;     // 이번 달 지출액
    private Double ratio;        // 달성률 (%)
    private Integer year;
    private Integer month;
    private String message;
    private boolean exists;

    /** Target → TargetResponse 변환 */


    public static TargetResponse of(Optional<Target> optional, Long usedAmount) {

        if (optional.isEmpty()) {
            return TargetResponse.builder()
                    .exists(false)
                    .usedAmount(usedAmount)
                    .message("이번 달 목표가 설정되어 있지 않습니다.")
                    .build();
        }

        Target target = optional.get();
        Long amount = target.getTargetAmount();
        double ratio = amount == 0 ? 0 : usedAmount * 100.0 / amount;

        return TargetResponse.builder()
                .exists(true)
                .targetAmount(amount)
                .usedAmount(usedAmount)
                .ratio(ratio)
                .year(target.getYear())
                .month(target.getMonth())
                .message(String.format("현재 목표 대비 %.1f%%를 사용했습니다.", ratio))
                .build();
    }

    public static TargetResponse of(Target target, Long usedAmount) {

        if (target == null) {
            return TargetResponse.builder()
                    .exists(false)
                    .usedAmount(usedAmount)
                    .message("이번 달 목표가 설정되어 있지 않습니다.")
                    .build();
        }

        Long amount = target.getTargetAmount();
        double ratio = amount == 0 ? 0 : usedAmount * 100.0 / amount;

        return TargetResponse.builder()
                .exists(true)
                .targetAmount(amount)
                .usedAmount(usedAmount)
                .ratio(ratio)
                .year(target.getYear())
                .month(target.getMonth())
                .message(String.format("현재 목표 대비 %.1f%%를 사용했습니다.", ratio))
                .build();
    }

}
