import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
	fetchBookings,
	fetchBookingsByPage,
	createBooking,
	updateBookingById,
	deleteBookingById,
	type Booking as BookingType,
} from '../../features/BookingSlice'
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

const Bookings: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const bookings = useSelector((state: RootState) => state.booking.booking)
	const pagination = useSelector((state: RootState) => state.booking.pagination)
	const loading = useSelector((state: RootState) => state.booking.ui.loading)
	const error = useSelector((state: RootState) => state.booking.ui.error)

	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(['bookingId', 'customerName', 'itinerary', 'bookingDate', 'travelDate', 'numberOfTravelers', 'totalAmount', 'status', 'actions'])
	)

	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)

	// Form panel state
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingBooking, setEditingBooking] = useState<BookingType | null>(null)

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

	// Fetch paginated data on mount and when page changes
	useEffect(() => {
		const loadBookings = async () => {
			try {
				await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage })).unwrap()
			} catch (error) {
				console.error('Failed to load bookings:', error)
				// Error is already set in Redux state, so it will show in the error display
			}
		}
		loadBookings()
	}, [dispatch, currentPage, itemsPerPage])

	// Filter and sort bookings
	const filteredAndSortedBookings = useMemo(() => {
		let filtered = bookings

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = bookings.filter(
				(booking: BookingType) =>
					booking.bookingId.toLowerCase().includes(query) ||
					booking.customerName.toLowerCase().includes(query) ||
					booking.customerEmail.toLowerCase().includes(query) ||
					booking.customerPhone.includes(query) ||
					booking.itinerary.toLowerCase().includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a: BookingType, b: BookingType) => {
				const aValue = a[sortConfig.key as keyof BookingType]
				const bValue = b[sortConfig.key as keyof BookingType]

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

	// Use pagination from Redux state
	const totalPages = pagination.totalPages || 1
	const paginatedBookings = filteredAndSortedBookings

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

	const handleEdit = (booking: BookingType) => {
		setEditingBooking(booking)
		setIsFormOpen(true)
	}

	const handleAddNew = () => {
		setEditingBooking(null)
		setIsFormOpen(true)
	}

	const handleFormSubmit = async (values: Omit<BookingType, 'id'>) => {
		try {
			if (editingBooking) {
				// Update existing booking
				await dispatch(
					updateBookingById({
						id: editingBooking.id,
						data: values,
					})
				).unwrap()

				setDialogConfig({
					title: 'Success',
					description: `Booking "${values.bookingId}" updated successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
			} else {
				// Create new booking
				await dispatch(createBooking(values)).unwrap()

				setDialogConfig({
					title: 'Success',
					description: `Booking "${values.bookingId}" added successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
			}

			// Refetch paginated data to ensure UI is in sync
			await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))

			setDialogOpen(true)
			setIsFormOpen(false)
			setEditingBooking(null)
		} catch (error) {
			setDialogConfig({
				title: 'Error',
				description: `Failed to ${editingBooking ? 'update' : 'create'} booking: ${error}`,
				actionText: 'OK',
				color: 'red',
				onConfirm: () => setDialogOpen(false),
			})
			setDialogOpen(true)
		}
	}

	const handleDelete = (booking: BookingType) => {
		setDialogConfig({
			title: 'Delete Booking',
			description: `Are you sure you want to delete booking "${booking.bookingId}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: async () => {
				try {
					await dispatch(deleteBookingById(booking.id)).unwrap()
					
					// Refetch paginated data
					await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))

					setDialogOpen(false)
					setDialogConfig({
						title: 'Success',
						description: 'Booking deleted successfully.',
						actionText: 'OK',
						color: 'green',
						onConfirm: () => setDialogOpen(false),
					})
					setDialogOpen(true)
				} catch (error) {
					setDialogOpen(false)
					setDialogConfig({
						title: 'Error',
						description: `Failed to delete booking: ${error}`,
						actionText: 'OK',
						color: 'red',
						onConfirm: () => setDialogOpen(false),
					})
					setDialogOpen(true)
				}
			},
		})
		setDialogOpen(true)
	}

	// Render status badge
	const renderStatus = (status: BookingType['status']) => {
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
	const renderActions = (booking: BookingType) => {
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
			render: (row: BookingType) => renderDate(row.bookingDate),
		},
		{
			key: 'travelDate',
			label: 'Travel Date',
			width: '140px',
			sortable: true,
			render: (row: BookingType) => renderDate(row.travelDate),
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
			render: (row: BookingType) => renderAmount(row.totalAmount),
		},
		{
			key: 'status',
			label: 'Status',
			width: '120px',
			sortable: true,
			render: (row: BookingType) => renderStatus(row.status),
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: BookingType) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Loading indicator */}
			{loading && (
				<Box style={{ 
					position: 'absolute', 
					top: 0, 
					left: 0, 
					right: 0, 
					bottom: 0, 
					background: 'rgba(0,0,0,0.1)', 
					zIndex: 1000, 
					display: 'flex', 
					alignItems: 'center', 
					justifyContent: 'center' 
				}}>
					<Text>Loading...</Text>
				</Box>
			)}

			{/* Error display */}
			{error && (
				<Box style={{ 
					marginBottom: '16px', 
					padding: '12px', 
					background: 'var(--red-3)', 
					borderRadius: '4px',
					border: '1px solid var(--red-6)'
				}}>
					<Flex justify="between" align="center">
						<Text size="2" color="red" weight="medium">
							Error: {error}
						</Text>
						<Button 
							variant="soft" 
							size="1" 
							color="red"
							onClick={() => {
								dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))
							}}
						>
							Retry
						</Button>
					</Flex>
				</Box>
			)}

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

				<Button 
					variant="soft" 
					size="2"
					onClick={handleAddNew}
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
				<Flex justify="end" align="center" gap="3" style={{ marginTop: '16px' }}>
					<Text size="2" style={{ color: 'var(--accent-11)' }}>
						Page {pagination.page || currentPage} of {totalPages} (Total: {pagination.totalRecords || 0} records)
					</Text>
					<Button 
						variant="soft" 
						size="2" 
						disabled={currentPage === 1} 
						onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
					>
						Previous
					</Button>
					<Button 
						variant="soft" 
						size="2" 
						disabled={currentPage >= totalPages} 
						onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
					>
						Next
					</Button>
				</Flex>
			)}

			{/* Alert Dialog */}
			{dialogConfig && (
				<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialog.Content maxWidth="450px">
						<AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
						<AlertDialog.Description size="3">{dialogConfig.description}</AlertDialog.Description>
						<Flex gap="3" mt="4" justify="end">
							{dialogConfig.cancelText && (
								<AlertDialog.Cancel>
									<Button variant="soft" color="gray">
										{dialogConfig.cancelText}
									</Button>
								</AlertDialog.Cancel>
							)}
							<AlertDialog.Action>
								<Button
									variant="solid"
									color={dialogConfig.color || 'blue'}
									onClick={dialogConfig.onConfirm}
								>
									{dialogConfig.actionText}
								</Button>
							</AlertDialog.Action>
						</Flex>
					</AlertDialog.Content>
				</AlertDialog.Root>
			)}
		</Box>
	)
}

export default Bookings
