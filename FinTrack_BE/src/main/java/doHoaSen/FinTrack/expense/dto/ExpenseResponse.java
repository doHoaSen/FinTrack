package doHoaSen.FinTrack.expense.dto;

import doHoaSen.FinTrack.category.entity.ExpenseType;

import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        Long amount,
        Long categoryId,
        String categoryName,
        ExpenseType categoryType,
        String memo,
        LocalDateTime expenseAt
) { }
