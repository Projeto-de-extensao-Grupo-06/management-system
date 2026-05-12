import usePermissions from "../../hooks/usePermissions";
import type { SecureComponentProps } from "../../interfaces/properties/SecureComponentProps";

export default function SecureComponent({
  permissions,
  children,
}: SecureComponentProps) {
  const userPermissions = usePermissions();
  const userPermissionsSet = new Set(userPermissions);

  return permissions.some((p) => userPermissionsSet.has(p)) ? children : null;
}
