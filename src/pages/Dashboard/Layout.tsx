import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'

const HomeIcon = (props : any) =>{
  return(

    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-6 h-6"
    {...props}
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l9.75-9 9.75 9m-1.5 0v9.75A1.5 1.5 0 0118.75 22.5H5.25A1.5 1.5 0 013.75 21.75V12" />
</svg>
)
}

const ItineraryIcon = () => {
  return(

    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
  )
}
const CategoryIcon = () => {
  return(
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);



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
            {id: "itinerary" , label: "Itinerary", path: "/dashboard/itinerary", icon : <ItineraryIcon/>},
            {id: "add-itinerary" , label: "Category", path: "/dashboard/category", icon : <CategoryIcon/>},
            { id: "home", label: "Home", path: "/", icon :<HomeIcon/>},
            // { id: "form", label: "Form", path: "/test-form" },
            // { id: "table", label: "Table", path: "/table" },
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