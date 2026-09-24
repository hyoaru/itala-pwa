import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

import { Category } from "@/domain/entities";
import { TransactionType } from "@/domain/value-objects";
import { HttpCategoryRepository } from "./implementation";
import {
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
} from "@/application/ports/category-repository";

describe("HttpCategoryRepository", () => {
  it("creates a category and returns its ID", async () => {
    const httpClient = { post: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.post).mockResolvedValue({
      data: {
        id: "category-123",
      },
    });

    const repository = new HttpCategoryRepository(httpClient);
    const result = await repository.create("Food", TransactionType.Expense);

    expect(result).toBe("category-123");

    expect(httpClient.post).toHaveBeenCalledWith("/categories", {
      name: "Food",
      transaction_type: "EXPENSE",
    });
  });

  it("throws a CategoryAlreadyExistsError when the category already exists", async () => {
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

    const repository = new HttpCategoryRepository(httpClient);
    const promise = repository.create("Food", TransactionType.Expense);
    await expect(promise).rejects.toBeInstanceOf(CategoryAlreadyExistsError);
  });

  it("finds a category by ID and maps it to a domain entity", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        id: "category-123",
        name: "Food",
        transaction_type: "EXPENSE",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-02T00:00:00.000Z",
      },
    });

    const repository = new HttpCategoryRepository(httpClient);
    const result = await repository.findOne("category-123");

    expect(httpClient.get).toHaveBeenCalledWith("/categories/category-123");
    expect(result).toBeInstanceOf(Category);
    expect(result.id).toBe("category-123");
    expect(result.name).toBe("Food");
    expect(result.transactionType).toBe(TransactionType.Expense);
    expect(result.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(result.updatedAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
  });

  it("throws a CategoryNotFoundError when the category does not exist", async () => {
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

    const repository = new HttpCategoryRepository(httpClient);
    const promise = repository.findOne("category-123");
    await expect(promise).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("finds categories and maps the page", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        items: [
          {
            id: "category-123",
            name: "Food",
            transaction_type: "EXPENSE",
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-02T00:00:00.000Z",
          },
        ],
        next_cursor: "cursor-456",
      },
    });

    const repository = new HttpCategoryRepository(httpClient);
    const result = await repository.find();

    expect(httpClient.get).toHaveBeenCalledWith("/categories", { params: {} });
    expect(result.nextCursor).toBe("cursor-456");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toBeInstanceOf(Category);
    expect(result.items[0].id).toBe("category-123");
    expect(result.items[0].transactionType).toBe(TransactionType.Expense);
  });

  it("passes query filters as request params", async () => {
    const httpClient = { get: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.get).mockResolvedValue({
      data: { items: [], next_cursor: null },
    });

    const repository = new HttpCategoryRepository(httpClient);
    await repository.find({
      name: "Food",
      transactionType: TransactionType.Income,
      cursor: "cursor-456",
    });

    expect(httpClient.get).toHaveBeenCalledWith("/categories", {
      params: {
        name: "Food",
        transaction_type: "INCOME",
        cursor: "cursor-456",
      },
    });
  });

  it("updates a category", async () => {
    const httpClient = { put: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.put).mockResolvedValue({});

    const repository = new HttpCategoryRepository(httpClient);
    await repository.update("category-123", "Groceries");

    expect(httpClient.put).toHaveBeenCalledWith("/categories/category-123", {
      name: "Groceries",
    });
  });

  it("throws a CategoryAlreadyExistsError when updating to an existing name", async () => {
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

    const repository = new HttpCategoryRepository(httpClient);
    const promise = repository.update("category-123", "Groceries");
    await expect(promise).rejects.toBeInstanceOf(CategoryAlreadyExistsError);
  });

  it("throws a CategoryNotFoundError when the category does not exist", async () => {
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

    const repository = new HttpCategoryRepository(httpClient);
    const promise = repository.update("category-123", "Groceries");
    await expect(promise).rejects.toBeInstanceOf(CategoryNotFoundError);
  });

  it("deletes a category", async () => {
    const httpClient = { delete: vi.fn() } as unknown as AxiosInstance;

    vi.mocked(httpClient.delete).mockResolvedValue({});

    const repository = new HttpCategoryRepository(httpClient);
    await repository.delete("category-123");

    expect(httpClient.delete).toHaveBeenCalledWith("/categories/category-123");
  });

  it("throws a CategoryNotFoundError when deleting a missing category", async () => {
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

    const repository = new HttpCategoryRepository(httpClient);
    const promise = repository.delete("category-123");
    await expect(promise).rejects.toBeInstanceOf(CategoryNotFoundError);
  });
});
