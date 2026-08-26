import type { CategoryRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { FindCategoryRequest } from "./request";
import type { FindCategoryResponse } from "./response";

export class FindCategory implements UseCase<FindCategoryResponse> {
  private request: FindCategoryRequest;
  private repository: CategoryRepository;

  public constructor(
    repository: CategoryRepository,
    request: FindCategoryRequest,
  ) {
    this.request = request;
    this.repository = repository;
  }

  public async execute(): Promise<FindCategoryResponse> {
    return await this.repository.findOne(this.request.id);
  }
}