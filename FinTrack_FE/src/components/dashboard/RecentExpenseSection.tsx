import type { Expense } from "../../store/expenseStore";

type Props = {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onMore: () => void;
};

function RecentExpenseSection({
  expenses,
  onDeleteExpense,
  onEditExpense,
  onMore,
}: Props) {
  return (
    <section>
      <h2>최근 지출 (이번 달 기준 최근 7일)</h2>

      {expenses.length === 0 && (
        <p>이번 달 최근 지출이 없습니다.</p>
      )}

      <ul>
        {expenses.map((e) => {
          const amountText =
            typeof e.amount === "number"
              ? `${e.amount.toLocaleString()}원`
              : "-";

          const categoryText = e.categoryName ?? "기타";

          return (
            <li key={e.id}>
              {categoryText} · {amountText}
              <button onClick={() => onEditExpense(e)}>수정</button>
              <button onClick={() => onDeleteExpense(e.id)}>삭제</button>
            </li>
          );
        })}
      </ul>

      <button onClick={onMore}>더보기 →</button>
    </section>
  );
}

export default RecentExpenseSection;
