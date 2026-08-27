export const AccountStatus = {
  Active: "active",
  Archived: "archived",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];
