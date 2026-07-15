package doHoaSen.FinTrack.category.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.dto.CategoryCreateRequest;
import doHoaSen.FinTrack.category.dto.CategoryResponse;
import doHoaSen.FinTrack.category.dto.CategoryUpdateRequest;
import doHoaSen.FinTrack.category.dto.ReplaceCategoryRequest;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Category", description = "카테고리 조회·생성·수정·삭제 API")
public interface CategoryControllerSpec {

    @Operation(summary = "카테고리 목록 조회", description = "로그인한 사용자의 기본 카테고리와 커스텀 카테고리 목록을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "USER_NOT_FOUND: 사용자를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<List<CategoryResponse>> getCategories(
            @Parameter(hidden = true) CustomUserDetails user
    );

    @Operation(summary = "카테고리 추가", description = "커스텀 카테고리를 생성합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "USER_NOT_FOUND: 사용자를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "CATEGORY_ALREADY_EXISTS: 이미 존재하는 카테고리입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<Long> createCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "생성할 카테고리 정보")
            CategoryCreateRequest request
    );

    @Operation(summary = "카테고리 수정", description = "카테고리 이름 등 정보를 수정합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "CATEGORY_NOT_FOUND: 카테고리를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                    description = "CATEGORY_UPDATE_FORBIDDEN: 수정 권한이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "CATEGORY_DEFAULT_NOT_EDITABLE: 기본 카테고리는 수정할 수 없습니다. / "
                            + "CATEGORY_NAME_DUPLICATE: 이미 존재하는 카테고리 이름입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<Void> updateCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "수정할 카테고리 ID") Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 카테고리 정보")
            CategoryUpdateRequest request
    );

    @Operation(summary = "카테고리 단순 삭제", description = "해당 카테고리를 사용하는 지출이 없을 때 카테고리를 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "CATEGORY_NOT_FOUND: 카테고리를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                    description = "CATEGORY_DELETE_FORBIDDEN: 삭제 권한이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "CATEGORY_DEFAULT_NOT_DELETABLE: 기본 카테고리는 삭제할 수 없습니다. / "
                            + "CATEGORY_IN_USE: 이 카테고리를 사용하는 지출이 있어 삭제할 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<Void> deleteCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "삭제할 카테고리 ID") Long id
    );

    @Operation(summary = "카테고리 변경 후 삭제", description = "삭제할 카테고리를 사용 중인 지출들을 다른 카테고리로 이전한 뒤 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "CATEGORY_NOT_FOUND: 카테고리를 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                    description = "CATEGORY_DELETE_FORBIDDEN: 삭제 권한이 없습니다. / "
                            + "CATEGORY_TARGET_FORBIDDEN: 대상 카테고리에 대한 권한이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "CATEGORY_SAME_AS_TARGET: 같은 카테고리로 변경할 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ApiResponse<Void> replaceAndDeleteCategory(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "삭제할 카테고리 ID") Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "지출을 이전할 대상 카테고리 ID")
            ReplaceCategoryRequest request
    );
}
