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
import AddReviewForm from './AddReviewForm'

type ReviewData = {
	id: string
	customerName: string
	rating: number
	reviewText: string
	date: string
	status: 'Approved' | 'Pending' | 'Rejected'
	packageName?: string
	packageCode?: string
	reviewerImageUrl?: string
	itineraryId?: string
}

// Dummy review data
const dummyReviews: ReviewData[] = [
	{
		id: '1',
		customerName: 'Rajesh Kumar',
		rating: 5,
		reviewText: 'Amazing experience! The tour was well organized and the guide was very knowledgeable.',
		date: '2024-01-15',
		status: 'Approved',
		packageName: 'Manali & Kasol Tour',
		packageCode: '#MKP02',
		itineraryId: '11',
	},
	{
		id: '2',
		customerName: 'Priya Sharma',
		rating: 4,
		reviewText: 'Good trip overall, but hotel could have been better.',
		date: '2024-01-14',
		status: 'Approved',
		packageName: 'Goa Beach Tour',
		packageCode: '#GB01',
		itineraryId: '12',
	},
	{
		id: '3',
		customerName: 'Amit Patel',
		rating: 5,
		reviewText: 'Excellent service and beautiful destinations. Highly recommended!',
		date: '2024-01-13',
		status: 'Pending',
		packageName: 'Kerala Backwaters',
		packageCode: '#KB03',
		itineraryId: '13',
	},
	{
		id: '4',
		customerName: 'Sneha Reddy',
		rating: 3,
		reviewText: 'Average experience. Some activities were cancelled without notice.',
		date: '2024-01-12',
		status: 'Pending',
		packageName: 'Ladakh Adventure',
		packageCode: '#LA05',
		itineraryId: '14',
	},
	{
		id: '5',
		customerName: 'Vikram Singh',
		rating: 5,
		reviewText: 'Best trip ever! Everything was perfect from start to finish.',
		date: '2024-01-11',
		status: 'Approved',
		packageName: 'Rajasthan Heritage',
		packageCode: '#RH07',
		itineraryId: '15',
	},
	{
		id: '6',
		customerName: 'Ananya Verma',
		rating: 2,
		reviewText: 'Not satisfied with the service. Poor communication.',
		date: '2024-01-10',
		status: 'Rejected',
		packageName: 'Shimla Manali',
		packageCode: '#SM09',
	},
	{
		id: '7',
		customerName: 'Karan Mehta',
		rating: 4,
		reviewText: 'Great value for money. Would book again.',
		date: '2024-01-09',
		status: 'Approved',
		packageName: 'Andaman Islands',
		packageCode: '#AI11',
	},
	{
		id: '8',
		customerName: 'Divya Nair',
		rating: 5,
		reviewText: 'Outstanding experience! The team was very professional.',
		date: '2024-01-08',
		status: 'Approved',
		packageName: 'Darjeeling Tea Gardens',
		packageCode: '#DT13',
	},
	{
		id: '9',
		customerName: 'Arjun Gupta',
		rating: 4,
		reviewText: 'Good trip, enjoyed the activities. Food was excellent.',
		date: '2024-01-07',
		status: 'Pending',
		packageName: 'Udaipur Palace Tour',
		packageCode: '#UP15',
	},
	{
		id: '10',
		customerName: 'Riya Joshi',
		rating: 5,
		reviewText: 'Perfect honeymoon destination! Romantic and beautiful.',
		date: '2024-01-06',
		status: 'Approved',
		packageName: 'Rishikesh Rafting',
		packageCode: '#RR17',
	},
]

