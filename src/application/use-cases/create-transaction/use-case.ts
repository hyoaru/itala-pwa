import type { TransactionRepository } from "@/application/ports/transaction-repository";
import type { UseCase } from "../interface";
import type { CreateTransactionRequest } from "./request";
import type { CreateTransactionResponse } from "./response";

export class CreateTransaction implements UseCase<
  CreateTransactionRequest,
  CreateTransactionResponse
> {
  private repository: TransactionRepository;

  public constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  public async execute(
    request: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    return await this.repository.create(
      request.amount,
      request.accountId,
      request.categoryId,
      request.description,
      request.occurredAt,
    );
  }
}
