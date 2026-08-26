import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { ResetPasswordRequest } from "./request";
import type { ResetPasswordResponse } from "./response";

export class ResetPassword implements UseCase<
  ResetPasswordRequest,
  ResetPasswordResponse
> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    await this.idp.resetPassword(
      request.email,
      request.code,
      request.newPassword,
    );
  }
}
