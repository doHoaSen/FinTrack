package doHoaSen.FinTrack.expense.controller;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.expense.dto.ExpenseCreateRequest;
import doHoaSen.FinTrack.expense.dto.ExpenseResponse;
import doHoaSen.FinTrack.expense.dto.ExpenseUpdateRequest;
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
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getMonthlyExpenses(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam int year,
            @RequestParam int month
    ){
        List<ExpenseResponse> expenses = expenseService.getMonthlyExpenses(user.getId(), year, month);

        System.out.println("principal=" + user);
        return ResponseEntity.ok(
                ApiResponse.success("해당 월 목록 조회 성공", expenses)
        );
    }

    /*지출 수정*/
    @PatchMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> updateExpense(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long expenseId,
            @RequestBody ExpenseUpdateRequest request
            ){
        expenseService.updateExpense(user.getId(), expenseId, request);

        return ResponseEntity.ok(
                ApiResponse.success("지출 수정 완료", null)
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
