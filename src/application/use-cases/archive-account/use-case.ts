import type { AccountRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { ArchiveAccountRequest } from "./request";
import type { ArchiveAccountResponse } from "./response";

export class ArchiveAccount implements UseCase<
  ArchiveAccountRequest,
  ArchiveAccountResponse
> {
  private repository: AccountRepository;

  public constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  public async execute(
    request: ArchiveAccountRequest,
  ): Promise<ArchiveAccountResponse> {
    return await this.repository.archive(request.id);
  }
}