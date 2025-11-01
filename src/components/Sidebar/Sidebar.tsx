import React from "react";

type Permission = "read" | "write" | "create" | "delete" | "admin";

type User = {
  name: string;
  email: string;
  permissions: Permission[];
  avatar?: string;
};

type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permission?: Permission | Permission[]; // string or array (treated as OR)
  badge?: string;
  children?: MenuItem[];
};

type SidebarProps = {
  user: User;
  menuItems: MenuItem[];
  onNavigate?: (path: string) => void;
  collapsed?: boolean;
};

const simpleIcon = (label: string) => (
  <span style={{ display: "inline-block", width: 18, textAlign: "center" }}>{label[0]}</span>
);

const hasPermission = (user: User, item: MenuItem) => {
  if (!item.permission) return true;
  if (Array.isArray(item.permission)) {
    // treat as OR: visible if user has any of listed permissions
    return item.permission.some((p) => user.permissions.includes(p));
  }
  return user.permissions.includes(item.permission);
};

const Sidebar: React.FC<SidebarProps> = ({ user, menuItems, onNavigate, collapsed = false }) => {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        background: "#0f172a",
        color: "white",
        padding: "12px",
        boxSizing: "border-box",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
        />
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{user.email}</div>
          </div>
        )}
      </div>

      <nav>
        {menuItems
          .filter((item) => hasPermission(user, item))
          .map((item) => (
            <div key={item.id} style={{ marginBottom: 8 }}>
              <div
                onClick={() => item.path && onNavigate && onNavigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  cursor: item.path ? "pointer" : "default",
                  background: "transparent",
                }}
              >
                <span style={{ width: 20 }}>{item.icon ?? simpleIcon(item.label)}</span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      background: "#f97316",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {item.children && !collapsed && (
                <div style={{ marginLeft: 28, marginTop: 6 }}>
                  {item.children
                    .filter((c) => hasPermission(user, c))
                    .map((child) => (
                      <div
                        key={child.id}
                        onClick={() => child.path && onNavigate && onNavigate(child.path)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 6,
                          cursor: child.path ? "pointer" : "default",
                          fontSize: 14,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {child.label}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;