export const TransactionType = {
  Income: "income",
  Expense: "expense",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
