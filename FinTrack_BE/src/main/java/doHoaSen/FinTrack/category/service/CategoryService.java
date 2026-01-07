package doHoaSen.FinTrack.category.service;

import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.category.repository.CategoryRepository;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    /** 카테고리 목록 조회 (기본 + 사용자) */
    public List<CategoryResponse> getCategories(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("사용자 없음"));

        return categoryRepository.findByUserIsNullOrUserOrderByIsDefaultDescIdAsc(user)
                .stream()
                .map(c -> new CategoryResponse(
                        c.getId(),
                        c.getName(),
                        c.getType()
                ))
                .toList();
    }

    /** 사용자 카테고리 생성 */
    public Long createCategory(Long userId, CategoryCreateRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("사용자 없음"));

        if (categoryRepository.existsByNameAndUserIsNullOrUser(request.name(), user)){
            throw new BadRequestException("이미 존재하는 카테고리입니다.");
        }

        Category category = Category.builder()
                .user(user)
                .name(request.name())
                .type(request.type())
                .isDefault(false)
                .build();

        categoryRepository.save(category);
        return category.getId();
    }
}
