import {
  AccountRepositoryError,
  type AccountPage,
  type AccountQuery,
  type AccountRepository,
} from "@/application/ports/account-repository";
import type { Account } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingAccountRepository implements AccountRepository {
  private inner: AccountRepository;

  public constructor(inner: AccountRepository) {
    this.inner = inner;
  }

  private logFailure(
    message: string,
    extra: object | undefined,
    error: unknown,
  ): void {
    const isExpected =
      error instanceof AccountRepositoryError &&
      error.constructor !== AccountRepositoryError;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullMessage = `${message}: ${errorMessage}`;
    if (isExpected) {
      logger.warn(fullMessage, extra);
    } else {
      logger.error(fullMessage, extra);
    }
  }

  public async create(name: string): Promise<string> {
    try {
      logger.debug("Creating account", { name });
      const result = await this.inner.create(name);
      logger.info("Account created", { name });
      return result;
    } catch (error) {
      this.logFailure("Failed to create account", { name }, error);
      throw error;
    }
  }

  public async findOne(id: string): Promise<Account> {
    try {
      logger.debug("Finding account", { id });
      const result = await this.inner.findOne(id);
      logger.info("Account found", { id });
      return result;
    } catch (error) {
      this.logFailure("Failed to find account", { id }, error);
      throw error;
    }
  }

  public async find(query?: AccountQuery): Promise<AccountPage> {
    try {
      logger.debug("Finding accounts", { query });
      const result = await this.inner.find(query);
      logger.info("Accounts found", { query });
      return result;
    } catch (error) {
      this.logFailure("Failed to find accounts", { query }, error);
      throw error;
    }
  }

  public async update(id: string, name: string): Promise<void> {
    try {
      logger.debug("Updating account", { id, name });
      await this.inner.update(id, name);
      logger.info("Account updated", { id, name });
    } catch (error) {
      this.logFailure("Failed to update account", { id, name }, error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      logger.debug("Deleting account", { id });
      await this.inner.delete(id);
      logger.info("Account deleted", { id });
    } catch (error) {
      this.logFailure("Failed to delete account", { id }, error);
      throw error;
    }
  }
}
