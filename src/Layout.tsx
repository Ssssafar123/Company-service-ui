import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onSidebarToggle={() => setCollapsed(s => !s)} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar 
          user={{
            name: "Rohit Sharma",
            email: "rohit.sharma@example.com",
            permissions: ["read", "write", "admin"],
            avatar: "https://i.pravatar.cc/40?img=3",
          }}
          menuItems={[
            {id: "itinerary" , label: "Itinerary", path: "/itinerary"},
            { id: "home", label: "Home", path: "/" },
            { id: "form", label: "Form", path: "/test-form" },
            { id: "table", label: "Table", path: "/table" },
            { id: "test2", label: "Test 2", path: "/test2" },
          ]}
          collapsed={collapsed}
          onToggle={() => setCollapsed(s => !s)}
          onNavigate={(path) => navigate(path)}
        />
        <main style={{ 
          flex: 1, 
          padding: 20,
          marginLeft: collapsed ? "70px" : "280px",
          transition: "margin-left 0.25s ease",
          marginTop: "64px"
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout