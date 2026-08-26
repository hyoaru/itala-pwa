import { Category } from "@/domain/entities";
import type { FindItem } from "./dto";
import { CategoryStatus, TransactionType } from "@/domain/value-objects";

export const transactionTypeFromServer: Record<string, TransactionType> = {
  INCOME: TransactionType.Income,
  EXPENSE: TransactionType.Expense,
};

export const transactionTypeToServer: Record<TransactionType, string> = {
  [TransactionType.Income]: "INCOME",
  [TransactionType.Expense]: "EXPENSE",
};

export const categoryStatusMap: Record<string, CategoryStatus> = {
  ACTIVE: CategoryStatus.Active,
  ARCHIVED: CategoryStatus.Archived,
};

export function toCategory(data: FindItem): Category {
  return new Category({
    id: data.id,
    name: data.name,
    transactionType: transactionTypeFromServer[data.transaction_type],
    status: categoryStatusMap[data.status],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  });
}
