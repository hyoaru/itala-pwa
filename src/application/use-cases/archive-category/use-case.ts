import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { ArchiveCategoryRequest } from "./request";
import type { ArchiveCategoryResponse } from "./response";

export class ArchiveCategory implements UseCase<
  ArchiveCategoryRequest,
  ArchiveCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: ArchiveCategoryRequest,
  ): Promise<ArchiveCategoryResponse> {
    return await this.repository.archive(request.id);
  }
}