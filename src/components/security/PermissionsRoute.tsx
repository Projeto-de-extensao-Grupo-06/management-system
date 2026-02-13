import usePermissions from "../../hooks/usePermissions";
import type { PermissionRouteProps } from "../../interfaces/properties/PermissionsRouteProps";
import Forbidden from "../../pages/shared/Forbidden";

export default function PermissionRoute({ permissions, element }: PermissionRouteProps) {
    const userPermissions = usePermissions();
    const userPermissionsSet = new Set(userPermissions);

    return permissions.some(p => userPermissionsSet.has(p)) ? element : <Forbidden />;
}