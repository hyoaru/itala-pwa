import type { CategoryRepository } from "@/application/ports/account-repository";
import type { UseCase } from "../interface";
import type { CreateCategoryRequest } from "./request";
import type { CreateCategoryResponse } from "./response";

export class CreateCategory implements UseCase<CreateCategoryResponse> {
  private request: CreateCategoryRequest;
  private repository: CategoryRepository;

  public constructor(
    repository: CategoryRepository,
    request: CreateCategoryRequest,
  ) {
    this.request = request;
    this.repository = repository;
  }

  public async execute(): Promise<CreateCategoryResponse> {
    return await this.repository.create(this.request.name);
  }
}
