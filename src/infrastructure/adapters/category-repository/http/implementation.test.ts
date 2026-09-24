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
});
