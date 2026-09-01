import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { DeleteAccountRequest } from "./request";
import type { DeleteAccountResponse } from "./response";

export class DeleteAccount implements UseCase<
  DeleteAccountRequest,
  DeleteAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: DeleteAccountRequest,
  ): Promise<DeleteAccountResponse> {
    return await this.repository.delete(request.id);
  }
}
