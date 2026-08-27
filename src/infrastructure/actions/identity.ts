import {
  RefreshSession,
  ResetPassword,
  SendAccountVerification,
  SendPasswordReset,
  SignIn,
  SignUp,
  VerifyAccount,
  type ResetPasswordRequest,
  type SendAccountVerificationRequest,
  type SendPasswordResetRequest,
  type SignInRequest,
  type SignUpRequest,
  type VerifyAccountRequest,
  type RefreshSessionRequest,
} from "@/application/use-cases";
import { mutationOptions, useQueryClient } from "@tanstack/react-query";
import {
  CognitoIdentityProvider,
  DecoratedIdentityProvider,
} from "../adapters/identity-provider";
import { accountKeys } from "./account";
import { categoryKeys } from "./category";

const baseKey = "identity";

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

export const useIdentityActions = () => {
  const queryClient = useQueryClient();
  return {
    signIn: () =>
      mutationOptions({
        mutationKey: [baseKey, "sign_in"],
        mutationFn: async (
          request: SignInRequest,
        ): ReturnType<typeof signIn.execute> => {
          const authenticatedSession = await signIn.execute(request);

          localStorage.setItem("ID_TOKEN", authenticatedSession.idToken);
          localStorage.setItem(
            "ACCESS_TOKEN",
            authenticatedSession.accessToken,
          );
          localStorage.setItem(
            "REFRESH_TOKEN",
            authenticatedSession.refreshToken,
          );

          return authenticatedSession;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    refresh: () =>
      mutationOptions({
        mutationKey: [baseKey, "refresh"],
        mutationFn: async (
          request: RefreshSessionRequest,
        ): ReturnType<typeof refreshSession.execute> => {
          const authenticatedSession = await refreshSession.execute(request);

          localStorage.setItem("ID_TOKEN", authenticatedSession.idToken);
          localStorage.setItem(
            "ACCESS_TOKEN",
            authenticatedSession.accessToken,
          );
          localStorage.setItem(
            "REFRESH_TOKEN",
            authenticatedSession.refreshToken,
          );

          return authenticatedSession;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.all });
          queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
      }),
    signUp: () =>
      mutationOptions({
        mutationKey: [baseKey, "sign_up"],
        mutationFn: (
          request: SignUpRequest,
        ): ReturnType<typeof signUp.execute> => {
          return signUp.execute(request);
        },
      }),
    verifyAccount: () =>
      mutationOptions({
        mutationKey: [baseKey, "verify"],
        mutationFn: (
          request: VerifyAccountRequest,
        ): ReturnType<typeof verifyAccount.execute> => {
          return verifyAccount.execute(request);
        },
      }),
    sendAccountVerification: () =>
      mutationOptions({
        mutationKey: [baseKey, "send_verification"],
        mutationFn: (
          request: SendAccountVerificationRequest,
        ): ReturnType<typeof sendAccountVerification.execute> => {
          return sendAccountVerification.execute(request);
        },
      }),
    sendPasswordReset: () =>
      mutationOptions({
        mutationKey: [baseKey, "request_password_reset"],
        mutationFn: (
          request: SendPasswordResetRequest,
        ): ReturnType<typeof sendPasswordReset.execute> => {
          return sendPasswordReset.execute(request);
        },
      }),
    resetPassword: () =>
      mutationOptions({
        mutationKey: [baseKey, "reset_password"],
        mutationFn: (
          request: ResetPasswordRequest,
        ): ReturnType<typeof resetPassword.execute> => {
          return resetPassword.execute(request);
        },
      }),
  };
};
