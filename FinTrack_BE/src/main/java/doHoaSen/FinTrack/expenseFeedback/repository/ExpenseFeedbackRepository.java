package doHoaSen.FinTrack.expenseFeedback.repository;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class ExpenseFeedbackRepository {

    @PersistenceContext
    private final EntityManager em;

    /* 카테고리 총액*/
    public Map<String, Long> getCategoryTotals(Long userId){
        String sql = """
                SELECT category, SUM(amount)
                FROm expense
                WHERE user_id = :userId
                    AND DATE_TRUNC('month', date_time) = DATE_TRUNC('month', NOW())
                GROUP BY category
                """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .getResultList();

        Map<String, Long> map = new HashMap<>();
        for(Object[] row: rows){
            map.put((String)row[0], ((Number)row[1]).longValue());
        }
        return map;
    }

    /* 날짜별 지출*/
    public List<DayExpense> getDailyTotals(Long userId) {
        String sql = """
            SELECT DATE(date_time), SUM(amount)
            FROM expense
            WHERE user_id = :userId
              AND DATE_TRUNC('month', date_time)=DATE_TRUNC('month', NOW())
            GROUP BY DATE(date_time)
            ORDER BY DATE(date_time)
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
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


    /* 이번달 총액*/
    public Long getMonthlyTotal(Long userId, YearMonth month){
        String sql = """
            SELECT SUM(amount)
            FROM expense
            WHERE user_id = :userId
              AND DATE_TRUNC('month', date_time)=DATE_TRUNC('month', CAST(:target AS timestamp)) 
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("target", month.atDay(1))
                .getSingleResult();

        return result == null ? 0L : ((Number)result).longValue();
    }

    /* 지난달 평균*/
    public Double getLastMonthDailyAverage(Long userId){
        YearMonth last = YearMonth.now().minusMonths(1);
        String sql = """
            SELECT AVG(daily_sum) FROM (
                SELECT DATE(date_time), SUM(amount) AS daily_sum
                FROM expense
                WHERE user_id = :userId
                  AND DATE_TRUNC('month', date_time)=DATE_TRUNC('month', CAST(:lm AS timestamp))
                GROUP BY DATE(date_time)
            ) t
        """;

        Object result = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("lm", last.atDay(1))
                .getSingleResult();

        return result == null ? null : ((Number) result).doubleValue();
    }
}
