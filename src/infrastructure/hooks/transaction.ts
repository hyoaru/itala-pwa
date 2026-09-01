import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  DeleteTransactionRequest,
  DeleteTransactionResponse,
  FindTransactionRequest,
  FindTransactionResponse,
  FindTransactionsRequest,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from "@/application/use-cases";
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { container } from "../container";
import { baseKey as accountBaseKey } from "./account";

const baseKey = "transactions";

export const useTransactionActions = () => {
  const queryClient = useQueryClient();
  return {
    createTransaction: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: CreateTransactionRequest,
        ): Promise<CreateTransactionResponse> => {
          return container.transaction.create.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
          queryClient.invalidateQueries({ queryKey: [accountBaseKey] });
        },
      }),
    findTransaction: (request: FindTransactionRequest) =>
      queryOptions({
        queryKey: [baseKey, request.id],
        queryFn: (): Promise<FindTransactionResponse> => {
          return container.transaction.findOne.execute(request);
        },
      }),
    findTransactionsInfinite: (request?: FindTransactionsRequest) =>
      infiniteQueryOptions({
        queryKey: [baseKey, request],
        queryFn: ({ pageParam }) =>
          container.transaction.find.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    updateTransaction: () =>
      mutationOptions({
        mutationFn: (
          request: UpdateTransactionRequest,
        ): Promise<UpdateTransactionResponse> => {
          return container.transaction.update.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
          queryClient.invalidateQueries({ queryKey: [accountBaseKey] });
        },
      }),
    deleteTransaction: () =>
      mutationOptions({
        mutationFn: (
          request: DeleteTransactionRequest,
        ): Promise<DeleteTransactionResponse> => {
          return container.transaction.delete.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
          queryClient.invalidateQueries({ queryKey: [accountBaseKey] });
        },
      }),
  };
};
