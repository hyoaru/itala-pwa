import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { UpdateCategoryRequest } from "./request";
import type { UpdateCategoryResponse } from "./response";

export class UpdateCategory implements UseCase<
  UpdateCategoryRequest,
  UpdateCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: UpdateCategoryRequest,
  ): Promise<UpdateCategoryResponse> {
    return await this.repository.update(
      request.id,
      request.name,
      request.status,
    );
  }
}