import type { Category } from "@/domain/entities";
import type { TransactionType } from "@/domain/value-objects";

export interface CategoryQuery {
  name?: string;
  transactionType?: TransactionType;
  status?: string;
}

export interface CategoryPage {
  items: Category[];
  nextCursor: string | null;
}

export interface CategoryRepository {
  create(name: string, transactionType: TransactionType): Promise<string>;
  findOne(id: string): Promise<Category>;
  find(query?: CategoryQuery): Promise<CategoryPage>;
}
