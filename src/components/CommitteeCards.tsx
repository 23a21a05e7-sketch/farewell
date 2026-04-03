import { Committee } from "@/lib/budgetData";

const CARD_GRADIENTS = [
  "from-primary/8 to-accent/5 border-primary/15",
  "from-accent/8 to-primary/5 border-accent/15",
  "from-chart-food/8 to-chart-dj/5 border-chart-food/15",
  "from-chart-dj/8 to-chart-food/5 border-chart-dj/15",
];

interface CommitteeCardsProps {
  committees: Committee[];
}

export default function CommitteeCards({ committees }: CommitteeCardsProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 card-glow animate-slide-up">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
        👥 Committees
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {committees.map((committee, i) => (
          <div
            key={committee.id}
            className={`rounded-xl border bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h3 className="font-bold text-foreground flex items-center gap-2 text-base mb-1">
              <span className="text-lg">{committee.emoji}</span>
              {committee.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {committee.description}
            </p>
            <div className="space-y-2">
              {committee.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="font-semibold text-foreground">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
