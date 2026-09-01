import type {
  TransactionPage,
  TransactionQuery,
  TransactionRepository,
} from "@/application/ports/transaction-repository";
import type { Transaction } from "@/domain/entities";
import { LoggingTransactionRepository } from "../logging";

export class DecoratedTransactionRepository implements TransactionRepository {
  private inner: TransactionRepository;

  public constructor(inner: TransactionRepository) {
    this.inner = new LoggingTransactionRepository(inner);
  }

  public async create(
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
    idempotencyKey: string,
  ): Promise<string> {
    return this.inner.create(
      amount,
      accountId,
      categoryId,
      description,
      occurredAt,
      idempotencyKey,
    );
  }

  public async findOne(id: string): Promise<Transaction> {
    return this.inner.findOne(id);
  }

  public async find(query?: TransactionQuery): Promise<TransactionPage> {
    return this.inner.find(query);
  }

  public async update(
    id: string,
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
    idempotencyKey: string,
  ): Promise<void> {
    return this.inner.update(
      id,
      amount,
      accountId,
      categoryId,
      description,
      occurredAt,
      idempotencyKey,
    );
  }

  public async delete(id: string): Promise<void> {
    return this.inner.delete(id);
  }
}
