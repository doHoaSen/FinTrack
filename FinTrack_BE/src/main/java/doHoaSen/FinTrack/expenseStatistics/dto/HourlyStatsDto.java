package doHoaSen.FinTrack.expenseStatistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HourlyStatsDto {
    private Integer hour; // 0~23
    private Long amount;
}
