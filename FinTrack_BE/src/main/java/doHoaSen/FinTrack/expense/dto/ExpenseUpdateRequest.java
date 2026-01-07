package doHoaSen.FinTrack.expense.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ExpenseUpdateRequest(
        Long amount,
        Long categoryId,
        String memo,
        LocalDateTime expenseAt
) {
}
