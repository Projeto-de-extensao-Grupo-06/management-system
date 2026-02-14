import { useState } from "react"
import type { Permissions } from "../interfaces/properties/PermissionsRouteProps"
import { getCookie } from "../utils/cookieUtils";

export default function usePermissions() {
    const [permissions] = useState<Permissions[]>(() => {
        const permissionsCookie = getCookie("userAuthorities");

        if (!permissionsCookie) return [];

        const decode = atob(permissionsCookie);

        return decode
            .replace("[", "")
            .replace("]", "")
            .split(", ") as Permissions[];
    });

    return permissions;
}
