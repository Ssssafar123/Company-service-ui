import React, { useState } from "react";
import { Flex } from "@radix-ui/themes";
import DynamicAlertDialog from "../components/dynamicComponents/Card";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

type Permission = "read" | "write" | "create" | "delete" | "admin";

const menuItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "form", label: "Form", path: "/test-form" },
  { id: "table", label: "Table", path: "/table" },
  { id: "test2", label: "Test 2", path: "/test2" },
  { id: "admin", label: "Admin", path: "/admin", permission: "admin" as Permission },
];

const user = {
  name: "Rohit Sharma",
  email: "rohit.sharma@example.com",
  permissions: ["read", "write", "admin"] as Permission[],
  avatar: "https://i.pravatar.cc/40?img=3",
};

export default function MyApp() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar
          user={user}
          menuItems={menuItems}
          onNavigate={(path) => navigate(path)}
          collapsed={collapsed}
        />

        <main style={{ flex: 1, padding: 20 }}>
          <button  onClick={() => setCollapsed((s) => !s)} style={{ marginBottom: 12, cursor: "pointer" }}>
            ☰
          </button>

          <Flex direction="column" gap="4">
            <DynamicAlertDialog
              triggerText="Go to next page"
              title="Go to next page"
              description="Are you sure you want to go to next page? This action can be undone."
              cancelText="Cancel"
              actionText="Yes"
              onAction={() => navigate("/test2")}
              color="red"
            />
            <DynamicAlertDialog
              triggerText="Test Dynamic Table"
              title="Dynamic Table test"
              description="Do you want to Test Table dynamic component ?"
              cancelText="Stay"
              actionText="Yes"
              onAction={() => navigate("/table")}
              color="blue"
            />
            <DynamicAlertDialog
              triggerText="Upgrade Plan"
              title="Upgrade Plan"
              description="Upgrade to premium to unlock advanced features and priority support."
              cancelText="Not Now"
              actionText="Upgrade"
              onAction={() => alert("Plan upgraded!")}
              color="green"
            />
            <DynamicAlertDialog
              triggerText="Reset Password"
              title="Reset Password"
              description="Are you sure you want to reset your password? You will receive a reset link via email."
              cancelText="Cancel"
              actionText="Reset"
              onAction={() => alert("Password reset link sent!")}
              color="gray"
            />
            <DynamicAlertDialog
              triggerText="Archive Project"
              title="Archive Project"
              description="Archiving will remove the project from your active list. You can restore it later."
              cancelText="Cancel"
              actionText="Archive"
              onAction={() => alert("Project archived!")}
              color="blue"
            />
          </Flex>
        </main>
      </div>
    </div>
  );
}