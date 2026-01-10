import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchActivities,
    createActivity,
    updateActivityById,
    deleteActivityById,
} from '../../features/ActivitySlice'
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
import AddActivityForm from './AddActivityForm'

type ActivityData = {
	id: string
	name: string
	location: string
	locationLink?: string
	duration: number
	price: number
	shortDescription?: string
	fullDescription?: string
	images?: string[]
}

const Activities: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const activitiesFromStore = useSelector((state: RootState) => state.activity.activities)
    const loading = useSelector((state: RootState) => state.activity.ui.loading)
    const error = useSelector((state: RootState) => state.activity.ui.error)

	const [searchQuery, setSearchQuery] = useState('')
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(['name', 'location', 'locationLink', 'images', 'duration', 'price', 'actions'])
	)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)
	const [editingActivity, setEditingActivity] = useState<ActivityData | null>(null)

	// Form panel state
	const [isFormOpen, setIsFormOpen] = useState(false)

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

	// Fetch activities from Redux on mount
	useEffect(() => {
		dispatch(fetchActivities())
	}, [dispatch])

	// Map Redux data to component format
	const activities: ActivityData[] = useMemo(() => {
		return activitiesFromStore.map((activity) => ({
			id: activity.id,
			name: activity.name,
			location: activity.location,
			locationLink: activity.locationLink,
			duration: activity.duration,
			price: activity.price,
			shortDescription: activity.shortDescription,
			fullDescription: activity.fullDescription,
			images: activity.images,
		}))
	}, [activitiesFromStore])

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
					activity.locationLink?.toLowerCase().includes(query) ||
					activity.duration.toString().includes(query) ||
					activity.price.toString().includes(query)
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof ActivityData]
				const bValue = b[sortConfig.key as keyof ActivityData]

				// Handle undefined values
				if (aValue === undefined && bValue === undefined) return 0
				if (aValue === undefined) return 1
				if (bValue === undefined) return -1

				// Compare values
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
		setCurrentPage(1)
	}

	const handleHideColumn = (columnKey: string) => {
		setVisibleColumns((prev) => {
			const newSet = new Set(prev)
			newSet.delete(columnKey)
			return newSet
		})
	}

	const handleEdit = (activity: ActivityData) => {
		setEditingActivity(activity)
		setIsFormOpen(true)
	}

	const handleDelete = (activity: ActivityData) => {
		setDialogConfig({
			title: 'Delete Activity',
			description: `Are you sure you want to delete "${activity.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: async () => {
				await dispatch(deleteActivityById(activity.id))
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
		setEditingActivity(null)
		setIsFormOpen(true)
	}

	const handleFormSubmit = async (values: Record<string, any>) => {
		if (editingActivity) {
			// Update existing activity
			await dispatch(updateActivityById({
				id: editingActivity.id,
				data: {
					name: values.name || '',
					location: values.location || '',
					locationLink: values.locationLink || '',
					duration: Number(values.duration) || 1,
					price: Number(values.price) || 0,
					shortDescription: values.shortDescription || '',
					fullDescription: values.fullDescription || '',
				}
			}))
			setDialogConfig({
				title: 'Success',
				description: `Activity "${values.name}" updated successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		} else {
			// Create new activity
			await dispatch(createActivity({
				activity: {
					name: values.name || '',
					location: values.location || '',
					locationLink: values.locationLink || '',
					duration: Number(values.duration) || 1,
					price: Number(values.price) || 0,
					shortDescription: values.shortDescription || '',
					fullDescription: values.fullDescription || '',
					status: 'active',
				}
			}))
			setDialogConfig({
				title: 'Success',
				description: `Activity "${values.name}" added successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		}

		setDialogOpen(true)
		setIsFormOpen(false)
		setEditingActivity(null)
		dispatch(fetchActivities())
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

	// Render location link
	const renderLocationLink = (locationLink?: string) => {
		if (!locationLink) return <Text size="2">-</Text>
		return (
			<a 
				href={locationLink} 
				target="_blank" 
				rel="noopener noreferrer"
				style={{ color: 'var(--accent-9)', textDecoration: 'underline' }}
			>
				<Text size="2">View Location</Text>
			</a>
		)
	}

	// Render images count
	const renderImages = (images?: string[]) => {
		if (!images || images.length === 0) return <Text size="2">-</Text>
		return (
			<Text size="2">{images.length} image(s)</Text>
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
			width: '200px',
			sortable: true,
		},
		{
			key: 'location',
			label: 'Location',
			width: '150px',
			sortable: true,
		},
		{
			key: 'locationLink',
			label: 'Location Link',
			width: '150px',
			sortable: false,
			render: (row: ActivityData) => renderLocationLink(row.locationLink),
		},
		{
			key: 'images',
			label: 'Images',
			width: '100px',
			sortable: false,
			render: (row: ActivityData) => renderImages(row.images),
		},
		
		{
			key: 'duration',
			label: 'Duration (hrs)',
			width: '120px',
			sortable: true,
			render: (row: ActivityData) => renderDuration(row.duration),
		},
		{
			key: 'price',
			label: 'Price',
			width: '120px',
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
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Add Activity Form Component */}
			<AddActivityForm
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false)
					setEditingActivity(null)
				}}
				onSubmit={handleFormSubmit}
				initialData={editingActivity ? {
					id: editingActivity.id,
					name: editingActivity.name,
					location: editingActivity.location,
					locationLink: editingActivity.locationLink,
					duration: editingActivity.duration,
					price: editingActivity.price,
					shortDescription: editingActivity.shortDescription,
					fullDescription: editingActivity.fullDescription,
					images: editingActivity.images,
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
							{/* Columns dropdown */}
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
										{ key: 'locationLink', label: 'Location Link' },
										{ key: 'images', label: 'Images' },
										
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

export default Activities