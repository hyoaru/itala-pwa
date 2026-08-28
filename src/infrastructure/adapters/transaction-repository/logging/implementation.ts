import {
  type TransactionPage,
  type TransactionQuery,
  type TransactionRepository,
  TransactionRepositoryError,
} from "@/application/ports/transaction-repository";
import type { Transaction } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingTransactionRepository implements TransactionRepository {
  private inner: TransactionRepository;

  public constructor(inner: TransactionRepository) {
    this.inner = inner;
  }

  private logFailure(
    message: string,
    extra: object | undefined,
    error: unknown,
  ): void {
    const isExpected =
      error instanceof TransactionRepositoryError &&
      error.constructor !== TransactionRepositoryError;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullMessage = `${message}: ${errorMessage}`;
    if (isExpected) {
      logger.warn(fullMessage, extra);
    } else {
      logger.error(fullMessage, extra);
    }
  }

  public async create(
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
  ): Promise<string> {
    try {
      logger.debug("Creating transaction", { accountId, categoryId });
      const result = await this.inner.create(
        amount,
        accountId,
        categoryId,
        description,
        occurredAt,
      );
      logger.info("Transaction created", { accountId, categoryId });
      return result;
    } catch (error) {
      this.logFailure(
        "Failed to create transaction",
        { accountId, categoryId },
        error,
      );
      throw error;
    }
  }

  public async findOne(id: string): Promise<Transaction> {
    try {
      logger.debug("Finding transaction", { id });
      const result = await this.inner.findOne(id);
      logger.info("Transaction found", { id });
      return result;
    } catch (error) {
      this.logFailure("Failed to find transaction", { id }, error);
      throw error;
    }
  }

  public async find(query?: TransactionQuery): Promise<TransactionPage> {
    try {
      logger.debug("Finding transactions", { query });
      const result = await this.inner.find(query);
      logger.info("Transactions found", { query });
      return result;
    } catch (error) {
      this.logFailure("Failed to find transactions", { query }, error);
      throw error;
    }
  }

  public async update(
    id: string,
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
  ): Promise<void> {
    try {
      logger.debug("Updating transaction", { id, accountId, categoryId });
      await this.inner.update(
        id,
        amount,
        accountId,
        categoryId,
        description,
        occurredAt,
      );
      logger.info("Transaction updated", { id, accountId, categoryId });
    } catch (error) {
      this.logFailure(
        "Failed to update transaction",
        { id, accountId, categoryId },
        error,
      );
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      logger.debug("Deleting transaction", { id });
      await this.inner.delete(id);
      logger.info("Transaction deleted", { id });
    } catch (error) {
      this.logFailure("Failed to delete transaction", { id }, error);
      throw error;
    }
  }
}
