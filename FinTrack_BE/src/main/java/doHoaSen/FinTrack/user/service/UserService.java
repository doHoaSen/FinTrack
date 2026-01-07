package doHoaSen.FinTrack.user.service;

import doHoaSen.FinTrack.user.dto.UserRegisterRequest;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final int DELETE_GRACE_MONTHS = 6;

    public void register(UserRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        Optional<User> existed = userRepository.findByEmail(request.getEmail());

        if (existed.isEmpty()) {
            createNewUser(request);
            return;
        }

        User oldUser = existed.get();
        if (!oldUser.isDeleted()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 탈퇴했던 계정인 경우
        LocalDateTime deletedAt = oldUser.getDeletedAt();
        LocalDateTime graceLimit = LocalDateTime.now().minusMonths(DELETE_GRACE_MONTHS);

        if (deletedAt != null && deletedAt.isAfter(graceLimit)) {
            // 탈퇴한지 6개월 이내 -> 계정 복구
            restoreUser(oldUser, request);
        } else {
            // 기존 계정 완전 삭제 후 새 계정 생성
            hardDeleteUser(oldUser);
            createNewUser(request);
        }
    }



    /* 신규 유저 생성 */
    private void createNewUser(UserRegisterRequest request){
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isDeleted(false)
                .deletedAt(null)
                .build();

        userRepository.save(user);
    }

    /* 탈퇴 계정 복구 */
    private void restoreUser(User oldUser, UserRegisterRequest request){
        oldUser.setDeleted(false);
        oldUser.setDeletedAt(null);
        oldUser.setName(request.getName());
        oldUser.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(oldUser);
    }

    /* 이메일 중복 체크 */
    public boolean checkEmailDuplicate(String email){
        return userRepository.existsByEmailAndIsDeletedFalse(email);
    }

    /* 회원 탈퇴 */
    public void withdraw(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    @Transactional
    public void hardDeleteUser(User user){
        userRepository.delete(user);
    }

}
