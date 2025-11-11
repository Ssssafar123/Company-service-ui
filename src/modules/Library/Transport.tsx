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
import AddVehicleForm from './AddVehicleForm'

type VehicleData = {
	id: string
	vehicleType: string
	vehicleNumber: string
	capacity: number
	price: number // in rupees
	priceType: 'Per Tour' | 'Per Km' // Price type
	routes: string
	vendorName: string
	contact: string
	rating: number
	lastUpdated: string // Date string in format "MM/DD/YY"
}

// Dummy vehicle data
const dummyVehicles: VehicleData[] = [
	{
		id: '1',
		vehicleType: 'SUV 01',
		vehicleNumber: 'Hp02',
		capacity: 7,
		price: 6500,
		priceType: 'Per Tour',
		routes: 'Manali Kasol 3 Night',
		vendorName: 'Happy Bhai',
		contact: '7067632820',
		rating: 5,
		lastUpdated: '9/27/2',
	},
	{
		id: '2',
		vehicleType: 'Mini Bus',
		vehicleNumber: 'HP01 1232',
		capacity: 34,
		price: 234,
		priceType: 'Per Tour',
		routes: 'Manali to delhi',
		vendorName: 'Mini bus guy',
		contact: '24523',
		rating: 6,
		lastUpdated: '9/26/2',
	},
	{
		id: '3',
		vehicleType: 'Mini Bus edit',
		vehicleNumber: 'HP01 1232',
		capacity: 23,
		price: 122,
		priceType: 'Per Km',
		routes: 'Manali to delhi',
		vendorName: 'Mini bus guy',
		contact: '24523',
		rating: 8,
		lastUpdated: '9/27/2',
	},
	{
		id: '4',
		vehicleType: 'SUV 001',
		vehicleNumber: 'MP-09 2333',
		capacity: 12,
		price: 1190,
		priceType: 'Per Tour',
		routes: 'NAAA',
		vendorName: 'NAA',
		contact: 'NAA',
		rating: 7,
		lastUpdated: '9/28/2',
	},
	{
		id: '5',
		vehicleType: 'Sedan',
		vehicleNumber: 'DL-01 4567',
		capacity: 4,
		price: 3500,
		priceType: 'Per Tour',
		routes: 'Delhi to Agra',
		vendorName: 'City Travels',
		contact: '9876543210',
		rating: 8,
		lastUpdated: '9/25/2',
	},
	{
		id: '6',
		vehicleType: 'Tempo Traveller',
		vehicleNumber: 'HR-26 7890',
		capacity: 12,
		price: 8500,
		priceType: 'Per Tour',
		routes: 'Delhi to Shimla',
		vendorName: 'Mountain Tours',
		contact: '8765432109',
		rating: 9,
		lastUpdated: '9/24/2',
	},
	{
		id: '7',
		vehicleType: 'Bus',
		vehicleNumber: 'UP-14 3456',
		capacity: 45,
		price: 15000,
		priceType: 'Per Tour',
		routes: 'Delhi to Jaipur',
		vendorName: 'Royal Transport',
		contact: '7654321098',
		rating: 7,
		lastUpdated: '9/23/2',
	},
	{
		id: '8',
		vehicleType: 'Innova',
		vehicleNumber: 'MH-12 5678',
		capacity: 7,
		price: 4500,
		priceType: 'Per Tour',
		routes: 'Mumbai to Pune',
		vendorName: 'Western Travels',
		contact: '6543210987',
		rating: 8,
		lastUpdated: '9/22/2',
	},
	{
		id: '9',
		vehicleType: 'Hatchback',
		vehicleNumber: 'KA-03 9012',
		capacity: 4,
		price: 2500,
		priceType: 'Per Tour',
		routes: 'Bangalore to Mysore',
		vendorName: 'South Tours',
		contact: '5432109876',
		rating: 6,
		lastUpdated: '9/21/2',
	},
	{
		id: '10',
		vehicleType: 'Luxury Bus',
		vehicleNumber: 'RJ-14 2468',
		capacity: 40,
		price: 20000,
		priceType: 'Per Tour',
		routes: 'Jaipur to Udaipur',
		vendorName: 'Rajasthan Travels',
		contact: '4321098765',
		rating: 9,
		lastUpdated: '9/20/2',
	},
]

