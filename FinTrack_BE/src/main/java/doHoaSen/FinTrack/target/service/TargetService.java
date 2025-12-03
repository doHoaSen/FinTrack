package doHoaSen.FinTrack.target.service;

import doHoaSen.FinTrack.target.entity.Target;
import doHoaSen.FinTrack.target.repository.TargetRepository;
import doHoaSen.FinTrack.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class TargetService {
    private final TargetRepository targetRepository;

    // 이번달 목표 조회
    public Target getCurrentTarget(Long userId){
        YearMonth now = YearMonth.now();
        return targetRepository.findByUserIdAndYearAndMonth(
                userId,
                now.getYear(),
                now.getMonthValue()
        ).orElse(null);
    }

    // 목표 생성 및 수정
    public Target upsertTarget(Long userId, Long amount){
        YearMonth now = YearMonth.now();
        Target target = targetRepository.findByUserIdAndYearAndMonth(
                userId,
                now.getYear(),
                now.getMonthValue()
        ).orElse(
                Target.builder()
                        .user(User.fake(userId))
                        .year(now.getYear())
                        .month(now.getMonthValue())
                        .build()
        );

        target.setTargetAmount(amount);
        return targetRepository.save(target);
    }
}
