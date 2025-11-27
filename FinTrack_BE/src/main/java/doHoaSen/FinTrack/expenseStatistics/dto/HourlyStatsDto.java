package doHoaSen.FinTrack.expenseStatistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HourlyStatsDto {
    private int hour; // 0~23
    private long amount;
}
