import type {
  CategoryRepository,
  CategoryQuery,
  CategoryPage,
} from "@/application/ports/category-repository";
import type { Category } from "@/domain/entities";
import { LoggingCategoryRepository } from "../logging";

export class DecoratedCategoryRepository implements CategoryRepository {
  private inner: CategoryRepository;

  public constructor(inner: CategoryRepository) {
    this.inner = new LoggingCategoryRepository(inner);
  }

  public async create(name: string): Promise<string> {
    return this.inner.create(name);
  }

  public async findOne(id: string): Promise<Category> {
    return this.inner.findOne(id);
  }

  public async find(query?: CategoryQuery): Promise<CategoryPage> {
    return this.inner.find(query);
  }
}
