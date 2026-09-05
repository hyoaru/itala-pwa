import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SignOutRequest } from "./request";
import type { SignOutResponse } from "./response";

export class SignOut implements UseCase<SignOutRequest, SignOutResponse> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(request: SignOutRequest): Promise<SignOutResponse> {
    return await this.idp.revoke(request.refreshToken);
  }
}