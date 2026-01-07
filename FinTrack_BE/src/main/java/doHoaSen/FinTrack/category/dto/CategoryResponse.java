package doHoaSen.FinTrack.category.dto;

import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.category.entity.ExpenseType;

public record CategoryResponse(
        Long id,
        String name,
        ExpenseType type

) {
    public static CategoryResponse from(Category c){
        return new CategoryResponse(c.getId(), c.getName(), c.getType());
    }
}
