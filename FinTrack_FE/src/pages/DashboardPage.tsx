import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";
import { useState } from "react";

export type Expense = {
    id: number;
    amount: number;
    category: string;
};

function DashboardPage(){
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const addExpense = (expense: Expense) => {
        setExpenses((prev) => [expense, ...prev]);
    };

    const deleteExpense = (id: number) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    };
    
    return(
        <div style={{padding: 24}}>
            <h1>FINTRACK DASHBOARD</h1>
            

            <SummarySection expenses = {expenses} />
            <QuickExpenseForm onAddExpense = {addExpense} />
            <GoalHistoryPreview />
            <RecentExpenseSection 
                expenses = {expenses}
                onDeleteExpense = {deleteExpense}/>
        </div>
    )
}
export default DashboardPage;