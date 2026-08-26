import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { ResetPasswordRequest } from "./request";
import type { ResetPasswordResponse } from "./response";

export class ResetPassword implements UseCase<ResetPasswordResponse> {
  private request: ResetPasswordRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: ResetPasswordRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<ResetPasswordResponse> {
    await this.idp.resetPassword(
      this.request.email,
      this.request.code,
      this.request.newPassword,
    );
  }
}
