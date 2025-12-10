package doHoaSen.FinTrack.expenseFeedback.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FeedbackResponse {

    private MonthlyTrend monthlyTrend;
    private WeekdayPattern weekdayPattern;
    private HourlyPattern hourlyPattern;
    private CategoryPattern categoryPattern;
    private TargetProgress targetProgress;

    private FixedVsVariable fixedVsVariable;
    private CategoryConcentration categoryConcentration;
    private DailyAverageTrend dailyAverageTrend;
    private SpikeDetection spikeDetection;
    private OverSpendSequence overSpendSequence;

    @Getter @Builder
    public static class MonthlyTrend {
        private String status;
        private Long currentMonth;
        private Long lastMonth;
        private Double percentDiff;
        private String message;
    }

    @Getter @Builder
    public static class WeekdayPattern {
        private Integer peakDay;
        private Long peakAmount;
        private String message;
    }

    @Getter @Builder
    public static class HourlyPattern {
        private Integer peakHour;
        private Long amount;
        private String message;
    }

    @Getter @Builder
    public static class CategoryPattern {
        private String topCategory;
        private Long amount;
        private Double ratio;
        private String message;
    }

    @Getter @Builder
    public static class TargetProgress {
        private Long targetAmount;
        private Long usedAmount;
        private Double ratio;
        private String message;
    }

    @Getter @Builder
    public static class FixedVsVariable {
        private Long fixedTotal;
        private Long variableTotal;
        private Double fixedRatio;
        private Double variableRatio;
        private String message;
    }

    @Getter @Builder
    public static class CategoryConcentration {
        private String topCategory;
        private Long amount;
        private Double ratio;
        private String message;
    }

    @Getter @Builder
    public static class DailyAverageTrend {
        private Double currentAvg;
        private Double lastMonthAvg;
        private Double diff;
        private String message;
    }

    @Getter @Builder
    public static class SpikeDetection {
        private String date;
        private Long amount;
        private String message;
    }

    @Getter @Builder
    public static class OverSpendSequence {
        private Integer streak;
        private String message;
    }
}
