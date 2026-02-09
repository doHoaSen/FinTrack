package doHoaSen.FinTrack.expense.repository;

import doHoaSen.FinTrack.category.entity.ExpenseType;
import doHoaSen.FinTrack.expense.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // 월 기준 페이지네이션
    @Query("""
            SELECT e FROM Expense e
            JOIN FETCH e.category c
            WHERE e.user.id = :userId
                AND e.expenseAt >= :start
                AND e.expenseAt < :end
                AND (:categoryId IS NULL or c.id = :categoryId)
                AND (:type IS NULL OR c.type = :type)
            ORDER BY e.expenseAt DESC
            """)
    Page<Expense> findExpenses(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("categoryId") Long categoryId,
            @Param("type")ExpenseType type,
            Pageable pageable
            );

    long countByCategoryId(Long categoryId);

    @Modifying
    @Query("""
        UPDATE Expense e
        SET e.category.id = :targetCategoryId
        WHERE e.category.id = :deleteCategoryId
    """)
    void updateCategory(
            @Param("deleteCategoryId") Long deleteCategoryId,
            @Param("targetCategoryId") Long targetCategoryId
    );
}
