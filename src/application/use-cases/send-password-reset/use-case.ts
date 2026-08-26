import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SendPasswordResetRequest } from "./request";
import type { SendPasswordResetResponse } from "./response";

export class SendPasswordReset implements UseCase<SendPasswordResetResponse> {
  private request: SendPasswordResetRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: SendPasswordResetRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<SendPasswordResetResponse> {
    await this.idp.requestPasswordReset(this.request.email);
  }
}
