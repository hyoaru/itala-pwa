import type { TransactionRepository } from "@/application/ports/transaction-repository";
import type { UseCase } from "../interface";
import type { DeleteTransactionRequest } from "./request";
import type { DeleteTransactionResponse } from "./response";

export class DeleteTransaction implements UseCase<
  DeleteTransactionRequest,
  DeleteTransactionResponse
> {
  private repository: TransactionRepository;

  public constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  public async execute(
    request: DeleteTransactionRequest,
  ): Promise<DeleteTransactionResponse> {
    return await this.repository.delete(request.id);
  }
}