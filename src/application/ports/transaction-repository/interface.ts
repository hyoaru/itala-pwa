import type { Transaction } from "@/domain/entities";
import type { TransactionType } from "@/domain/value-objects";

export interface TransactionQuery {
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
  cursor?: string;
}

export interface TransactionPage {
  items: Transaction[];
  nextCursor: string | null;
}

export interface TransactionRepository {
  create(
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
    idempotencyKey: string,
  ): Promise<string>;
  findOne(id: string): Promise<Transaction>;
  find(query?: TransactionQuery): Promise<TransactionPage>;
  update(
    id: string,
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
    idempotencyKey: string,
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
