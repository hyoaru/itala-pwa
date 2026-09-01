import { Category } from "@/domain/entities";
import type { FindItem } from "./dto";
import { TransactionType } from "@/domain/value-objects";

export const transactionTypeFromServer: Record<string, TransactionType> = {
  INCOME: TransactionType.Income,
  EXPENSE: TransactionType.Expense,
};

export const transactionTypeToServer: Record<TransactionType, string> = {
  [TransactionType.Income]: "INCOME",
  [TransactionType.Expense]: "EXPENSE",
};

export function toCategory(data: FindItem): Category {
  return new Category({
    id: data.id,
    name: data.name,
    transactionType: transactionTypeFromServer[data.transaction_type],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  });
}
