import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

import { Transaction } from "@/domain/entities";
import { TransactionType } from "@/domain/value-objects";
import { HttpTransactionRepository } from "./implementation";
import {
  TransactionConflictError,
  TransactionLockedError,
  TransactionNotFoundError,
} from "@/application/ports/transaction-repository";

describe("HttpTransactionRepository", () => {
  it("creates a transaction and returns its ID", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockResolvedValue({
      data: {
        id: "txn-123",
      },
    });

    const repository = new HttpTransactionRepository(httpClient);
    const result = await repository.create(
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );

    expect(result).toBe("txn-123");

    expect(httpClient.post).toHaveBeenCalledWith(
      "/transactions",
      {
        amount: "100.00",
        account_id: "account-1",
        category_id: "category-1",
        description: "Lunch",
        occurred_at: "2024-01-01T00:00:00.000Z",
      },
      {
        headers: {
          "Idempotency-Key": "key-1",
        },
      },
    );
  });

  it("throws a TransactionLockedError when the resource is locked", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
          data: { code: "RESOURCE_LOCKED" },
        } as AxiosResponse,
      ),
    );

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.create(
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );
    await expect(promise).rejects.toBeInstanceOf(TransactionLockedError);
  });

  it("throws a TransactionConflictError when the resource conflicts", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
          data: { code: "VERSION_CONFLICT" },
        } as AxiosResponse,
      ),
    );

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.create(
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );
    await expect(promise).rejects.toBeInstanceOf(TransactionConflictError);
  });

  it("finds a transaction by ID and maps it to a domain entity", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        id: "txn-123",
        amount: "100.00",
        type: "INCOME",
        account_id: "account-1",
        category_id: "category-1",
        description: "Lunch",
        occurred_at: "2024-01-01T00:00:00.000Z",
        created_at: "2024-01-02T00:00:00.000Z",
        updated_at: "2024-01-03T00:00:00.000Z",
      },
    });

    const repository = new HttpTransactionRepository(httpClient);
    const result = await repository.findOne("txn-123");

    expect(httpClient.get).toHaveBeenCalledWith("/transactions/txn-123");
    expect(result).toBeInstanceOf(Transaction);
    expect(result.id).toBe("txn-123");
    expect(result.amount).toBe("100.00");
    expect(result.type).toBe(TransactionType.Income);
    expect(result.accountId).toBe("account-1");
    expect(result.categoryId).toBe("category-1");
    expect(result.description).toBe("Lunch");
    expect(result.occurredAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(result.createdAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
    expect(result.updatedAt).toEqual(new Date("2024-01-03T00:00:00.000Z"));
  });

  it("throws a TransactionNotFoundError when the transaction does not exist", async () => {
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

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.findOne("txn-123");
    await expect(promise).rejects.toBeInstanceOf(TransactionNotFoundError);
  });

  it("finds transactions and maps the page", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        items: [
          {
            id: "txn-123",
            amount: "100.00",
            type: "EXPENSE",
            account_id: "account-1",
            category_id: "category-1",
            description: "Lunch",
            occurred_at: "2024-01-01T00:00:00.000Z",
            created_at: "2024-01-02T00:00:00.000Z",
            updated_at: "2024-01-03T00:00:00.000Z",
          },
        ],
        next_cursor: "cursor-1",
      },
    });

    const repository = new HttpTransactionRepository(httpClient);
    const result = await repository.find();

    expect(httpClient.get).toHaveBeenCalledWith("/transactions", {
      params: {},
    });
    expect(result.nextCursor).toBe("cursor-1");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toBeInstanceOf(Transaction);
    expect(result.items[0].id).toBe("txn-123");
    expect(result.items[0].type).toBe(TransactionType.Expense);
  });

  it("passes query filters as request params", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: { items: [], next_cursor: null },
    });

    const repository = new HttpTransactionRepository(httpClient);
    await repository.find({
      type: TransactionType.Income,
      accountId: "account-1",
      categoryId: "category-1",
      from: "2024-01-01",
      to: "2024-01-31",
      cursor: "cursor-1",
    });

    expect(httpClient.get).toHaveBeenCalledWith("/transactions", {
      params: {
        type: "INCOME",
        account_id: "account-1",
        category_id: "category-1",
        from: "2024-01-01",
        to: "2024-01-31",
        cursor: "cursor-1",
      },
    });
  });

  it("updates a transaction", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockResolvedValue({});

    const repository = new HttpTransactionRepository(httpClient);
    await repository.update(
      "txn-123",
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );

    expect(httpClient.put).toHaveBeenCalledWith(
      "/transactions/txn-123",
      {
        amount: "100.00",
        account_id: "account-1",
        category_id: "category-1",
        description: "Lunch",
        occurred_at: "2024-01-01T00:00:00.000Z",
      },
      {
        headers: {
          "Idempotency-Key": "key-1",
        },
      },
    );
  });

  it("throws a TransactionLockedError when the resource is locked", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
          data: { code: "RESOURCE_LOCKED" },
        } as AxiosResponse,
      ),
    );

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.update(
      "txn-123",
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );
    await expect(promise).rejects.toBeInstanceOf(TransactionLockedError);
  });

  it("throws a TransactionConflictError when the resource conflicts", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockRejectedValue(
      new AxiosError(
        "Request failed with status code 409",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 409,
          data: { code: "VERSION_CONFLICT" },
        } as AxiosResponse,
      ),
    );

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.update(
      "txn-123",
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );
    await expect(promise).rejects.toBeInstanceOf(TransactionConflictError);
  });

  it("throws a TransactionNotFoundError when the transaction does not exist", async () => {
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

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.update(
      "txn-123",
      "100.00",
      "account-1",
      "category-1",
      "Lunch",
      new Date("2024-01-01T00:00:00.000Z"),
      "key-1",
    );
    await expect(promise).rejects.toBeInstanceOf(TransactionNotFoundError);
  });

  it("deletes a transaction", async () => {
    const httpClient = { delete: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.delete).mockResolvedValue({});

    const repository = new HttpTransactionRepository(httpClient);
    await repository.delete("txn-123");

    expect(httpClient.delete).toHaveBeenCalledWith("/transactions/txn-123");
  });

  it("throws a TransactionNotFoundError when deleting a missing transaction", async () => {
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

    const repository = new HttpTransactionRepository(httpClient);
    const promise = repository.delete("txn-123");
    await expect(promise).rejects.toBeInstanceOf(TransactionNotFoundError);
  });
});
