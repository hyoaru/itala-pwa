import { Transaction } from "@/domain/entities";
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

export function toTransaction(data: FindItem): Transaction {
  return new Transaction({
    id: data.id,
    amount: data.amount,
    type: transactionTypeFromServer[data.type],
    accountId: data.account_id,
    categoryId: data.category_id,
    description: data.description,
    occurredAt: new Date(data.occurred_at),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  });
}
