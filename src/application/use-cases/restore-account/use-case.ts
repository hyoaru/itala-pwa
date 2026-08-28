import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { RestoreAccountRequest } from "./request";
import type { RestoreAccountResponse } from "./response";

export class RestoreAccount implements UseCase<
  RestoreAccountRequest,
  RestoreAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: RestoreAccountRequest,
  ): Promise<RestoreAccountResponse> {
    return await this.repository.restore(request.id);
  }
}