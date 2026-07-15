package doHoaSen.FinTrack.category.service;

import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.dto.CategoryUpdateRequest;
import doHoaSen.FinTrack.category.entity.Category;
import doHoaSen.FinTrack.category.repository.CategoryRepository;
import doHoaSen.FinTrack.expense.repository.ExpenseRepository;
import doHoaSen.FinTrack.global.exception.BadRequestException;
import doHoaSen.FinTrack.global.exception.ForbiddenException;
import doHoaSen.FinTrack.global.exception.NotFoundException;
import doHoaSen.FinTrack.user.entity.User;
import doHoaSen.FinTrack.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_ALREADY_EXISTS;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_DEFAULT_NOT_DELETABLE;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_DEFAULT_NOT_EDITABLE;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_DELETE_FORBIDDEN;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_IN_USE;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_NAME_DUPLICATE;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_NOT_FOUND;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_SAME_AS_TARGET;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_TARGET_FORBIDDEN;
import static doHoaSen.FinTrack.category.exception.CategoryErrorCode.CATEGORY_UPDATE_FORBIDDEN;
import static doHoaSen.FinTrack.user.exception.UserErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    /** 카테고리 목록 조회 (기본 + 사용자) */
    public List<CategoryResponse> getCategories(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(USER_NOT_FOUND));

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
                .orElseThrow(() -> new NotFoundException(USER_NOT_FOUND));

        if (
                categoryRepository.existsByNameAndUser(request.name(), user) ||
                        categoryRepository.existsByNameAndUserIsNull(request.name())
        ){
            throw new BadRequestException(CATEGORY_ALREADY_EXISTS);
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
                .orElseThrow(() -> new NotFoundException(CATEGORY_NOT_FOUND));

        // 사용자 소유 검증
        if (category.getUser() == null || !category.getUser().getId().equals(userId)){
            throw new ForbiddenException(CATEGORY_UPDATE_FORBIDDEN);
        }

        // 기본 카테고리 수정 금지
        if (category.isDefault()){
            throw new BadRequestException(CATEGORY_DEFAULT_NOT_EDITABLE);
        }

        // 이름 중복 체크
        boolean exists = categoryRepository
                .existsByNameAndUserOrUserIsNull(request.getName(), category.getUser());

        if (exists && !category.getName().equals(request.getName())){
            throw new BadRequestException(CATEGORY_NAME_DUPLICATE);
        }

        category.setName(request.getName());
        category.setType(request.getType());
    }


    // 카테고리 단순 삭제
    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException(CATEGORY_NOT_FOUND));

        // 사용자 소유 검증
        if (category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new ForbiddenException(CATEGORY_DELETE_FORBIDDEN);
        }

        // 기본 카테고리 삭제 금지
        if (category.isDefault()) {
            throw new BadRequestException(CATEGORY_DEFAULT_NOT_DELETABLE);
        }

        long count = expenseRepository.countByCategoryId(categoryId);

        if (count > 0) {
            throw new BadRequestException(CATEGORY_IN_USE);
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
            throw new BadRequestException(CATEGORY_SAME_AS_TARGET);
        }

        Category deleteCategory = categoryRepository.findById(deleteCategoryId)
                .orElseThrow(() -> new NotFoundException(CATEGORY_NOT_FOUND));

        // 사용자 소유 + 기본 카테고리 보호
        if (deleteCategory.getUser() == null
                || !deleteCategory.getUser().getId().equals(userId)
                || deleteCategory.isDefault()) {
            throw new ForbiddenException(CATEGORY_DELETE_FORBIDDEN);
        }

        Category targetCategory = categoryRepository.findById(targetCategoryId)
                .orElseThrow(() -> new NotFoundException(CATEGORY_NOT_FOUND));

        // 대상 카테고리도 사용자 소유 or 기본 허용 여부 판단
        if (targetCategory.getUser() != null
                && !targetCategory.getUser().getId().equals(userId)) {
            throw new ForbiddenException(CATEGORY_TARGET_FORBIDDEN);
        }

        // 지출 카테고리 일괄 변경
        expenseRepository.updateCategory(deleteCategoryId, targetCategoryId);

        // 카테고리 삭제
        categoryRepository.delete(deleteCategory);
    }
}
