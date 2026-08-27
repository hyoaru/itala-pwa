import type { TransactionType } from "@/domain/value-objects";

export type CreateCategoryRequest = {
  name: string;
  transactionType: TransactionType;
};
