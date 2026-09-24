import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

import { Account } from "@/domain/entities";
import { HttpAccountRepository } from "./implementation";
import {
  AccountAlreadyExistsError,
  AccountNotFoundError,
} from "@/application/ports/account-repository";

describe("HttpAccountRepository", () => {
  it("creates an account and returns its ID", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockResolvedValue({
      data: {
        id: "account-123",
      },
    });

    const repository = new HttpAccountRepository(httpClient);
    const result = await repository.create("Cash");

    expect(result).toBe("account-123");

    expect(httpClient.post).toHaveBeenCalledWith("/accounts", {
      name: "Cash",
    });
  });

  it("throws an AccountAlreadyExistsError when the account already exists", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
        } as AxiosResponse,
      ),
    );

    const repository = new HttpAccountRepository(httpClient);
    const promise = repository.create("Cash");
    await expect(promise).rejects.toBeInstanceOf(AccountAlreadyExistsError);
  });

  it("finds an account by ID and maps it to a domain entity", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        id: "account-123",
        name: "Cash",
        balance: "1000.00",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-02T00:00:00.000Z",
      },
    });

    const repository = new HttpAccountRepository(httpClient);
    const result = await repository.findOne("account-123");

    expect(httpClient.get).toHaveBeenCalledWith("/accounts/account-123");
    expect(result).toBeInstanceOf(Account);
    expect(result.id).toBe("account-123");
    expect(result.name).toBe("Cash");
    expect(result.balance).toBe("1000.00");
    expect(result.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(result.updatedAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
  });

  it("throws an AccountNotFoundError when the account does not exist", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 404",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 404,
        } as AxiosResponse,
      ),
    );

    const repository = new HttpAccountRepository(httpClient);
    const promise = repository.findOne("account-123");
    await expect(promise).rejects.toBeInstanceOf(AccountNotFoundError);
  });

  it("finds accounts and maps the page", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        items: [
          {
            id: "account-123",
            name: "Cash",
            balance: "1000.00",
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-02T00:00:00.000Z",
          },
        ],
        next_cursor: "cursor-456",
      },
    });

    const repository = new HttpAccountRepository(httpClient);
    const result = await repository.find();

    expect(httpClient.get).toHaveBeenCalledWith("/accounts", { params: {} });
    expect(result.nextCursor).toBe("cursor-456");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toBeInstanceOf(Account);
    expect(result.items[0].id).toBe("account-123");
    expect(result.items[0].balance).toBe("1000.00");
  });

  it("passes query filters as request params", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: { items: [], next_cursor: null },
    });

    const repository = new HttpAccountRepository(httpClient);
    await repository.find({ name: "Cash", cursor: "cursor-456" });

    expect(httpClient.get).toHaveBeenCalledWith("/accounts", {
      params: {
        name: "Cash",
        cursor: "cursor-456",
      },
    });
  });

  it("updates an account", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockResolvedValue({});

    const repository = new HttpAccountRepository(httpClient);
    await repository.update("account-123", "Wallet");

    expect(httpClient.put).toHaveBeenCalledWith("/accounts/account-123", {
      name: "Wallet",
    });
  });

  it("throws an AccountAlreadyExistsError when updating to an existing name", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
        } as AxiosResponse,
      ),
    );

    const repository = new HttpAccountRepository(httpClient);
    const promise = repository.update("account-123", "Wallet");
    await expect(promise).rejects.toBeInstanceOf(AccountAlreadyExistsError);
  });

  it("throws an AccountNotFoundError when the account does not exist", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 404",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 404,
        } as AxiosResponse,
      ),
    );

    const repository = new HttpAccountRepository(httpClient);
    const promise = repository.update("account-123", "Wallet");
    await expect(promise).rejects.toBeInstanceOf(AccountNotFoundError);
  });

  it("deletes an account", async () => {
    const httpClient = { delete: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.delete).mockResolvedValue({});

    const repository = new HttpAccountRepository(httpClient);
    await repository.delete("account-123");

    expect(httpClient.delete).toHaveBeenCalledWith("/accounts/account-123");
  });

  it("throws an AccountNotFoundError when deleting a missing account", async () => {
    const httpClient = { delete: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.delete).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 404",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 404,
        } as AxiosResponse,
      ),
    );

    const repository = new HttpAccountRepository(httpClient);
    const promise = repository.delete("account-123");
    await expect(promise).rejects.toBeInstanceOf(AccountNotFoundError);
  });
});