// Dummy itineraries for mapping
const dummyItineraries = [
	{ id: '1', name: 'Pachmarhi | Ex- Indore' },
	{ id: '2', name: 'Kerala 7D 6N' },
	{ id: '3', name: 'Spiti Valley Full Circuit' },
	{ id: '4', name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Indore' },
	{ id: '5', name: 'Udaipur Mount Abu Weekend Group Trip 2D 1N | Ex- Delhi' },
	{ id: '6', name: 'Goa Beach Paradise 4D 3N' },
	{ id: '7', name: 'Rajasthan Cultural Tour 6D 5N' },
	{ id: '8', name: 'Himachal Adventure 5D 4N' },
	{ id: '9', name: 'North East Explorer 8D 7N' },
	{ id: '10', name: 'Ladakh Motorcycle Trip 10D 9N' },
	{ id: '11', name: 'Manali & Kasol Tour' },
	{ id: '12', name: 'Goa Beach Tour' },
	{ id: '13', name: 'Kerala Backwaters' },
	{ id: '14', name: 'Ladakh Adventure' },
	{ id: '15', name: 'Rajasthan Heritage' },
]

const Review: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [reviews, setReviews] = useState<ReviewData[]>(dummyReviews)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(['customerName', 'rating', 'reviewText', 'date', 'status', 'packageName', 'actions'])
	)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)

	// Form panel state
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingReview, setEditingReview] = useState<ReviewData | null>(null)

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

	// Filter and sort reviews
	const filteredAndSortedReviews = useMemo(() => {
		let filtered = reviews

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = reviews.filter(
				(review) =>
					review.customerName.toLowerCase().includes(query) ||
					review.reviewText.toLowerCase().includes(query) ||
					review.rating.toString().includes(query) ||
					review.date.includes(query) ||
					review.status.toLowerCase().includes(query) ||
					(review.packageName && review.packageName.toLowerCase().includes(query)) ||
					(review.packageCode && review.packageCode.includes(query))
			)
		}

		// Apply sorting
		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof ReviewData]
				const bValue = b[sortConfig.key as keyof ReviewData]

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
	}, [reviews, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedReviews = filteredAndSortedReviews.slice(startIndex, endIndex)

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

	const handleEdit = (review: ReviewData) => {
		setEditingReview(review)
		setIsFormOpen(true)
	}

	const handleAddNew = () => {
		setEditingReview(null)
		setIsFormOpen(true)
	}

	const handleFormSubmit = (values: Record<string, any>) => {
		console.log('Form submitted with values:', values)
		
		// Get selected itinerary name
		const selectedItinerary = dummyItineraries.find((it) => it.id === values.itineraryId)
		const packageName = selectedItinerary?.name || ''

		// Get current date
		const today = new Date()
		const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

		if (editingReview) {
			// Update existing review
			const updatedReview: ReviewData = {
				...editingReview,
				customerName: values.reviewerName || '',
				reviewerImageUrl: values.reviewerImageUrl || '',
				reviewText: values.reviewText || '',
				rating: values.rating || 5,
				itineraryId: values.itineraryId || '',
				packageName: packageName,
			}

			setReviews(reviews.map((r) => (r.id === editingReview.id ? updatedReview : r)))

			setDialogConfig({
				title: 'Success',
				description: `Review updated successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		} else {
			// Create new review
			const newReview: ReviewData = {
				id: String(reviews.length + 1),
				customerName: values.reviewerName || '',
				reviewerImageUrl: values.reviewerImageUrl || '',
				reviewText: values.reviewText || '',
				rating: values.rating || 5,
				date: date,
				status: 'Pending',
				packageName: packageName,
				itineraryId: values.itineraryId || '',
			}

			setReviews([...reviews, newReview])

			setDialogConfig({
				title: 'Success',
				description: `Review "${newReview.customerName}" added successfully!`,
				actionText: 'OK',
				color: 'green',
				onConfirm: () => setDialogOpen(false),
			})
		}

		setDialogOpen(true)
		setIsFormOpen(false)
		setEditingReview(null)
	}

	const handleDelete = (review: ReviewData) => {
		setDialogConfig({
			title: 'Delete Review',
			description: `Are you sure you want to delete the review by "${review.customerName}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setReviews(reviews.filter((r) => r.id !== review.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: `Review deleted successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleStatusChange = (review: ReviewData, newStatus: 'Approved' | 'Pending' | 'Rejected') => {
		setReviews(reviews.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r)))
		setDialogConfig({
			title: 'Success',
			description: `Review status updated to "${newStatus}"!`,
			actionText: 'OK',
			color: 'green',
			onConfirm: () => setDialogOpen(false),
		})
		setDialogOpen(true)
	}

	// Render rating with stars
	const renderRating = (rating: number) => {
		return (
			<Flex align="center" gap="1">
				<Text size="2" weight="medium">
					{rating}
				</Text>
				<Text size="2" style={{ color: '#fbbf24' }}>
					{'★'.repeat(rating)}
				</Text>
				<Text size="2" style={{ color: '#e5e7eb' }}>
					{'★'.repeat(5 - rating)}
				</Text>
			</Flex>
		)
	}

	// Render status badge
	const renderStatus = (status: 'Approved' | 'Pending' | 'Rejected') => {
		const colorMap = {
			Approved: 'green',
			Pending: 'yellow',
			Rejected: 'red',
		}
		return (
			<Badge color={colorMap[status] as any} size="2">
				{status}
			</Badge>
		)
	}

	// Render review text (truncated)
	const renderReviewText = (text: string) => {
		const maxLength = 100
		const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
		return (
			<Text size="2" style={{ maxWidth: '300px' }}>
				{truncated}
			</Text>
		)
	}

	// Render actions menu
	const renderActions = (review: ReviewData) => {
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
					<DropdownMenu.Item onClick={() => handleEdit(review)}>
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
					{review.status !== 'Approved' && (
						<DropdownMenu.Item onClick={() => handleStatusChange(review, 'Approved')}>
							<Flex align="center" gap="2">
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<path d="M13.5 4.5L6 12L2.5 8.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<Text size="2">Approve</Text>
							</Flex>
						</DropdownMenu.Item>
					)}
					{review.status !== 'Rejected' && (
						<DropdownMenu.Item color="red" onClick={() => handleStatusChange(review, 'Rejected')}>
							<Flex align="center" gap="2">
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<path d="M4 4L12 12M12 4L4 12" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<Text size="2">Reject</Text>
							</Flex>
						</DropdownMenu.Item>
					)}
					<DropdownMenu.Separator />
					<DropdownMenu.Item color="red" onClick={() => handleDelete(review)}>
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
			key: 'customerName',
			label: 'Customer Name',
			width: '150px',
			sortable: true,
		},
		{
			key: 'rating',
			label: 'Rating',
			width: '150px',
			sortable: true,
			render: (row: ReviewData) => renderRating(row.rating),
		},
		{
			key: 'reviewText',
			label: 'Review',
			width: '300px',
			sortable: false,
			render: (row: ReviewData) => renderReviewText(row.reviewText),
		},
		{
			key: 'packageName',
			label: 'Package',
			width: '200px',
			sortable: true,
		},
		{
			key: 'date',
			label: 'Date',
			width: '120px',
			sortable: true,
		},
		{
			key: 'status',
			label: 'Status',
			width: '120px',
			sortable: true,
			render: (row: ReviewData) => renderStatus(row.status),
		},
		{
			key: 'actions',
			label: '',
			width: '80px',
			sortable: false,
			render: (row: ReviewData) => renderActions(row),
		},
	].filter((col) => visibleColumns.has(col.key))

	return (
		<Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
			{/* Add Review Form Component */}
			<AddReviewForm
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false)
					setEditingReview(null)
				}}
				onSubmit={handleFormSubmit}
				initialData={editingReview ? {
					id: editingReview.id,
					customerName: editingReview.customerName,
					reviewerImageUrl: editingReview.reviewerImageUrl,
					reviewText: editingReview.reviewText,
					rating: editingReview.rating,
					itineraryId: editingReview.itineraryId,
					packageName: editingReview.packageName,
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
						Manage Reviews
					</Text>
					<Text
						size="2"
						style={{
							color: 'var(--accent-11)',
							display: 'block',
						}}
					>
						Here you can view, approve, reject, and manage customer reviews.
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
										{ key: 'customerName', label: 'Customer Name' },
										{ key: 'rating', label: 'Rating' },
										{ key: 'reviewText', label: 'Review' },
										{ key: 'packageName', label: 'Package' },
										{ key: 'date', label: 'Date' },
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

							{/* Add New Review Button */}
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
								Add New Review
							</Button>
						</Flex>
					</Flex>
				</Card>

				{/* Table Section */}
				<Card style={{ padding: '16px' }}>
					<Table
						columns={columns}
						rows={paginatedReviews}
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
				{filteredAndSortedReviews.length === 0 && (
					<Box
						style={{
							padding: '48px',
							textAlign: 'center',
							color: 'var(--accent-11)',
						}}
					>
						<Text size="3">No reviews found.</Text>
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

export default Review