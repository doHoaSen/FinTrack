package doHoaSen.FinTrack.expense.service;

import doHoaSen.FinTrack.expense.dto.ExpenseCreateRequest;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.dto.ExpenseUpdateRequest;
import doHoaSen.FinTrack.expense.entity.Expense;
import doHoaSen.FinTrack.expense.mapper.ExpenseMapper;
import doHoaSen.FinTrack.expense.repository.ExpenseRepository;
import doHoaSen.FinTrack.global.exception.ForbiddenException;
import doHoaSen.FinTrack.global.exception.NotFoundException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    // 지출 등록
    public Long createExpense(Long userId, ExpenseCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() ->new NotFoundException("존재하지 않는 사용자입니다."));

        Expense expense = Expense.builder()
                .user(user)
                .amount(request.amount())
                .category(request.category())
                .memo(request.memo())
                .dateTime(request.dateTime())
                .build();

        expenseRepository.save(expense);
        return expense.getId();
    }

    private Expense getUserExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new NotFoundException("Expense not found"));

        if (!expense.getUser().getId().equals(userId))
            throw new ForbiddenException("본인의 지출만 수정 가능합니다.");

        return expense;
    }

    // 지출 수정
    public void updateExpense(Long userId, Long expenseId, ExpenseUpdateRequest request){
        Expense expense = getUserExpense(userId, expenseId);
        if (request.amount() != null) expense.setAmount(request.amount());
        if (request.category() != null) expense.setCategory(request.category());
        if (request.memo() != null) expense.setMemo(request.memo());
        if (request.dateTime() != null) expense.setDateTime(request.dateTime());
    }

    // 지출 삭제
    public void deleteExpense(Long userId, Long expenseId){
        Expense expense = getUserExpense(userId, expenseId);
        expenseRepository.delete(expense);
    }

    // 월별 지출 목록
    public List<ExpenseResponse> getMonthlyExpenses(Long userId, int year, int month){
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);

        return expenseRepository.findByUserIdAndDateTimeBetween(userId, start, end)
                .stream()
                .map(ExpenseMapper::toResponse)
                .toList();
    }

}
