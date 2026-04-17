 import { ExpenseItem, formatINR } from "@/lib/budgetData";
import { Input } from "@/components/ui/input";

const CHART_COLORS: Record<string, string> = {
stage: "hsl(340, 82%, 55%)",
food: "hsl(210, 100%, 55%)",
gifts: "hsl(45, 100%, 55%)",
dj: "hsl(160, 70%, 42%)",
misc: "hsl(280, 70%, 60%)",
};

interface ExpenseTableProps {
items: ExpenseItem[];
isAdmin: boolean;
onAmountChange: (id: string, amount: number) => void;
}

export default function ExpenseTable({ items, isAdmin, onAmountChange }: ExpenseTableProps) {
return (
<div className="space-y-1">
<div className="flex items-center justify-between px-1 pb-2 border-b border-border/50">
<span className="text-sm font-semibold text-muted-foreground">Item</span>
<span className="text-sm font-semibold text-muted-foreground">Cost (₹)</span>
</div>
{items.map((item, i) => (
<div
key={item.id}
className="flex items-center justify-between py-3 px-1 border-b border-border/30 animate-slide-up hover:bg-primary/3 rounded-lg transition-colors"
style={{ animationDelay: ${i * 60}ms }}
>
<div className="flex items-center gap-3">
<div
className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
style={{ backgroundColor: CHART_COLORS[item.colorKey], boxShadow: 0 0 8px ${CHART_COLORS[item.colorKey]}40 }}
/>
<span className="font-medium text-foreground">{item.name}</span>
</div>
{isAdmin ? (
<Input
type="number"
value={item.amount}
onChange={(e) =>
onAmountChange(item.id, Math.max(0, Number(e.target.value)))
}
className="w-32 text-right rounded-xl font-mono"
min={0}
/>
) : (
<span className="font-semibold text-foreground font-mono">
₹{formatINR(item.amount)}
</span>
)}
</div>
))}
</div>
);
}
