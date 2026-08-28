import {
  ArchiveCategory,
  CreateCategory,
  FindCategories,
  FindCategory,
  RestoreCategory,
  UpdateCategory,
  type ArchiveCategoryRequest,
  type CreateCategoryRequest,
  type FindCategoriesRequest,
  type FindCategoryRequest,
  type RestoreCategoryRequest,
  type UpdateCategoryRequest,
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
const updateCategory = new UpdateCategory(categoryRepository);
const archiveCategory = new ArchiveCategory(categoryRepository);
const restoreCategory = new RestoreCategory(categoryRepository);

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
    updateCategory: (request: UpdateCategoryRequest) =>
      mutationOptions({
        mutationKey: [...categoryKeys.all, request.id],
        mutationFn: (): ReturnType<typeof updateCategory.execute> => {
          return updateCategory.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
      }),
    archiveCategory: (request: ArchiveCategoryRequest) =>
      mutationOptions({
        mutationKey: [...categoryKeys.all, request.id],
        mutationFn: (): ReturnType<typeof archiveCategory.execute> => {
          return archiveCategory.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
      }),
    restoreCategory: (request: RestoreCategoryRequest) =>
      mutationOptions({
        mutationKey: [...categoryKeys.all, request.id],
        mutationFn: (): ReturnType<typeof restoreCategory.execute> => {
          return restoreCategory.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
      }),
  };
};
