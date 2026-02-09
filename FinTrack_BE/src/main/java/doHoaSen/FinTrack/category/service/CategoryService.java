package doHoaSen.FinTrack.category.service;

import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.dto.CategoryUpdateRequest;
import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.category.repository.CategoryRepository;
import doHoaSen.FinTrack.expense.repository.ExpenseRepository;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

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

        if (
                categoryRepository.existsByNameAndUser(request.name(), user) ||
                        categoryRepository.existsByNameAndUserIsNull(request.name())
        ){
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

    @Transactional
    public void updateCategory(Long userId, Long categoryId, CategoryUpdateRequest request){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalStateException("카테고리를 찾을 수 없습니다."));

        // 사용자 소유 검증
        if (category.getUser() == null || !category.getUser().getId().equals(userId)){
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        // 기본 카테고리 수정 금지
        if (category.isDefault()){
            throw new IllegalStateException("기본 카테고리는 수정할 수 없습니다.");
        }

        // 이름 중복 체크
        boolean exists = categoryRepository
                .existsByNameAndUserOrUserIsNull(request.getName(), category.getUser());

        if (exists && !category.getName().equals(request.getName())){
            throw new IllegalStateException("이미 존재하는 카테고리 이름입니다.");
        }

        category.setName(request.getName());
        category.setType(request.getType());
    }


    // 카테고리 단순 삭제
    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalStateException("카테고리를 찾을 수 없습니다."));

        // 사용자 소유 검증
        if (category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        // 기본 카테고리 삭제 금지
        if (category.isDefault()) {
            throw new IllegalStateException("기본 카테고리는 삭제할 수 없습니다.");
        }

        long count = expenseRepository.countByCategoryId(categoryId);

        if (count > 0) {
            throw new IllegalStateException(
                    "이 카테고리를 사용하는 지출이 있어 삭제할 수 없습니다."
            );
        }

        categoryRepository.delete(category);
    }

    /** 카테고리 변경 후 삭제 */
    @Transactional
    public void replaceAndDeleteCategory(
            Long userId,
            Long deleteCategoryId,
            Long targetCategoryId
    ) {
        if (deleteCategoryId.equals(targetCategoryId)) {
            throw new IllegalArgumentException("같은 카테고리로 변경할 수 없습니다.");
        }

        Category deleteCategory = categoryRepository.findById(deleteCategoryId)
                .orElseThrow(() -> new IllegalStateException("삭제할 카테고리 없음"));

        // 사용자 소유 + 기본 카테고리 보호
        if (deleteCategory.getUser() == null
                || !deleteCategory.getUser().getId().equals(userId)
                || deleteCategory.isDefault()) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        Category targetCategory = categoryRepository.findById(targetCategoryId)
                .orElseThrow(() -> new IllegalStateException("대상 카테고리 없음"));

        // 대상 카테고리도 사용자 소유 or 기본 허용 여부 판단
        if (targetCategory.getUser() != null
                && !targetCategory.getUser().getId().equals(userId)) {
            throw new IllegalStateException("대상 카테고리에 대한 권한이 없습니다.");
        }

        // 지출 카테고리 일괄 변경
        expenseRepository.updateCategory(deleteCategoryId, targetCategoryId);

        // 카테고리 삭제
        categoryRepository.delete(deleteCategory);
    }
}
