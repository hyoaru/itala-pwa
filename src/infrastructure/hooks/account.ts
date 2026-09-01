import type {
  CreateAccountRequest,
  CreateAccountResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
  FindAccountRequest,
  FindAccountResponse,
  FindAccountsRequest,
  UpdateAccountRequest,
  UpdateAccountResponse,
} from "@/application/use-cases";
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { container } from "../container";

export const baseKey = "accounts";

export const useAccountActions = () => {
  const queryClient = useQueryClient();
  return {
    createAccount: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: CreateAccountRequest,
        ): Promise<CreateAccountResponse> => {
          return container.account.create.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    findAccount: (request: FindAccountRequest) =>
      queryOptions({
        queryKey: [baseKey, request.id],
        queryFn: (): Promise<FindAccountResponse> => {
          return container.account.findOne.execute(request);
        },
      }),
    findAccountsInfinite: (request?: FindAccountsRequest) =>
      infiniteQueryOptions({
        queryKey: [baseKey, request],
        queryFn: ({ pageParam }) =>
          container.account.find.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    updateAccount: () =>
      mutationOptions({
        mutationFn: (
          request: UpdateAccountRequest,
        ): Promise<UpdateAccountResponse> => {
          return container.account.update.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    deleteAccount: () =>
      mutationOptions({
        mutationFn: (
          request: DeleteAccountRequest,
        ): Promise<DeleteAccountResponse> => {
          return container.account.delete.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
  };
};
