import axios, { type AxiosInstance } from "axios";
import type {
  CreateRequest,
  CreateResponse,
  FindOneResponse,
  FindRequest,
  FindResponse,
  UpdateRequest,
} from "./dto";
import type { Transaction } from "@/domain/entities";
import {
  type TransactionPage,
  type TransactionQuery,
  type TransactionRepository,
  TransactionNotFoundError,
  TransactionRepositoryError,
} from "@/application/ports/transaction-repository";
import { toTransaction, transactionTypeToServer } from "./mapper";

export class HttpTransactionRepository implements TransactionRepository {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public async create(
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
  ): Promise<string> {
    try {
      const response = await this.httpClient.post<CreateResponse>(
        "/transactions",
        {
          amount,
          account_id: accountId,
          category_id: categoryId,
          description,
          occurred_at: occurredAt.toISOString(),
        } satisfies CreateRequest,
      );

      return response.data.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new TransactionRepositoryError(
          "Cannot create transaction: account or category is archived",
          { cause: error },
        );
      }

      throw error;
    }
  }

  public async findOne(id: string): Promise<Transaction> {
    try {
      const response = await this.httpClient.get<FindOneResponse>(
        `/transactions/${id}`,
      );
      return toTransaction(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new TransactionNotFoundError(id);
      }
      throw error;
    }
  }

  public async find(query?: TransactionQuery): Promise<TransactionPage> {
    const requestParams: FindRequest = {};
    if (query?.type) {
      requestParams.type = transactionTypeToServer[query.type];
    }
    if (query?.accountId) {
      requestParams.account_id = query.accountId;
    }
    if (query?.categoryId) {
      requestParams.category_id = query.categoryId;
    }
    if (query?.from) {
      requestParams.from = query.from;
    }
    if (query?.to) {
      requestParams.to = query.to;
    }
    if (query?.cursor) {
      requestParams.cursor = query.cursor;
    }
    const response = await this.httpClient.get<FindResponse>("/transactions", {
      params: requestParams,
    });

    return {
      items: response.data.items.map(toTransaction),
      nextCursor: response.data.next_cursor,
    };
  }

  public async update(
    id: string,
    amount: string,
    accountId: string,
    categoryId: string,
    description: string,
    occurredAt: Date,
  ): Promise<void> {
    try {
      await this.httpClient.put(`/transactions/${id}`, {
        amount,
        account_id: accountId,
        category_id: categoryId,
        description,
        occurred_at: occurredAt.toISOString(),
      } satisfies UpdateRequest);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new TransactionRepositoryError(
          "Cannot update transaction: account or category is archived",
          { cause: error },
        );
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new TransactionNotFoundError(id);
      }

      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/transactions/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new TransactionNotFoundError(id);
      }

      throw error;
    }
  }
}
