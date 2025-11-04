import React, { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";


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
      <div style={{ display: "flex", flex: 1 }}>
        

          Home Page
      </div>
    </div>
  );
}