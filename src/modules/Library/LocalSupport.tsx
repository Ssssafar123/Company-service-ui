import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchLocalSupportsByPage,
    createLocalSupport,
    updateLocalSupportById,
    deleteLocalSupportById,
    type LocalSupport as LocalSupportType,
} from '../../features/LocalSupportSlice'
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
import AddLocalSupportForm from './AddLocalSupportForm'

type LocalSupportData = {
    id: string
    name: string
    contact: string
    location: string
    supportType: string
    rating: number
}

// Dummy local support data


const LocalSupport: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    
    // Redux selectors
    const { localSupports: reduxLocalSupports, pagination, ui } = useSelector(
        (state: RootState) => state.localSupport
    )

    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['name', 'contact', 'location', 'supportType', 'rating', 'actions']))
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [editingSupport, setEditingSupport] = useState<LocalSupportData | null>(null)

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

    // Fetch local supports on component mount and when page changes
    useEffect(() => {
        dispatch(fetchLocalSupportsByPage({ page: currentPage, limit: itemsPerPage }))
    }, [dispatch, currentPage, itemsPerPage])

    // Map Redux data to component format
    const localSupports: LocalSupportData[] = useMemo(() => {
        return reduxLocalSupports.map((support) => ({
            id: support.id,
            name: support.name,
            contact: support.contact,
            location: support.location,
            supportType: support.supportType,
            rating: support.rating || 0,
        }))
    }, [reduxLocalSupports])

    // Filter and sort local supports
    const filteredAndSortedLocalSupports = useMemo(() => {
        let filtered = localSupports

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = localSupports.filter(
                (support) =>
                    support.name.toLowerCase().includes(query) ||
                    support.contact.includes(query) ||
                    support.location.toLowerCase().includes(query) ||
                    support.supportType.toLowerCase().includes(query) ||
                    support.rating.toString().includes(query)
            )
        }

        // Apply sorting
        if (sortConfig && sortConfig.direction) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key as keyof LocalSupportData]
                const bValue = b[sortConfig.key as keyof LocalSupportData]

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return filtered
    }, [localSupports, searchQuery, sortConfig])

    // Use pagination from Redux state
    const totalPages = pagination.totalPages
    const paginatedLocalSupports = filteredAndSortedLocalSupports

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

	const handleEdit = (support: LocalSupportData) => {
        setEditingSupport(support)
        setIsFormOpen(true)
    }

    const handleDelete = (support: LocalSupportData) => {
        setDialogConfig({
            title: 'Delete Local Support',
            description: `Are you sure you want to delete "${support.name}"? This action cannot be undone.`,
            actionText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
            onConfirm: async () => {
                try {
                    await dispatch(deleteLocalSupportById(support.id)).unwrap()
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Success',
                        description: `Local Support "${support.name}" deleted successfully!`,
                        actionText: 'OK',
                        color: 'green',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                } catch (error) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: `Failed to delete local support: ${error}`,
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

    const handleAddNew = () => {
        setEditingSupport(null)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (values: Record<string, any>) => {
        console.log('Form submitted with values:', values)
        
        try {
            if (editingSupport) {
                // Update existing local support
                const updateData: Partial<LocalSupportType> = {
                    name: values.name || '',
                    contact: values.contact || '',
                    location: values.location || '',
                    supportType: values.supportType as any || 'Guide',
                    rating: parseInt(values.rating) || 0,
                }

                await dispatch(updateLocalSupportById({ 
                    id: editingSupport.id, 
                    data: updateData 
                })).unwrap()

                setDialogConfig({
                    title: 'Success',
                    description: `Local Support "${values.name}" updated successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            } else {
                // Create new local support
                const newLocalSupport: Omit<LocalSupportType, 'id'> = {
                    name: values.name || '',
                    contact: values.contact || '',
                    location: values.location || '',
                    supportType: values.supportType as any || 'Guide',
                    rating: parseInt(values.rating) || 0,
                    availability: 'available',
                    status: 'active',
                }

                await dispatch(createLocalSupport(newLocalSupport)).unwrap()

                setDialogConfig({
                    title: 'Success',
                    description: `Local Support "${values.name}" added successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            }

            setDialogOpen(true)
            setIsFormOpen(false)
            setEditingSupport(null)
        } catch (error) {
            setDialogConfig({
                title: 'Error',
                description: `Failed to ${editingSupport ? 'update' : 'create'} local support: ${error}`,
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        }
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
	const renderActions = (support: LocalSupportData) => {
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
					<DropdownMenu.Item onClick={() => handleEdit(support)}>
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
					<DropdownMenu.Item color="red" onClick={() => handleDelete(support)}>
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
			key: 'contact',
			label: 'Contact',
			width: '150px',
			sortable: true,
		},
		{
			key: 'location',
			label: 'Location',
			width: '150px',
			sortable: true,
		},
		{
			key: 'supportType',
			label: 'Support Type',
			width: '150px',
			sortable: true,
		},
		{
			key: 'rating',
			label: 'Rating',
			width: '120px',
			sortable: true,
			render: (row: LocalSupportData) => renderRating(row.rating),
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: LocalSupportData) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Loading indicator */}
			{ui.loading && (
				<Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Text>Loading...</Text>
				</Box>
			)}

			{/* Add Local Support Form Component */}
			<AddLocalSupportForm
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false)
					setEditingSupport(null)
				}}
				onSubmit={handleFormSubmit}
				initialData={editingSupport ? {
					id: editingSupport.id,
					name: editingSupport.name,
					contact: editingSupport.contact,
					location: editingSupport.location,
					supportType: editingSupport.supportType,
					rating: editingSupport.rating,
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
						Manage Local Support
					</Text>
					<Text
						size="2"
						style={{
							color: 'var(--accent-11)',
							display: 'block',
						}}
					>
						Here you can add, edit, and view your Local Support.
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
										{ key: 'name', label: 'Name' },
										{ key: 'contact', label: 'Contact' },
										{ key: 'location', label: 'Location' },
										{ key: 'supportType', label: 'Support Type' },
										{ key: 'rating', label: 'Rating' },
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
								Add New Local Support
							</Button>
						</Flex>
					</Flex>
				</Card>

				{/* Table Section */}
				<Card style={{ padding: '16px' }}>
					<Table
						columns={columns}
						rows={paginatedLocalSupports}
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
				{filteredAndSortedLocalSupports.length === 0 && (
					<Box
						style={{
							padding: '48px',
							textAlign: 'center',
							color: 'var(--accent-11)',
						}}
					>
						<Text size="3">No local supports found</Text>
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

export default LocalSupport