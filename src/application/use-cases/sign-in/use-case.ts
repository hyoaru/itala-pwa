import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SignInRequest } from "./request";
import type { SignInResponse } from "./response";

export class SignIn implements UseCase<SignInRequest, SignInResponse> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(request: SignInRequest): Promise<SignInResponse> {
    return await this.idp.signIn(request.email, request.password);
  }
}
