package doHoaSen.FinTrack.expenseStatistics.service;

import doHoaSen.FinTrack.expenseFeedback.dto.DayExpense;
import doHoaSen.FinTrack.expenseStatistics.repository.ExpenseStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseStatsService {

    private final ExpenseStatsRepository repository;

    public Long getMonthlyTotal(Long userId, YearMonth month) {
        return repository.getMonthlyTotal(userId, month);
    }

    public List<DayExpense> getDailyTotals(Long userId, YearMonth month) {
        return repository.getDailyTotals(userId, month);
    }

    public Map<String, Long> getCategoryTotals(Long userId, YearMonth month) {
        return repository.getCategoryTotals(userId, month);
    }

    public long[] getFixedVsVariable(Long userId, YearMonth month) {
        return repository.getFixedVsVariable(userId, month);
    }

    public Long getWeekTotal(Long userId, LocalDate start) {
        return repository.getWeekTotal(userId, start);
    }
}
