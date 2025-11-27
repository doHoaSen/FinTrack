package doHoaSen.FinTrack.expenseStatistics.repository;

import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Projections;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import doHoaSen.FinTrack.expense.entity.QExpense;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static doHoaSen.FinTrack.expense.entity.QExpense.expense;

@Repository
@RequiredArgsConstructor
public class ExpenseQueryRepository {
    private final JPAQueryFactory queryFactory;

    // 월별 통계
    public List<MonthlyStatsDto> getMonthlyStats(Long userId, int year){
        return queryFactory.select(Projections.constructor(MonthlyStatsDto.class,
                expense.dateTime.month(),
                expense.amount.sum()
        ))
                .from(expense)
                .where(expense.user.id.eq(userId)
                        .and(expense.dateTime.year().eq(year)))
                .groupBy(expense.dateTime.month())
                .orderBy(expense.dateTime.month().asc())
                .fetch();
    }

    // 요일별 통계
    @PersistenceContext
    private EntityManager em;

    public List<WeekdayStatsDto> getWeekdayStats(Long userId) {

        String sql = """
        SELECT 
            extract(isodow from e.date_time) AS weekday,
            SUM(e.amount) AS total
        FROM expense e
        WHERE e.user_id = :userId
        GROUP BY extract(isodow from e.date_time)
        ORDER BY extract(isodow from e.date_time)
    """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .getResultList();

        List<WeekdayStatsDto> result = new ArrayList<>();

        for (Object[] row : rows) {
            result.add(new WeekdayStatsDto(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).longValue()
            ));
        }

        return result;
    }


    // 시간대별 통계
    public List<HourlyStatsDto> getHourlyStats(Long userId) {

        String sql = """
        SELECT 
            extract(hour from e.date_time) AS hour,
            SUM(e.amount) AS total
        FROM expense e
        WHERE e.user_id = :userId
        GROUP BY extract(hour from e.date_time)
        ORDER BY extract(hour from e.date_time)
    """;

        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("userId", userId)
                .getResultList();

        List<HourlyStatsDto> result = new ArrayList<>();

        for (Object[] row : rows) {
            result.add(new HourlyStatsDto(
                    ((Number) row[0]).intValue(),   // hour
                    ((Number) row[1]).longValue()   // total amount
            ));
        }

        return result;
    }

}
