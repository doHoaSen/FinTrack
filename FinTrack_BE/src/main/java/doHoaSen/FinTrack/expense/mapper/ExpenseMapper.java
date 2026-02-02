package doHoaSen.FinTrack.expense.mapper;

import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.entity.Expense;


// expense 엔티티 -> ExpenseResponse DTO로 변환
public class ExpenseMapper {
    public static ExpenseResponse toResponse(Expense expense){

        Category category = expense.getCategory();

        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                category != null ? category.getId() : null,
                category != null ? category.getName() : "미분류",
                category != null ? category.getType() : null,
                expense.getMemo(),
                expense.getExpenseAt()
        );
    }
}
