package doHoaSen.FinTrack.expense.dto;

import java.time.LocalDateTime;

public record ExpenseCreateRequest (
        Long amount,
        Long categoryId,
        String memo,
        LocalDateTime expenseAt // 사용자가 실제 지출한 시각
){}
