import {
  IdentityProviderCodeDeliveryFailureError,
  IdentityProviderEmailAlreadyExistsError,
  IdentityProviderError,
  IdentityProviderInvalidCodeError,
  IdentityProviderInvalidCredentialsError,
  IdentityProviderInvalidEmailError,
  IdentityProviderInvalidPasswordError,
  IdentityProviderPasswordResetRequiredError,
  IdentityProviderUserNotVerifiedError,
  IdentityProviderUserNotFoundError,
  type IdentityProvider,
} from "@/application/ports/identity-provider";
import { AuthenticatedSession } from "@/domain/entities";
import {
  AliasExistsException,
  CodeDeliveryFailureException,
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  InvalidEmailRoleAccessPolicyException,
  InvalidParameterException,
  InvalidPasswordException,
  LimitExceededException,
  NotAuthorizedException,
  PasswordResetRequiredException,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  UsernameExistsException,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoIdentityProvider implements IdentityProvider {
  private cognitoClientId: string;
  private cognitoClient: CognitoIdentityProviderClient;

  public constructor() {
    this.cognitoClientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: import.meta.env.VITE_AWS_REGION,
    });
  }

  public async signUp(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<void> {
    try {
      await this.cognitoClient.send(
        new SignUpCommand({
          ClientId: this.cognitoClientId,
          Username: email,
          Password: password,
          UserAttributes: [
            { Name: "email", Value: email },
            { Name: "custom:first_name", Value: firstName },
            { Name: "custom:last_name", Value: lastName },
          ],
        }),
      );
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (
        error instanceof UsernameExistsException ||
        error instanceof AliasExistsException
      ) {
        throw new IdentityProviderEmailAlreadyExistsError(email, {
          cause: error,
        });
      }
      if (error instanceof InvalidPasswordException) {
        throw new IdentityProviderInvalidPasswordError({ cause: error });
      }
      if (
        error instanceof InvalidParameterException ||
        error instanceof InvalidEmailRoleAccessPolicyException
      ) {
        throw new IdentityProviderInvalidEmailError(email, { cause: error });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<AuthenticatedSession> {
    try {
      const result = await this.cognitoClient.send(
        new InitiateAuthCommand({
          ClientId: this.cognitoClientId,
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        }),
      );

      const accessToken = result?.AuthenticationResult?.AccessToken;
      const idToken = result?.AuthenticationResult?.IdToken;
      const refreshToken = result?.AuthenticationResult?.RefreshToken;

      if (!accessToken || !idToken || !refreshToken) {
        throw new IdentityProviderError("Unexpected response from Cognito");
      }

      return new AuthenticatedSession({ accessToken, idToken, refreshToken });
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (
        error instanceof NotAuthorizedException ||
        error instanceof UserNotFoundException
      ) {
        throw new IdentityProviderInvalidCredentialsError(email, {
          cause: error,
        });
      }
      if (error instanceof UserNotConfirmedException) {
        throw new IdentityProviderUserNotVerifiedError(email, {
          cause: error,
        });
      }
      if (error instanceof PasswordResetRequiredException) {
        throw new IdentityProviderPasswordResetRequiredError(email, {
          cause: error,
        });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async refresh(refreshToken: string): Promise<AuthenticatedSession> {
    try {
      const result = await this.cognitoClient.send(
        new GetTokensFromRefreshTokenCommand({
          ClientId: this.cognitoClientId,
          RefreshToken: refreshToken,
        }),
      );

      const accessToken = result?.AuthenticationResult?.AccessToken;
      const idToken = result?.AuthenticationResult?.IdToken;
      const newRefreshToken = result?.AuthenticationResult?.RefreshToken;

      if (!accessToken || !idToken || !newRefreshToken) {
        throw new IdentityProviderError("Unexpected response from Cognito");
      }

      return new AuthenticatedSession({
        accessToken,
        idToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async verify(email: string, code: string): Promise<void> {
    try {
      await this.cognitoClient.send(
        new ConfirmSignUpCommand({
          ClientId: this.cognitoClientId,
          Username: email,
          ConfirmationCode: code,
        }),
      );
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (
        error instanceof CodeMismatchException ||
        error instanceof ExpiredCodeException
      ) {
        throw new IdentityProviderInvalidCodeError({ cause: error });
      }
      if (error instanceof UserNotFoundException) {
        throw new IdentityProviderUserNotFoundError(email, { cause: error });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async sendVerification(email: string): Promise<void> {
    try {
      await this.cognitoClient.send(
        new ResendConfirmationCodeCommand({
          ClientId: this.cognitoClientId,
          Username: email,
        }),
      );
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (
        error instanceof CodeDeliveryFailureException ||
        error instanceof LimitExceededException
      ) {
        throw new IdentityProviderCodeDeliveryFailureError(email, {
          cause: error,
        });
      }
      if (error instanceof UserNotFoundException) {
        throw new IdentityProviderUserNotFoundError(email, { cause: error });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.cognitoClient.send(
        new ForgotPasswordCommand({
          ClientId: this.cognitoClientId,
          Username: email,
        }),
      );
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (error instanceof UserNotFoundException) {
        throw new IdentityProviderUserNotFoundError(email, { cause: error });
      }
      if (
        error instanceof CodeDeliveryFailureException ||
        error instanceof LimitExceededException
      ) {
        throw new IdentityProviderCodeDeliveryFailureError(email, {
          cause: error,
        });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }

  public async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await this.cognitoClient.send(
        new ConfirmForgotPasswordCommand({
          ClientId: this.cognitoClientId,
          Username: email,
          ConfirmationCode: code,
          Password: newPassword,
        }),
      );
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        throw error;
      }
      if (
        error instanceof CodeMismatchException ||
        error instanceof ExpiredCodeException
      ) {
        throw new IdentityProviderInvalidCodeError({ cause: error });
      }
      if (error instanceof InvalidPasswordException) {
        throw new IdentityProviderInvalidPasswordError({ cause: error });
      }
      if (error instanceof UserNotFoundException) {
        throw new IdentityProviderUserNotFoundError(email, { cause: error });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new IdentityProviderError(`Identity provider error: ${message}`, {
        cause: error,
      });
    }
  }
}
