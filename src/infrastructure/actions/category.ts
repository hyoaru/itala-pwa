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

export const categoryActions = {
  createCategory: () =>
    mutationOptions({
      mutationKey: [baseKey, "create"],
      mutationFn: (
        request: CreateCategoryRequest,
      ): ReturnType<InstanceType<typeof CreateCategory>["execute"]> => {
        return new CreateCategory(categoryRepository, {
          name: request.name,
        }).execute();
      },
    }),
  findCategory: (request: FindCategoryRequest) =>
    queryOptions({
      queryKey: [baseKey, "find_one", request.id],
      queryFn: (): ReturnType<InstanceType<typeof FindCategory>["execute"]> => {
        return new FindCategory(categoryRepository, {
          id: request.id,
        }).execute();
      },
    }),
  findCategories: (request?: FindCategoriesRequest) =>
    queryOptions({
      queryKey: [baseKey, "find", request],
      queryFn: (): ReturnType<
        InstanceType<typeof FindCategories>["execute"]
      > => {
        return new FindCategories(categoryRepository, request).execute();
      },
    }),
};
