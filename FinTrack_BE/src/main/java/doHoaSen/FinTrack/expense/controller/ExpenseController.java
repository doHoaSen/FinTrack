package doHoaSen.FinTrack.expense.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.category.entity.ExpenseType;
import doHoaSen.FinTrack.expense.dto.ExpenseCreateRequest;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.dto.ExpenseUpdateRequest;
import doHoaSen.FinTrack.expense.dto.PageResponse;
import doHoaSen.FinTrack.expense.service.ExpenseService;
import doHoaSen.FinTrack.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    /*지출 등록*/
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createExpense(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ExpenseCreateRequest request
            ){

        Long id = expenseService.createExpense(user.getId(),request);

        return ResponseEntity.ok(
                ApiResponse.success("지출이 등록되었습니다.", id)
        );
    }

    /*최근 지출 조회*/
    @GetMapping("/recent")
    public ApiResponse<List<ExpenseResponse>> getRecentExpenses(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ApiResponse.success(
                "최근 지출 조회 성공",
                expenseService.getRecentExpenses(user.getId())
        );
    }

    /*월별 지출 조회*/
    @GetMapping
    public ApiResponse<PageResponse<ExpenseResponse>> getMonthlyExpenses(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) ExpenseType type
    ) {
        return ApiResponse.success(
                "지출 목록 조회 성공",
                expenseService.getMonthlyExpenses(
                        user.getId(),
                        year,
                        month,
                        page,
                        size,
                        categoryId,
                        type
                )
        );
    }

    /*지출 수정*/
    @PatchMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long expenseId,
            @RequestBody ExpenseUpdateRequest request
    ) {
        ExpenseResponse updated =
                expenseService.updateExpense(user.getId(), expenseId, request);

        return ResponseEntity.ok(
                ApiResponse.success("지출 수정 완료", updated)
        );
    }


    /*지출 삭제*/
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long expenseId
    ){
        expenseService.deleteExpense(user.getId(), expenseId);
        return ResponseEntity.ok(
                ApiResponse.success("지출 삭제 완료", null)
        );
    }
}
