import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Card,
	AlertDialog,
	DropdownMenu,
	IconButton,
	Badge,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'
import AddBookingForm from './AddBookingForm'

type BookingData = {
	id: string
	bookingId: string
	customerName: string
	customerEmail: string
	customerPhone: string
	itinerary: string
	bookingDate: string
	travelDate: string
	numberOfTravelers: number
	totalAmount: number
	status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
	paymentStatus?: 'paid' | 'pending' |'  refunded'
}

// Dummy booking data - 10 entries
const dummyBookings: BookingData[] = [
	{
		id: '1',
		bookingId: 'BK001',
		customerName: 'John Doe',
		customerEmail: 'john@example.com',
		customerPhone: '+91 98765 43210',
		itinerary: 'Manali Kasol | Best Selling - Manali',
		bookingDate: '2024-01-15',
		travelDate: '2024-02-20',
		numberOfTravelers: 2,
		totalAmount: 25000,
		status: 'confirmed',
		paymentStatus: 'paid',
	},
	{
		id: '2',
		bookingId: 'BK002',
		customerName: 'Jane Smith',
		customerEmail: 'jane@example.com',
		customerPhone: '+91 98765 43211',
		itinerary: 'Udaipur Mount Abu Weekend Group Trip 2D 1N',
		bookingDate: '2024-01-18',
		travelDate: '2024-03-10',
		numberOfTravelers: 4,
		totalAmount: 45000,
		status: 'pending',
		paymentStatus: 'pending',
	},
	{
		id: '3',
		bookingId: 'BK003',
		customerName: 'Mike Johnson',
		customerEmail: 'mike@example.com',
		customerPhone: '+91 98765 43212',
		itinerary: 'Pachmarhi | Ex- Indore - Pachmarhi',
		bookingDate: '2024-01-20',
		travelDate: '2024-02-15',
		numberOfTravelers: 1,
		totalAmount: 12000,
		status: 'confirmed',
		paymentStatus: 'paid',
	},
	{
		id: '4',
		bookingId: 'BK004',
		customerName: 'Sarah Williams',
		customerEmail: 'sarah@example.com',
		customerPhone: '+91 98765 43213',
		itinerary: 'Goa Beach Tour | 3 Days 2 Nights',
		bookingDate: '2024-01-22',
		travelDate: '2024-03-25',
		numberOfTravelers: 3,
		totalAmount: 35000,
		status: 'confirmed',
		paymentStatus: 'paid',
	},
	{
		id: '5',
		bookingId: 'BK005',
		customerName: 'David Brown',
		customerEmail: 'david@example.com',
		customerPhone: '+91 98765 43214',
		itinerary: 'Kerala Backwaters | Alleppey Houseboat',
		bookingDate: '2024-01-25',
		travelDate: '2024-04-05',
		numberOfTravelers: 2,
		totalAmount: 28000,
		status: 'pending',
		paymentStatus: 'pending',
	},
	{
		id: '6',
		bookingId: 'BK006',
		customerName: 'Emily Davis',
		customerEmail: 'emily@example.com',
		customerPhone: '+91 98765 43215',
		itinerary: 'Rajasthan Heritage Tour | Jaipur Udaipur',
		bookingDate: '2024-01-28',
		travelDate: '2024-03-20',
		numberOfTravelers: 5,
		totalAmount: 55000,
		status: 'completed',
		paymentStatus: 'paid',
	},
	{
		id: '7',
		bookingId: 'BK007',
		customerName: 'Robert Wilson',
		customerEmail: 'robert@example.com',
		customerPhone: '+91 98765 43216',
		itinerary: 'Himachal Pradesh | Shimla Manali',
		bookingDate: '2024-02-01',
		travelDate: '2024-04-15',
		numberOfTravelers: 2,
		totalAmount: 32000,
		status: 'cancelled',
		paymentStatus: 'refunded',
	},
	{
		id: '8',
		bookingId: 'BK008',
		customerName: 'Lisa Anderson',
		customerEmail: 'lisa@example.com',
		customerPhone: '+91 98765 43217',
		itinerary: 'Darjeeling Gangtok | Hill Station Tour',
		bookingDate: '2024-02-05',
		travelDate: '2024-05-01',
		numberOfTravelers: 4,
		totalAmount: 48000,
		status: 'confirmed',
		paymentStatus: 'paid',
	},
	{
		id: '9',
		bookingId: 'BK009',
		customerName: 'James Taylor',
		customerEmail: 'james@example.com',
		customerPhone: '+91 98765 43218',
		itinerary: 'Varanasi Spiritual Tour | 2 Days',
		bookingDate: '2024-02-08',
		travelDate: '2024-04-10',
		numberOfTravelers: 1,
		totalAmount: 15000,
		status: 'pending',
		paymentStatus: 'pending',
	},
	{
		id: '10',
		bookingId: 'BK010',
		customerName: 'Maria Garcia',
		customerEmail: 'maria@example.com',
		customerPhone: '+91 98765 43219',
		itinerary: 'Mumbai City Tour | Gateway of India',
		bookingDate: '2024-02-10',
		travelDate: '2024-03-30',
		numberOfTravelers: 3,
		totalAmount: 22000,
		status: 'confirmed',
		paymentStatus: 'paid',
	},
]

