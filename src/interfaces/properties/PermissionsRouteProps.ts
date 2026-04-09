import type { JSX } from "react";

type Modules = "CLIENT" | "PROJECT" | "BUDGET" | "SCHEDULE";
type Actions = "READ" | "WRITE" | "UPDATE" | "DELETE";
export type Permissions = `${Modules}_${Actions}`;

export interface PermissionRouteProps {
  permissions: Permissions[];
  element: JSX.Element;
}
