import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatINR, type ExpenseItem, type Committee } from "@/lib/budgetData";
import { type Section } from "@/components/SectionCollection";

interface ReportDownloadProps {
  sections: Section[];
  expenses: ExpenseItem[];
  committees?: Committee[];
  totalCollected: number;
  totalExpense: number;
}

export default function ReportDownload({
  sections,
  expenses,
  committees = [],
  totalCollected,
  totalExpense,
}: ReportDownloadProps) {
  const csv = (value: string | number) =>
    `"${String(value).replaceAll('"', '""')}"`;

  const handleDownload = () => {
    const lines: string[] = [];
    const now = new Date().toLocaleString("en-IN");

    lines.push("FAREWELL BUDGET REPORT");
    lines.push(`Generated: ${now}`);
    lines.push("");

    // Sections
    lines.push("CSE SECTIONS - COLLECTION");
    lines.push("Section,Amount (₹)");
    sections.forEach((s) => lines.push(`${csv(s.name)},${csv(s.amount)}`));
    lines.push(`${csv("Total Collected")},${csv(totalCollected)}`);
    lines.push("");

    // Expenses
    lines.push("EXPENSES");
    lines.push("Item,Amount (₹)");
    expenses.forEach((e) => lines.push(`${csv(e.name)},${csv(e.amount)}`));
    lines.push(`${csv("Total Expense")},${csv(totalExpense)}`);
    lines.push("");

    // Committees
    lines.push("COMMITTEES");
    lines.push("Committee,Field,Value");
    committees.forEach((committee) => {
      lines.push(
        `${csv(committee.name)},${csv("Emoji")},${csv(committee.emoji)}`,
      );
      lines.push(
        `${csv(committee.name)},${csv("Description")},${csv(committee.description)}`,
      );
      committee.details.forEach((detail) => {
        lines.push(
          `${csv(committee.name)},${csv(detail.label)},${csv(detail.value)}`,
        );
      });
    });
    lines.push("");

    // Balance
    const remaining = totalCollected - totalExpense;
    lines.push("BALANCE SUMMARY");
    lines.push(`${csv("Total Collected")},${csv(totalCollected)}`);
    lines.push(`${csv("Total Expense")},${csv(totalExpense)}`);
    lines.push(`${csv("Remaining Balance")},${csv(remaining)}`);

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
