import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Badge,
	DropdownMenu,
	Checkbox,
	IconButton,
	AlertDialog,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'


type ItineraryData = {
	id: string
	name: string
	city: string
	price: number 
	priceDisplay: string 
	status: 'Active' | 'Inactive'
	trending: string
}

const dummyItineraries: ItineraryData[] = [
	{
		id: '1',
		name: 'Pachmarhi | Ex- Indore',
		city: 'Pachmarhi',
		price: 4499,
		priceDisplay: '₹4,499',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '2',
		name: 'Kerala 7D 6N',
		city: 'Kerala',
		price: 16499,
		priceDisplay: '₹16,499',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '3',
		name: 'Spiti Valley Full Circuit',
		city: 'Spiti Valley',
		price: 5599,
		priceDisplay: '₹5,599',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '4',
		name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Indore',
		city: 'Udaipur, Mount Abu',
		price: 15999,
		priceDisplay: '₹15,999',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '5',
		name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Delhi',
		city: 'Udaipur, Mount Abu',
		price: 15999,
		priceDisplay: '₹15,999',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '6',
		name: 'Goa Beach Paradise 4D 3N',
		city: 'Goa',
		price: 8999,
		priceDisplay: '₹8,999',
		status: 'Inactive',
		trending: 'No',
	},
	{
		id: '7',
		name: 'Rajasthan Cultural Tour 6D 5N',
		city: 'Rajasthan',
		price: 12499,
		priceDisplay: '₹12,499',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '8',
		name: 'Himachal Adventure 5D 4N',
		city: 'Himachal Pradesh',
		price: 9999,
		priceDisplay: '₹9,999',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '9',
		name: 'North East Explorer 8D 7N',
		city: 'North East',
		price: 18999,
		priceDisplay: '₹18,999',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '10',
		name: 'Ladakh Motorcycle Trip 10D 9N',
		city: 'Ladakh',
		price: 25999,
		priceDisplay: '₹25,999',
		status: 'Inactive',
		trending: 'No',
	},
	{
		id: '11',
		name: 'Pachmarhi | Ex- Indore',
		city: 'Pachmarhi',
		price: 4499,
		priceDisplay: '₹4,499',
		status: 'Inactive',
		trending: 'No',
	},
	{
		id: '12',
		name: 'Kerala 7D 6N',
		city: 'Kerala',
		price: 16499,
		priceDisplay: '₹16,499',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '13',
		name: 'Spiti Valley Full Circuit',
		city: 'Spiti Valley',
		price: 5599,
		priceDisplay: '₹5,599',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '14',
		name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Indore',
		city: 'Udaipur, Mount Abu',
		price: 15999,
		priceDisplay: '₹15,999',
		status: 'Active',
		trending: 'No',
	},
	{
		id: '15',
		name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Delhi',
		city: 'Udaipur, Mount Abu',
		price: 15999,
		priceDisplay: '₹15,999',
		status: 'Active',
		trending: 'No',
	},
]

type SortDirection = 'asc' | 'desc' | null

type ColumnConfig = {
	key: string
	label: string
	dropdownLabel: string
	width: string
	sortable: boolean
	render: (row: ItineraryData) => React.ReactNode
}

