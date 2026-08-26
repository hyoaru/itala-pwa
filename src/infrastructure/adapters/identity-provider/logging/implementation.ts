import {
  IdentityProviderError,
  type IdentityProvider,
} from "@/application/ports/identity-provider";
import type { AuthenticatedSession } from "@/domain/entities";
import { logger } from "@/infrastructure/logger";

export class LoggingIdentityProvider implements IdentityProvider {
  private inner: IdentityProvider;

  public constructor(inner: IdentityProvider) {
    this.inner = inner;
  }

  private logFailure(
    message: string,
    extra: object | undefined,
    error: unknown,
  ): void {
    const isExpected =
      error instanceof IdentityProviderError &&
      error.constructor !== IdentityProviderError;
    if (isExpected) {
      logger.warn(message, extra);
    } else {
      logger.error(message, extra);
    }
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
      this.logFailure("Sign up failed", { email }, error);
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
      this.logFailure("Sign in failed", { email }, error);
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
      this.logFailure("Refreshing session failed", undefined, error);
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
      this.logFailure("Email verification failed", { email }, error);
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
      this.logFailure("Sending email verification failed", { email }, error);
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
      this.logFailure("Requesting password reset failed", { email }, error);
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
      this.logFailure("Resetting password failed", { email }, error);
      throw error;
    }
  }
}
