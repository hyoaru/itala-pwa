import { describe, expect, it } from "vitest";

import { Transaction } from "@/domain/entities";
import { TransactionType } from "@/domain/value-objects";
import {
  toTransaction,
  transactionTypeFromServer,
  transactionTypeToServer,
} from "./mapper";

describe("transaction repository http mapper", () => {
  it("maps a server item to a Transaction entity", () => {
    const transaction = toTransaction({
      id: "txn-123",
      amount: "100.00",
      type: "EXPENSE",
      account_id: "account-1",
      category_id: "category-1",
      description: "Lunch",
      occurred_at: "2024-01-01T00:00:00.000Z",
      created_at: "2024-01-02T00:00:00.000Z",
      updated_at: "2024-01-03T00:00:00.000Z",
    });

    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.id).toBe("txn-123");
    expect(transaction.amount).toBe("100.00");
    expect(transaction.type).toBe(TransactionType.Expense);
    expect(transaction.accountId).toBe("account-1");
    expect(transaction.categoryId).toBe("category-1");
    expect(transaction.description).toBe("Lunch");
    expect(transaction.occurredAt).toEqual(
      new Date("2024-01-01T00:00:00.000Z"),
    );
    expect(transaction.createdAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
    expect(transaction.updatedAt).toEqual(new Date("2024-01-03T00:00:00.000Z"));
  });

  it("maps server types to domain transaction types", () => {
    expect(transactionTypeFromServer.INCOME).toBe(TransactionType.Income);
    expect(transactionTypeFromServer.EXPENSE).toBe(TransactionType.Expense);
  });

  it("maps domain transaction types to server types", () => {
    expect(transactionTypeToServer[TransactionType.Income]).toBe("INCOME");
    expect(transactionTypeToServer[TransactionType.Expense]).toBe("EXPENSE");
  });
});
