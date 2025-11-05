import React from "react";
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Avatar, 
  DropdownMenu,
  TextField
} from "@radix-ui/themes";
import { useThemeToggle } from '../../ThemeProvider';
import { useNavigate } from "react-router-dom";

// Add props to accept toggle handler
const Navbar: React.FC<{ onSidebarToggle?: () => void }> = ({ onSidebarToggle }) => {
  const { isDark, toggle } = useThemeToggle();
  const navigate = useNavigate();
  return (
<Box
  style={{
    backgroundColor: "var(--color-panel)",
    borderBottom: "1px solid var(--accent-6)",
    padding: "0 24px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backdropFilter: "blur(8px)",
    boxSizing: "border-box",
  }}
>

      <Flex justify="between" align="center" style={{ height: "70px" }}>
        {/* Left Section */}
        <Flex align="center" gap="6">
          {/* Sidebar Toggle Button */}
          {onSidebarToggle && (
            <Button 
              variant="ghost" 
              size="2"
              onClick={onSidebarToggle}
              style={{ minWidth: "auto", padding: "6px" }}
            >
              <MenuIcon size={16} />
            </Button>
          )}

  
<Text 
  size="5" 
  weight="bold" 
  style={{ 
    fontFamily: "'Playfair Display', 'Georgia', serif",
    background: "linear-gradient(135deg, var(--accent-11) 0%, var(--accent-9) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "0.02em",
    fontSize: "24px",
    fontWeight: 700,
  }}
>
  Safar Wanderlust
</Text>


          {/* Desktop Navigation */}
          <Flex display={{ initial: "none", md: "flex" }} gap="4">
            <NavLink href="/">Home</NavLink>
            
          </Flex>
        </Flex>

        {/* Right Section - Search & Actions */}
        <Flex align="center" gap="4">
          {/* Search Bar */}
          <Box display={{ initial: "none", lg: "block" }}>
            <TextField.Root
              placeholder="Search..."
              size="2"
              style={{ width: "240px" }}
            >
              <TextField.Slot>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z" stroke="var(--accent-11)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </TextField.Slot>
            </TextField.Root>
          </Box>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="2"
            onClick={toggle}
            style={{ 
              minWidth: "auto",
              padding: "6px"
            }}
          >
            {isDark ? (
              <SunIcon size={16} />
            ) : (
              <MoonIcon size={16} />
            )}
          </Button>

          {/* Auth Buttons - Desktop */}
          <Flex display={{ initial: "none", sm: "flex" }} align="center" gap="2">
            <Button variant="ghost" size="2">
             Sign Up
            </Button>
            <Button onClick={() => navigate('/login')} size="2">
              Login
            </Button>
          </Flex>

          {/* Mobile Menu */}
          <Box display={{ sm: "none" }}>
            <MobileMenuDropdown />
          </Box>

          <AvatarDropdown />
        </Flex>
      </Flex>
    </Box>
  );
};

// Improved NavLink Component
const NavLink = ({ href, children }: { href: string; children: string }) => {
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
        color: "var(--accent-11)",
        fontSize: "14px",
        fontWeight: 500,
        padding: "8px 12px",
        borderRadius: "6px",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "var(--accent-4)";
        e.currentTarget.style.color = "var(--accent-12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--accent-11)";
      }}
    >
      {children}
    </a>
  );
};

// Mobile Menu using DropdownMenu (Proper Radix UI)
const MobileMenuDropdown: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button 
          variant="ghost" 
          size="2"
          style={{ minWidth: "auto", padding: "6px" }}
        >
          <MenuIcon size={16} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content style={{ minWidth: "200px" }}>
        <DropdownMenu.Item>Home</DropdownMenu.Item>
        <DropdownMenu.Item>Features</DropdownMenu.Item>
        <DropdownMenu.Item>Pricing</DropdownMenu.Item>
        <DropdownMenu.Item>About</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Sign In</DropdownMenu.Item>
        <DropdownMenu.Item>Sign Up</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

// Avatar Dropdown using DropdownMenu (Proper Radix UI)
const AvatarDropdown: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar
          size="2"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
          fallback="U"
          style={{ 
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content style={{ minWidth: "160px" }}>
        <DropdownMenu.Item>
          <Flex align="center" gap="2">
            <UserIcon size={14} />
            Profile
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Flex align="center" gap="2">
            <SettingsIcon size={14} />
            Settings
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red">
          <Flex align="center" gap="2">
            <LogoutIcon size={14} />
            Logout
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

// Icon Components
const SunIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 1V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 8L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13.071 13.071L12.364 12.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3.636 3.636L2.929 2.929" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13.071 2.929L12.364 3.636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3.636 12.364L2.929 13.071" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0656 9.50621C13.4125 9.69371 12.7219 9.79684 12.0062 9.79684C8.36874 9.79684 5.42187 6.84996 5.42187 3.21246C5.42187 2.49684 5.52499 1.80621 5.71249 1.15309C3.39374 2.12809 1.78749 4.38121 1.78749 6.99996C1.78749 10.6375 4.73437 13.5843 8.37187 13.5843C10.9906 13.5843 13.2437 11.9781 14.2187 9.65934C14.0719 9.60309 13.95 9.57184 13.8531 9.55309C13.7844 9.54059 13.7219 9.53121 13.6687 9.52496C13.5656 9.51246 13.4781 9.50621 13.4125 9.50621H14.0656Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UserIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 14V12.6667C13 11.9594 12.719 11.2811 12.219 10.781C11.7189 10.281 11.0406 10 10.3333 10H5.66667C4.95942 10 4.28115 10.281 3.78105 10.781C3.28095 11.2811 3 11.9594 3 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.15 6.66667L12.5 5.5L13.5 4.5L12.5 3.5L11.5 4.5L10.3333 3.85V2.66667H9.16667L8.5 2H7.5L6.83333 2.66667H5.66667L5 3.85L3.83333 4.5L2.83333 3.5L1.83333 4.5L2.83333 5.5L2.16667 6.66667V7.83333L1.5 8.5V9.5L2.16667 10.1667V11.3333L2.83333 12.5L1.83333 13.5L2.83333 14.5L3.83333 13.5L5 14.15V15.3333H6.16667L6.83333 16H7.83333L8.5 15.3333H9.66667L10.3333 14.15L11.5 13.5L12.5 14.5L13.5 13.5L12.5 12.5L13.15 11.3333V10.1667L13.8333 9.5V8.5L13.15 7.83333V6.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Navbar;