import type { Section } from "@/components/SectionCollection";
import type { ExpenseItem } from "@/lib/budgetData";

export interface BudgetSnapshot {
  sections: Section[];
  expenses: ExpenseItem[];
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
  if (!Array.isArray(payload.sections) || !Array.isArray(payload.expenses)) {
    return null;
  }

  return {
    sections: payload.sections as Section[],
    expenses: payload.expenses as ExpenseItem[],
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };
}

export async function saveBudgetToCloud(
  snapshot: BudgetSnapshot,
): Promise<void> {
  if (!endpoint) return;

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
}
