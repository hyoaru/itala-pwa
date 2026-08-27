import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { CreateCategoryRequest } from "./request";
import type { CreateCategoryResponse } from "./response";

export class CreateCategory implements UseCase<
  CreateCategoryRequest,
  CreateCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    return await this.repository.create(request.name);
  }
}
