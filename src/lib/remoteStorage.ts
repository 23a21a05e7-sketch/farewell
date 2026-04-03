import type { Section } from "@/components/SectionCollection";
import type { ExpenseItem, Committee } from "@/lib/budgetData";

export interface BudgetSnapshot {
  sections: Section[];
  expenses: ExpenseItem[];
  committees: Committee[];
  updatedAt: string;
}

const endpoint = import.meta.env.VITE_STORAGE_ENDPOINT?.trim();
const token = import.meta.env.VITE_STORAGE_TOKEN?.trim();

function buildUrl(): string {
  if (!endpoint) {
    throw new Error("Cloud storage endpoint is not configured.");
  }

  const url = new URL(endpoint);
  if (token) {
    url.searchParams.set("token", token);
  }
  return url.toString();
}

export function isCloudStorageEnabled(): boolean {
  return Boolean(endpoint);
}

export async function loadBudgetFromCloud(): Promise<BudgetSnapshot | null> {
  if (!endpoint) return null;

  console.log("[Cloud] Loading budget snapshot from Google Apps Script...");
  const response = await fetch(buildUrl(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Cloud load failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Partial<BudgetSnapshot>;
  console.log("[Cloud] Raw budget payload received:", payload);
  if (!Array.isArray(payload.sections) || !Array.isArray(payload.expenses)) {
    console.log(
      "[Cloud] Payload is missing sections or expenses arrays, ignoring cloud data.",
    );
    return null;
  }

  const snapshot = {
    sections: payload.sections as Section[],
    expenses: payload.expenses as ExpenseItem[],
    committees: Array.isArray(payload.committees)
      ? (payload.committees as Committee[])
      : [],
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };

  console.log("[Cloud] Parsed snapshot loaded from cloud:", {
    sectionsCount: snapshot.sections.length,
    expensesCount: snapshot.expenses.length,
    committeesCount: snapshot.committees.length,
    updatedAt: snapshot.updatedAt,
  });

  return snapshot;
}

export async function saveBudgetToCloud(
  snapshot: BudgetSnapshot,
): Promise<void> {
  if (!endpoint) return;

  console.log("[Cloud] Saving budget snapshot to Google Apps Script:", {
    sectionsCount: snapshot.sections.length,
    expensesCount: snapshot.expenses.length,
    committeesCount: snapshot.committees.length,
    updatedAt: snapshot.updatedAt,
    sections: snapshot.sections,
    expenses: snapshot.expenses,
    committees: snapshot.committees,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
    body: JSON.stringify({
      token,
      ...snapshot,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cloud save failed with status ${response.status}`);
  }

  console.log("[Cloud] Save completed successfully.");
}
