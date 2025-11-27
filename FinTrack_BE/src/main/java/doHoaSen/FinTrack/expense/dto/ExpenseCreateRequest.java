package doHoaSen.FinTrack.expense.dto;

import java.time.LocalDateTime;

public record ExpenseCreateRequest (
        Long amount,
        String category,
        String memo,
        LocalDateTime dateTime
){}
