package doHoaSen.FinTrack.target.dto;

import doHoaSen.FinTrack.target.entity.Target;
import lombok.Builder;
import lombok.Getter;

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
    public static TargetResponse of(Target target, Long usedAmount) {

        // 목표가 아예 없는 경우
        if (target == null) {
            return TargetResponse.builder()
                    .exists(false)
                    .usedAmount(usedAmount)
                    .message("이번 달 목표가 설정되어 있지 않습니다.")
                    .ratio(null)
                    .build();
        }

        Long targetAmount = target.getTargetAmount();

        // 목표에는 존재하지만 금액이 설정되지 않은 경우 (이상치 방지)
        if (targetAmount == null || targetAmount == 0) {
            return TargetResponse.builder()
                    .exists(true)
                    .targetAmount(targetAmount)
                    .usedAmount(usedAmount)
                    .ratio(null)
                    .year(target.getYear())
                    .month(target.getMonth())
                    .message("목표 금액이 아직 설정되지 않았습니다.")
                    .build();
        }

        double ratio = usedAmount * 100.0 / targetAmount;

        return TargetResponse.builder()
                .exists(true)
                .targetAmount(targetAmount)
                .usedAmount(usedAmount)
                .ratio(ratio)
                .year(target.getYear())
                .month(target.getMonth())
                .message(String.format("현재 목표의 %.1f%%를 사용했습니다.", ratio))
                .build();
    }
}
