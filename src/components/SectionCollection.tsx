import { useState } from "react";
import { formatINR } from "@/lib/budgetData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface Section {
  id: string;
  name: string;
  amount: number;
}

interface SectionCollectionProps {
  sections: Section[];
  isAdmin: boolean;
  onSectionsChange: (sections: Section[]) => void;
}

const SECTION_COLORS = [
  "from-primary/12 to-primary/5 border-primary/20",
  "from-accent/12 to-accent/5 border-accent/20",
  "from-chart-food/12 to-chart-food/5 border-chart-food/20",
  "from-chart-dj/12 to-chart-dj/5 border-chart-dj/20",
  "from-chart-misc/12 to-chart-misc/5 border-chart-misc/20",
];

export default function SectionCollection({
  sections,
  isAdmin,
  onSectionsChange,
}: SectionCollectionProps) {
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const total = sections.reduce((sum, s) => sum + s.amount, 0);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const section: Section = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      amount: Number(newAmount) || 0,
    };
    onSectionsChange([...sections, section]);
    setNewName("");
    setNewAmount("");
  };

  const handleRemove = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id));
  };

  const handleAmountChange = (id: string, amount: number) => {
    onSectionsChange(
      sections.map((s) => (s.id === id ? { ...s, amount } : s))
    );
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 card-glow animate-slide-up">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
        🏫 CSE Sections — Collection
      </h2>

      {sections.length === 0 && !isAdmin && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No sections added yet.
        </p>
      )}

      <div className="space-y-3">
        {sections.map((section, i) => (
          <div
            key={section.id}
            className={`flex items-center justify-between gap-3 rounded-xl border bg-gradient-to-r ${SECTION_COLORS[i % SECTION_COLORS.length]} p-3 transition-all duration-200 hover:shadow-sm`}
          >
            <span className="text-sm font-medium text-foreground truncate flex-1">
              {section.name}
            </span>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">₹</span>
                <Input
                  type="number"
                  value={section.amount || ""}
                  onChange={(e) =>
                    handleAmountChange(section.id, Number(e.target.value) || 0)
                  }
                  className="w-28 h-8 text-sm font-mono"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleRemove(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <span className="text-sm font-bold text-foreground font-mono">
                ₹{formatINR(section.amount)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Admin: Add new section */}
      {isAdmin && (
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Section name (e.g. CSE-A)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-28 h-9 text-sm font-mono"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" className="h-9 px-3" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Total */}
      {sections.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">
            Total Collected
          </span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono">
            ₹{formatINR(total)}
          </span>
        </div>
      )}
    </div>
  );
}
