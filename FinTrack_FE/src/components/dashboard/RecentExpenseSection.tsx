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
    onMore, }: Props) {

    return (
        <section>
            <h2>최근 지출</h2>

            {expenses.length === 0 && <p>아직 지출이 없습니다.</p>}

            <ul>
                {expenses.map((e) => (
                    <li key={e.id}>
                        {e.categoryName} · {e.amount.toLocaleString()}원
                        <button onClick={() => onEditExpense(e)}>수정</button>
                        <button onClick={() => onDeleteExpense(e.id)}>삭제</button>
                    </li>
                ))}
            </ul>

            <button onClick={onMore}>더보기 →</button>
        </section>
    )
}

export default RecentExpenseSection;