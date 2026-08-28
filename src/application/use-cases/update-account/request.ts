import type { AccountStatus } from "@/domain/value-objects";

export type UpdateAccountRequest = {
  id: string;
  name: string;
  status: AccountStatus;
};