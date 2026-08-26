import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SendAccountVerificationRequest } from "./request";
import type { SendAccountVerificationResponse } from "./response";

export class SendAccountVerification
  implements UseCase<SendAccountVerificationResponse>
{
  private request: SendAccountVerificationRequest;
  private idp: IdentityProvider;

  public constructor(
    idp: IdentityProvider,
    request: SendAccountVerificationRequest,
  ) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<SendAccountVerificationResponse> {
    await this.idp.sendVerification(this.request.email);
  }
}
