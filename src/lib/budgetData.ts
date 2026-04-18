export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  colorKey: string;
}

export interface Committee {
  id: string;
  emoji: string;
  name: string;
  description: string;
  details: { label: string; value: string }[];
}

export const defaultExpenses: ExpenseItem[] = [
  { id: "1", name: "Stage Decoration", amount: 20000, colorKey: "stage" },
  { id: "2", name: "Food & Catering", amount: 60000, colorKey: "food" },
  { id: "3", name: "Gifts", amount: 15000, colorKey: "gifts" },
  { id: "4", name: "DJ / Sound", amount: 10000, colorKey: "dj" },
  { id: "5", name: "Camera", amount: 5000, colorKey: "misc" },
];

export const totalCollected = 124000;

export const defaultCommittees: Committee[] = [
  {
    id: "stage",
    emoji: "🎤",
    name: "Stage committee",
    description:
      "Decoration, mic & sound setup, backdrop, lighting, stage props management.",
    details: [
      { label: "Budget", value: "₹20,000" },
      { label: "Members", value: "8 students" },
      { label: "Lead", value: "Rahul K." },
      { label: "Status", value: "On track" },
    ],
  },
  {
    id: "food",
    emoji: "🍽️",
    name: "Food committee",
    description:
      "Menu planning, catering vendor, serving arrangements and post-event cleanup.",
    details: [
      { label: "Budget", value: "₹60,000" },
      { label: "Members", value: "12 students" },
      { label: "Lead", value: "Priya S." },
      { label: "Status", value: "Vendor booked" },
    ],
  },
  {
    id: "invitation",
    emoji: "📩",
    name: "Invitation committee",
    description:
      "Designs & sends invites to faculty, alumni, guests. Tracks RSVPs.",
    details: [
      { label: "Invites sent", value: "84 / 100" },
      { label: "RSVPs", value: "61 confirmed" },
      { label: "Lead", value: "Sneha M." },
      { label: "Status", value: "In progress" },
    ],
  },
  {
    id: "guest",
    emoji: "🙏",
    name: "Guest receiving",
    description:
      "Welcomes guests, registration desk, name badges and gift distribution.",
    details: [
      { label: "Gifts budget", value: "₹15,000" },
      { label: "Badges ready", value: "61 / 100" },
      { label: "Lead", value: "Arun V." },
      { label: "Status", value: "Ready" },
    ],
  },
  {
    id: "program",
    emoji: "📅",
    name: "Program schedule",
    description:
      "Event timeline, MC & anchoring coordination, inter-committee management.",
    details: [
      { label: "Total slots", value: "12 items" },
      { label: "Confirmed", value: "9 / 12" },
      { label: "Lead", value: "Divya R." },
      { label: "Status", value: "Finalising" },
    ],
  },
];

export const committees: Committee[] = defaultCommittees;

export function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN");
}

export function getTotalExpense(items: ExpenseItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}