const Itinerary: React.FC = () => {
	const navigate = useNavigate() 
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: SortDirection
	} | null>(null)
     
	// Add dialog state for controlled dialog
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		cancelText?: string
		onConfirm: () => void
		color?: 'red' | 'blue' | 'green' | 'gray'
	} | null>(null)

	const [columnVisibility, setColumnVisibility] = useState({
		name: true,
		city: true,
		price: true,
		trending: true,
		status: true,
		edit: true,
		actions: true,
	})

	const [trendingStatus, setTrendingStatus] = useState<Record<string, boolean>>(() => {
		const initial: Record<string, boolean> = {}
		dummyItineraries.forEach(item => {
			initial[item.id] = item.trending === 'Yes'
		})
		return initial
	})

	const [itineraries, setItineraries] = useState<ItineraryData[]>(dummyItineraries)

	const itemsPerPage = 10

	

	const handleEdit = (itinerary: ItineraryData) => {
		navigate('/dashboard/add-itinerary', {
			state: { itineraryData: itinerary },
		})
	}

	const handleDuplicate = (itinerary: ItineraryData) => {
		setDialogConfig({
			title: 'Duplicate Itinerary',
			description: `Are you sure you want to duplicate "${itinerary.name}"?`,
			actionText: 'Duplicate',
			cancelText: 'Cancel',
			color: 'blue',
			onConfirm: () => {
				const duplicated: ItineraryData = {
					...itinerary,
					id: `${itinerary.id}_copy_${Date.now()}`,
					name: `${itinerary.name} (Copy)`,
				}
				setItineraries(prev => [...prev, duplicated])
				setDialogOpen(false)
				// Show success
				setDialogConfig({
					title: 'Success',
					description: `Itinerary "${itinerary.name}" duplicated successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleToggleStatus = (itinerary: ItineraryData) => {
		const newStatus = itinerary.status === 'Active' ? 'Inactive' : 'Active'
		setDialogConfig({
			title: 'Change Status',
			description: `Are you sure you want to change status to "${newStatus}"?`,
			actionText: 'Change',
			cancelText: 'Cancel',
			color: 'blue',
			onConfirm: () => {
				setItineraries(prev =>
					prev.map(item =>
						item.id === itinerary.id
							? {
									...item,
									status: item.status === 'Active' ? 'Inactive' : 'Active',
								}
							: item
					)
				)
				setDialogOpen(false)
				// Show success
				setDialogConfig({
					title: 'Success',
					description: `Status changed to "${newStatus}" successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleDelete = (itinerary: ItineraryData) => {
		setDialogConfig({
			title: 'Delete Itinerary',
			description: `Are you sure you want to delete "${itinerary.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setItineraries(prev => prev.filter(item => item.id !== itinerary.id))
				setDialogOpen(false)
				// Show success
				setDialogConfig({
					title: 'Success',
					description: `Itinerary "${itinerary.name}" deleted successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleTrendingChange = (id: string, checked: boolean) => {
		setItineraries(prev =>
			prev.map(item =>
				item.id === id
					? { ...item, trending: checked ? 'Yes' : 'No' }
					: item
			)
		)
		
		// Then sync trendingStatus state
		setTrendingStatus(prev => ({
			...prev,
			[id]: checked,
		}))
	}

	const allColumns: ColumnConfig[] = [
		{
			key: 'name',
			label: 'Itinerary Name',
			dropdownLabel: 'Title',
			width: '300px',
			sortable: true,
			render: (row: ItineraryData) => <Text size="2">{row.name}</Text>,
		},
		{
			key: 'city',
			label: 'City',
			dropdownLabel: 'City',
			width: '200px',
			sortable: true,
			render: (row: ItineraryData) => <Text size="2">{row.city}</Text>,
		},
		{
			key: 'price',
			label: 'Price',
			dropdownLabel: 'Startin_price',
			width: '150px',
			sortable: true,
			render: (row: ItineraryData) => (
				<Text size="2" weight="medium">
					{row.priceDisplay}
				</Text>
			),
		},
		{
			key: 'trending',
			label: 'Trending',
			dropdownLabel: 'Is_trending',
			width: '120px',
			sortable: false,
			render: (row: ItineraryData) => {
				// Use row data directly - state will sync via handleTrendingChange
				const isChecked = row.trending === 'Yes'
				
				return (
					<Flex align="center" justify="center">
						<Checkbox
							checked={isChecked}
							onCheckedChange={(checked) => {
								handleTrendingChange(row.id, checked === true)
							}}
						/>
					</Flex>
				)
			},
		},
		{
			key: 'status',
			label: 'Status',
			dropdownLabel: 'Is_active',
			width: '120px',
			sortable: true,
			render: (row: ItineraryData) => renderStatus(row.status),
		},
		{
			key: 'edit',
			label: '', // Empty label so header doesn't show
			dropdownLabel: 'Edit',
			width: '80px',
			sortable: false,
			render: (row: ItineraryData) => (
				<Flex gap="2" align="center" justify="center">
					<Button
						variant="soft"
						size="1"
						onClick={() => handleEdit(row)}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
							cursor: 'pointer',
						}}
					>
						Edit
					</Button>
				</Flex>
			),
		},
		{
			key: 'actions',
			label: '', // Empty label so header doesn't show
			dropdownLabel: 'Actions',
			width: '80px',
			sortable: false,
			render: (row: ItineraryData) => (
				<Flex gap="2" align="center" justify="center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<IconButton
								variant="ghost"
								size="2"
								style={{
									cursor: 'pointer',
									color: 'var(--accent-11)',
								}}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle cx="8" cy="3" r="1.5" fill="currentColor" />
									<circle cx="8" cy="8" r="1.5" fill="currentColor" />
									<circle cx="8" cy="13" r="1.5" fill="currentColor" />
								</svg>
							</IconButton>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							style={{
								minWidth: '180px',
								backgroundColor: 'var(--color-panel)',
								border: '1px solid var(--accent-6)',
							}}
						>
							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleEdit(row)
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8 3C5.5 3 3.3 4.2 2 6C3.3 7.8 5.5 9 8 9C10.5 9 12.7 7.8 14 6C12.7 4.2 10.5 3 8 3ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										View Itinerary
									</Text>
								</Flex>
							</DropdownMenu.Item>

							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleDuplicate(row)
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M4 2C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2H4ZM4 3H12C12.6 3 13 3.4 13 4V12C13 12.6 12.6 13 12 13H4C3.4 13 3 12.6 3 12V4C3 3.4 3.4 3 4 3Z"
											fill="currentColor"
										/>
										<path
											d="M6 6H10V7H6V6ZM6 8H10V9H6V8ZM6 10H10V11H6V10Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										Duplicate Itinerary
									</Text>
								</Flex>
							</DropdownMenu.Item>

							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleToggleStatus(row)
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2ZM8 13C5.2 13 3 10.8 3 8C3 5.2 5.2 3 8 3C10.8 3 13 5.2 13 8C13 10.8 10.8 13 8 13Z"
											fill="currentColor"
										/>
										<path
											d="M8 5C6.3 5 5 6.3 5 8C5 9.7 6.3 11 8 11C9.7 11 11 9.7 11 8C11 6.3 9.7 5 8 5Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										Status ({row.status === 'Active' ? 'Set Inactive' : 'Set Active'})
									</Text>
								</Flex>
							</DropdownMenu.Item>

							<DropdownMenu.Separator />

							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleDelete(row)
								}}
								style={{ cursor: 'pointer' }}
								color="red"
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5ZM6 1V2H10V1H6ZM4 4V13C4 13.6 4.4 14 5 14H11C11.6 14 12 13.6 12 13V4H4Z"
											fill="currentColor"
										/>
										<path
											d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--red-11)' }}>
										Delete
									</Text>
								</Flex>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Flex>
			),
		},
	]

	const visibleColumns = useMemo(() => {
		return allColumns.filter((col) => columnVisibility[col.key as keyof typeof columnVisibility])
	}, [columnVisibility])

	const handleColumnToggle = (columnKey: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnKey]: !prev[columnKey as keyof typeof prev],
		}))
	}

	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return itineraries
		}

		const query = searchQuery.toLowerCase()
		return itineraries.filter(
			(item) =>
				item.name.toLowerCase().includes(query) ||
				item.city.toLowerCase().includes(query) ||
				item.priceDisplay.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query)
		)
	}, [searchQuery, itineraries])

	const sortedData = useMemo(() => {
		if (!sortConfig || !sortConfig.direction) {
			return filteredData
		}

		return [...filteredData].sort((a, b) => {
			let aValue: any = a[sortConfig.key as keyof ItineraryData]
			let bValue: any = b[sortConfig.key as keyof ItineraryData]

			if (sortConfig.key === 'price') {
				return sortConfig.direction === 'asc'
					? a.price - b.price
					: b.price - a.price
			}

			if (sortConfig.key === 'status') {
				const aStatus = a.status === 'Active' ? 1 : 0
				const bStatus = b.status === 'Active' ? 1 : 0
				return sortConfig.direction === 'asc'
					? aStatus - bStatus
					: bStatus - aStatus
			}

			if (aValue == null && bValue == null) return 0
			if (aValue == null) return 1
			if (bValue == null) return -1

			const aStr = String(aValue).toLowerCase()
			const bStr = String(bValue).toLowerCase()

			if (aStr < bStr)
				return sortConfig.direction === 'asc' ? -1 : 1
			if (aStr > bStr)
				return sortConfig.direction === 'asc' ? 1 : -1
			return 0
		})
	}, [filteredData, sortConfig])

	const totalPages = Math.ceil(sortedData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedData = sortedData.slice(startIndex, endIndex)

	const handleSort = (columnKey: string, direction: SortDirection) => {
		setSortConfig(direction ? { key: columnKey, direction } : null)
		setCurrentPage(1)
	}

	const handleHideColumn = (columnKey: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnKey]: false,
		}))
	}

	const renderStatus = (status: string) => {
		const isActive = status === 'Active'
		return (
			<Badge
				size="2"
				variant="solid"
				color={isActive ? 'green' : 'red'}
				style={{
					textTransform: 'capitalize',
				}}
			>
				{status}
			</Badge>
		)
	}

	const tableRows = paginatedData.map((item) => ({
		...item,
		price: item.priceDisplay,
	}))

	return (
		<Box style={{ padding: '24px' }}>
			<Text
				size="7"
				weight="bold"
				style={{
					color: 'var(--accent-12)',
					marginBottom: '24px',
					display: 'block',
				}}
			>
				Manage Itinerary
			</Text>

			<Flex gap="3" align="center" justify="between" style={{ marginBottom: '24px' }}>
				<TextField.Root
					placeholder="Search all columns..."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value)
						setCurrentPage(1)
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
					<Button
						variant="soft"
						size="2"
						onClick={() => navigate('/dashboard/add-itinerary')}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
							width: '200px',
						}}
					>
						Add New Itinerary
					</Button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button
								variant="soft"
								size="2"
								style={{
									color: 'white',
									backgroundColor: 'var(--accent-9)',
									width: '100px',
								}}
							>
								Columns
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							style={{
								minWidth: '160px',
								backgroundColor: 'var(--color-panel)',
								border: '1px solid var(--accent-6)',
							}}
						>
							{allColumns.map((col) => (
								<DropdownMenu.Item
									key={col.key}
									onSelect={(e) => {
										e.preventDefault()
										handleColumnToggle(col.key)
									}}
									style={{
										cursor: 'pointer',
									}}
								>
									<Flex align="center" gap="3">
										<Checkbox
											checked={columnVisibility[col.key as keyof typeof columnVisibility]}
											onCheckedChange={() => handleColumnToggle(col.key)}
											style={{ pointerEvents: 'none' }}
										/>
										<Text size="2" style={{ color: 'var(--accent-12)' }}>
											{col.dropdownLabel}
										</Text>
									</Flex>
								</DropdownMenu.Item>
							))}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Flex>
			</Flex>

			<Box
				style={{
					backgroundColor: 'var(--color-panel)',
					borderRadius: '8px',
					overflow: 'hidden',
					border: '1px solid var(--accent-6)',
				}}
			>
				<Table
					columns={visibleColumns}
					rows={tableRows}
					onSort={handleSort}
					sortConfig={sortConfig}
					onHideColumn={handleHideColumn}
				/>
			</Box>

			{sortedData.length > itemsPerPage && (
				<Flex
					justify="end"
					align="center"
					gap="3"
					style={{ marginTop: '16px' }}
				>
					<Text size="2" style={{ color: 'var(--accent-11)' }}>
						Page {currentPage} of {totalPages}
					</Text>
					<Button
						variant="soft"
						size="2"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					>
						Previous
					</Button>
					<Button
						variant="soft"
						size="2"
						disabled={currentPage === totalPages}
						onClick={() =>
							setCurrentPage((prev) => Math.min(totalPages, prev + 1))
						}
					>
						Next
					</Button>
				</Flex>
			)}
			{/* Controlled AlertDialog - replaces alerts */}
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

export default Itinerary