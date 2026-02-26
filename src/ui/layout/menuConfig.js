export const menuConfig = {
  // Roles hierarchy or simple list
  roles: ["admin", "manager", "user"],

  // Default permissions for paths
  // If a path is not here, maybe it's public or uses a default
  permissions: {
    // NEXUS
    "/nexus/dashboard": ["admin", "manager", "user"],
    "/nexus/contracts": ["admin", "manager"],
    "/nexus/vendor-risk": ["admin"],
    "/nexus/ai-assistant": ["admin", "manager", "user"],

    // STRUCTURA
    "/structura/execution": ["admin", "manager", "user"],
    "/structura/boq": ["admin", "manager"],
    "/structura/sop": ["admin", "manager"],
    "/structura/snag": ["admin", "manager", "user"],
    "/structura/dlp": ["admin"],

    // SENTINEL
    "/sentinel/command": ["admin", "manager"],
    "/sentinel/auth": ["admin"],
    "/sentinel/cctv": ["admin", "manager"],
    "/sentinel/ecc": ["admin", "manager"],
    "/sentinel/sop-violation": ["admin", "manager"],

    // ECOLOGIC
    "/ecologic/lpg": ["admin", "manager", "user"],
    "/ecologic/btu": ["admin", "manager", "user"],
    "/ecologic/ev": ["admin", "manager", "user"],

    // SYSTEM / ACCOUNT
    "/profile": ["admin", "manager", "user"],
    "/settings": ["admin", "manager", "user"],
  },

  // Helper to check access
  hasAccess: (role, path) => {
    if (!role) return false;
    const allowedRoles = menuConfig.permissions[path];
    if (!allowedRoles) return true; // Default to allow if not defined? Or false? Let's say true for now.
    return allowedRoles.includes(role.toLowerCase());
  },
};
