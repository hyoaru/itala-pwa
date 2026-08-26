import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SignUpRequest } from "./request";
import type { SignUpResponse } from "./response";

export class SignUp implements UseCase<SignUpResponse> {
  private request: SignUpRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: SignUpRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<SignUpResponse> {
    await this.idp.signUp(
      this.request.email,
      this.request.firstName,
      this.request.lastName,
      this.request.password,
    );
  }
}
