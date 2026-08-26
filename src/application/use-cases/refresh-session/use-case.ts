import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { AuthenticatedSession } from "@/domain/entities";
import type { UseCase } from "../interface";
import type { RefreshSessionRequest } from "./request";
import type { RefreshSessionResponse } from "./response";

export class RefreshSession implements UseCase<
  RefreshSessionRequest,
  RefreshSessionResponse
> {
  private idp: IdentityProvider;

  public constructor(idp: IdentityProvider) {
    this.idp = idp;
  }

  public async execute(
    request: RefreshSessionRequest,
  ): Promise<AuthenticatedSession> {
    return await this.idp.refresh(request.refreshToken);
  }
}
