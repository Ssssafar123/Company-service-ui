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

type ActivityData = {
	id: string
	name: string
	location: string
	duration: number // in hours
	price: number // in rupees
}

// Dummy activity data
const dummyActivities: ActivityData[] = [
	{
		id: '1',
		name: 'Paragliding Adventure',
		location: 'Manali',
		duration: 2,
		price: 3500,
	},
	{
		id: '2',
		name: 'River Rafting',
		location: 'Rishikesh',
		duration: 3,
		price: 2500,
	},
	{
		id: '3',
		name: 'Desert Safari',
		location: 'Jaisalmer',
		duration: 4,
		price: 4000,
	},
	{
		id: '4',
		name: 'Scuba Diving',
		location: 'Goa',
		duration: 2,
		price: 4500,
	},
	{
		id: '5',
		name: 'Trekking Expedition',
		location: 'Himachal Pradesh',
		duration: 8,
		price: 5000,
	},
	{
		id: '6',
		name: 'Wildlife Safari',
		location: 'Ranthambore',
		duration: 6,
		price: 3500,
	},
	{
		id: '7',
		name: 'Hot Air Balloon Ride',
		location: 'Pushkar',
		duration: 1,
		price: 6000,
	},
	{
		id: '8',
		name: 'Rock Climbing',
		location: 'Mumbai',
		duration: 3,
		price: 2000,
	},
	{
		id: '9',
		name: 'Bungee Jumping',
		location: 'Rishikesh',
		duration: 1,
		price: 3500,
	},
	{
		id: '10',
		name: 'Camel Safari',
		location: 'Jaisalmer',
		duration: 5,
		price: 3000,
	},
]

const Activities: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [activities, setActivities] = useState<ActivityData[]>(dummyActivities)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['name', 'location', 'duration', 'price', 'actions']))
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

	// Filter and sort activities
	const filteredAndSortedActivities = useMemo(() => {
		let filtered = activities

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = activities.filter(
				(activity) =>
					activity.name.toLowerCase().includes(query) ||
					activity.location.toLowerCase().includes(query) ||
					activity.duration.toString().includes(query) ||
					activity.price.toString().includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof ActivityData]
				const bValue = b[sortConfig.key as keyof ActivityData]

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
				return 0
			})
		}

		return filtered
	}, [activities, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedActivities.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedActivities = filteredAndSortedActivities.slice(startIndex, endIndex)

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

	const handleEdit = (activity: ActivityData) => {
		// Navigate to edit page or open edit dialog
		console.log('Edit activity:', activity)
		// navigate('/dashboard/library/activities/edit', { state: { activityData: activity } })
	}

	const handleDelete = (activity: ActivityData) => {
		setDialogConfig({
			title: 'Delete Activity',
			description: `Are you sure you want to delete "${activity.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setActivities(activities.filter((a) => a.id !== activity.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: `Activity "${activity.name}" deleted successfully!`,
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
		// Navigate to add activity page or open add dialog
		console.log('Add new activity')
		// navigate('/dashboard/library/activities/add')
	}

	// Format price as currency
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 2,
		}).format(price)
	}

	// Render price
	const renderPrice = (price: number) => {
		return (
			<Text size="2" weight="medium">
				{formatPrice(price)}
			</Text>
		)
	}

	// Render duration
	const renderDuration = (duration: number) => {
		return (
			<Text size="2" weight="medium">
				{duration} hrs
			</Text>
		)
	}

	// Render actions menu
	const renderActions = (activity: ActivityData) => {
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
					<DropdownMenu.Item onClick={() => handleEdit(activity)}>
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
					<DropdownMenu.Item color="red" onClick={() => handleDelete(activity)}>
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
			width: '250px',
			sortable: true,
		},
		{
			key: 'location',
			label: 'Location',
			width: '200px',
			sortable: true,
		},
		{
			key: 'duration',
			label: 'Duration (hrs)',
			width: '150px',
			sortable: true,
			render: (row: ActivityData) => renderDuration(row.duration),
		},
		{
			key: 'price',
			label: 'Price',
			width: '150px',
			sortable: true,
			render: (row: ActivityData) => renderPrice(row.price),
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: ActivityData) => renderActions(row),
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
					Manage Activities
				</Text>
				<Text
					size="2"
					style={{
						color: 'var(--accent-11)',
						display: 'block',
					}}
				>
					Here you can add, edit, and view your Activities.
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
									{ key: 'location', label: 'Location' },
									{ key: 'duration', label: 'Duration (hrs)' },
									{ key: 'price', label: 'Price' },
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
							Add New Activity
						</Button>
					</Flex>
				</Flex>
			</Card>

			{/* Table Section */}
			<Card style={{ padding: '16px' }}>
				<Table
					columns={columns}
					rows={paginatedActivities}
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
			{filteredAndSortedActivities.length === 0 && (
				<Box
					style={{
						padding: '48px',
						textAlign: 'center',
						color: 'var(--accent-11)',
					}}
				>
					<Text size="3">No results.</Text>
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

export default Activities