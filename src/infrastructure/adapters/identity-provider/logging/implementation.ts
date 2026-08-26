import type { IdentityProvider } from "@/application/ports/identity-provider";
import type { AuthenticatedSession } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingIdentityProvider implements IdentityProvider {
  private inner: IdentityProvider;

  public constructor(inner: IdentityProvider) {
    this.inner = inner;
  }

  public async signUp(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<void> {
    try {
      logger.debug("Signing up", { email });
      const result = await this.inner.signUp(
        email,
        firstName,
        lastName,
        password,
      );
      logger.info("Sign up successful", { email });
      return result;
    } catch (error) {
      logger.error("Sign up failed", { email });
      throw error;
    }
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<AuthenticatedSession> {
    try {
      logger.debug("Signing in", { email });
      const result = await this.inner.signIn(email, password);
      logger.info("Sign in successful", { email });
      return result;
    } catch (error) {
      logger.error("Sign in failed", { email });
      throw error;
    }
  }

  public async refresh(refreshToken: string): Promise<AuthenticatedSession> {
    try {
      logger.debug("Refreshing session");
      const result = await this.inner.refresh(refreshToken);
      logger.debug("Session refreshed");
      return result;
    } catch (error) {
      logger.error("Refreshing session failed");
      throw error;
    }
  }

  public async verify(email: string, code: string): Promise<void> {
    try {
      logger.debug("Verifying email", { email });
      const result = await this.inner.verify(email, code);
      logger.info("Email verification successful", { email });
      return result;
    } catch (error) {
      logger.error("Email verification failed", { email });
      throw error;
    }
  }

  public async sendVerification(email: string): Promise<void> {
    try {
      logger.debug("Sending email verification", { email });
      const result = await this.inner.sendVerification(email);
      logger.info("Email verification sent", { email });
      return result;
    } catch (error) {
      logger.error("Sending email verification failed", { email });
      throw error;
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      logger.debug("Requesting password reset", { email });
      const result = await this.inner.requestPasswordReset(email);
      logger.info("Password reset requested", { email });
      return result;
    } catch (error) {
      logger.error("Requesting password reset failed", { email });
      throw error;
    }
  }

  public async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    try {
      logger.debug("Resetting password", { email });
      const result = await this.inner.resetPassword(email, code, newPassword);
      logger.info("Password reset successful", { email });
      return result;
    } catch (error) {
      logger.error("Resetting password failed", { email });
      throw error;
    }
  }
}
