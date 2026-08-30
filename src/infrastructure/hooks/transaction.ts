import {
  CreateTransaction,
  DeleteTransaction,
  FindTransaction,
  FindTransactions,
  UpdateTransaction,
  type CreateTransactionRequest,
  type DeleteTransactionRequest,
  type FindTransactionRequest,
  type FindTransactionsRequest,
  type UpdateTransactionRequest,
} from "@/application/use-cases";
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  DecoratedTransactionRepository,
  HttpTransactionRepository,
} from "../adapters/transaction-repository";
import { accountKeys } from "./account";
import { apiHttpClient } from "./api-client";

const baseKey = "transactions";

export const transactionKeys = {
  all: [baseKey] as const,
};

const transactionRepository = new DecoratedTransactionRepository(
  new HttpTransactionRepository(apiHttpClient),
);

const createTransaction = new CreateTransaction(transactionRepository);
const findTransaction = new FindTransaction(transactionRepository);
const findTransactions = new FindTransactions(transactionRepository);
const updateTransaction = new UpdateTransaction(transactionRepository);
const deleteTransaction = new DeleteTransaction(transactionRepository);

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
    updateTransaction: (request: UpdateTransactionRequest) =>
      mutationOptions({
        mutationKey: [...transactionKeys.all, request.id],
        mutationFn: (): ReturnType<typeof updateTransaction.execute> => {
          return updateTransaction.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: transactionKeys.all });
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    deleteTransaction: (request: DeleteTransactionRequest) =>
      mutationOptions({
        mutationKey: [...transactionKeys.all, request.id],
        mutationFn: (): ReturnType<typeof deleteTransaction.execute> => {
          return deleteTransaction.execute(request);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: transactionKeys.all });
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
  };
};
