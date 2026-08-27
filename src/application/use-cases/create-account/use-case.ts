import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { CreateAccountRequest } from "./request";
import type { CreateAccountResponse } from "./response";

export class CreateAccount implements UseCase<
  CreateAccountRequest,
  CreateAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return await this.repository.create(request.name);
  }
}
