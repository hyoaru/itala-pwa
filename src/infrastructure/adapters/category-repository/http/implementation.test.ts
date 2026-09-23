import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { describe, expect, it, vi } from "vitest";

import { TransactionType } from "@/domain/value-objects";
import { HttpCategoryRepository } from "./implementation";
import { CategoryAlreadyExistsError } from "@/application/ports/category-repository";

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
});
