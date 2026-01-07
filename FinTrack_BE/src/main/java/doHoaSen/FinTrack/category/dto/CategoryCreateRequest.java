package doHoaSen.FinTrack.category.dto;

import doHoaSen.FinTrack.category.entity.ExpenseType;

public record CategoryCreateRequest(
        String name,
        ExpenseType type
) {
}
