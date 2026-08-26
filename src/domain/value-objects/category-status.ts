export const CategoryStatus = {
  Active: "active",
  Archived: "archived",
} as const;

export type CategoryStatus =
  (typeof CategoryStatus)[keyof typeof CategoryStatus];
