package doHoaSen.FinTrack.expense.service;

import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.category.entity.ExpenseType;
import doHoaSen.FinTrack.category.repository.CategoryRepository;
import doHoaSen.FinTrack.expense.dto.ExpenseCreateRequest;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.dto.ExpenseUpdateRequest;
import doHoaSen.FinTrack.expense.dto.PageResponse;
import doHoaSen.FinTrack.expense.entity.Expense;
import doHoaSen.FinTrack.expense.mapper.ExpenseMapper;
import doHoaSen.FinTrack.expense.repository.ExpenseRepository;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.global.exception.ForbiddenException;
import doHoaSen.FinTrack.global.exception.NotFoundException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    // 지출 등록
    public Long createExpense(Long userId, ExpenseCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() ->new NotFoundException("존재하지 않는 사용자입니다."));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new BadRequestException("카테고리 없음"));

        if (request.expenseAt() == null) {
            throw new BadRequestException("지출 시각은 필수입니다.");
        }

        Expense expense = Expense.builder()
                .user(user)
                .category(category)
                .amount(request.amount())
                .memo(request.memo())
                .expenseAt(request.expenseAt())
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

    // 최근 지출 조회
    public List<ExpenseResponse> getRecentExpenses(Long userId) {
        return expenseRepository.findTop10ByUserIdOrderByExpenseAtDesc(userId)
                .stream()
                .map(ExpenseMapper::toResponse)
                .toList();
    }

    // 지출 수정
    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseUpdateRequest request){
        Expense expense = getUserExpense(userId, expenseId);

        if (request.amount() != null) {
            expense.setAmount(request.amount());
        }
        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new NotFoundException("카테고리 없음"));
            expense.setCategory(category);
        }
        if (request.memo() != null) {
            expense.setMemo(request.memo());
        }
        if (request.expenseAt() != null) {
            expense.setExpenseAt(request.expenseAt());
        }

        return ExpenseMapper.toResponse(expense);
    }



    // 월별 지출 목록
    public PageResponse<ExpenseResponse> getMonthlyExpenses(
            Long userId,
            int year,
            int month,
            int page,
            int size,
            Long categoryId,
            ExpenseType type
    ) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);

        Pageable pageable = PageRequest.of(page, size);

        Page<Expense> result = expenseRepository.findExpenses(
                userId, start, end, categoryId, type, pageable
        );

        return new PageResponse<>(
                result.getContent()
                        .stream()
                        .map(ExpenseMapper::toResponse)
                        .toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    // 지출 삭제
    public void deleteExpense(Long userId, Long expenseId){
        Expense expense = getUserExpense(userId, expenseId);
        expenseRepository.delete(expense);
    }

}
