import type { ReactNode } from "react";
import type { Permissions } from "./PermissionsRouteProps";

export interface SecureComponentProps {
  permissions: Permissions[];
  children: ReactNode;
}
