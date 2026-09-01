import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { DeleteCategoryRequest } from "./request";
import type { DeleteCategoryResponse } from "./response";

export class DeleteCategory implements UseCase<
  DeleteCategoryRequest,
  DeleteCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: DeleteCategoryRequest,
  ): Promise<DeleteCategoryResponse> {
    return await this.repository.delete(request.id);
  }
}
