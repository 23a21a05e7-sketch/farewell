import { formatINR } from "@/lib/budgetData";

interface BalanceSummaryProps {
  totalCollected: number;
  totalExpense: number;
}

export default function BalanceSummary({ totalCollected, totalExpense }: BalanceSummaryProps) {

  const remaining = totalCollected - totalExpense;

  let label = "Money left after expenses";
  let displayAmount = `₹ ${formatINR(remaining)}`;
  let colorClass = "text-success";

  if (remaining < 0) {
    label = "More money needed for event";
    displayAmount = `– ₹ ${formatINR(Math.abs(remaining))}`;
    colorClass = "text-destructive";
  }

  if (remaining === 0) {
    label = "All expenses covered";
    displayAmount = `₹ 0`;
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 card-glow animate-slide-up">

      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
        💼 Event budget summary
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Total money collected
          </p>

          <p className="text-xl font-bold text-primary font-mono">
            ₹ {formatINR(totalCollected)}
          </p>
        </div>


        <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Total event expenses
          </p>

          <p className="text-xl font-bold text-accent font-mono">
            ₹ {formatINR(totalExpense)}
          </p>
        </div>

      </div>


      <div className="text-center rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 p-4">

        <p className={`text-3xl font-extrabold font-mono ${colorClass}`}>
          {displayAmount}
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          {label}
        </p>

      </div>

    </div>
  );
}
