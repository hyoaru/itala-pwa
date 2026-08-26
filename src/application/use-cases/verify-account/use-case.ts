import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { VerifyAccountRequest } from "./request";
import type { VerifyAccountResponse } from "./response";

export class VerifyAccount implements UseCase<
  VerifyAccountRequest,
  VerifyAccountResponse
> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(
    request: VerifyAccountRequest,
  ): Promise<VerifyAccountResponse> {
    await this.idp.verify(request.email, request.code);
  }
}
