import {
  CreateTransaction,
  FindTransaction,
  FindTransactions,
  type CreateTransactionRequest,
  type FindTransactionRequest,
  type FindTransactionsRequest,
} from "@/application/use-cases";
import {
  mutationOptions,
  infiniteQueryOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  DecoratedTransactionRepository,
  HttpTransactionRepository,
} from "../adapters/transaction-repository";
import { accountKeys } from "./account";

const baseKey = "transactions";

export const transactionKeys = {
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

const transactionRepository = new DecoratedTransactionRepository(
  new HttpTransactionRepository(httpClient),
);

const createTransaction = new CreateTransaction(transactionRepository);
const findTransaction = new FindTransaction(transactionRepository);
const findTransactions = new FindTransactions(transactionRepository);

export const useTransactionActions = () => {
  const queryClient = useQueryClient();
  return {
    createTransaction: () =>
      mutationOptions({
        mutationKey: transactionKeys.all,
        mutationFn: (
          request: CreateTransactionRequest,
        ): ReturnType<typeof createTransaction.execute> => {
          return createTransaction.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: transactionKeys.all });
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    findTransaction: (request: FindTransactionRequest) =>
      queryOptions({
        queryKey: [...transactionKeys.all, request.id],
        queryFn: (): ReturnType<typeof findTransaction.execute> => {
          return findTransaction.execute(request);
        },
      }),
    findTransactionsInfinite: (request?: FindTransactionsRequest) =>
      infiniteQueryOptions({
        queryKey: [...transactionKeys.all, request],
        queryFn: ({ pageParam }) =>
          findTransactions.execute({
            ...request,
            cursor: pageParam ?? undefined,
          }),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
  };
};
