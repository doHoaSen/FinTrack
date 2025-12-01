package doHoaSen.FinTrack.expenseFeedback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FeedbackResponse {
    private String monthlyTrend;
    private String weekdayPattern;
    private String hourlyPattern;
    private String categoryPattern;
    private String targetProgress;

    private String fixedVsVariable;
    private String categoryConcentration;
    private String dailyAverageTrend;
    private String spikeDetection;
    private String overSpendSequence;
}
