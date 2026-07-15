package doHoaSen.FinTrack.expense.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.entity.ExpenseType;
import doHoaSen.FinTrack.expense.dto.ExpenseCreateRequest;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.dto.ExpenseUpdateRequest;
import doHoaSen.FinTrack.expense.dto.PageResponse;
import doHoaSen.FinTrack.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Expense", description = "지출 등록·조회·수정·삭제 API")
public interface ExpenseControllerSpec {

    @Operation(summary = "지출 등록", description = "새로운 지출 내역을 등록합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "USER_NOT_FOUND: 존재하지 않는 사용자입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "VALIDATION_ERROR: 요청 값이 올바르지 않습니다. / "
                            + "EXPENSE_CATEGORY_NOT_FOUND: 존재하지 않는 카테고리입니다. / "
                            + "EXPENSE_TIME_REQUIRED: 지출 시각은 필수입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<Long>> createExpense(
            @Parameter(hidden = true) CustomUserDetails user,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 지출 정보")
            ExpenseCreateRequest request
    );

    @Operation(summary = "최근 지출 조회", description = "로그인한 사용자의 최근 지출 내역을 조회합니다.")
    ApiResponse<List<ExpenseResponse>> getRecentExpenses(
            @Parameter(hidden = true) CustomUserDetails user
    );

    @Operation(summary = "월별 지출 조회", description = "연/월 기준으로 지출 내역을 페이지네이션하여 조회합니다. 카테고리·타입 필터를 선택적으로 적용할 수 있습니다.")
    ApiResponse<PageResponse<ExpenseResponse>> getMonthlyExpenses(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "조회 연도", example = "2026") int year,
            @Parameter(description = "조회 월", example = "7") int month,
            @Parameter(description = "페이지 번호 (0부터 시작)") int page,
            @Parameter(description = "페이지 크기") int size,
            @Parameter(description = "카테고리 ID 필터") Long categoryId,
            @Parameter(description = "지출 타입 필터") ExpenseType type
    );

    @Operation(summary = "지출 수정", description = "기존 지출 내역을 수정합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "EXPENSE_NOT_FOUND: 지출 내역을 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                    description = "EXPENSE_FORBIDDEN: 본인의 지출만 수정 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                    description = "EXPENSE_CATEGORY_NOT_FOUND: 존재하지 않는 카테고리입니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "수정할 지출 ID") Long expenseId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 지출 정보")
            ExpenseUpdateRequest request
    );

    @Operation(summary = "지출 삭제", description = "지출 내역을 삭제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                    description = "EXPENSE_NOT_FOUND: 지출 내역을 찾을 수 없습니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                    description = "EXPENSE_FORBIDDEN: 본인의 지출만 수정 가능합니다.",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> deleteExpense(
            @Parameter(hidden = true) CustomUserDetails user,
            @Parameter(description = "삭제할 지출 ID") Long expenseId
    );
}
