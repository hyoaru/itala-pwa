import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { VerifyAccountRequest } from "./request";
import type { VerifyAccountResponse } from "./response";

export class VerifyAccount implements UseCase<VerifyAccountResponse> {
  private request: VerifyAccountRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: VerifyAccountRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<VerifyAccountResponse> {
    await this.idp.verify(this.request.email, this.request.code);
  }
}
