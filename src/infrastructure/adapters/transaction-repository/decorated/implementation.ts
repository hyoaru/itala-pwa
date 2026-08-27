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
  ): Promise<string> {
    return this.inner.create(
      amount,
      accountId,
      categoryId,
      description,
      occurredAt,
    );
  }

  public async findOne(id: string): Promise<Transaction> {
    return this.inner.findOne(id);
  }

  public async find(query?: TransactionQuery): Promise<TransactionPage> {
    return this.inner.find(query);
  }
}
