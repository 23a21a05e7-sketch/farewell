import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ExpenseItem } from "@/lib/budgetData";

const CHART_COLORS: Record<string, string> = {
  stage: "hsl(340, 82%, 55%)",
  food: "hsl(210, 100%, 55%)",
  gifts: "hsl(45, 100%, 55%)",
  dj: "hsl(160, 70%, 42%)",
  misc: "hsl(280, 70%, 60%)",
};

const SHORT_NAMES: Record<string, string> = {
  "Stage Decoration": "Stage",
  "Food & Catering": "Food & Catering",
  "Gifts": "Gifts",
  "DJ / Sound": "DJ/Sound",
  "Miscellaneous": "Misc",
};

export default function BudgetChart({ items }: { items: ExpenseItem[] }) {
  const data = items.map((item) => ({
    name: SHORT_NAMES[item.name] || item.name,
    value: item.amount,
    colorKey: item.colorKey,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={95}
          dataKey="value"
          strokeWidth={2}
          stroke="hsl(0, 0%, 100%)"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ strokeWidth: 1 }}
        >
          {data.map((entry) => (
            <Cell key={entry.colorKey} fill={CHART_COLORS[entry.colorKey]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid hsl(250, 20%, 91%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            backdropFilter: "blur(8px)",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "13px", fontWeight: 500 }}
          formatter={(value) => <span style={{ color: "hsl(250, 30%, 12%)" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
