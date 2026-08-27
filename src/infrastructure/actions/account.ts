import {
  CreateAccount,
  FindAccount,
  FindAccounts,
  type CreateAccountRequest,
  type FindAccountRequest,
  type FindAccountsRequest,
} from "@/application/use-cases";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import {
  DecoratedAccountRepository,
  HttpAccountRepository,
} from "../adapters/account-repository";

const baseKey = "accounts";

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

export const accountActions = {
  createAccount: () =>
    mutationOptions({
      mutationKey: [baseKey, "create"],
      mutationFn: (
        request: CreateAccountRequest,
      ): ReturnType<typeof createAccount.execute> => {
        return createAccount.execute(request);
      },
    }),
  findAccount: (request: FindAccountRequest) =>
    queryOptions({
      queryKey: [baseKey, "find_one", request.id],
      queryFn: (): ReturnType<typeof findAccount.execute> => {
        return findAccount.execute(request);
      },
    }),
  findAccounts: (request?: FindAccountsRequest) =>
    queryOptions({
      queryKey: [baseKey, "find", request],
      queryFn: (): ReturnType<typeof findAccounts.execute> => {
        return findAccounts.execute(request);
      },
    }),
};
