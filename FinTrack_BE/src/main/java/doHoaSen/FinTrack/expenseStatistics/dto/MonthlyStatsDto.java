package doHoaSen.FinTrack.expenseStatistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlyStatsDto {
    private Integer month;
    private Long amount;
}
