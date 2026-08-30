import type {
  ArchiveAccountRequest,
  ArchiveAccountResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  FindAccountRequest,
  FindAccountResponse,
  FindAccountsRequest,
  RestoreAccountRequest,
  RestoreAccountResponse,
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
    updateAccount: (request: UpdateAccountRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<UpdateAccountResponse> => {
          return container.account.update.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    archiveAccount: (request: ArchiveAccountRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<ArchiveAccountResponse> => {
          return container.account.archive.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
    restoreAccount: (request: RestoreAccountRequest) =>
      mutationOptions({
        mutationKey: [baseKey, request.id],
        mutationFn: (): Promise<RestoreAccountResponse> => {
          return container.account.restore.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [baseKey] });
        },
      }),
  };
};
