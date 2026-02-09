package doHoaSen.FinTrack.category.dto;

import doHoaSen.FinTrack.category.entity.ExpenseType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CategoryUpdateRequest {
    private String name;
    private ExpenseType type;
}
