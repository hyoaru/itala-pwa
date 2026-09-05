import { queryOptions } from "@tanstack/react-query";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  DecoratedAccountRepository,
  HttpAccountRepository,
} from "./adapters/account-repository";
import {
  CreateAccount,
  CreateCategory,
  CreateTransaction,
  DeleteAccount,
  DeleteCategory,
  DeleteTransaction,
  FindAccount,
  FindAccounts,
  FindCategories,
  FindCategory,
  FindTransaction,
  FindTransactions,
  RefreshSession,
  ResetPassword,
  SendAccountVerification,
  SendPasswordReset,
  SignIn,
  SignOut,
  SignUp,
  UpdateAccount,
  UpdateCategory,
  UpdateTransaction,
  VerifyAccount,
} from "@/application/use-cases";
import {
  DecoratedCategoryRepository,
  HttpCategoryRepository,
} from "./adapters/category-repository";
import {
  DecoratedTransactionRepository,
  HttpTransactionRepository,
} from "./adapters/transaction-repository";
import {
  CognitoIdentityProvider,
  DecoratedIdentityProvider,
} from "./adapters/identity-provider";
import { sessionEvents } from "./events/session";

// Identity
const identityProvider = new DecoratedIdentityProvider(
  new CognitoIdentityProvider(),
);

const signIn = new SignIn(identityProvider);
const signOut = new SignOut(identityProvider);
const refreshSession = new RefreshSession(identityProvider);
const signUp = new SignUp(identityProvider);
const verifyAccount = new VerifyAccount(identityProvider);
const sendAccountVerification = new SendAccountVerification(identityProvider);
const sendPasswordReset = new SendPasswordReset(identityProvider);
const resetPassword = new ResetPassword(identityProvider);

// API Client
const apiHttpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiHttpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

apiHttpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401) throw error;
    if (originalRequest._retry) throw error;
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    if (!refreshToken) throw error;

    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = refreshSession
        .execute({ refreshToken })
        .then((session) => {
          localStorage.setItem("ACCESS_TOKEN", session.accessToken);
          localStorage.setItem("ID_TOKEN", session.idToken);
          localStorage.setItem("REFRESH_TOKEN", session.refreshToken);
          sessionEvents.emit("refreshed", session);
        })
        .catch(() => {
          localStorage.removeItem("ACCESS_TOKEN");
          localStorage.removeItem("ID_TOKEN");
          localStorage.removeItem("REFRESH_TOKEN");
          sessionEvents.emit("expired");
        })
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
    }

    await refreshPromise;
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken) {
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    }

    return apiHttpClient(originalRequest);
  },
);

// Account
const accountRepository = new DecoratedAccountRepository(
  new HttpAccountRepository(apiHttpClient),
);
const createAccount = new CreateAccount(accountRepository);
const findAccounts = new FindAccounts(accountRepository);
const findOneAccount = new FindAccount(accountRepository);
const updateAccount = new UpdateAccount(accountRepository);
const deleteAccount = new DeleteAccount(accountRepository);

// Category
const categoryRepository = new DecoratedCategoryRepository(
  new HttpCategoryRepository(apiHttpClient),
);
const createCategory = new CreateCategory(categoryRepository);
const findOneCategory = new FindCategory(categoryRepository);
const findCategories = new FindCategories(categoryRepository);
const updateCategory = new UpdateCategory(categoryRepository);
const deleteCategory = new DeleteCategory(categoryRepository);

// Transaction
const transactionRepository = new DecoratedTransactionRepository(
  new HttpTransactionRepository(apiHttpClient),
);

const createTransaction = new CreateTransaction(transactionRepository);
const findOneTransaction = new FindTransaction(transactionRepository);
const findTransactions = new FindTransactions(transactionRepository);
const updateTransaction = new UpdateTransaction(transactionRepository);
const deleteTransaction = new DeleteTransaction(transactionRepository);

// Version
const getVersion = () =>
  queryOptions({
    queryKey: ["version"],
    queryFn: async () => {
      const { data } = await apiHttpClient.get<{ version: string }>(
        "/version",
      );
      return data.version;
    },
  });

export const container = {
  identity: {
    signIn: signIn,
    signOut: signOut,
    refresh: refreshSession,
    signUp: signUp,
    verifyAccount: verifyAccount,
    sendAccountVerification: sendAccountVerification,
    sendPasswordReset: sendPasswordReset,
    resetPassword: resetPassword,
  },
  account: {
    create: createAccount,
    find: findAccounts,
    findOne: findOneAccount,
    update: updateAccount,
    delete: deleteAccount,
  },
  category: {
    create: createCategory,
    find: findCategories,
    findOne: findOneCategory,
    update: updateCategory,
    delete: deleteCategory,
  },
  transaction: {
    create: createTransaction,
    find: findTransactions,
    findOne: findOneTransaction,
    update: updateTransaction,
    delete: deleteTransaction,
  },
  version: {
    get: getVersion,
  },
};
