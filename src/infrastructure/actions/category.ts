import {
  CreateCategory,
  FindCategories,
  FindCategory,
  type CreateCategoryRequest,
  type FindCategoriesRequest,
  type FindCategoryRequest,
} from "@/application/use-cases";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import {
  DecoratedCategoryRepository,
  HttpCategoryRepository,
} from "../adapters/category-repository";

const baseKey = "categories";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const categoryRepository = new DecoratedCategoryRepository(
  new HttpCategoryRepository(httpClient),
);

const createCategory = new CreateCategory(categoryRepository);
const findCategory = new FindCategory(categoryRepository);
const findCategories = new FindCategories(categoryRepository);

export const categoryActions = {
  createCategory: () =>
    mutationOptions({
      mutationKey: [baseKey, "create"],
      mutationFn: (
        request: CreateCategoryRequest,
      ): ReturnType<typeof createCategory.execute> => {
        return createCategory.execute(request);
      },
    }),
  findCategory: (request: FindCategoryRequest) =>
    queryOptions({
      queryKey: [baseKey, "find_one", request.id],
      queryFn: (): ReturnType<typeof findCategory.execute> => {
        return findCategory.execute(request);
      },
    }),
  findCategories: (request?: FindCategoriesRequest) =>
    queryOptions({
      queryKey: [baseKey, "find", request],
      queryFn: (): ReturnType<typeof findCategories.execute> => {
        return findCategories.execute(request);
      },
    }),
};
