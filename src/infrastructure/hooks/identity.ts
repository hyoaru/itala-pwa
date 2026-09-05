import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendAccountVerificationRequest,
  SendAccountVerificationResponse,
  SendPasswordResetRequest,
  SendPasswordResetResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "@/application/use-cases";
import { mutationOptions, useQueryClient } from "@tanstack/react-query";
import { container } from "../container";

const baseKey = "identity";

export const useIdentityActions = () => {
  const queryClient = useQueryClient();
  return {
    signIn: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: async (
          request: SignInRequest,
        ): Promise<SignInResponse> => {
          const authenticatedSession =
            await container.identity.signIn.execute(request);

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
          queryClient.invalidateQueries();
        },
      }),
    signOut: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: async (): Promise<void> => {
          const refreshToken = localStorage.getItem("REFRESH_TOKEN");
          if (refreshToken) {
            await container.identity.signOut.execute({ refreshToken });
          }
        },
      }),
    signUp: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: SignUpRequest,
        ): Promise<SignUpResponse> => {
          return container.identity.signUp.execute(request);
        },
      }),
    verifyAccount: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: VerifyAccountRequest,
        ): Promise<VerifyAccountResponse> => {
          return container.identity.verifyAccount.execute(request);
        },
      }),
    sendAccountVerification: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: SendAccountVerificationRequest,
        ): Promise<SendAccountVerificationResponse> => {
          return container.identity.sendAccountVerification.execute(request);
        },
      }),
    sendPasswordReset: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: SendPasswordResetRequest,
        ): Promise<SendPasswordResetResponse> => {
          return container.identity.sendPasswordReset.execute(request);
        },
      }),
    resetPassword: () =>
      mutationOptions({
        mutationKey: [baseKey],
        mutationFn: (
          request: ResetPasswordRequest,
        ): Promise<ResetPasswordResponse> => {
          return container.identity.resetPassword.execute(request);
        },
      }),
  };
};
