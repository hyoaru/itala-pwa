import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { UpdateAccountRequest } from "./request";
import type { UpdateAccountResponse } from "./response";

export class UpdateAccount implements UseCase<
  UpdateAccountRequest,
  UpdateAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: UpdateAccountRequest,
  ): Promise<UpdateAccountResponse> {
    return await this.repository.update(
      request.id,
      request.name,
      request.status,
    );
  }
}