const Bookings: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [bookings, setBookings] = useState<BookingData[]>(dummyBookings)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(['bookingId', 'customerName', 'itinerary', 'bookingDate', 'travelDate', 'numberOfTravelers', 'totalAmount', 'status', 'actions'])
	)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)

	// Form panel state
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingBooking, setEditingBooking] = useState<BookingData | null>(null)

	// Dialog state
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		cancelText?: string
		onConfirm: () => void
		color?: 'red' | 'blue' | 'green' | 'gray'
	} | null>(null)

	// Filter and sort bookings
	const filteredAndSortedBookings = useMemo(() => {
		let filtered = bookings

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = bookings.filter(
				(booking) =>
					booking.bookingId.toLowerCase().includes(query) ||
					booking.customerName.toLowerCase().includes(query) ||
					booking.customerEmail.toLowerCase().includes(query) ||
					booking.customerPhone.includes(query) ||
					booking.itinerary.toLowerCase().includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof BookingData]
				const bValue = b[sortConfig.key as keyof BookingData]

				// Handle undefined values
				if (aValue === undefined && bValue === undefined) return 0
				if (aValue === undefined) return 1
				if (bValue === undefined) return -1

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
				return 0
			})
		}

		return filtered
	}, [bookings, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedBookings = filteredAndSortedBookings.slice(startIndex, endIndex)

	const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
		setSortConfig(direction ? { key: columnKey, direction } : null)
		setCurrentPage(1) // Reset to first page on sort
	}

	const handleHideColumn = (columnKey: string) => {
		setVisibleColumns((prev) => {
			const newSet = new Set(prev)
			newSet.delete(columnKey)
			return newSet
		})
	}

	const handleEdit = (booking: BookingData) => {
		setEditingBooking(booking)
		setIsFormOpen(true)
	}

	const handleFormSubmit = (values: Record<string, any>) => {
		if (editingBooking) {
			// Update existing booking
			setBookings(bookings.map(b => 
				b.id === editingBooking.id 
					? {
						...b,
						bookingId: values.bookingId,
						customerName: values.customerName,
						customerEmail: values.customerEmail,
						customerPhone: values.customerPhone,
						itinerary: values.itinerary,
						bookingDate: values.bookingDate,
						travelDate: values.travelDate,
						numberOfTravelers: parseInt(values.numberOfTravelers) || 1,
						totalAmount: parseFloat(values.totalAmount) || 0,
						status: values.status,
						paymentStatus: values.paymentStatus,
					}
					: b
			))
			setDialogConfig({
				title: 'Success',
				description: `Booking "${values.bookingId}" updated successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		} else {
			// Add new booking
			const newBooking: BookingData = {
				id: Date.now().toString(),
				bookingId: values.bookingId,
				customerName: values.customerName,
				customerEmail: values.customerEmail,
				customerPhone: values.customerPhone,
				itinerary: values.itinerary,
				bookingDate: values.bookingDate,
				travelDate: values.travelDate,
				numberOfTravelers: parseInt(values.numberOfTravelers) || 1,
				totalAmount: parseFloat(values.totalAmount) || 0,
				status: values.status,
				paymentStatus: values.paymentStatus,
			}
			setBookings([...bookings, newBooking])
			setDialogConfig({
				title: 'Success',
				description: `Booking "${values.bookingId}" added successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		}
		setDialogOpen(true)
		setIsFormOpen(false)
		setEditingBooking(null)
	}

	const handleDelete = (booking: BookingData) => {
		setDialogConfig({
			title: 'Delete Booking',
			description: `Are you sure you want to delete booking "${booking.bookingId}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setBookings(bookings.filter((b) => b.id !== booking.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: 'Booking deleted successfully.',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	// Render status badge
	const renderStatus = (status: BookingData['status']) => {
		const statusConfig = {
			confirmed: { label: 'Confirmed', color: 'green' as const },
			pending: { label: 'Pending', color: 'yellow' as const },
			cancelled: { label: 'Cancelled', color: 'red' as const },
			completed: { label: 'Completed', color: 'blue' as const },
		}

		const config = statusConfig[status]
		return (
			<Badge color={config.color} size="2">
				{config.label}
			</Badge>
		)
	}

	// Render amount with currency
	const renderAmount = (amount: number) => {
		return `₹${amount.toLocaleString('en-IN')}`
	}

	// Render date in readable format
	const renderDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		})
	}

	// Render actions menu with dropdown (three dots)
	const renderActions = (booking: BookingData) => {
		return (
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<IconButton variant="ghost" size="2">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="12" cy="12" r="1" />
							<circle cx="12" cy="5" r="1" />
							<circle cx="12" cy="19" r="1" />
						</svg>
					</IconButton>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onClick={() => handleEdit(booking)}>
						<Flex align="center" gap="2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path
									d="M11.5 2.5L13.5 4.5L4.5 13.5H2.5V11.5L11.5 2.5Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<Text size="2">Edit</Text>
						</Flex>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item color="red" onClick={() => handleDelete(booking)}>
						<Flex align="center" gap="2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path
									d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5Z"
									fill="currentColor"
								/>
								<path
									d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z"
									fill="currentColor"
								/>
							</svg>
							<Text size="2">Delete</Text>
						</Flex>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		)
	}

	// Define table columns
	const columns = [
		{
			key: 'bookingId',
			label: 'Booking ID',
			width: '120px',
			sortable: true,
		},
		{
			key: 'customerName',
			label: 'Customer Name',
			width: '180px',
			sortable: true,
		},
		{
			key: 'itinerary',
			label: 'Itinerary',
			width: '250px',
			sortable: true,
		},
		{
			key: 'bookingDate',
			label: 'Booking Date',
			width: '140px',
			sortable: true,
			render: (row: BookingData) => renderDate(row.bookingDate),
		},
		{
			key: 'travelDate',
			label: 'Travel Date',
			width: '140px',
			sortable: true,
			render: (row: BookingData) => renderDate(row.travelDate),
		},
		{
			key: 'numberOfTravelers',
			label: 'Travelers',
			width: '100px',
			sortable: true,
		},
		{
			key: 'totalAmount',
			label: 'Total Amount',
			width: '150px',
			sortable: true,
			render: (row: BookingData) => renderAmount(row.totalAmount),
		},
		{
			key: 'status',
			label: 'Status',
			width: '120px',
			sortable: true,
			render: (row: BookingData) => renderStatus(row.status),
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: BookingData) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Add Booking Form Component */}
			<AddBookingForm
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false)
					setEditingBooking(null)
				}}
				onSubmit={handleFormSubmit}
				initialData={editingBooking ? {
					id: editingBooking.id,
					bookingId: editingBooking.bookingId,
					customerName: editingBooking.customerName,
					customerEmail: editingBooking.customerEmail,
					customerPhone: editingBooking.customerPhone,
					itinerary: editingBooking.itinerary,
					bookingDate: editingBooking.bookingDate,
					travelDate: editingBooking.travelDate,
					numberOfTravelers: editingBooking.numberOfTravelers,
					totalAmount: editingBooking.totalAmount,
					status: editingBooking.status,
					paymentStatus: editingBooking.paymentStatus,
				} : null}
			/>

			{/* Header */}
			<Flex justify="between" align="center" mb="4">
				<Text size="7" weight="bold">
					Bookings
				</Text>
			</Flex>

			{/* Search and Controls */}
			<Flex gap="3" mb="4" align="center" wrap="wrap">
				<TextField.Root
					placeholder="Search bookings..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value)
						setCurrentPage(1)
					}}
					style={{ flex: 1, minWidth: '300px' }}
				>
					<TextField.Slot>
						<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
							<path
								d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
								fill="currentColor"
								fillRule="evenodd"
								clipRule="evenodd"
							/>
						</svg>
					</TextField.Slot>
				</TextField.Root>

				{/* Columns Menu */}
				<Button variant="soft" size="2"
  						onClick={() => {
    					setEditingBooking(null)   // new booking
    					setIsFormOpen(true)      // form open
  					}}
  						style={{
    					color: 'white',
    					backgroundColor: 'var(--accent-9)',
    					whiteSpace: 'nowrap',
						
  					}}
					>
  					Add Booking
				</Button>


				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="soft" size="2">
							Columns
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path
									d="M6 9L1 4H11L6 9Z"
									fill="currentColor"
								/>
							</svg>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content style={{ minWidth: '200px' }}>
						{[
							{ key: 'bookingId', label: 'Booking ID' },
							{ key: 'customerName', label: 'Customer Name' },
							{ key: 'itinerary', label: 'Itinerary' },
							{ key: 'bookingDate', label: 'Booking Date' },
							{ key: 'travelDate', label: 'Travel Date' },
							{ key: 'numberOfTravelers', label: 'Travelers' },
							{ key: 'totalAmount', label: 'Total Amount' },
							{ key: 'status', label: 'Status' },
						].map((col) => (
							<DropdownMenu.Item
								key={col.key}
								onSelect={(e) => {
									e.preventDefault()
									setVisibleColumns((prev) => {
										const newSet = new Set(prev)
										if (newSet.has(col.key)) {
											newSet.delete(col.key)
										} else {
											newSet.add(col.key)
										}
										return newSet
									})
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<input
										type="checkbox"
										checked={visibleColumns.has(col.key)}
										onChange={() => {}}
										style={{ cursor: 'pointer' }}
									/>
									<Text size="2">{col.label}</Text>
								</Flex>
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Flex>

			{/* Table */}
			<Card>
				<Table
					columns={columns}
					rows={paginatedBookings}
					onSort={handleSort}
					sortConfig={sortConfig}
					onHideColumn={handleHideColumn}
				/>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<Flex justify="between" align="center" mt="4">
					<Text size="2" style={{ color: 'var(--gray-11)' }}>
						Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedBookings.length)} of{' '}
						{filteredAndSortedBookings.length} bookings
					</Text>
					<Flex gap="2">
						<Button
							variant="soft"
							size="2"
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<Text size="2" style={{ alignSelf: 'center' }}>
							Page {currentPage} of {totalPages}
						</Text>
						<Button
							variant="soft"
							size="2"
							onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</Flex>
				</Flex>
			)}

			{/* Alert Dialog */}
			<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialog.Content maxWidth="450px">
					<AlertDialog.Title>{dialogConfig?.title}</AlertDialog.Title>
					<AlertDialog.Description size="3">{dialogConfig?.description}</AlertDialog.Description>
					<Flex gap="3" mt="4" justify="end">
						{dialogConfig?.cancelText && (
							<AlertDialog.Cancel>
								<Button variant="soft" color="gray">
									{dialogConfig.cancelText}
								</Button>
							</AlertDialog.Cancel>
						)}
						<AlertDialog.Action>
							<Button
								variant="solid"
								color={dialogConfig?.color || 'blue'}
								onClick={dialogConfig?.onConfirm}
							>
								{dialogConfig?.actionText}
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Box>
	)
}

export default Bookings