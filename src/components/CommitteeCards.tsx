import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Committee } from "@/lib/budgetData";
import { Plus, Trash2 } from "lucide-react";

const CARD_GRADIENTS = [
  "from-primary/8 to-accent/5 border-primary/15",
  "from-accent/8 to-primary/5 border-accent/15",
  "from-chart-food/8 to-chart-dj/5 border-chart-food/15",
  "from-chart-dj/8 to-chart-food/5 border-chart-dj/15",
];

interface CommitteeCardsProps {
  committees: Committee[];
  isAdmin: boolean;
  onCommitteesChange: (committees: Committee[]) => void;
}

export default function CommitteeCards({
  committees,
  isAdmin,
  onCommitteesChange,
}: CommitteeCardsProps) {
  const updateCommittee = (
    committeeId: string,
    updater: (committee: Committee) => Committee,
  ) => {
    onCommitteesChange(
      committees.map((committee) =>
        committee.id === committeeId ? updater(committee) : committee,
      ),
    );
  };

  const updateDetail = (
    committeeId: string,
    detailIndex: number,
    field: "label" | "value",
    value: string,
  ) => {
    updateCommittee(committeeId, (committee) => ({
      ...committee,
      details: committee.details.map((detail, index) =>
        index === detailIndex ? { ...detail, [field]: value } : detail,
      ),
    }));
  };

  const addDetail = (committeeId: string) => {
    updateCommittee(committeeId, (committee) => ({
      ...committee,
      details: [
        ...committee.details,
        { label: "New label", value: "New value" },
      ],
    }));
  };

  const removeDetail = (committeeId: string, detailIndex: number) => {
    updateCommittee(committeeId, (committee) => ({
      ...committee,
      details: committee.details.filter((_, index) => index !== detailIndex),
    }));
  };

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
            <div className="flex items-start gap-3 mb-3">
              {isAdmin ? (
                <Input
                  value={committee.emoji}
                  onChange={(e) =>
                    updateCommittee(committee.id, (current) => ({
                      ...current,
                      emoji: e.target.value,
                    }))
                  }
                  className="h-9 w-16 text-sm text-center"
                  placeholder="Emoji"
                />
              ) : (
                <div className="text-lg leading-none pt-1">
                  {committee.emoji}
                </div>
              )}

              <div className="flex-1">
                {isAdmin ? (
                  <Input
                    value={committee.name}
                    onChange={(e) =>
                      updateCommittee(committee.id, (current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    className="h-9 text-sm font-semibold"
                  />
                ) : (
                  <h3 className="font-bold text-foreground text-base mb-1">
                    {committee.name}
                  </h3>
                )}
              </div>
            </div>

            {isAdmin ? (
              <Textarea
                value={committee.description}
                onChange={(e) =>
                  updateCommittee(committee.id, (current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="text-sm leading-relaxed mb-4 min-h-20"
              />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {committee.description}
              </p>
            )}

            <div className="space-y-2">
              {committee.details.map((detail, detailIndex) => (
                <div
                  key={`${committee.id}-${detailIndex}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center"
                >
                  {isAdmin ? (
                    <Input
                      value={detail.label}
                      onChange={(e) =>
                        updateDetail(
                          committee.id,
                          detailIndex,
                          "label",
                          e.target.value,
                        )
                      }
                      className="h-8 text-xs"
                      placeholder="Label"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {detail.label}
                    </span>
                  )}

                  {isAdmin ? (
                    <Input
                      value={detail.value}
                      onChange={(e) =>
                        updateDetail(
                          committee.id,
                          detailIndex,
                          "value",
                          e.target.value,
                        )
                      }
                      className="h-8 text-xs"
                      placeholder="Value"
                    />
                  ) : (
                    <span className="font-semibold text-foreground text-sm sm:text-right">
                      {detail.value}
                    </span>
                  )}

                  {isAdmin ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive justify-self-start sm:justify-self-end"
                      onClick={() => removeDetail(committee.id, detailIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>

            {isAdmin && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-4"
                onClick={() => addDetail(committee.id)}
              >
                <Plus className="h-4 w-4" />
                Add detail
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
