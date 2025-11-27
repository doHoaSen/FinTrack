package doHoaSen.FinTrack.expenseStatistics.service;

import doHoaSen.FinTrack.expenseStatistics.dto.HourlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.MonthlyStatsDto;
import doHoaSen.FinTrack.expenseStatistics.dto.WeekdayStatsDto;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseStatsService {
    private final ExpenseQueryRepository expenseQueryRepository;

    public List<MonthlyStatsDto> getMonthlyStats(Long userId, int year){
        return expenseQueryRepository.getMonthlyStats(userId, year);
    }

    public List<WeekdayStatsDto> getWeekdayStats(Long userId){
        return expenseQueryRepository.getWeekdayStats(userId);
    }

    public List<HourlyStatsDto> getHourlyStats(Long userId){
        return expenseQueryRepository.getHourlyStats(userId);
    }
}
