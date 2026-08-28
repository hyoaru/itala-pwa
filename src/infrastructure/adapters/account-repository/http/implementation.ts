import axios, { type AxiosInstance } from "axios";
import type {
  CreateRequest,
  CreateResponse,
  FindOneResponse,
  FindRequest,
  FindResponse,
  UpdateRequest,
} from "./dto";
import type { Account } from "@/domain/entities";
import { AccountStatus } from "@/domain/value-objects";
import {
  type AccountPage,
  type AccountQuery,
  type AccountRepository,
  AccountAlreadyExistsError,
  AccountNotFoundError,
} from "@/application/ports/account-repository";
import { toAccount, statusToServer } from "./mapper";

export class HttpAccountRepository implements AccountRepository {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public async create(name: string): Promise<string> {
    try {
      const response = await this.httpClient.post<CreateResponse>("/accounts", {
        name,
      } satisfies CreateRequest);

      return response.data.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new AccountAlreadyExistsError(name);
      }

      throw error;
    }
  }

  public async findOne(id: string): Promise<Account> {
    try {
      const response = await this.httpClient.get<FindOneResponse>(
        `/accounts/${id}`,
      );
      return toAccount(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AccountNotFoundError(id);
      }
      throw error;
    }
  }

  public async find(query?: AccountQuery): Promise<AccountPage> {
    const requestParams: FindRequest = {};
    if (query?.name) {
      requestParams.name = query.name;
    }
    if (query?.status) {
      requestParams.status = statusToServer[query.status];
    }
    if (query?.cursor) {
      requestParams.cursor = query.cursor;
    }
    const response = await this.httpClient.get<FindResponse>(`/accounts`, {
      params: requestParams,
    });

    return {
      items: response.data.items.map(toAccount),
      nextCursor: response.data.next_cursor,
    };
  }

  public async update(
    id: string,
    name: string,
    status: AccountStatus,
  ): Promise<void> {
    try {
      await this.httpClient.put(`/accounts/${id}`, {
        name,
        status: statusToServer[status],
      } satisfies UpdateRequest);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new AccountAlreadyExistsError(name);
      }
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AccountNotFoundError(id);
      }

      throw error;
    }
  }

  public async archive(id: string): Promise<void> {
    try {
      await this.httpClient.post(`/accounts/${id}/archive`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AccountNotFoundError(id);
      }

      throw error;
    }
  }

  public async restore(id: string): Promise<void> {
    try {
      await this.httpClient.post(`/accounts/${id}/restore`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new AccountNotFoundError(id);
      }

      throw error;
    }
  }
}
