package doHoaSen.FinTrack.category.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.dto.CategoryUpdateRequest;
import doHoaSen.FinTrack.category.dto.ReplaceCategoryRequest;
import doHoaSen.FinTrack.category.service.CategoryService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    /** 카테고리 목록 조회 */
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories(
            @AuthenticationPrincipal CustomUserDetails user
            ){
        return ApiResponse.success(
                "카테고리 조회 성공",
                categoryService.getCategories(user.getId())
        );
    }

    /** 카테고리 추가 */
    @PostMapping
    public ApiResponse<Long> createCategory(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CategoryCreateRequest request
            ){
        return ApiResponse.success(
                "카테고리 생성 성공",
                categoryService.createCategory(user.getId(), request)
        );
    }

    /** 카테고리 수정 */
    @PutMapping("/{id}")
    public ApiResponse<Void> updateCategory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id,
            @RequestBody CategoryUpdateRequest request
    ){
        categoryService.updateCategory(user.getId(), id, request);
        return ApiResponse.success("카테고리 수정 완료", null);
    }

    /** 카테고리 단순 삭제 */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id
    ){
        categoryService.deleteCategory(user.getId(), id);
        return ApiResponse.success("카테고리 삭제 완료", null);
    }

    /** 카테고리 변경 후 삭제 */
    @PostMapping("/{id}/replace-and-delete")
    public ApiResponse<Void> replaceAndDeleteCategory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id,
            @RequestBody ReplaceCategoryRequest request
    ){
        categoryService.replaceAndDeleteCategory(
                user.getId(),
                id,
                request.getTargetCategoryId()
        );
        return ApiResponse.success("카테고리 변경 후 삭제 완료", null);
    }
}
