import type {
  ArchiveCategoryRequest,
  ArchiveCategoryResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  FindCategoriesRequest,
  FindCategoryRequest,
  FindCategoryResponse,
  RestoreCategoryRequest,
  RestoreCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "@/application/use-cases";
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { container } from "../container";

const baseKey = "categories";

export const useCategoryActions = () => {
  const queryClient = useQueryClient();
  return {
    createCategory: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: CreateCategoryRequest,
        ): Promise<CreateCategoryResponse> => {
          return container.category.create.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    findCategory: (request: FindCategoryRequest) =>
      queryOptions({
        queryKey: [baseKey, request.id],
        queryFn: (): Promise<FindCategoryResponse> => {
          return container.category.findOne.execute(request);
        },
      }),
    findCategoriesInfinite: (request?: FindCategoriesRequest) =>
      infiniteQueryOptions({
        queryKey: [baseKey, request],
        queryFn: ({ pageParam }) =>
          container.category.find.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    updateCategory: (request: UpdateCategoryRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<UpdateCategoryResponse> => {
          return container.category.update.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    archiveCategory: (request: ArchiveCategoryRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<ArchiveCategoryResponse> => {
          return container.category.archive.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    restoreCategory: (request: RestoreCategoryRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<RestoreCategoryResponse> => {
          return container.category.restore.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
  };
};
