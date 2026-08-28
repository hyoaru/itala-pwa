import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { RestoreCategoryRequest } from "./request";
import type { RestoreCategoryResponse } from "./response";

export class RestoreCategory implements UseCase<
  RestoreCategoryRequest,
  RestoreCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: RestoreCategoryRequest,
  ): Promise<RestoreCategoryResponse> {
    return await this.repository.restore(request.id);
  }
}