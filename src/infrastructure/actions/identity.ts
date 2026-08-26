import {
  ResetPassword,
  SendAccountVerification,
  SendPasswordReset,
  SignIn,
  SignUp,
  VerifyAccount,
  RefreshSession,
  type ResetPasswordRequest,
  type SendAccountVerificationRequest,
  type SendPasswordResetRequest,
  type SignInRequest,
  type SignUpRequest,
  type VerifyAccountRequest,
  type RefreshSessionRequest,
} from "@/application/use-cases";
import { mutationOptions } from "@tanstack/react-query";
import {
  CognitoIdentityProvider,
  DecoratedIdentityProvider,
} from "../adapters/identity-provider";

const baseKey = "identity";

const identityProvider = new DecoratedIdentityProvider(
  new CognitoIdentityProvider(),
);

export const identityActions = {
  signIn: () =>
    mutationOptions({
      mutationKey: [baseKey, "sign_in"],
      mutationFn: async (
        request: SignInRequest,
      ): ReturnType<InstanceType<typeof SignIn>["execute"]> => {
        const authenticatedSession = await new SignIn(identityProvider, {
          email: request.email,
          password: request.password,
        }).execute();

        localStorage.setItem("ID_TOKEN", authenticatedSession.idToken);
        localStorage.setItem("ACCESS_TOKEN", authenticatedSession.accessToken);
        localStorage.setItem(
          "REFRESH_TOKEN",
          authenticatedSession.refreshToken,
        );

        return authenticatedSession;
      },
    }),
  refresh: () =>
    mutationOptions({
      mutationKey: [baseKey, "refresh"],
      mutationFn: async (
        request: RefreshSessionRequest,
      ): ReturnType<InstanceType<typeof RefreshSession>["execute"]> => {
        const authenticatedSession = await new RefreshSession(
          identityProvider,
          {
            refreshToken: request.refreshToken,
          },
        ).execute();

        localStorage.setItem("ID_TOKEN", authenticatedSession.idToken);
        localStorage.setItem("ACCESS_TOKEN", authenticatedSession.accessToken);
        localStorage.setItem(
          "REFRESH_TOKEN",
          authenticatedSession.refreshToken,
        );

        return authenticatedSession;
      },
    }),
  signUp: () =>
    mutationOptions({
      mutationKey: [baseKey, "sign_up"],
      mutationFn: (
        request: SignUpRequest,
      ): ReturnType<InstanceType<typeof SignUp>["execute"]> => {
        return new SignUp(identityProvider, {
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
          password: request.password,
        }).execute();
      },
    }),
  verifyAccount: () =>
    mutationOptions({
      mutationKey: [baseKey, "verify"],
      mutationFn: (
        request: VerifyAccountRequest,
      ): ReturnType<InstanceType<typeof VerifyAccount>["execute"]> => {
        return new VerifyAccount(identityProvider, {
          email: request.email,
          code: request.code,
        }).execute();
      },
    }),
  sendAccountVerification: () =>
    mutationOptions({
      mutationKey: [baseKey, "send_verification"],
      mutationFn: (
        request: SendAccountVerificationRequest,
      ): ReturnType<
        InstanceType<typeof SendAccountVerification>["execute"]
      > => {
        return new SendAccountVerification(identityProvider, {
          email: request.email,
        }).execute();
      },
    }),
  sendPasswordReset: () =>
    mutationOptions({
      mutationKey: [baseKey, "request_password_reset"],
      mutationFn: (
        request: SendPasswordResetRequest,
      ): ReturnType<InstanceType<typeof SendPasswordReset>["execute"]> => {
        return new SendPasswordReset(identityProvider, {
          email: request.email,
        }).execute();
      },
    }),
  resetPassword: () =>
    mutationOptions({
      mutationKey: [baseKey, "reset_password"],
      mutationFn: (
        request: ResetPasswordRequest,
      ): ReturnType<InstanceType<typeof ResetPassword>["execute"]> => {
        return new ResetPassword(identityProvider, {
          email: request.email,
          code: request.code,
          newPassword: request.newPassword,
        }).execute();
      },
    }),
};
