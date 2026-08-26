import type { CategoryRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { FindCategoriesRequest } from "./request";
import type { FindCategoriesResponse } from "./response";

export class FindCategories implements UseCase<
  FindCategoriesRequest | undefined,
  FindCategoriesResponse
> {
  private repository: CategoryRepository;

  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  public async execute(
    request?: FindCategoriesRequest,
  ): Promise<FindCategoriesResponse> {
    return await this.repository.find(request);
  }
}
