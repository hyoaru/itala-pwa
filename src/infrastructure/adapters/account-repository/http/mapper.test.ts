import { describe, expect, it } from "vitest";

import { Account } from "@/domain/entities";
import { toAccount } from "./mapper";

describe("account repository http mapper", () => {
  it("maps a server item to an Account entity", () => {
    const account = toAccount({
      id: "account-123",
      name: "Cash",
      balance: "1000.00",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-02T00:00:00.000Z",
    });

    expect(account).toBeInstanceOf(Account);
    expect(account.id).toBe("account-123");
    expect(account.name).toBe("Cash");
    expect(account.balance).toBe("1000.00");
    expect(account.createdAt).toEqual(new Date("2024-01-01T00:00:00.000Z"));
    expect(account.updatedAt).toEqual(new Date("2024-01-02T00:00:00.000Z"));
  });
});
