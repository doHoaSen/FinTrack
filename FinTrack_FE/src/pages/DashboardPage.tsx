import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";
import { useExpenseStore } from "../store/expenseStore";

export type Expense = {
    id: number;
    amount: number;
    category: string;
};

function DashboardPage(){
    const expenses = useExpenseStore((state) => state.expenses);
    const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  
    
    return(
        <div style={{padding: 24}}>
            <h1>FINTRACK DASHBOARD</h1>
            

            <SummarySection expenses = {expenses} />
            <QuickExpenseForm />
            <GoalHistoryPreview />
            <RecentExpenseSection 
                expenses = {expenses}
                onDeleteExpense = {deleteExpense}/>
        </div>
    )
}
export default DashboardPage;