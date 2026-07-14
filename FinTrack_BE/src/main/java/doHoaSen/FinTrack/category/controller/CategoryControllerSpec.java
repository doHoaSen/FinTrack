package doHoaSen.FinTrack.category.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.dto.CategoryUpdateRequest;
import doHoaSen.FinTrack.category.dto.ReplaceCategoryRequest;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Category", description = "카테고리 조회·생성·수정·삭제 API")
public interface CategoryControllerSpec {

    @Operation(summary = "카테고리 목록 조회", description = "로그인한 사용자의 기본 카테고리와 커스텀 카테고리 목록을 조회합니다.")
    ApiResponse<List<CategoryResponse>> getCategories(
            @Parameter(hidden = true) CustomUserDetails user
    );

    @Operation(summary = "카테고리 추가", description = "커스텀 카테고리를 생성합니다.")
    ApiResponse<Long> createCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "생성할 카테고리 정보")
            CategoryCreateRequest request
    );

    @Operation(summary = "카테고리 수정", description = "카테고리 이름 등 정보를 수정합니다.")
    ApiResponse<Void> updateCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "수정할 카테고리 ID") Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 카테고리 정보")
            CategoryUpdateRequest request
    );

    @Operation(summary = "카테고리 단순 삭제", description = "해당 카테고리를 사용하는 지출이 없을 때 카테고리를 삭제합니다.")
    ApiResponse<Void> deleteCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "삭제할 카테고리 ID") Long id
    );

    @Operation(summary = "카테고리 변경 후 삭제", description = "삭제할 카테고리를 사용 중인 지출들을 다른 카테고리로 이전한 뒤 삭제합니다.")
    ApiResponse<Void> replaceAndDeleteCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "삭제할 카테고리 ID") Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "지출을 이전할 대상 카테고리 ID")
            ReplaceCategoryRequest request
    );
}
