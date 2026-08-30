import axios from "axios";
import {
  DecoratedAccountRepository,
  HttpAccountRepository,
} from "./adapters/account-repository";
import {
  ArchiveAccount,
  ArchiveCategory,
  CreateAccount,
  CreateCategory,
  CreateTransaction,
  DeleteTransaction,
  FindAccount,
  FindAccounts,
  FindCategories,
  FindCategory,
  FindTransaction,
  FindTransactions,
  RefreshSession,
  ResetPassword,
  RestoreAccount,
  RestoreCategory,
  SendAccountVerification,
  SendPasswordReset,
  SignIn,
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

// Identity
const identityProvider = new DecoratedIdentityProvider(
  new CognitoIdentityProvider(),
);

const signIn = new SignIn(identityProvider);
const refreshSession = new RefreshSession(identityProvider);
const signUp = new SignUp(identityProvider);
const verifyAccount = new VerifyAccount(identityProvider);
const sendAccountVerification = new SendAccountVerification(identityProvider);
const sendPasswordReset = new SendPasswordReset(identityProvider);
const resetPassword = new ResetPassword(identityProvider);
const apiHttpClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// API Client
apiHttpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Account
const accountRepository = new DecoratedAccountRepository(
  new HttpAccountRepository(apiHttpClient),
);
const createAccount = new CreateAccount(accountRepository);
const findAccounts = new FindAccounts(accountRepository);
const findOneAccount = new FindAccount(accountRepository);
const updateAccount = new UpdateAccount(accountRepository);
const archiveAccount = new ArchiveAccount(accountRepository);
const restoreAccount = new RestoreAccount(accountRepository);

// Category
const categoryRepository = new DecoratedCategoryRepository(
  new HttpCategoryRepository(apiHttpClient),
);
const createCategory = new CreateCategory(categoryRepository);
const findOneCategory = new FindCategory(categoryRepository);
const findCategories = new FindCategories(categoryRepository);
const updateCategory = new UpdateCategory(categoryRepository);
const archiveCategory = new ArchiveCategory(categoryRepository);
const restoreCategory = new RestoreCategory(categoryRepository);

// Transaction
const transactionRepository = new DecoratedTransactionRepository(
  new HttpTransactionRepository(apiHttpClient),
);

const createTransaction = new CreateTransaction(transactionRepository);
const findOneTransaction = new FindTransaction(transactionRepository);
const findTransactions = new FindTransactions(transactionRepository);
const updateTransaction = new UpdateTransaction(transactionRepository);
const deleteTransaction = new DeleteTransaction(transactionRepository);

export const container = {
  identity: {
    signIn: signIn,
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
    archive: archiveAccount,
    restore: restoreAccount,
  },
  category: {
    create: createCategory,
    find: findCategories,
    findOne: findOneCategory,
    update: updateCategory,
    archive: archiveCategory,
    restore: restoreCategory,
  },
  transaction: {
    create: createTransaction,
    find: findTransactions,
    findOne: findOneTransaction,
    update: updateTransaction,
    delete: deleteTransaction,
  },
};
