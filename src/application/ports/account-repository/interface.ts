import type { Account } from "@/domain/entities";
import type { AccountStatus } from "@/domain/value-objects";

export interface AccountQuery {
  name?: string;
  status?: AccountStatus;
  cursor?: string;
}

export interface AccountPage {
  items: Account[];
  nextCursor: string | null;
}

export interface AccountRepository {
  create(name: string): Promise<string>;
  findOne(id: string): Promise<Account>;
  find(query?: AccountQuery): Promise<AccountPage>;
  update(id: string, name: string, status: AccountStatus): Promise<void>;
  archive(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
