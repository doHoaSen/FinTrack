package doHoaSen.FinTrack.expenseStatistics.repository;

import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ExpenseQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    /* 요일별 지출 분포 (1=월 ~ 7=일, ISO 기준) */
    public List<WeekdayStatsDto> getWeekdayStats(Long userId) {

        String sql = """
            SELECT
                EXTRACT(ISODOW FROM e.expense_at) AS weekday,
                COALESCE(SUM(e.amount), 0) AS total
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at IS NOT NULL
            GROUP BY EXTRACT(ISODOW FROM e.expense_at)
            ORDER BY weekday
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .getResultList();

        List<WeekdayStatsDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            if (row[0] == null) continue;

            result.add(new WeekdayStatsDto(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).longValue()
            ));
        }

        return result;
    }

    /* 시간대별 지출 분포 (0~23) */
    public List<HourlyStatsDto> getHourlyStats(Long userId) {

        String sql = """
            SELECT
                EXTRACT(HOUR FROM e.expense_at) AS hour,
                COALESCE(SUM(e.amount), 0) AS total
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at IS NOT NULL
            GROUP BY EXTRACT(HOUR FROM e.expense_at)
            ORDER BY hour
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .getResultList();

        List<HourlyStatsDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            if (row[0] == null) continue;

            result.add(new HourlyStatsDto(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).longValue()
            ));
        }

        return result;
    }

    /* 월별 분포 (차트용) */
    public List<MonthlyStatsDto> getMonthlyStats(Long userId, int year) {

        String sql = """
            SELECT
                EXTRACT(MONTH FROM e.expense_at) AS month,
                COALESCE(SUM(e.amount), 0) AS total
            FROM expense e
            JOIN users u ON u.id = e.user_id
            WHERE u.id = :userId
              AND u.is_deleted = false
              AND e.expense_at IS NOT NULL
              AND EXTRACT(YEAR FROM e.expense_at) = :year
            GROUP BY EXTRACT(MONTH FROM e.expense_at)
            ORDER BY month
        """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("year", year)
                .getResultList();

        List<MonthlyStatsDto> result = new ArrayList<>();
        for (Object[] row : rows) {
            if (row[0] == null) continue;

            result.add(new MonthlyStatsDto(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).longValue()
            ));
        }

        return result;
    }
}
