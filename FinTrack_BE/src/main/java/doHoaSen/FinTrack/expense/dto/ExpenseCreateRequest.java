package doHoaSen.FinTrack.expense.dto;

import java.time.LocalDateTime;

public record ExpenseCreateRequest (
        Integer amount,
        String category,
        String memo,
        LocalDateTime dateTime
){}
