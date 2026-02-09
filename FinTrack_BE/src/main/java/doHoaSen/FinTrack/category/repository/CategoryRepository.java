package doHoaSen.FinTrack.category.repository;

import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserIsNullOrUserOrderByIsDefaultDescIdAsc(User user);

    boolean existsByNameAndUser(String name, User user);

    boolean existsByNameAndUserIsNull(String name);

    boolean existsByNameAndUserOrUserIsNull(String name, User user);

    Optional<Category> findByIdAndUser(Long id, User user);
}

