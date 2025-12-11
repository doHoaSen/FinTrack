package doHoaSen.FinTrack.target.service;

import doHoaSen.FinTrack.target.entity.Target;
import doHoaSen.FinTrack.target.repository.TargetRepository;
import doHoaSen.FinTrack.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TargetService {

    private final TargetRepository targetRepository;

    /** 이번 달 목표 조회 */
    public Optional<Target> getCurrentTarget(Long userId) {
        YearMonth now = YearMonth.now();
        return targetRepository.findByUserIdAndYearAndMonth(
                userId,
                now.getYear(),
                now.getMonthValue()
        );
    }

    /** 목표 생성 또는 업데이트 (upsert) */
    public Target upsertTarget(Long userId, Long amount) {
        YearMonth now = YearMonth.now();

        Target target = getCurrentTarget(userId)
                .orElse(
                        Target.builder()
                                .user(User.fake(userId))
                                .year(now.getYear())
                                .month(now.getMonthValue())
                                .build()
                );

        target.setTargetAmount(amount);
        return targetRepository.save(target);
    }

    /** 목표 수정 */
    public Target updateTarget(Long userId, Long amount) {
        return upsertTarget(userId, amount);
    }

    /** 목표 삭제 */
    public void deleteCurrentTarget(Long userId) {
        getCurrentTarget(userId).ifPresent(targetRepository::delete);
    }
}
