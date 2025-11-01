import React, { useState, useMemo } from 'react'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Badge,
	DropdownMenu,
	Checkbox,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'

type ItineraryData = {
	id: string
	name: string
	city: string
	price: number // Store as number for proper sorting
	priceDisplay: string // Display format
	status: 'Active' | 'Inactive'
	trending: string
}

// Dummy data
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
]

type SortDirection = 'asc' | 'desc' | null

// Column configuration with mapping to dropdown labels
type ColumnConfig = {
	key: string
	label: string
	dropdownLabel: string // Label shown in dropdown
	width: string
	sortable: boolean
	render: (row: ItineraryData) => React.ReactNode
}

const Itinerary: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: SortDirection
	} | null>(null)

	// Column visibility state - all visible by default
	const [columnVisibility, setColumnVisibility] = useState({
		name: true,
		city: true,
		price: true,
		trending: true,
		status: true,
	})

	const itemsPerPage = 10

	// All column definitions
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
			sortable: true,
			render: (row: ItineraryData) => <Text size="2">{row.trending}</Text>,
		},
		{
			key: 'status',
			label: 'Status',
			dropdownLabel: 'Is_active',
			width: '120px',
			sortable: true,
			render: (row: ItineraryData) => renderStatus(row.status),
		},
	]

	// Filter columns based on visibility
	const visibleColumns = useMemo(() => {
		return allColumns.filter((col) => columnVisibility[col.key as keyof typeof columnVisibility])
	}, [columnVisibility])

	const handleColumnToggle = (columnKey: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnKey]: !prev[columnKey as keyof typeof prev],
		}))
	}

	// Filter data based on search query
	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return dummyItineraries
		}

		const query = searchQuery.toLowerCase()
		return dummyItineraries.filter(
			(item) =>
				item.name.toLowerCase().includes(query) ||
				item.city.toLowerCase().includes(query) ||
				item.priceDisplay.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query)
		)
	}, [searchQuery])

	// Sort data
	const sortedData = useMemo(() => {
		if (!sortConfig || !sortConfig.direction) {
			return filteredData
		}

		return [...filteredData].sort((a, b) => {
			let aValue: any = a[sortConfig.key as keyof ItineraryData]
			let bValue: any = b[sortConfig.key as keyof ItineraryData]

			// Handle price separately
			if (sortConfig.key === 'price') {
				return sortConfig.direction === 'asc'
					? a.price - b.price
					: b.price - a.price
			}

			// Handle status (Active should come before Inactive)
			if (sortConfig.key === 'status') {
				const aStatus = a.status === 'Active' ? 1 : 0
				const bStatus = b.status === 'Active' ? 1 : 0
				return sortConfig.direction === 'asc'
					? aStatus - bStatus
					: bStatus - aStatus
			}

			// Handle string values
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

	// Pagination
	const totalPages = Math.ceil(sortedData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedData = sortedData.slice(startIndex, endIndex)

	const handleSort = (columnKey: string, direction: SortDirection) => {
		setSortConfig(direction ? { key: columnKey, direction } : null)
		setCurrentPage(1) // Reset to first page on sort
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

	// Prepare table rows with all necessary fields
	const tableRows = paginatedData.map((item) => ({
		...item,
		price: item.priceDisplay, // Display formatted price in table
	}))

	return (
		<Box style={{ padding: '24px' }}>
			{/* Title */}
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

			{/* Search Bar and Columns Button */}
			<Flex gap="3" align="center" justify="between" style={{ marginBottom: '24px' }}>
				{/* Search Bar - Left Side */}
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

				{/* Columns Button - Right Side */}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button
							variant="soft"
							size="2"
							style={{
								color: 'white',
								backgroundColor: 'var(--accent-9)',
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

			{/* Table Container */}
			<Box
				style={{
					backgroundColor: 'var(--color-panel)',
					borderRadius: '8px',
					overflow: 'hidden',
					border: '1px solid var(--accent-6)',
				}}
			>
				{/* Using Dynamic Table Component */}
				<Table
					columns={visibleColumns}
					rows={tableRows}
					onSort={handleSort}
					sortConfig={sortConfig}
          onHideColumn={handleHideColumn}
				/>
			</Box>

			{/* Pagination */}
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
		</Box>
	)
}

export default Itinerary