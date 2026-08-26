import type { CategoryRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { FindCategoriesRequest } from "./request";
import type { FindCategoriesResponse } from "./response";

export class FindCategories implements UseCase<FindCategoriesResponse> {
  private request?: FindCategoriesRequest;
  private repository: CategoryRepository;

  public constructor(
    repository: CategoryRepository,
    request?: FindCategoriesRequest,
  ) {
    this.request = request;
    this.repository = repository;
  }

  public async execute(): Promise<FindCategoriesResponse> {
    return await this.repository.find(this.request);
  }
}