import {
  CreateAccount,
  FindAccount,
  FindAccounts,
  type CreateAccountRequest,
  type FindAccountRequest,
  type FindAccountsRequest,
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
  };
};
