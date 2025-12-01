package doHoaSen.FinTrack.expenseFeedback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DayExpense {
    private LocalDate date;
    private Long total;
}
