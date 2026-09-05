import type { IdentityProvider } from "@/application/ports/identity-provider";
import { LoggingIdentityProvider } from "../logging";
import type { AuthenticatedSession } from "@/domain/entities";

export class DecoratedIdentityProvider implements IdentityProvider {
  private inner: IdentityProvider;

  public constructor(inner: IdentityProvider) {
    this.inner = new LoggingIdentityProvider(inner);
  }

  public async signUp(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<void> {
    return await this.inner.signUp(email, firstName, lastName, password);
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<AuthenticatedSession> {
    return await this.inner.signIn(email, password);
  }

  public async refresh(refreshToken: string): Promise<AuthenticatedSession> {
    return await this.inner.refresh(refreshToken);
  }

  public async revoke(refreshToken: string): Promise<void> {
    return await this.inner.revoke(refreshToken);
  }

  public async verify(email: string, code: string): Promise<void> {
    return await this.inner.verify(email, code);
  }

  public async sendVerification(email: string): Promise<void> {
    return await this.inner.sendVerification(email);
  }

  public async requestPasswordReset(email: string): Promise<void> {
    return await this.inner.requestPasswordReset(email);
  }

  public async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    return await this.inner.resetPassword(email, code, newPassword);
  }
}
