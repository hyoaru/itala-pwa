import type {
  AccountPage,
  AccountQuery,
  AccountRepository,
} from "@/application/ports/account-repository";
import type { Account } from "@/domain/entities";
import { LoggingAccountRepository } from "../logging";

export class DecoratedAccountRepository implements AccountRepository {
  private inner: AccountRepository;

  public constructor(inner: AccountRepository) {
    this.inner = new LoggingAccountRepository(inner);
  }

  public async create(name: string): Promise<string> {
    return this.inner.create(name);
  }

  public async findOne(id: string): Promise<Account> {
    return this.inner.findOne(id);
  }

  public async find(query?: AccountQuery): Promise<AccountPage> {
    return this.inner.find(query);
  }

  public async update(id: string, name: string): Promise<void> {
    return this.inner.update(id, name);
  }

  public async delete(id: string): Promise<void> {
    return this.inner.delete(id);
  }
}
