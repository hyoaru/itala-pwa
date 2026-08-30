import {
  ArchiveAccount,
  CreateAccount,
  FindAccount,
  FindAccounts,
  RestoreAccount,
  UpdateAccount,
  type ArchiveAccountRequest,
  type CreateAccountRequest,
  type FindAccountRequest,
  type FindAccountsRequest,
  type RestoreAccountRequest,
  type UpdateAccountRequest,
} from "@/application/use-cases";
import {
  mutationOptions,
  infiniteQueryOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  DecoratedAccountRepository,
  HttpAccountRepository,
} from "../adapters/account-repository";

const baseKey = "accounts";

export const accountKeys = {
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

const accountRepository = new DecoratedAccountRepository(
  new HttpAccountRepository(httpClient),
);

const createAccount = new CreateAccount(accountRepository);
const findAccount = new FindAccount(accountRepository);
const findAccounts = new FindAccounts(accountRepository);
const updateAccount = new UpdateAccount(accountRepository);
const archiveAccount = new ArchiveAccount(accountRepository);
const restoreAccount = new RestoreAccount(accountRepository);

export const useAccountActions = () => {
  const queryClient = useQueryClient();
  return {
    createAccount: () =>
      mutationOptions({
        mutationKey: accountKeys.all,
        mutationFn: (
          request: CreateAccountRequest,
        ): ReturnType<typeof createAccount.execute> => {
          return createAccount.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    findAccount: (request: FindAccountRequest) =>
      queryOptions({
        queryKey: [...accountKeys.all, request.id],
        queryFn: (): ReturnType<typeof findAccount.execute> => {
          return findAccount.execute(request);
        },
      }),
    findAccountsInfinite: (request?: FindAccountsRequest) =>
      infiniteQueryOptions({
        queryKey: [...accountKeys.all, request],
        queryFn: ({ pageParam }) =>
          findAccounts.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    updateAccount: (request: UpdateAccountRequest) =>
      mutationOptions({
        mutationKey: [...accountKeys.all, request.id],
        mutationFn: (): ReturnType<typeof updateAccount.execute> => {
          return updateAccount.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    archiveAccount: (request: ArchiveAccountRequest) =>
      mutationOptions({
        mutationKey: [...accountKeys.all, request.id],
        mutationFn: (): ReturnType<typeof archiveAccount.execute> => {
          return archiveAccount.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    restoreAccount: (request: RestoreAccountRequest) =>
      mutationOptions({
        mutationKey: [...accountKeys.all, request.id],
        mutationFn: (): ReturnType<typeof restoreAccount.execute> => {
          return restoreAccount.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
  };
};
