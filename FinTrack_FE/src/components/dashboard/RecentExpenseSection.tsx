import type { Expense } from "../../pages/DashboardPage";

type Props = {
    expenses: Expense[];
    onDeleteExpense: (id: number) => void;
};

function RecentExpenseSection({expenses, onDeleteExpense}: Props) {
    
    return(
        <section>
            <h2>최근 지출</h2>
            
            {expenses.length === 0 && <p>아직 지출이 없습니다.</p>}

            <ul>
                {expenses.map((e) => (
                    <li key = {e.id}>
                        {e.category} - {e.amount.toLocaleString()}원
                        <button onClick={() => onDeleteExpense(e.id)}>삭제하기</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default RecentExpenseSection;