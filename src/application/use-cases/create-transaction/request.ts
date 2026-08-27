export type CreateTransactionRequest = {
  amount: string;
  accountId: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
};
