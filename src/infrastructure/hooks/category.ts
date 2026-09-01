import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  FindCategoriesRequest,
  FindCategoryRequest,
  FindCategoryResponse,
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
    updateCategory: () =>
      mutationOptions({
        mutationFn: (
          request: UpdateCategoryRequest,
        ): Promise<UpdateCategoryResponse> => {
          return container.category.update.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    deleteCategory: () =>
      mutationOptions({
        mutationFn: (
          request: DeleteCategoryRequest,
        ): Promise<DeleteCategoryResponse> => {
          return container.category.delete.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
  };
};
