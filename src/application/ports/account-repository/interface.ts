import type { Account } from "@/domain/entities";

export interface AccountQuery {
  name?: string;
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
  update(id: string, name: string): Promise<void>;
  delete(id: string): Promise<void>;
}
