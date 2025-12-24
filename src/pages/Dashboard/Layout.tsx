import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'

import Dashboard from './Dashboard'

const HomeIcon = (props: any) => {
	return (
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
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}
const CategoryIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	)
}
const LocationIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	)
}

const LeadsIcon = ({ color = 'currentColor', size = 24 }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			role="img"
		>
			<path d="M4 11a8 8 0 0 1 16 0v2" />
			<rect x="2.5" y="11" width="3" height="6" rx="1.2" />
			<rect x="18.5" y="11" width="3" height="6" rx="1.2" />
			<path d="M6 17c0 1.5.8 2.5 2.5 2.5H10" />
		</svg>
	)
}

const DashboardIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="9" y1="21" x2="9" y2="9" />
		</svg>
	)
}

const LibraryIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
			<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
			<path d="M8 7h8M8 11h8M8 15h4" />
		</svg>
	)
}

const BookingsIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <rect x="8" y="14" width="2" height="2" />
            <rect x="14" y="14" width="2" height="2" />
            <rect x="8" y="18" width="2" height="2" />
            <rect x="14" y="18" width="2" height="2" />
        </svg>
    )
}
const ReviewIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
		</svg>
	)
}
const LedgerIcon = () => {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	)
}


const ContentIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
            <path d="M8 13h2" />
            <path d="M8 17h8" />
        </svg>
    )
}

const WebsiteIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

const SalesIcon = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

const InvoiceIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h10M7 11h10M7 15h6" />
        </svg>
    )
}

const PaymentIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <circle cx="7.5" cy="15.5" r="1" />
            <circle cx="11.5" cy="15.5" r="1" />
        </svg>
    )
}

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
            <Navbar onSidebarToggle={() => setCollapsed((s) => !s)} />
            <div style={{ display: 'flex', flex: 1, width: '100%', overflowX: 'hidden' }}>
                <Sidebar
                    user={{
                        name: 'Rohit Sharma',
                        email: 'rohit.sharma@example.com',
                    }}
                    menuItems={[
                        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
                       
                           {
                            id: 'website',
                            label: 'Website',
                            icon: <WebsiteIcon />,
                            children: [
                                { id: 'itinerary', label: 'Itinerary', path: '/dashboard/itinerary', icon: <ItineraryIcon /> },
                                { id: 'category', label: 'Category', path: '/dashboard/category', icon: <CategoryIcon /> },
                                { id: 'location', label: 'Location', path: '/dashboard/location', icon: <LocationIcon /> },
                                { id: 'reviews', label: 'Reviews', path: '/dashboard/review', icon: <ReviewIcon /> },
                                { id: 'bookings', label: 'Bookings', path: '/dashboard/bookings', icon: <BookingsIcon /> },
                                { id: 'content', label: 'Content', path: '/dashboard/content', icon: <ContentIcon /> },
                                { id: 'customers', label: 'Customers', path: '/dashboard/customers', }, 
                            ],
                        },
                         {
                            id: 'leads',
                            label: 'Leads',
                            icon: <LeadsIcon />,
                            children: [
                                { id: 'all-leads', label: 'All Leads', path: '/dashboard/leads' },
                                { id: 'customize-leads', label: 'Customize Leads', path: '/dashboard/customize-leads' },
                            ],
                        },
                        {
                            id: "sales", 
                            label: "Sales", 
                            icon: <SalesIcon />,
                            children: [
                                { id: 'invoice', label: "Invoice", path: '/dashboard/invoice', icon: <InvoiceIcon /> },
                                { id: 'payment', label: "Payment", path: '/dashboard/payment', icon: <PaymentIcon /> },
                                { id: 'ledger', label: "Ledger", path: '/dashboard/ledger', icon: <LedgerIcon /> },
                            ]
                        },
                        {
                            id: 'library',
                            label: 'Library',
                            icon: <LibraryIcon />,
                            children: [
                                { id: 'hotel', label: 'Hotel', path: '/dashboard/library/hotel' },
                                { id: 'activities', label: 'Activities', path: '/dashboard/library/activities' },
                                { id: 'transport', label: 'Transport', path: '/dashboard/library/transport' },
                                { id: 'coordinator', label: 'Coordinator', path: '/dashboard/library/coordinator' },
                                { id: 'local-support', label: 'Local Support', path: '/dashboard/library/local-support' },
                            ],
                        },
                     
                       

                    ]}
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((s) => !s)}
                    onNavigate={(path) => navigate(path)}
                />
                <main
                    style={{
                        flex: 1,
                        padding: '20px',
                        marginLeft: collapsed ? '70px' : '280px',
                        transition: 'margin-left 0.25s ease',
                        marginTop: '64px',
                        width: `calc(100% - ${collapsed ? '70px' : '280px'})`,
                        maxWidth: `calc(100% - ${collapsed ? '70px' : '280px'})`,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout