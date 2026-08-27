import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { FindAccountRequest } from "./request";
import type { FindAccountResponse } from "./response";

export class FindAccount implements UseCase<
  FindAccountRequest,
  FindAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: FindAccountRequest,
  ): Promise<FindAccountResponse> {
    return await this.repository.findOne(request.id);
  }
}
