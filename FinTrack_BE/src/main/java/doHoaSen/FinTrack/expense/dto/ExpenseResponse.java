package doHoaSen.FinTrack.expense.dto;

import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        Long amount,
        String category,
        String memo,
        LocalDateTime dateTime
) { }
