import type { TransactionRepository } from "@/application/ports/transaction-repository";
import type { UseCase } from "../interface";
import type { UpdateTransactionRequest } from "./request";
import type { UpdateTransactionResponse } from "./response";

export class UpdateTransaction implements UseCase<
  UpdateTransactionRequest,
  UpdateTransactionResponse
> {
  private repository: TransactionRepository;

  public constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  public async execute(
    request: UpdateTransactionRequest,
  ): Promise<UpdateTransactionResponse> {
    return await this.repository.update(
      request.id,
      request.amount,
      request.accountId,
      request.categoryId,
      request.description,
      request.occurredAt,
      request.idempotencyKey,
    );
  }
}
