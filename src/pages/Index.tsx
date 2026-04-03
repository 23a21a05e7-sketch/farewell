import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import ReportDownload from "@/components/ReportDownload";
import ExpenseTable from "@/components/ExpenseTable";
import BudgetChart from "@/components/BudgetChart";
import BalanceSummary from "@/components/BalanceSummary";
import CommitteeCards from "@/components/CommitteeCards";
import SectionCollection, {
  type Section,
} from "@/components/SectionCollection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";
import {
  defaultExpenses,
  defaultCommittees,
  getTotalExpense,
  formatINR,
  type Committee,
  type ExpenseItem,
} from "@/lib/budgetData";
import {
  isCloudStorageEnabled,
  loadBudgetFromCloud,
  saveBudgetToCloud,
} from "@/lib/remoteStorage";

const STORAGE_KEY_SECTIONS = "farewell_sections";
const STORAGE_KEY_EXPENSES = "farewell_expenses";
const STORAGE_KEY_COMMITTEES = "farewell_committees";

function loadSections(): Section[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECTIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors and return default
  }
  return [
    { id: "cse-a", name: "CSE-A", amount: 0 },
    { id: "cse-b", name: "CSE-B", amount: 0 },
    { id: "cse-c", name: "CSE-C", amount: 0 },
    { id: "cse-d", name: "CSE-D", amount: 0 },
    { id: "cse-e", name: "CSE-E", amount: 0 },
  ];
}

function loadExpenses(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors and return default
  }
  return defaultExpenses;
}

function loadCommittees(): Committee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMITTEES);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors and return default
  }
  return defaultCommittees;
}

export default function Index() {
  const [items, setItems] = useState<ExpenseItem[]>(loadExpenses);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState<Section[]>(loadSections);
  const [committeeItems, setCommitteeItems] =
    useState<Committee[]>(loadCommittees);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveSnapshot = async (snapshot: {
    sections: Section[];
    expenses: ExpenseItem[];
    committees: Committee[];
  }) => {
    localStorage.setItem(
      STORAGE_KEY_SECTIONS,
      JSON.stringify(snapshot.sections),
    );
    localStorage.setItem(
      STORAGE_KEY_EXPENSES,
      JSON.stringify(snapshot.expenses),
    );
    localStorage.setItem(
      STORAGE_KEY_COMMITTEES,
      JSON.stringify(snapshot.committees),
    );

    await saveBudgetToCloud({
      ...snapshot,
      updatedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (!isCloudStorageEnabled()) return;

    let cancelled = false;

    const syncFromCloud = async () => {
      try {
        const cloudData = await loadBudgetFromCloud();
        if (cancelled) return;

        const localSections = loadSections();
        const localExpenses = loadExpenses();
        const localCommittees = loadCommittees();

        if (!cloudData) {
          await saveBudgetToCloud({
            sections: localSections,
            expenses: localExpenses,
            committees: localCommittees,
            updatedAt: new Date().toISOString(),
          });
          return;
        }

        const hasCloudSections = cloudData.sections.length > 0;
        const hasCloudExpenses = cloudData.expenses.length > 0;
        const hasCloudCommittees = cloudData.committees.length > 0;

        if (!hasCloudSections && !hasCloudExpenses && !hasCloudCommittees) {
          await saveBudgetToCloud({
            sections: localSections,
            expenses: localExpenses,
            committees: localCommittees,
            updatedAt: new Date().toISOString(),
          });
          return;
        }

        if (hasCloudSections) {
          setSections(cloudData.sections);
        }

        if (hasCloudExpenses) {
          setItems(cloudData.expenses);
        }

        if (hasCloudCommittees) {
          setCommitteeItems(cloudData.committees);
        }

        setHasChanges(false);
      } catch {
        toast.error("Cloud sync failed. Using local data.");
      }
    };

    void syncFromCloud();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isCloudStorageEnabled() || !isAdmin || !hasChanges) return;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          await saveSnapshot({
            sections,
            expenses: items,
            committees: committeeItems,
          });
          setHasChanges(false);
          toast.success("Auto-saved to cloud. ✅");
        } catch {
          toast.error("Auto-save failed. You can try Submit again.");
        }
      })();
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [sections, items, committeeItems, isAdmin, hasChanges]);

  const handleAmountChange = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item)),
    );
    setHasChanges(true);
  };

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections);
    setHasChanges(true);
  };

  const handleCommitteesChange = (newCommittees: Committee[]) => {
    setCommitteeItems(newCommittees);
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await saveSnapshot({
        sections,
        expenses: items,
        committees: committeeItems,
      });

      setHasChanges(false);
      if (isCloudStorageEnabled()) {
        toast.success("Saved to cloud and local browser storage. ✅");
      } else {
        toast.success("Saved in browser storage. ✅");
      }
    } catch {
      setHasChanges(false);
      toast.error("Saved locally, but cloud save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCollected = sections.reduce((sum, s) => sum + s.amount, 0);
  const totalExpense = getTotalExpense(items);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-card/70">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🎓 Farewell Budget Tracker
          </h1>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <ReportDownload
                sections={sections}
                expenses={items}
                committees={committeeItems}
                totalCollected={totalCollected}
                totalExpense={totalExpense}
              />
              <AdminLogin
                isAdmin={isAdmin}
                onLogin={() => setIsAdmin(true)}
                onLogout={() => setIsAdmin(false)}
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* CSE Sections Collection */}
        <SectionCollection
          sections={sections}
          isAdmin={isAdmin}
          onSectionsChange={handleSectionsChange}
        />

        {/* Total Collection */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 card-glow text-center animate-slide-up">
          <h2 className="text-lg font-bold text-foreground flex items-center justify-start gap-2 mb-4">
            💰 Total collection
          </h2>
          <p className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono">
            ₹ {formatINR(totalCollected)}
          </p>
        </div>

        {/* Expenses + Chart */}
        <div
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 card-glow animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
            💸 Expenses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseTable
              items={items}
              isAdmin={isAdmin}
              onAmountChange={handleAmountChange}
            />
            <BudgetChart items={items} />
          </div>
        </div>

        {/* Admin Submit Button */}
        {isAdmin && (
          <div className="flex justify-center animate-slide-up">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full max-w-md h-12 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting
                ? "Saving..."
                : hasChanges
                  ? "Submit & Save Changes"
                  : "All Changes Saved ✓"}
            </Button>
          </div>
        )}

        {/* Balance Summary */}
        <BalanceSummary
          totalCollected={totalCollected}
          totalExpense={totalExpense}
        />

        {/* Committees */}
        <CommitteeCards
          committees={committeeItems}
          isAdmin={isAdmin}
          onCommitteesChange={handleCommitteesChange}
        />

        {/* Admin Login (when not admin) */}
        {!isAdmin && (
          <AdminLogin
            isAdmin={isAdmin}
            onLogin={() => setIsAdmin(true)}
            onLogout={() => setIsAdmin(false)}
          />
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for the farewell committee
          </p>
        </div>
      </main>
    </div>
  );
}
