import { useEffect, useState } from "react"
import type { Permissions } from "../interfaces/properties/PermissionsRouteProps"
import { getCookie } from "../utils/cookieUtils";

export default function usePermissions() {
    const [permissions, setPermissions] = useState<Permissions[]>([]);

    useEffect(() => {
        const permissionsCookie = getCookie("userAuthorities");

        if(permissionsCookie) {
            const decode = atob(permissionsCookie);

            const userPermissions = decode
            .replace("[", "")
            .replace("]", "")
            .split(", ") as Permissions[];

            setPermissions(userPermissions);
        }
    }, []);

    return permissions;
}