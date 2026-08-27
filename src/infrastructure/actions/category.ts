import {
  CreateCategory,
  FindCategories,
  FindCategory,
  type CreateCategoryRequest,
  type FindCategoriesRequest,
  type FindCategoryRequest,
} from "@/application/use-cases";
import {
  mutationOptions,
  infiniteQueryOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  DecoratedCategoryRepository,
  HttpCategoryRepository,
} from "../adapters/category-repository";

const baseKey = "categories";

export const categoryKeys = {
  all: [baseKey] as const,
};

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

export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  return {
    createCategory: () =>
      mutationOptions({
        mutationKey: categoryKeys.all,
        mutationFn: (
          request: CreateCategoryRequest,
        ): ReturnType<typeof createCategory.execute> => {
          return createCategory.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
      }),
    findCategory: (request: FindCategoryRequest) =>
      queryOptions({
        queryKey: [...categoryKeys.all, request.id],
        queryFn: (): ReturnType<typeof findCategory.execute> => {
          return findCategory.execute(request);
        },
      }),
    findCategoriesInfinite: (request?: FindCategoriesRequest) =>
      infiniteQueryOptions({
        queryKey: [...categoryKeys.all, request],
        queryFn: ({ pageParam }) =>
          findCategories.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
  };
};
