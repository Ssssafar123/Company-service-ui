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
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'

type HotelData = {
	id: string
	name: string
	city: string
	country: string
	rating: number
	phone: string
}

// Dummy hotel data
const dummyHotels: HotelData[] = [
	{
		id: '1',
		name: 'Grand Plaza Hotel edit',
		city: 'Indore',
		country: 'India',
		rating: 1,
		phone: '09340526306',
	},
	{
		id: '2',
		name: 'Taj Mahal Palace',
		city: 'Mumbai',
		country: 'India',
		rating: 5,
		phone: '022-6665-3366',
	},
	{
		id: '3',
		name: 'Oberoi Udaivilas',
		city: 'Udaipur',
		country: 'India',
		rating: 5,
		phone: '0294-243-3300',
	},
	{
		id: '4',
		name: 'The Leela Palace',
		city: 'New Delhi',
		country: 'India',
		rating: 5,
		phone: '011-3939-1234',
	},
	{
		id: '5',
		name: 'ITC Maratha',
		city: 'Mumbai',
		country: 'India',
		rating: 5,
		phone: '022-2830-3030',
	},
	{
		id: '6',
		name: 'The Ritz-Carlton',
		city: 'Bangalore',
		country: 'India',
		rating: 5,
		phone: '080-4914-8000',
	},
	{
		id: '7',
		name: 'Park Hyatt',
		city: 'Hyderabad',
		country: 'India',
		rating: 5,
		phone: '040-4949-1234',
	},
	{
		id: '8',
		name: 'The Westin',
		city: 'Goa',
		country: 'India',
		rating: 4,
		phone: '0832-669-3000',
	},
	{
		id: '9',
		name: 'Radisson Blu',
		city: 'Pune',
		country: 'India',
		rating: 4,
		phone: '020-6645-4444',
	},
	{
		id: '10',
		name: 'Holiday Inn',
		city: 'Jaipur',
		country: 'India',
		rating: 4,
		phone: '0141-510-6000',
	},
]

const Hotel: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [hotels, setHotels] = useState<HotelData[]>(dummyHotels)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['name', 'city', 'country', 'rating', 'phone', 'actions']))
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)

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

	// Filter and sort hotels
	const filteredAndSortedHotels = useMemo(() => {
		let filtered = hotels

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = hotels.filter(
				(hotel) =>
					hotel.name.toLowerCase().includes(query) ||
					hotel.city.toLowerCase().includes(query) ||
					hotel.country.toLowerCase().includes(query) ||
					hotel.phone.includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof HotelData]
				const bValue = b[sortConfig.key as keyof HotelData]

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
				return 0
			})
		}

		return filtered
	}, [hotels, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedHotels = filteredAndSortedHotels.slice(startIndex, endIndex)

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

	const handleEdit = (hotel: HotelData) => {
		// Navigate to edit page or open edit dialog
		console.log('Edit hotel:', hotel)
		// navigate('/dashboard/library/hotel/edit', { state: { hotelData: hotel } })
	}

	const handleDelete = (hotel: HotelData) => {
		setDialogConfig({
			title: 'Delete Hotel',
			description: `Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setHotels(hotels.filter((h) => h.id !== hotel.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: `Hotel "${hotel.name}" deleted successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleAddNew = () => {
		// Navigate to add hotel page or open add dialog
		console.log('Add new hotel')
		// navigate('/dashboard/library/hotel/add')
	}

	// Render star rating
	const renderRating = (rating: number) => {
		return (
			<Flex align="center" gap="1">
				<Text size="2" weight="medium">
					{rating}
				</Text>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					style={{ color: '#fbbf24' }}
				>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			</Flex>
		)
	}

	// Render actions menu
	const renderActions = (hotel: HotelData) => {
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
					<DropdownMenu.Item onClick={() => handleEdit(hotel)}>
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
					<DropdownMenu.Item color="red" onClick={() => handleDelete(hotel)}>
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
			key: 'name',
			label: 'Name',
			width: '200px',
			sortable: true,
		},
		{
			key: 'city',
			label: 'City',
			width: '150px',
			sortable: true,
		},
		{
			key: 'country',
			label: 'Country',
			width: '150px',
			sortable: true,
		},
		{
			key: 'rating',
			label: 'Rating',
			width: '120px',
			sortable: true,
			render: (row: HotelData) => renderRating(row.rating),
		},
		{
			key: 'phone',
			label: 'Phone',
			width: '150px',
			sortable: true,
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: HotelData) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px' }}>
			{/* Header Section */}
         <Box style={{ marginBottom: '24px' }}>
	<Text
		size="7"
		weight="bold"
		style={{
			color: 'var(--accent-12)',
			marginBottom: '8px',
			display: 'block',
		}}
	>
		Manage Hotels
	</Text>
	<Text
		size="2"
		style={{
			color: 'var(--accent-11)',
			display: 'block',
		}}
	>
		Here you can add, edit, and view your Hotels.
	</Text>
</Box>
			{/* Search and Columns Section */}
<Card style={{ padding: '16px', marginBottom: '16px' }}>
	<Flex gap="3" align="center" justify="between">
		<TextField.Root
			placeholder="Search all columns..."
			value={searchQuery}
			onChange={(e) => {
				setSearchQuery(e.target.value)
				setCurrentPage(1) // Reset to first page on search
			}}
			style={{ flex: 1, maxWidth: '400px' }}
		>
			<TextField.Slot>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z"
						stroke="var(--accent-11)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TextField.Slot>
		</TextField.Root>

		<Flex gap="2" align="center">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="soft" size="2">
						Columns
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{[
						{ key: 'name', label: 'Name' },
						{ key: 'city', label: 'City' },
						{ key: 'country', label: 'Country' },
						{ key: 'rating', label: 'Rating' },
						{ key: 'phone', label: 'Phone' },
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
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ marginRight: '8px' }}
				>
					<path
						d="M8 3V13M3 8H13"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
				Add New Hotel
			</Button>
		</Flex>
	</Flex>
</Card>
			{/* Table Section */}
			<Card style={{ padding: '16px' }}>
				<Table
					columns={columns}
					rows={paginatedHotels}
					onSort={handleSort}
					sortConfig={sortConfig}
					onHideColumn={handleHideColumn}
				/>
			</Card>

			{/* Pagination Section */}
			<Flex justify="end" align="center" gap="2" style={{ marginTop: '16px' }}>
				<Button
					variant="soft"
					size="2"
					onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					disabled={currentPage === 1}
					style={{
						cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
						opacity: currentPage === 1 ? 0.5 : 1,
					}}
				>
					Previous
				</Button>
				<Text size="2" style={{ color: 'var(--accent-11)' }}>
					Page {currentPage} of {totalPages || 1}
				</Text>
				<Button
					variant="soft"
					size="2"
					onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
					disabled={currentPage >= totalPages}
					style={{
						cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
						opacity: currentPage >= totalPages ? 0.5 : 1,
					}}
				>
					Next
				</Button>
			</Flex>

			{/* Empty State */}
			{filteredAndSortedHotels.length === 0 && (
				<Box
					style={{
						padding: '48px',
						textAlign: 'center',
						color: 'var(--accent-11)',
					}}
				>
					<Text size="3">No hotels found</Text>
				</Box>
			)}

			{/* Alert Dialog */}
			{dialogConfig && (
				<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialog.Content maxWidth="450px">
						<AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
						<AlertDialog.Description size="2">
							{dialogConfig.description}
						</AlertDialog.Description>
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
									color={dialogConfig.color || 'red'}
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

export default Hotel