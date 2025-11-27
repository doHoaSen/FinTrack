package doHoaSen.FinTrack.expense.mapper;

import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.entity.Expense;


// expense 엔티티 -> ExpenseResponse DTO로 변환
public class ExpenseMapper {
    public static ExpenseResponse toResponse(Expense expense){
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getMemo(),
                expense.getDateTime()
        );
    }
}
