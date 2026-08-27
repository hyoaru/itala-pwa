import axios, { type AxiosInstance } from "axios";
import type {
  CreateRequest,
  CreateResponse,
  FindOneResponse,
  FindRequest,
  FindResponse,
} from "./dto";
import type { Category } from "@/domain/entities";
import type { TransactionType } from "@/domain/value-objects";
import {
  categoryStatusMap,
  toCategory,
  transactionTypeToServer,
} from "./mapper";
import {
  type CategoryQuery,
  type CategoryPage,
  type CategoryRepository,
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
} from "@/application/ports/category-repository";

export class HttpCategoryRepository implements CategoryRepository {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public async create(
    name: string,
    transactionType: TransactionType,
  ): Promise<string> {
    try {
      const response = await this.httpClient.post<CreateResponse>(
        "/categories",
        {
          name,
          transaction_type: transactionTypeToServer[transactionType],
        } satisfies CreateRequest,
      );

      return response.data.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new CategoryAlreadyExistsError(name);
      }

      throw error;
    }
  }

  public async findOne(id: string): Promise<Category> {
    try {
      const response = await this.httpClient.get<FindOneResponse>(
        `/categories/${id}`,
      );
      return toCategory(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new CategoryNotFoundError(id);
      }
      throw error;
    }
  }

  public async find(query?: CategoryQuery): Promise<CategoryPage> {
    const requestParams: FindRequest = {};
    if (query?.name) {
      requestParams.name = query.name;
    }
    if (query?.transactionType) {
      requestParams.transaction_type =
        transactionTypeToServer[query.transactionType];
    }
    if (query?.status) {
      requestParams.status = categoryStatusMap[query.status];
    }
    const response = await this.httpClient.get<FindResponse>(`/categories`, {
      params: requestParams,
    });

    return {
      items: response.data.items.map(toCategory),
      nextCursor: response.data.next_cursor,
    };
  }
}
