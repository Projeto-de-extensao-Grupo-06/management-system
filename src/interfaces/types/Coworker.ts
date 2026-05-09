export interface Coworker {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  isActive: boolean;
  permissionGroupId?: number | null;
  permissionGroupRole?: string | null;
}
