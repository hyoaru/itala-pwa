import {
  AliasExistsException,
  type CognitoIdentityProviderClient,
  InvalidEmailRoleAccessPolicyException,
  InvalidParameterException,
  InvalidPasswordException,
  SignUpCommand,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { describe, expect, it, vi } from "vitest";

import { CognitoIdentityProvider } from "./implementation";
import {
  IdentityProviderEmailAlreadyExistsError,
  IdentityProviderError,
  IdentityProviderInvalidEmailError,
  IdentityProviderInvalidPasswordError,
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
});
