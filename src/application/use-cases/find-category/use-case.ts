import type { CategoryRepository } from "@/application/ports/category-repository";
import type { UseCase } from "../interface";
import type { FindCategoryRequest } from "./request";
import type { FindCategoryResponse } from "./response";

export class FindCategory implements UseCase<
  FindCategoryRequest,
  FindCategoryResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request: FindCategoryRequest,
  ): Promise<FindCategoryResponse> {
    return await this.repository.findOne(request.id);
  }
}
