import {
  AliasExistsException,
  type CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InvalidEmailRoleAccessPolicyException,
  InvalidParameterException,
  InvalidPasswordException,
  NotAuthorizedException,
  PasswordResetRequiredException,
  SignUpCommand,
  UsernameExistsException,
  UserNotConfirmedException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { describe, expect, it, vi } from "vitest";

import { AuthenticatedSession } from "@/domain/entities";
import { CognitoIdentityProvider } from "./implementation";
import {
  IdentityProviderEmailAlreadyExistsError,
  IdentityProviderError,
  IdentityProviderInvalidCredentialsError,
  IdentityProviderInvalidEmailError,
  IdentityProviderInvalidPasswordError,
  IdentityProviderPasswordResetRequiredError,
  IdentityProviderUserNotVerifiedError,
} from "@/application/ports/identity-provider";

describe("CognitoIdentityProvider", () => {
  it("signs up with the expected Cognito command", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockResolvedValue({});

    await provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!");

    const command = sendMock.mock.calls[0][0] as SignUpCommand;
    expect(command).toBeInstanceOf(SignUpCommand);
    expect(command.input).toEqual({
      ClientId: "client-123",
      Username: "ada@example.com",
      Password: "Password1!",
      UserAttributes: [
        { Name: "email", Value: "ada@example.com" },
        { Name: "custom:first_name", Value: "Ada" },
        { Name: "custom:last_name", Value: "Lovelace" },
      ],
    });
  });

  it("throws an email-already-exists error when the username exists", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new UsernameExistsException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderEmailAlreadyExistsError);
  });

  it("throws an email-already-exists error when the alias exists", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new AliasExistsException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderEmailAlreadyExistsError);
  });

  it("throws an invalid-password error", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new InvalidPasswordException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderInvalidPasswordError);
  });

  it("throws an invalid-email error for invalid parameters", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new InvalidParameterException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderInvalidEmailError);
  });

  it("throws an invalid-email error for role access policy failures", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new InvalidEmailRoleAccessPolicyException({
        message: "x",
        $metadata: {},
      }),
    );

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderInvalidEmailError);
  });

  it("wraps unknown errors in a generic identity provider error", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(new Error("network"));

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderError);
  });

  it("rethrows an existing identity provider error untouched", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    const original = new IdentityProviderError("boom");
    sendMock.mockRejectedValue(original);

    await expect(
      provider.signUp("ada@example.com", "Ada", "Lovelace", "Password1!"),
    ).rejects.toBe(original);
  });

  it("signs in and returns the authenticated session", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockResolvedValue({
      AuthenticationResult: {
        AccessToken: "access",
        IdToken: "id",
        RefreshToken: "refresh",
      },
    });

    const session = await provider.signIn("ada@example.com", "Password1!");

    expect(session).toBeInstanceOf(AuthenticatedSession);
    expect(session).toMatchObject({
      accessToken: "access",
      idToken: "id",
      refreshToken: "refresh",
    });

    const command = sendMock.mock.calls[0][0] as InitiateAuthCommand;
    expect(command).toBeInstanceOf(InitiateAuthCommand);
    expect(command.input.AuthFlow).toBe("USER_PASSWORD_AUTH");
    expect(command.input.AuthParameters).toEqual({
      USERNAME: "ada@example.com",
      PASSWORD: "Password1!",
    });
  });

  it("throws invalid-credentials when not authorized", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new NotAuthorizedException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signIn("ada@example.com", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderInvalidCredentialsError);
  });

  it("throws invalid-credentials when the user is not found", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new UserNotFoundException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signIn("ada@example.com", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderInvalidCredentialsError);
  });

  it("throws user-not-verified when the user is not confirmed", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new UserNotConfirmedException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signIn("ada@example.com", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderUserNotVerifiedError);
  });

  it("throws password-reset-required when Cognito requires a reset", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockRejectedValue(
      new PasswordResetRequiredException({ message: "x", $metadata: {} }),
    );

    await expect(
      provider.signIn("ada@example.com", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderPasswordResetRequiredError);
  });

  it("throws a generic error when tokens are missing", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    sendMock.mockResolvedValue({ AuthenticationResult: {} });

    await expect(
      provider.signIn("ada@example.com", "Password1!"),
    ).rejects.toBeInstanceOf(IdentityProviderError);
  });

  it("rethrows an existing identity provider error untouched", async () => {
    const sendMock = vi.fn();
    const provider = new CognitoIdentityProvider(
      { send: sendMock } as unknown as CognitoIdentityProviderClient,
      "client-123",
    );
    const original = new IdentityProviderError("boom");
    sendMock.mockRejectedValue(original);

    await expect(provider.signIn("ada@example.com", "Password1!")).rejects.toBe(
      original,
    );
  });
});
