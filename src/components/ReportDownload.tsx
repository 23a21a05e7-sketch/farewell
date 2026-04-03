import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatINR, type ExpenseItem } from "@/lib/budgetData";
import { type Section } from "@/components/SectionCollection";

interface ReportDownloadProps {
  sections: Section[];
  expenses: ExpenseItem[];
  totalCollected: number;
  totalExpense: number;
}

export default function ReportDownload({
  sections,
  expenses,
  totalCollected,
  totalExpense,
}: ReportDownloadProps) {
  const handleDownload = () => {
    const lines: string[] = [];
    const now = new Date().toLocaleString("en-IN");

    lines.push("FAREWELL BUDGET REPORT");
    lines.push(`Generated: ${now}`);
    lines.push("");

    // Sections
    lines.push("CSE SECTIONS - COLLECTION");
    lines.push("Section,Amount (₹)");
    sections.forEach((s) => lines.push(`${s.name},${s.amount}`));
    lines.push(`Total Collected,${totalCollected}`);
    lines.push("");

    // Expenses
    lines.push("EXPENSES");
    lines.push("Item,Amount (₹)");
    expenses.forEach((e) => lines.push(`${e.name},${e.amount}`));
    lines.push(`Total Expense,${totalExpense}`);
    lines.push("");

    // Balance
    const remaining = totalCollected - totalExpense;
    lines.push("BALANCE SUMMARY");
    lines.push(`Total Collected,${totalCollected}`);
    lines.push(`Total Expense,${totalExpense}`);
    lines.push(`Remaining Balance,${remaining}`);

    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farewell-budget-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download Report
    </Button>
  );
}
