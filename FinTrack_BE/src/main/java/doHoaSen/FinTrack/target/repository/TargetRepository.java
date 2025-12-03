package doHoaSen.FinTrack.target.repository;

import doHoaSen.FinTrack.target.entity.Target;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TargetRepository extends JpaRepository<Target, Long> {

    Optional<Target> findByUserIdAndYearAndMonth(Long userId, Integer year, Integer month);

}
