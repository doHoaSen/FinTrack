import { useState } from "react";
import type { Expense } from "../../pages/DashboardPage";

type Props = {
    onAddExpense: (expense: Expense) => void;
}

function QuickExpenseForm({onAddExpense}: Props){
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("식비");

    const handleSubmit = () => {
        if (!amount) return;
        onAddExpense({
            id: Date.now(),
            amount: Number(amount),
            category,
        });
        setAmount("");
    }

    return (
        <section style = {{marginBottom: 24}}>
            <h2>빠른 지출 등록</h2>
            <input
                type = "number"
                placeholder="금액"
                value = {amount}
                onChange = {(e) => setAmount(e.target.value)}
                />

            <select
                value = {category}
                onChange = {(e) => setCategory(e.target.value)}
                >
                    <option value = "식비">식비</option>
                    <option value = "카페">카페</option>
                    <option value = "교통">교통</option>
                    <option value = "기타">기타</option>

                </select>

            <button onClick={handleSubmit}>등록하기</button>
        </section>
    )
}

export default QuickExpenseForm;