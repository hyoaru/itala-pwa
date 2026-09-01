import { Account } from "@/domain/entities";
import type { FindItem } from "./dto";

export function toAccount(data: FindItem): Account {
  return new Account({
    id: data.id,
    name: data.name,
    balance: data.balance,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  });
}
