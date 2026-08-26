import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { AuthenticatedSession } from "@/domain/entities";
import type { UseCase } from "../interface";
import type { RefreshSessionRequest } from "./request";
import type { RefreshSessionResponse } from "./response";

export class RefreshSession implements UseCase<RefreshSessionResponse> {
  private request: RefreshSessionRequest;
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider, request: RefreshSessionRequest) {
    this.request = request;
    this.idp = idp;
  }

  public async execute(): Promise<AuthenticatedSession> {
    return await this.idp.refresh(this.request.refreshToken);
  }
}
