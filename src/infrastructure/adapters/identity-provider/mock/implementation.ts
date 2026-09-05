import { type IdentityProvider } from "@/application/ports/identity-provider";
import { AuthenticatedSession } from "@/domain/entities";

export class MockIdentityProvider implements IdentityProvider {
  public async signUp(
    _email: string,
    _firstName: string,
    _lastName: string,
    _password: string,
  ): Promise<void> {}

  public async signIn(
    _email: string,
    _password: string,
  ): Promise<AuthenticatedSession> {
    return new AuthenticatedSession({
      accessToken: "accessToken",
      idToken: "idToken",
      refreshToken: "refreshToken",
    });
  }

  public async refresh(_refreshToken: string): Promise<AuthenticatedSession> {
    return new AuthenticatedSession({
      accessToken: "accessToken",
      idToken: "idToken",
      refreshToken: "refreshToken",
    });
  }

  public async revoke(_refreshToken: string): Promise<void> {}

  public async verify(_email: string, _code: string): Promise<void> {}

  public async sendVerification(_email: string): Promise<void> {}

  public async requestPasswordReset(_email: string): Promise<void> {}

  public async resetPassword(
    _email: string,
    _code: string,
    _newPassword: string,
  ): Promise<void> {}
}
