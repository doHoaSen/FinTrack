package doHoaSen.FinTrack.expenseStatistics.repository;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class ExpenseStatsRepository {

    @PersistenceContext
    private final EntityManager em;

    /* 월 총 지출 */
    public Long getMonthlyTotal(Long userId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.plusMonths(1).atDay(1);

        String sql = """
            SELECT COALESCE(SUM(e.amount), 0)
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at >= :start
              AND e.expense_at < :end
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return ((Number) result).longValue();
    }

    /* 일별 총 지출 */
    public List<DayExpense> getDailyTotals(Long userId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.plusMonths(1).atDay(1);

        String sql = """
            SELECT DATE(e.expense_at), COALESCE(SUM(e.amount), 0)
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at >= :start
              AND e.expense_at < :end
            GROUP BY DATE(e.expense_at)
            ORDER BY DATE(e.expense_at)
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        List<DayExpense> result = new ArrayList<>();
        for (Object[] r : rows) {
            result.add(new DayExpense(
                    ((java.sql.Date) r[0]).toLocalDate(),
                    ((Number) r[1]).longValue()
            ));
        }
        return result;
    }

    /* 카테고리별 합계 */
    public Map<String, Long> getCategoryTotals(Long userId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.plusMonths(1).atDay(1);

        String sql = """
            SELECT c.name, COALESCE(SUM(e.amount), 0)
            FROM expense e
            JOIN category c ON c.id = e.category_id
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at >= :start
              AND e.expense_at < :end
            GROUP BY c.name
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        Map<String, Long> map = new HashMap<>();
        for (Object[] r : rows) {
            map.put((String) r[0], ((Number) r[1]).longValue());
        }
        return map;
    }

    /* 고정비 / 변동비 (NPE 완전 차단) */
    public long[] getFixedVsVariable(Long userId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.plusMonths(1).atDay(1);

        String sql = """
            SELECT
                COALESCE(SUM(CASE WHEN c.type = 'FIXED' THEN e.amount ELSE 0 END), 0),
                COALESCE(SUM(CASE WHEN c.type = 'VARIABLE' THEN e.amount ELSE 0 END), 0)
            FROM expense e
            JOIN category c ON c.id = e.category_id
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at >= :start
              AND e.expense_at < :end
        """;

        Object[] row = (Object[]) em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        long fixed = ((Number) row[0]).longValue();
        long variable = ((Number) row[1]).longValue();

        return new long[]{ fixed, variable };
    }

    /* 주간 합계 */
    public Long getWeekTotal(Long userId, LocalDate start) {
        LocalDate end = start.plusDays(7);

        String sql = """
            SELECT COALESCE(SUM(e.amount), 0)
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND DATE(e.expense_at) >= :start
              AND DATE(e.expense_at) < :end
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return ((Number) result).longValue();
    }
}
