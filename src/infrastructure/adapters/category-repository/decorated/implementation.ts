import type {
  CategoryRepository,
  CategoryQuery,
  CategoryPage,
} from "@/application/ports/category-repository";
import type { Category } from "@/domain/entities";
import type {
  CategoryStatus,
  TransactionType,
} from "@/domain/value-objects";
import { LoggingCategoryRepository } from "../logging";

export class DecoratedCategoryRepository implements CategoryRepository {
  private inner: CategoryRepository;

  public constructor(inner: CategoryRepository) {
    this.inner = new LoggingCategoryRepository(inner);
  }

  public async create(
    name: string,
    transactionType: TransactionType,
  ): Promise<string> {
    return this.inner.create(name, transactionType);
  }

  public async findOne(id: string): Promise<Category> {
    return this.inner.findOne(id);
  }

  public async find(query?: CategoryQuery): Promise<CategoryPage> {
    return this.inner.find(query);
  }

  public async update(
    id: string,
    name: string,
    status: CategoryStatus,
  ): Promise<void> {
    return this.inner.update(id, name, status);
  }

  public async archive(id: string): Promise<void> {
    return this.inner.archive(id);
  }

  public async restore(id: string): Promise<void> {
    return this.inner.restore(id);
  }
}
