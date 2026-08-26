import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SendAccountVerificationRequest } from "./request";
import type { SendAccountVerificationResponse } from "./response";

export class SendAccountVerification implements UseCase<
  SendAccountVerificationRequest,
  SendAccountVerificationResponse
> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(
    request: SendAccountVerificationRequest,
  ): Promise<SendAccountVerificationResponse> {
    await this.idp.sendVerification(request.email);
  }
}
