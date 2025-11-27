package doHoaSen.FinTrack.expenseStatistics.repository;

import com.querydsl.core.types.Projections;

import com.querydsl.jpa.impl.JPAQueryFactory;
import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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
    public List<WeekdayStatsDto> getWeekdayStats(Long userId){
        return queryFactory
                .select(Projections.constructor(WeekdayStatsDto.class,
                        expense.dateTime.dayOfWeek(),
                        expense.amount.sum()
                ))
                .from(expense)
                .where(expense.user.id.eq(userId))
                .groupBy(expense.dateTime.dayOfWeek())
                .orderBy(expense.dateTime.dayOfWeek().asc())
                .fetch();
    }

    // 시간대별 통계
    public List<HourlyStatsDto> getHourlyStats(Long userId) {
        return queryFactory
                .select(Projections.constructor(HourlyStatsDto.class,
                        expense.dateTime.hour(),
                        expense.amount.sum()
                ))
                .from(expense)
                .where(expense.user.id.eq(userId))
                .groupBy(expense.dateTime.hour())
                .orderBy(expense.dateTime.hour().asc())
                .fetch();
    }

}
