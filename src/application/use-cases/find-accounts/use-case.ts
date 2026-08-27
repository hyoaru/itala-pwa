import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { FindAccountsRequest } from "./request";
import type { FindAccountsResponse } from "./response";

export class FindAccounts implements UseCase<
  FindAccountsRequest | undefined,
  FindAccountsResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request?: FindAccountsRequest,
  ): Promise<FindAccountsResponse> {
    return await this.repository.find(request);
  }
}
