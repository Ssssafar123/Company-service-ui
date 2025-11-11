import React, { useState } from 'react'
import { Box, Flex, Text, TextField, Badge, Checkbox } from '@radix-ui/themes'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

const CustomizeLeads: React.FC = () => {
	// Dummy data for statistics
	const totalLeads = 10
	const todayLeads = 2
	const convertedLeads = 1

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [activeFilter, setActiveFilter] = useState<string>('All')
	const [searchQuery, setSearchQuery] = useState('')

	// Dummy leads data - Updated with customize and requests types
	const leadsData = [
		{
			id: 1,
			name: 'Priyanshu',
			badgeType: 'customize',
			leadId: '2142599',
			time: 'Today at 7:15 PM',
			phone: '6367710137',
			destination: 'Manali & Kasol | Group',
			packageCode: '#MKP02',
			remarks: 'interested',
			status: 'Hot',
			contacted: 'Contacted',
			assignedTo: 'Rohit',
		},
		{
			id: 2,
			name: 'Aarav Kumar',
			badgeType: 'requests',
			leadId: '2142600',
			time: 'Today at 6:30 PM',
			phone: '9876543210',
			destination: 'Goa Beach | Solo',
			packageCode: '#GB01',
			remarks: 'wants discount',
			status: 'Warm',
			contacted: 'Not Contacted',
			assignedTo: 'Shivam',
		},
		{
			id: 3,
			name: 'Sneha Patel',
			badgeType: 'customize',
			leadId: '2142601',
			time: 'Today at 5:45 PM',
			phone: '8765432109',
			destination: 'Kerala Backwaters | Family',
			packageCode: '#KB03',
			remarks: 'budget friendly',
			status: 'Hot',
			contacted: 'Contacted',
			assignedTo: 'Sonia',
		},
		{
			id: 4,
			name: 'Rahul Singh',
			badgeType: 'requests',
			leadId: '2142602',
			time: 'Today at 4:20 PM',
			phone: '7654321098',
			destination: 'Ladakh Adventure | Group',
			packageCode: '#LA05',
			remarks: 'needs info',
			status: 'Cold',
			contacted: 'Not Contacted',
			assignedTo: 'Rohit',
		},
		{
			id: 5,
			name: 'Priya Sharma',
			badgeType: 'customize',
			leadId: '2142603',
			time: 'Today at 3:10 PM',
			phone: '6543210987',
			destination: 'Rajasthan Heritage | Couple',
			packageCode: '#RH07',
			remarks: 'ready to book',
			status: 'Hot',
			contacted: 'Contacted',
			assignedTo: 'Shivam',
		},
		{
			id: 6,
			name: 'Vikram Reddy',
			badgeType: 'requests',
			leadId: '2142604',
			time: 'Today at 2:05 PM',
			phone: '5432109876',
			destination: 'Shimla Manali | Family',
			packageCode: '#SM09',
			remarks: 'comparing prices',
			status: 'Warm',
			contacted: 'Not Contacted',
			assignedTo: 'Sonia',
		},
		{
			id: 7,
			name: 'Ananya Verma',
			badgeType: 'customize',
			leadId: '2142605',
			time: 'Today at 1:30 PM',
			phone: '4321098765',
			destination: 'Andaman Islands | Honeymoon',
			packageCode: '#AI11',
			remarks: 'interested in luxury',
			status: 'Hot',
			contacted: 'Contacted',
			assignedTo: 'Rohit',
		},
		{
			id: 8,
			name: 'Karan Mehta',
			badgeType: 'requests',
			leadId: '2142606',
			time: 'Today at 12:15 PM',
			phone: '3210987654',
			destination: 'Darjeeling Tea Gardens | Solo',
			packageCode: '#DT13',
			remarks: 'price too high',
			status: 'Cold',
			contacted: 'Not Contacted',
			assignedTo: 'Shivam',
		},
		{
			id: 9,
			name: 'Divya Nair',
			badgeType: 'customize',
			leadId: '2142607',
			time: 'Today at 11:00 AM',
			phone: '2109876543',
			destination: 'Udaipur Palace Tour | Couple',
			packageCode: '#UP15',
			remarks: 'wants customization',
			status: 'Warm',
			contacted: 'Contacted',
			assignedTo: 'Sonia',
		},
		{
			id: 10,
			name: 'Arjun Gupta',
			badgeType: 'requests',
			leadId: '2142608',
			time: 'Today at 10:00 AM',
			phone: '1098765432',
			destination: 'Rishikesh Rafting | Group',
			packageCode: '#RR17',
			remarks: 'confirm availability',
			status: 'Hot',
			contacted: 'Contacted',
			assignedTo: 'Rohit',
		},
	]

	// Filter leads based on active filter and search query
	const filteredLeads = leadsData.filter((lead) => {
		// Search filter
		const matchesSearch =
			!searchQuery ||
			lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lead.leadId.includes(searchQuery) ||
			lead.phone.includes(searchQuery) ||
			lead.destination.toLowerCase().includes(searchQuery.toLowerCase())

		// Status filter
		if (activeFilter === 'All') {
			return matchesSearch && (lead.badgeType === 'customize' || lead.badgeType === 'requests')
		} else if (activeFilter === 'Customize') {
			return matchesSearch && lead.badgeType === 'customize'
		} else if (activeFilter === 'Requests') {
			return matchesSearch && lead.badgeType === 'requests'
		} else if (['Hot', 'Warm', 'Cold'].includes(activeFilter)) {
			return matchesSearch && lead.status === activeFilter && (lead.badgeType === 'customize' || lead.badgeType === 'requests')
		} else if (activeFilter === 'Remainder') {
			return matchesSearch && lead.contacted === 'Not Contacted' && (lead.badgeType === 'customize' || lead.badgeType === 'requests')
		}

		return matchesSearch
	})

	// Calculate pagination values
	const totalItems = filteredLeads.length
	const totalPages = Math.ceil(totalItems / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentLeads = filteredLeads.slice(startIndex, endIndex)

	// Reset to page 1 when items per page changes or filter changes
	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage)
		setCurrentPage(1)
	}

	const handleFilterClick = (filter: string) => {
		setActiveFilter(filter)
		setCurrentPage(1)
	}

	const WhatsAppIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				display: 'inline-block',
				verticalAlign: 'middle',
				marginLeft: '4px',
			}}
		>
			<path
				d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
				fill="#25D366"
			/>
			<path
				d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.298c-1.778 0-3.524-.477-5.042-1.377l-.362-.214-3.754.982.999-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.002 5.45-4.436 9.884-9.864 9.884z"
				fill="#25D366"
			/>
		</svg>
	)

	const PhoneIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				display: 'inline-block',
				verticalAlign: 'middle',
				marginLeft: '4px',
			}}
		>
			<path
				d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)

	const AddIcon = () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				display: 'inline-block',
				verticalAlign: 'middle',
				marginRight: '6px',
			}}
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
			<path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)

	const MessageIcon = () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				display: 'inline-block',
				verticalAlign: 'middle',
				marginLeft: '4px',
			}}
		>
			<path
				d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)

	return (
		<Box
			style={{
				width: '100%',
				maxWidth: '100%',
				padding: '24px',
				boxSizing: 'border-box',
				overflowX: 'hidden',
				overflowY: 'visible',
			}}
		>
			{/* Title */}
			<Text size="8" weight="regular" style={{ color: 'var(--accent-12)', marginBottom: '24px', display: 'block' }}>
				Customize Leads
			</Text>

			{/* Statistics Cards - Responsive Grid */}
			<Flex
				gap="4"
				mb="4"
				wrap="wrap"
				style={{
					marginTop: '20px',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{/* Overall Leads Captured */}
				<Box
					style={{
						border: '1px solid #e5e7eb',
						flex: '1 1 300px',
						minWidth: '250px',
						maxWidth: '100%',
						height: '90px',
						borderRadius: '10px',
						display: 'flex',
						textAlign: 'center',
						padding: '16px',
						boxSizing: 'border-box',
					}}
				>
					<Flex direction="column" justify="center" style={{ width: '100%' }}>
						<Text
							size="2"
							style={{
								marginBottom: '8px',
								color: 'gray',
							}}
						>
							Overall Leads Captured
						</Text>
						<Text
							size="6"
							style={{
								fontSize: '20px',
								fontWeight: 'bold',
							}}
						>
							{totalLeads.toLocaleString()}
						</Text>
					</Flex>
				</Box>

				{/* Today's Leads */}
				<Box
					style={{
						border: '1px solid #e5e7eb',
						flex: '1 1 300px',
						minWidth: '250px',
						maxWidth: '100%',
						height: '90px',
						borderRadius: '10px',
						display: 'flex',
						textAlign: 'center',
						padding: '16px',
						boxSizing: 'border-box',
					}}
				>
					<Flex direction="column" justify="center" style={{ width: '100%' }}>
						<Text
							size="2"
							style={{
								marginBottom: '8px',
								color: 'gray',
							}}
						>
							Today Leads Captured
						</Text>
						<Text
							size="6"
							style={{
								fontSize: '20px',
								fontWeight: 'bold',
							}}
						>
							{todayLeads.toLocaleString()}
						</Text>
					</Flex>
				</Box>

				{/* Overall Leads Converted */}
				<Box
					style={{
						border: '1px solid #e5e7eb',
						flex: '1 1 300px',
						minWidth: '250px',
						maxWidth: '100%',
						height: '90px',
						borderRadius: '10px',
						display: 'flex',
						textAlign: 'center',
						padding: '16px',
						boxSizing: 'border-box',
					}}
				>
					<Flex direction="column" justify="center" style={{ width: '100%' }}>
						<Text
							size="2"
							style={{
								marginBottom: '8px',
								color: 'gray',
							}}
						>
							Overall Leads Converted
						</Text>
						<Text
							size="6"
							style={{
								fontSize: '20px',
								fontWeight: 'bold',
							}}
						>
							{convertedLeads.toLocaleString()}
						</Text>
					</Flex>
				</Box>
			</Flex>

			{/* Search and Actions Bar - Responsive */}
			<Flex
				gap="3"
				wrap="wrap"
				align="center"
				style={{
					marginTop: '20px',
					marginBottom: '15px',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				<TextField.Root
					placeholder="Search..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value)
						setCurrentPage(1)
					}}
					style={{
						flex: '1 1 300px',
						minWidth: '200px',
						maxWidth: '100%',
					}}
				>
					<TextField.Slot>
						<MagnifyingGlassIcon height="16" width="16" />
					</TextField.Slot>
				</TextField.Root>

				<Flex gap="2" wrap="wrap">
					<Box
						style={{
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							padding: '8px 16px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							whiteSpace: 'nowrap',
						}}
					>
						Actions
					</Box>
					<Box
						style={{
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							padding: '8px 16px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							whiteSpace: 'nowrap',
						}}
					>
						Refresh
					</Box>
				</Flex>
			</Flex>

			{/* Filter Buttons - Responsive - Updated with Customize and Requests */}
			<Flex
				wrap="wrap"
				gap="2"
				style={{
					marginTop: '15px',
					marginBottom: '15px',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{['All', 'Hot', 'Warm', 'Cold', 'Remainder', 'Customize', 'Requests'].map((filter) => (
					<Box
						key={filter}
						onClick={() => handleFilterClick(filter)}
						style={{
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							padding: '8px 16px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							cursor: 'pointer',
							whiteSpace: 'nowrap',
							minWidth: '60px',
							backgroundColor: activeFilter === filter ? '#000' : 'transparent',
							color: activeFilter === filter ? '#fff' : 'inherit',
						}}
					>
						<Text size="2">{filter}</Text>
					</Box>
				))}

				<Flex
					style={{
						marginLeft: 'auto',
						alignItems: 'center',
					}}
				>
					<Text size="2" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
						Showing <span style={{ fontWeight: 'bold' }}>{startIndex + 1}</span> to{' '}
						<span style={{ fontWeight: 'bold' }}>{Math.min(endIndex, totalItems)}</span> of{' '}
						<span style={{ fontWeight: 'bold' }}>{totalItems}</span> lead(s)
					</Text>
				</Flex>
			</Flex>

			{/* Table Container - No Scroll, Fits Width */}
			<Box
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '20px',
					width: '100%',
					maxWidth: '100%',
					border: '1px solid #e5e7eb',
					paddingTop: '10px',
					borderRadius: '5px',
					overflowX: 'hidden',
					overflowY: 'visible',
					boxSizing: 'border-box',
				}}
			>
				{/* Table Header */}
				<Flex
					style={{
						display: 'flex',
						paddingBottom: '10px',
						borderBottom: '1px solid #e5e7eb',
						paddingLeft: '10px',
						paddingRight: '10px',
						width: '100%',
						boxSizing: 'border-box',
					}}
				>
					{/* S.No Header */}
					<Box style={{ width: '6%', minWidth: '50px', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
						<Checkbox style={{ marginRight: '6px' }} />
						<Text style={{ fontSize: '12px' }}>S.No.</Text>
					</Box>

					{/* Lead Details Header */}
					<Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Lead Details</Text>
					</Box>

					{/* Enquiry Details Header */}
					<Box style={{ width: '20%', minWidth: '160px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Enquiry Details</Text>
					</Box>

					{/* Remarks Header */}
					<Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Remarks & Reminders</Text>
					</Box>

					{/* Quick Actions Header */}
					<Box style={{ width: '14%', minWidth: '120px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Quick Actions</Text>
					</Box>

					{/* Assigned To Header */}
					<Box style={{ width: '12%', minWidth: '100px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Assigned To</Text>
					</Box>

					{/* Actions Header */}
					<Box style={{ width: '10%', minWidth: '80px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Actions</Text>
					</Box>
				</Flex>

				{/* Table Body */}
				{currentLeads.map((lead, index) => (
					<Flex
						key={lead.id}
						style={{
							marginTop: '10px',
							borderBottom: index < currentLeads.length - 1 ? '1px solid #e5e7eb' : 'none',
							paddingBottom: '10px',
							paddingLeft: '10px',
							paddingRight: '10px',
							width: '100%',
							boxSizing: 'border-box',
						}}
					>
						<Box
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								minHeight: '100px',
							}}
						>
							{/* S.No Column */}
							<Box
								style={{
									width: '6%',
									minWidth: '50px',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingRight: '8px',
								}}
							>
								<Checkbox
									style={{
										marginTop: '2px',
										cursor: 'pointer',
									}}
									size="2"
								/>
								<Text
									style={{
										paddingLeft: '2px',
										fontSize: '13px',
									}}
								>
									{startIndex + index + 1}
								</Text>
							</Box>

							{/* Lead Details Column */}
							<Box
								style={{
									width: '16%',
									minWidth: '140px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Text
									style={{
										fontWeight: 'bold',
										textDecoration: 'underline',
										fontSize: '13px',
									}}
								>
									{lead.name}
								</Text>
								<Text style={{ fontSize: '12px' }}>ID : {lead.leadId}</Text>

								{lead.badgeType === 'customize' ? (
									<Box
										style={{
											width: '75px',
											height: '26px',
											borderRadius: '10px',
											backgroundColor: '#8b5cf6',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											color: 'white',
											fontSize: '11px',
										}}
									>
										Customize
									</Box>
								) : lead.badgeType === 'requests' ? (
									<Box
										style={{
											width: '75px',
											height: '26px',
											borderRadius: '10px',
											backgroundColor: '#10b981',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											color: 'white',
											fontSize: '11px',
										}}
									>
										Requests
									</Box>
								) : null}

								<Text style={{ fontSize: '12px' }}>{lead.time}</Text>
							</Box>

							{/* Enquiry Details Column */}
							<Box
								style={{
									width: '20%',
									minWidth: '160px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Text style={{ fontSize: '12px' }}>
									{lead.phone} | <WhatsAppIcon /> <PhoneIcon />
								</Text>
								<Text style={{ fontSize: '12px' }}>{lead.destination}</Text>
								<span
									style={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<MessageIcon />
									<Text
										style={{
											marginLeft: '4px',
											fontSize: '12px',
										}}
									>
										{lead.packageCode}
									</Text>
								</span>
							</Box>

							{/* Remarks Column */}
							<Box
								style={{
									width: '16%',
									minWidth: '140px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Text style={{ fontSize: '12px' }}>Remarks</Text>
								<Text style={{ fontSize: '12px' }}>{lead.remarks}</Text>
								<span
									style={{
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<AddIcon />
									<Text
										style={{
											textDecoration: 'underline',
											fontSize: '11px',
										}}
									>
										Add Remark
									</Text>
								</span>
							</Box>

							{/* Quick Actions Column */}
							<Box
								style={{
									width: '14%',
									minWidth: '120px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<select
									id={`status-${lead.id}`}
									style={{
										width: '100%',
										maxWidth: '110px',
										height: '32px',
										border: '2px solid #e5e7eb',
										borderRadius: '5px',
										fontSize: '12px',
										padding: '4px 8px',
									}}
								>
									<option value="Hot" selected={lead.status === 'Hot'}>
										Hot
									</option>
									<option value="Warm" selected={lead.status === 'Warm'}>
										Warm
									</option>
									<option value="Cold" selected={lead.status === 'Cold'}>
										Cold
									</option>
								</select>
								<select
									id={`contact-${lead.id}`}
									style={{
										width: '100%',
										maxWidth: '110px',
										height: '32px',
										border: '2px solid #e5e7eb',
										borderRadius: '5px',
										fontSize: '12px',
										padding: '4px 8px',
									}}
								>
									<option value="Contacted" selected={lead.contacted === 'Contacted'}>
										Contacted
									</option>
									<option value="Not Contacted" selected={lead.contacted === 'Not Contacted'}>
										Not Contacted
									</option>
								</select>
								<Text
									style={{
										fontWeight: 'bold',
										fontSize: '11px',
										cursor: 'pointer',
									}}
								>
									More
								</Text>
							</Box>

							{/* Assigned To Column */}
							<Box
								style={{
									width: '12%',
									minWidth: '100px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<select
									id={`assign-${lead.id}`}
									style={{
										width: '100%',
										maxWidth: '110px',
										height: '32px',
										border: '1px solid #e5e7eb',
										borderRadius: '5px',
										fontSize: '12px',
										padding: '4px 8px',
									}}
								>
									<option value="Rohit" selected={lead.assignedTo === 'Rohit'}>
										Rohit
									</option>
									<option value="Shivam" selected={lead.assignedTo === 'Shivam'}>
										Shivam
									</option>
									<option value="Sonia" selected={lead.assignedTo === 'Sonia'}>
										Sonia
									</option>
								</select>
							</Box>

							{/* Actions Column */}
							<Box
								style={{
									width: '10%',
									minWidth: '80px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px',
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Box
									style={{
										backgroundColor: 'black',
										width: '100%',
										maxWidth: '90px',
										height: '32px',
										border: '1px solid #e5e7eb',
										borderRadius: '5px',
										color: 'white',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										cursor: 'pointer',
									}}
								>
									<Text
										style={{
											color: 'white',
											textAlign: 'center',
											fontSize: '12px',
										}}
									>
										Actions
									</Text>
								</Box>
							</Box>
						</Box>
					</Flex>
				))}
			</Box>

			{/* Pagination - Responsive */}
			<Flex
				wrap="wrap"
				gap="3"
				style={{
					marginTop: '20px',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '15px 0',
					borderTop: '1px solid #e5e7eb',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{/* Left side - Items per page */}
				<Flex
					style={{
						alignItems: 'center',
						gap: '10px',
						flex: '1 1 auto',
						minWidth: '200px',
					}}
				>
					<Text
						style={{
							fontSize: '14px',
							color: '#6b7280',
							whiteSpace: 'nowrap',
						}}
					>
						Rows per page:
					</Text>
					<select
						value={itemsPerPage}
						onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
						style={{
							width: '80px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							padding: '5px 10px',
							cursor: 'pointer',
							fontSize: '14px',
						}}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
					</select>
				</Flex>

				{/* Center - Page info */}
				<Text
					style={{
						fontSize: '14px',
						color: '#6b7280',
						whiteSpace: 'nowrap',
						margin: '0 16px',
					}}
				>
					Page <span style={{ fontWeight: 'bold', color: '#000' }}>{currentPage}</span> of{' '}
					<span style={{ fontWeight: 'bold', color: '#000' }}>{totalPages}</span>
				</Text>

				{/* Right side - Navigation buttons */}
				<Flex
					style={{
						gap: '8px',
						alignItems: 'center',
						flex: '1 1 auto',
						justifyContent: 'flex-end',
						minWidth: '200px',
					}}
				>
					{/* Previous button */}
					<Box
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						style={{
							width: '35px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
							opacity: currentPage === 1 ? 0.5 : 1,
							backgroundColor: 'white',
							transition: 'all 0.2s',
						}}
					>
						<ChevronLeftIcon width="18" height="18" />
					</Box>

					{/* Dynamic page numbers */}
					{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
						let pageNum
						if (totalPages <= 5) {
							pageNum = i + 1
						} else if (currentPage <= 3) {
							pageNum = i + 1
						} else if (currentPage >= totalPages - 2) {
							pageNum = totalPages - 4 + i
						} else {
							pageNum = currentPage - 2 + i
						}

						return (
							<Box
								key={pageNum}
								onClick={() => setCurrentPage(pageNum)}
								style={{
									width: '35px',
									height: '35px',
									border: '1px solid #e5e7eb',
									borderRadius: '5px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									backgroundColor: currentPage === pageNum ? '#000' : '#fff',
									color: currentPage === pageNum ? '#fff' : '#000',
									fontWeight: currentPage === pageNum ? 'bold' : 'normal',
									fontSize: '14px',
									transition: 'all 0.2s',
								}}
							>
								{pageNum}
							</Box>
						)
					})}

					{/* Next button */}
					<Box
						onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
						style={{
							width: '35px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
							opacity: currentPage === totalPages ? 0.5 : 1,
							backgroundColor: 'white',
							transition: 'all 0.2s',
						}}
					>
						<ChevronRightIcon width="18" height="18" />
					</Box>
				</Flex>
			</Flex>
		</Box>
	)
}

export default CustomizeLeads