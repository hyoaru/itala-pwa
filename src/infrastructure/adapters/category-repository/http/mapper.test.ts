import { describe, expect, it } from "vitest";

import { Category } from "@/domain/entities";
import { TransactionType } from "@/domain/value-objects";
import {
  toCategory,
  transactionTypeFromServer,
  transactionTypeToServer,
} from "./mapper";

describe("category repository http mapper", () => {
  it("maps a server item to a Category entity", () => {
    const category = toCategory({
      id: "category-123",
      name: "Food",
      transaction_type: "EXPENSE",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-02T00:00:00.000Z",
    });

    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBe("category-123");
    expect(category.name).toBe("Food");
    expect(category.transactionType).toBe(TransactionType.Expense);
    expect(category.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(category.updatedAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
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
