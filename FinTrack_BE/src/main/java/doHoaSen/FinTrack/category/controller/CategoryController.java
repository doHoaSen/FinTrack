package doHoaSen.FinTrack.category.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
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
}
