import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Separator,
  Tooltip,
} from "@radix-ui/themes";

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
  permission?: Permission | Permission[];
  badge?: string;
  children?: MenuItem[];
};

type SidebarProps = {
  user: User;
  menuItems: MenuItem[];
  onNavigate?: (path: string) => void;
  collapsed?: boolean;
  onToggle?: () => void; // Add this
};

// Beautiful SVG Icons
const DashboardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 21H20C20.55 21 21 20.55 21 20V12C21 11.45 20.55 11 20 11H14C13.45 11 13 11.45 13 12V20C13 20.55 13.45 21 14 21Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 13H20C20.55 13 21 12.55 21 12V8C21 7.45 20.55 7 20 7H14C13.45 7 13 7.45 13 8V12C13 12.55 13.45 13 14 13Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const UsersIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AnalyticsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 22H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 10C5 9.44772 5.44772 9 6 9C6.55228 9 7 9.44772 7 10V18C7 18.5523 6.55228 19 6 19C5.44772 19 5 18.5523 5 18V10Z" fill="currentColor"/>
    <path d="M9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V18C11 18.5523 10.5523 19 10 19C9.44772 19 9 18.5523 9 18V6Z" fill="currentColor"/>
    <path d="M13 14C13 13.4477 13.4477 13 14 13C14.5523 13 15 13.4477 15 14V18C15 18.5523 14.5523 19 14 19C13.4477 19 13 18.5523 13 18V14Z" fill="currentColor"/>
    <path d="M17 2C17 1.44772 17.4477 1 18 1C18.5523 1 19 1.44772 19 2V18C19 18.5523 18.5523 19 18 19C17.4477 19 17 18.5523 17 18V2Z" fill="currentColor"/>
  </svg>
);

const SettingsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C19.2663 15.3044 19.1993 15.6343 19.2 16C19.2 16.7504 19.6941 17.3329 20.4 17.6C19.6941 17.8671 19.2 18.4496 19.2 19.2C19.2 19.5657 19.2663 19.8956 19.4 20.2C18.9496 20.4203 18.4203 20.5504 17.8 20.55C16.6941 20.55 15.8 19.7671 15.5 18.8C15.3663 18.4956 15.3 18.1657 15.3 17.8C15.3 17.0496 14.8059 16.4671 14.1 16.2C14.8059 15.9329 15.3 15.3504 15.3 14.6C15.3 14.2343 15.2337 13.9044 15.1 13.6C15.6941 13.25 16.5 12.7504 16.5 12C16.5 11.2496 15.6941 10.75 15.1 10.4C15.2337 10.0956 15.3 9.7657 15.3 9.4C15.3 8.64957 14.8059 8.06714 14.1 7.8C14.8059 7.53286 15.3 6.95043 15.3 6.2C15.3 5.8343 15.2337 5.50443 15.1 5.2C15.5504 4.97974 16.0797 4.84957 16.7 4.85C17.8059 4.85 18.7 5.63286 19 6.6C19.1337 6.90443 19.2 7.2343 19.2 7.6C19.2 8.35043 19.6941 8.93286 20.4 9.2C19.6941 9.46714 19.2 10.0496 19.2 10.8C19.2 11.1657 19.1337 11.4956 19 11.8C19.5504 12.1203 20 12.5203 20.4 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReportsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14V17M12 14V17M16 14V17M3 21H21M3 10H21M3 7L12 3L21 7V18C21 18.5304 20.7893 19.0391 20.4142 19.4142C20.0391 19.7893 19.5304 20 19 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const hasPermission = (user: User, item: MenuItem) => {
  if (!item.permission) return true;
  if (Array.isArray(item.permission)) {
    return item.permission.some((p) => user.permissions.includes(p));
  }
  return user.permissions.includes(item.permission);
};

