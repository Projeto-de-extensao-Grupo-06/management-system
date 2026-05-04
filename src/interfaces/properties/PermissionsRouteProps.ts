import type { JSX } from "react";

type Modules =
  | "CLIENT"
  | "PROJECT"
  | "BUDGET"
  | "SCHEDULE"
  | "CONFIGURATION"
  | "ROLE";

type Actions =
  | "READ"
  | "WRITE"
  | "UPDATE"
  | "DELETE"
  | "ADMIN";

export type Permissions = `${Modules}_${Actions}`;

export interface PermissionRouteProps {
  permissions: Permissions[];
  element: JSX.Element;
}
