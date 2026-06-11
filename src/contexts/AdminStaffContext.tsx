import { createContext, useContext } from 'react';

export interface AdminPermissions {
  view_clients: boolean;
  approve_registrations: boolean;
  view_orders: boolean;
  view_prices: boolean;
  manage_products: boolean;
  manage_colors: boolean;
  manage_brochures: boolean;
}

export interface AdminStaffInfo {
  role: 'owner' | 'staff';
  fullName?: string;
  permissions: AdminPermissions;
  /** True when role is 'owner'. Owners always have all permissions including staff management. */
  isOwner: boolean;
  /** Convenience helper: returns true if the permission is granted (owners always return true). */
  canDo: (permission: keyof AdminPermissions | 'manage_staff') => boolean;
}

const OWNER_PERMS: AdminPermissions = {
  view_clients: true,
  approve_registrations: true,
  view_orders: true,
  view_prices: true,
  manage_products: true,
  manage_colors: true,
  manage_brochures: true,
};

/** Fallback value used while the verify call is in flight (ProtectedRoute shows a loader). */
export const defaultAdminStaffInfo: AdminStaffInfo = {
  role: 'owner',
  permissions: OWNER_PERMS,
  isOwner: true,
  canDo: () => true,
};

export function buildAdminStaffInfo(
  role: 'owner' | 'staff',
  permissions: AdminPermissions,
  fullName?: string
): AdminStaffInfo {
  const isOwner = role === 'owner';
  return {
    role,
    fullName,
    permissions,
    isOwner,
    canDo: (permission) => {
      if (isOwner) return true;
      if (permission === 'manage_staff') return false;
      return Boolean(permissions[permission as keyof AdminPermissions]);
    },
  };
}

export const AdminStaffContext = createContext<AdminStaffInfo>(defaultAdminStaffInfo);

export function useAdminStaff(): AdminStaffInfo {
  return useContext(AdminStaffContext);
}
