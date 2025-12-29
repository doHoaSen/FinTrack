import type { Expense } from "../../pages/DashboardPage";

type Props = {
    expenses: Expense[];
}

function SummarySection({expenses}: Props) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <section style={{ marginBottom: 24 }}>
            <h2>이번 달 요약</h2>

            <p>총 소비: {total.toLocaleString()}원</p>
        </section>
    )
}

export default SummarySection;