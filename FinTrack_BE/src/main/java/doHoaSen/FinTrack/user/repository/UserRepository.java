package doHoaSen.FinTrack.user.repository;

import doHoaSen.FinTrack.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmailAndIsDeletedFalse(String email);

    Optional<User> findByEmail(String email);

    // 탈퇴하지 않은 사용자만 조회
    Optional<User> findByEmailAndIsDeletedFalse(String email);

    Optional<User> findByIdAndIsDeletedFalse(Long id);

}
