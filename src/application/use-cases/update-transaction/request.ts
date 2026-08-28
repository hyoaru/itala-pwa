export type UpdateTransactionRequest = {
  id: string;
  amount: string;
  accountId: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
};