package doHoaSen.FinTrack.expenseStatistics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeekdayStatsDto {
        private int weekday; // 1~7
        private long amount;
}