const Transport: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [vehicles, setVehicles] = useState<VehicleData[]>(dummyVehicles)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['vehicleType', 'vehicleNumber', 'capacity', 'price', 'routes', 'vendorName', 'contact', 'rating', 'lastUpdated', 'actions']))
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)

	// Form panel state
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null)

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

	// Filter and sort vehicles
	const filteredAndSortedVehicles = useMemo(() => {
		let filtered = vehicles

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = vehicles.filter(
				(vehicle) =>
					vehicle.vehicleType.toLowerCase().includes(query) ||
					vehicle.vehicleNumber.toLowerCase().includes(query) ||
					vehicle.capacity.toString().includes(query) ||
					vehicle.price.toString().includes(query) ||
					vehicle.routes.toLowerCase().includes(query) ||
					vehicle.vendorName.toLowerCase().includes(query) ||
					vehicle.contact.includes(query) ||
					vehicle.rating.toString().includes(query) ||
					vehicle.lastUpdated.includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof VehicleData]
				const bValue = b[sortConfig.key as keyof VehicleData]

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
				return 0
			})
		}

		return filtered
	}, [vehicles, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedVehicles.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedVehicles = filteredAndSortedVehicles.slice(startIndex, endIndex)

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

	const handleEdit = (vehicle: VehicleData) => {
		setEditingVehicle(vehicle)
		setIsFormOpen(true)
	}

	const handleDelete = (vehicle: VehicleData) => {
		setDialogConfig({
			title: 'Delete Vehicle',
			description: `Are you sure you want to delete "${vehicle.vehicleType} - ${vehicle.vehicleNumber}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setVehicles(vehicles.filter((v) => v.id !== vehicle.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: `Vehicle "${vehicle.vehicleType} - ${vehicle.vehicleNumber}" deleted successfully!`,
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
		setEditingVehicle(null)
		setIsFormOpen(true)
	}

	const handleFormSubmit = (values: Record<string, any>) => {
		console.log('Form submitted with values:', values)
		
		if (editingVehicle) {
			// Update existing vehicle
			const today = new Date()
			const lastUpdated = `${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(-2)}`
			
			const updatedVehicle: VehicleData = {
				...editingVehicle,
				vehicleType: values.vehicleType || '',
				vehicleNumber: values.vehicleNumber || '',
				capacity: parseInt(values.capacity) || 0,
				price: parseFloat(values.price) || 0,
				priceType: (values.priceType as 'Per Tour' | 'Per Km') || 'Per Tour',
				routes: values.availableRoutes || '',
				vendorName: values.vendorName || '',
				contact: values.contact || '',
				rating: parseInt(values.rating) || 1,
				lastUpdated: lastUpdated,
			}
	
			setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)))
	
			setDialogConfig({
				title: 'Success',
				description: `Vehicle "${updatedVehicle.vehicleType} - ${updatedVehicle.vehicleNumber}" updated successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		} else {
			// Create new vehicle
			const today = new Date()
			const lastUpdated = `${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(-2)}`
			
			const newVehicle: VehicleData = {
				id: String(vehicles.length + 1),
				vehicleType: values.vehicleType || '',
				vehicleNumber: values.vehicleNumber || '',
				capacity: parseInt(values.capacity) || 0,
				price: parseFloat(values.price) || 0,
				priceType: (values.priceType as 'Per Tour' | 'Per Km') || 'Per Tour',
				routes: values.availableRoutes || '',
				vendorName: values.vendorName || '',
				contact: values.contact || '',
				rating: parseInt(values.rating) || 1,
				lastUpdated: lastUpdated,
			}
	
			setVehicles([...vehicles, newVehicle])
	
			setDialogConfig({
				title: 'Success',
				description: `Vehicle "${newVehicle.vehicleType} - ${newVehicle.vehicleNumber}" added successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		}
	
		setDialogOpen(true)
		setIsFormOpen(false)
		setEditingVehicle(null)
	}

	// Format price as currency
	const formatPrice = (price: number, priceType: 'Per Tour' | 'Per Km') => {
		const formattedPrice = new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 2,
		}).format(price)
		return `${formattedPrice} / ${priceType}`
	}

	// Render price
	const renderPrice = (vehicle: VehicleData) => {
		return (
			<Text size="2" weight="medium">
				{formatPrice(vehicle.price, vehicle.priceType)}
			</Text>
		)
	}

	// Render rating
	const renderRating = (rating: number) => {
		return (
			<Flex align="center" gap="1">
				<Text size="2" weight="medium">
					{rating}
				</Text>
			</Flex>
		)
	}

	// Render actions menu
	const renderActions = (vehicle: VehicleData) => {
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
					<DropdownMenu.Item onClick={() => handleEdit(vehicle)}>
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
					<DropdownMenu.Item color="red" onClick={() => handleDelete(vehicle)}>
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
			key: 'vehicleType',
			label: 'Vehicle Type',
			width: '150px',
			sortable: true,
		},
		{
			key: 'vehicleNumber',
			label: 'Vehicle Number',
			width: '180px',
			sortable: true,
		},
		{
			key: 'capacity',
			label: 'Capacity',
			width: '120px',
			sortable: true,
		},
		{
			key: 'price',
			label: 'Price',
			width: '200px',
			sortable: true,
			render: (row: VehicleData) => renderPrice(row),
		},
		{
			key: 'routes',
			label: 'Routes',
			width: '200px',
			sortable: true,
		},
		{
			key: 'vendorName',
			label: 'Vendor Name',
			width: '150px',
			sortable: true,
		},
		{
			key: 'contact',
			label: 'Contact',
			width: '150px',
			sortable: true,
		},
		{
			key: 'rating',
			label: 'Rating',
			width: '100px',
			sortable: true,
			render: (row: VehicleData) => renderRating(row.rating),
		},
		{
			key: 'lastUpdated',
			label: 'Last Updated',
			width: '150px',
			sortable: true,
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: VehicleData) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Add Vehicle Form Component */}
			<AddVehicleForm
	           isOpen={isFormOpen}
	           onClose={() => {
		          setIsFormOpen(false)
		        setEditingVehicle(null)
	    }}
	    onSubmit={handleFormSubmit}
	    initialData={editingVehicle ? {
		id: editingVehicle.id,
		vehicleType: editingVehicle.vehicleType,
		vehicleNumber: editingVehicle.vehicleNumber,
		capacity: editingVehicle.capacity,
		price: editingVehicle.price,
		priceType: editingVehicle.priceType,
		routes: editingVehicle.routes,
		vendorName: editingVehicle.vendorName,
		contact: editingVehicle.contact,
		rating: editingVehicle.rating,
	} : null}
/>

			{/* Main Content */}
			<Box style={{ width: '100%' }}>
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
						Manage Vehicles
					</Text>
					<Text
						size="2"
						style={{
							color: 'var(--accent-11)',
							display: 'block',
						}}
					>
						Here you can add, edit, and view your vehicle fleet.
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
							{/* Columns dropdown */}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="soft" size="2">
										Columns
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									{[
										{ key: 'vehicleType', label: 'Vehicle Type' },
										{ key: 'vehicleNumber', label: 'Vehicle Number' },
										{ key: 'capacity', label: 'Capacity' },
										{ key: 'price', label: 'Price' },
										{ key: 'routes', label: 'Routes' },
										{ key: 'vendorName', label: 'Vendor Name' },
										{ key: 'contact', label: 'Contact' },
										{ key: 'rating', label: 'Rating' },
										{ key: 'lastUpdated', label: 'Last Updated' },
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
								Add New Vehicle
							</Button>
						</Flex>
					</Flex>
				</Card>

				{/* Table Section */}
				<Card style={{ padding: '16px' }}>
					<Table
						columns={columns}
						rows={paginatedVehicles}
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
				{filteredAndSortedVehicles.length === 0 && (
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
			</Box>

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

export default Transport