const Sidebar: React.FC<SidebarProps> = ({ user, menuItems, onNavigate, collapsed = false, onToggle }) => {
  const [activeItem, setActiveItem] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      setActiveItem(item.id);
      onNavigate?.(item.path);
    } else if (item.children) {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const filteredChildren = item.children?.filter(child => hasPermission(user, child));

    const menuItemContent = (
      <Flex
        align="center"
        gap="3"
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: item.path || hasChildren ? "pointer" : "default",
          backgroundColor: isActive ? "var(--accent-5)" : "transparent",
          color: isActive ? "var(--accent-12)" : "var(--accent-11)",
          transition: "all 0.2s ease",
          marginLeft: level > 0 ? level * 12 : 0,
          border: isActive ? "1px solid var(--accent-6)" : "1px solid transparent",
        }}
        onClick={() => handleItemClick(item)}
        onMouseOver={(e) => {
          if (!isActive && (item.path || hasChildren)) {
            e.currentTarget.style.backgroundColor = "var(--accent-4)";
          }
        }}
        onMouseOut={(e) => {
          if (!isActive && (item.path || hasChildren)) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <Box style={{ 
          opacity: 0.9, 
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px"
        }}>
          {item.icon}
        </Box>
        
        {!collapsed && (
          <>
            <Text size="2" weight="medium" style={{ flex: 1 }}>
              {item.label}
            </Text>
            
            {item.badge && (
              <Badge size="1" variant="solid" color="blue">
                {item.badge}
              </Badge>
            )}
            
            {hasChildren && (
              <Box
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  opacity: 0.7
                }}
              >
                ▼
              </Box>
            )}
          </>
        )}
      </Flex>
    );

    return (
      <Box key={item.id}>
        {collapsed ? (
          <Tooltip content={item.label} side="right">
            {menuItemContent}
          </Tooltip>
        ) : (
          menuItemContent
        )}

        {hasChildren && isExpanded && !collapsed && filteredChildren && filteredChildren.length > 0 && (
          <Box style={{ marginTop: "4px" }}>
            {filteredChildren.map(child => renderMenuItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(user, item));

  return (
    <Box
      style={{
        width: collapsed ? "70px" : "280px",
        height: "100vh",
        backgroundColor: "var(--accent-1)",
        borderRight: "1px solid var(--accent-6)",
        padding: "20px 0",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          style={{
            position: "absolute",
            top: 12,
            right: collapsed ? 12 : -12,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "#1e293b",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            zIndex: 10,
          }}
        >
          {collapsed ? "→" : "←"}
        </button>
      )}

      {/* User Section */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 32 }}>
        <Avatar
          size="3"
          src={user.avatar}
          fallback={user.name.charAt(0).toUpperCase()}
          style={{ 
            borderRadius: "10px",
            border: "2px solid var(--accent-6)"
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="2" weight="bold" style={{ color: "var(--accent-12)" }} truncate>
            {user.name}
          </Text>
          <Text size="1" style={{ color: "var(--accent-11)" }} truncate>
            {user.email}
          </Text>
        </div>
      </div>

      {/* Permissions Badges */}
      {!collapsed && user.permissions.length > 0 && (
        <Flex gap="1" wrap="wrap" style={{ marginTop: "12px" }}>
          {user.permissions.map(permission => (
            <Badge 
              key={permission} 
              size="1" 
              variant="soft"
              style={{ textTransform: "capitalize" }}
            >
              {permission}
            </Badge>
          ))}
        </Flex>
      )}

      <Separator size="4" style={{ margin: "0 20px" }} />

      {/* Navigation */}
      <nav style={{ 
        flex: 1, 
        padding: "12px 12px", 
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        <Flex direction="column" gap="1">
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </Flex>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <Box style={{ padding: "0 20px" }}>
          <Separator size="4" style={{ marginBottom: "16px" }} />
          <Text size="1" style={{ color: "var(--accent-11)", textAlign: "center" }}>
            © 2024 Your Company
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Default icons for menu items
const defaultIcons: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  users: <UsersIcon />,
  analytics: <AnalyticsIcon />,
  settings: <SettingsIcon />,
  reports: <ReportsIcon />,
};

// Enhanced menu items with proper icons
export const enhanceMenuItems = (items: MenuItem[]): MenuItem[] => {
  return items.map(item => ({
    ...item,
    icon: item.icon || defaultIcons[item.id] || <DashboardIcon />,
    children: item.children ? enhanceMenuItems(item.children) : undefined,
  }));
};

export default Sidebar;