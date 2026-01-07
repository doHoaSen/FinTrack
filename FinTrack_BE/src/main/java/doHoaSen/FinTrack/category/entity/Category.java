package doHoaSen.FinTrack.category.entity;

import doHoaSen.FinTrack.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "category",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "name"})
        }
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // null이면 공통 기본 카테고리
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false, length = 30)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType type; // FIXED / VARIABLE

    @Column(nullable = false)
    private boolean isDefault;
}
