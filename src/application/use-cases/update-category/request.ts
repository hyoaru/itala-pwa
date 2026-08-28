import type { CategoryStatus } from "@/domain/value-objects";

export type UpdateCategoryRequest = {
  id: string;
  name: string;
  status: CategoryStatus;
};