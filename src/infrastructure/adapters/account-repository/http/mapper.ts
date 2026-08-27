import { Account } from "@/domain/entities";
import type { FindItem } from "./dto";
import { AccountStatus } from "@/domain/value-objects";

export const statusFromServer: Record<string, AccountStatus> = {
  ACTIVE: AccountStatus.Active,
  ARCHIVED: AccountStatus.Archived,
};

export const statusToServer: Record<AccountStatus, string> = {
  [AccountStatus.Active]: "ACTIVE",
  [AccountStatus.Archived]: "ARCHIVED",
};

export function toAccount(data: FindItem): Account {
  return new Account({
    id: data.id,
    name: data.name,
    balance: data.balance,
    status: statusFromServer[data.status],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  });
}
