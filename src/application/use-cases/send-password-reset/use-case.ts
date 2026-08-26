import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SendPasswordResetRequest } from "./request";
import type { SendPasswordResetResponse } from "./response";

export class SendPasswordReset implements UseCase<
  SendPasswordResetRequest,
  SendPasswordResetResponse
> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(
    request: SendPasswordResetRequest,
  ): Promise<SendPasswordResetResponse> {
    await this.idp.requestPasswordReset(request.email);
  }
}
