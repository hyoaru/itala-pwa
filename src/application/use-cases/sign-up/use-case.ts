import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { UseCase } from "../interface";
import type { SignUpRequest } from "./request";
import type { SignUpResponse } from "./response";

export class SignUp implements UseCase<SignUpRequest, SignUpResponse> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(request: SignUpRequest): Promise<SignUpResponse> {
    await this.idp.signUp(
      request.email,
      request.firstName,
      request.lastName,
      request.password,
    );
  }
}
