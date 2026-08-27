import type { TransactionRepository } from "@/application/ports/transaction-repository";
import type { UseCase } from "../interface";
import type { FindTransactionsRequest } from "./request";
import type { FindTransactionsResponse } from "./response";

export class FindTransactions implements UseCase<
  FindTransactionsRequest | undefined,
  FindTransactionsResponse
> {
  private repository: TransactionRepository;

  public constructor(repository: TransactionRepository) {
    this.repository = repository;
  }

  public async execute(
    request?: FindTransactionsRequest,
  ): Promise<FindTransactionsResponse> {
    return await this.repository.find(request);
  }
}
