package doHoaSen.FinTrack.expense.entity;

import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Long amount;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    private String memo;

    /** 사용자가 실제로 돈을 쓴 시각 */
    private LocalDateTime expenseAt;

    /** 사용자가 이 기록을 시스템에 등록한 시각 */
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
