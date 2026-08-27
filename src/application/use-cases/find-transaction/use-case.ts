import type { TransactionRepository } from "@/application/ports/transaction-repository";
import type { UseCase } from "../interface";
import type { FindTransactionRequest } from "./request";
import type { FindTransactionResponse } from "./response";

export class FindTransaction implements UseCase<
  FindTransactionRequest,
  FindTransactionResponse
> {
  private repository: TransactionRepository;

  public constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  public async execute(
    request: FindTransactionRequest,
  ): Promise<FindTransactionResponse> {
    return await this.repository.findOne(request.id);
  }
}
