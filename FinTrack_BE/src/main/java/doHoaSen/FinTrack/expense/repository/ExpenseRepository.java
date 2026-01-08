package doHoaSen.FinTrack.expense.repository;

import doHoaSen.FinTrack.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdAndExpenseAtBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Expense> findByUserIdOrderByExpenseAtDesc(Long userId, Pageable pageable);

    List<Expense> findTop10ByUserIdOrderByExpenseAtDesc(Long userId);
}
