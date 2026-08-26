import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SignInRequest } from "./request";
import type { SignInResponse } from "./response";

export class SignIn implements UseCase<SignInResponse> {
  private request: SignInRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: SignInRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<SignInResponse> {
    return await this.idp.signIn(this.request.email, this.request.password);
  }
}
