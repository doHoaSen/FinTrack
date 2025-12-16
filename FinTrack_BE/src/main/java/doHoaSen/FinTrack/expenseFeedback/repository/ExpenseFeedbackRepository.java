package doHoaSen.FinTrack.expenseFeedback.repository;

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
public class ExpenseFeedbackRepository {

    @PersistenceContext
    private final EntityManager em;

    /* 1) 카테고리 총액 (이번 달) */
    public Map<String, Long> getCategoryTotals(Long userId){
        LocalDate start = YearMonth.now().atDay(1);
        LocalDate end = YearMonth.now().plusMonths(1).atDay(1);

        String sql = """
                SELECT category, SUM(amount)
                FROM expense
                WHERE user_id = :userId
                  AND date_time >= :start
                  AND date_time < :end
                GROUP BY category
                """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        Map<String, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            map.put((String) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }

    /* 2) 날짜별 총액 (이번 달) */
    public List<DayExpense> getDailyTotals(Long userId) {
        LocalDate start = YearMonth.now().atDay(1);
        LocalDate end = YearMonth.now().plusMonths(1).atDay(1);

        String sql = """
            SELECT DATE(date_time), SUM(amount)
            FROM expense
            WHERE user_id = :userId
              AND date_time >= :start
              AND date_time < :end
            GROUP BY DATE(date_time)
            ORDER BY DATE(date_time)
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        List<DayExpense> list = new ArrayList<>();
        for (Object[] row : rows) {
            list.add(
                    new DayExpense(
                            ((java.sql.Date) row[0]).toLocalDate(),
                            ((Number) row[1]).longValue()
                    )
            );
        }
        return list;
    }

    /* 3) 특정 월 총액 */
    public Long getMonthlyTotal(Long userId, YearMonth month) {

        LocalDate start = month.atDay(1);
        LocalDate end = month.plusMonths(1).atDay(1);

        String sql = """
            SELECT COALESCE(SUM(amount), 0)
            FROM expense
            WHERE user_id = :userId
              AND date_time >= :start
              AND date_time < :end
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return ((Number) result).longValue();
    }

    /* 4) 지난달 일평균 */
    public Double getLastMonthDailyAverage(Long userId){
        YearMonth last = YearMonth.now().minusMonths(1);
        LocalDate start = last.atDay(1);
        LocalDate end = last.plusMonths(1).atDay(1);

        String sql = """
            SELECT AVG(daily_sum) FROM (
                SELECT DATE(date_time) AS d, SUM(amount) AS daily_sum
                FROM expense
                WHERE user_id = :userId
                  AND date_time >= :start
                  AND date_time < :end
                GROUP BY DATE(date_time)
            ) t
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return result == null ? null : ((Number) result).doubleValue();
    }

    /* 5) 이번 주 총 지출 */
    public Long getThisWeekTotal(Long userId, LocalDate weekStart) {
        LocalDate start = weekStart;
        LocalDate end = weekStart.plusDays(7);  // exclusive

        String sql = """
        SELECT COALESCE(SUM(amount), 0)
        FROM expense
        WHERE user_id = :userId
          AND DATE(date_time) >= :start
          AND DATE(date_time) < :end
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return ((Number) result).longValue();
    }

    /* 6) 지난 주 총 지출 */
    public Long getLastWeekTotal(Long userId, LocalDate lastWeekStart) {
        LocalDate start = lastWeekStart;
        LocalDate end = lastWeekStart.plusDays(7);

        String sql = """
        SELECT COALESCE(SUM(amount), 0)
        FROM expense
        WHERE user_id = :userId
          AND DATE(date_time) >= :start
          AND DATE(date_time) < :end
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();

        return ((Number) result).longValue();
    }

}
