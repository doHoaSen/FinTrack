package doHoaSen.FinTrack.target.entity;

import doHoaSen.FinTrack.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Target {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;  // 현재 로그인 사용자

    private Long targetAmount; // 이번달 목표 금액

    private Integer year;      // 목표 년도
    private Integer month;     // 목표 월

}
