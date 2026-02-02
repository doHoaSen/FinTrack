import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import type { MonthlyStat } from "../../features/dashboard/api";

type Props = {
    data: MonthlyStat[];
};

function MonthlyExpenseChart({data}: Props){
    return(
        <div style={{ width: "100%", height: 250 }}>
      <h3>월별 소비</h3>

      <ResponsiveContainer>
        <BarChart data = {data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
        </BarChart>
      </ResponsiveContainer>
        </div>
    );
}

export default MonthlyExpenseChart;