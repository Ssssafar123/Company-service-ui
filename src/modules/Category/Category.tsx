import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Grid,
	IconButton,
	AlertDialog,
	Card,
} from '@radix-ui/themes'

type CategoryData = {
	id: string
	name: string
	image: string
	tripCount: number
	order?: number
}

const dummyCategories: CategoryData[] = [
	{
		id: '1',
		name: 'Beaches',
		image: '/images/categories/Goa_bg.webp.png',
		tripCount: 32,
		order: 1,
	},
	{
		id: '2',
		name: 'Mountains',
		image: '/images/categories/hill.png',
		tripCount: 16,
		order: 2,
	},
	{
		id: '3',
		name: 'Adventure',
		image: '/images/categories/modern.png',
		tripCount: 25,
		order: 3,
	},
	{
		id: '4',
		name: 'Honeymoon Trips',
		image: '/images/categories/tourists.jpg',
		tripCount: 48,
		order: 4,
	},
	{
		id: '5',
		name: 'Adventure',
		image: '/images/categories/turkey_bg.webp.jpg',
		tripCount: 25,
		order: 5,
	},
	{
		id: '6',
		name: 'Category',
		image: '/images/categories/mountainss.jpg',
		tripCount: 13,
		order: 6,
	},
]

// LocalStorage key for category order
const CATEGORY_ORDER_KEY = 'category_order'

const Category: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [categories, setCategories] = useState<CategoryData[]>([])
	const [draggedId, setDraggedId] = useState<string | null>(null)
	const [hasOrderChanged, setHasOrderChanged] = useState(false)

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

	// Load categories from localStorage on mount
	useEffect(() => {
		const savedOrder = localStorage.getItem(CATEGORY_ORDER_KEY)
		if (savedOrder) {
			try {
				const savedCategories: CategoryData[] = JSON.parse(savedOrder)
				// Merge saved order with dummy data to ensure all categories exist
				const mergedCategories = dummyCategories.map((dummy) => {
					const saved = savedCategories.find((cat) => cat.id === dummy.id)
					return saved ? { ...dummy, order: saved.order } : dummy
				})
				// Sort by order
				const sorted = mergedCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
				setCategories(sorted)
			} catch (error) {
				// If parsing fails, use default order
				setCategories(dummyCategories)
			}
		} else {
			// First time - use default order
			setCategories(dummyCategories)
		}
	}, [])

	const filteredCategories = useMemo(() => {
		if (!searchQuery.trim()) {
			return categories.sort((a, b) => (a.order || 0) - (b.order || 0))
		}

		const query = searchQuery.toLowerCase()
		return categories
			.filter((category) => category.name.toLowerCase().includes(query))
			.sort((a, b) => (a.order || 0) - (b.order || 0))
	}, [searchQuery, categories])

	// Drag and Drop Handlers
	const handleDragStart = (e: React.DragEvent, id: string) => {
		setDraggedId(id)
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/html', id)
		;(e.target as HTMLElement).style.opacity = '0.5'
	}

	const handleDragEnd = (e: React.DragEvent) => {
		;(e.target as HTMLElement).style.opacity = '1'
		setDraggedId(null)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDrop = (e: React.DragEvent, targetId: string) => {
		e.preventDefault()
		
		if (!draggedId || draggedId === targetId) return

		const draggedIndex = categories.findIndex((cat) => cat.id === draggedId)
		const targetIndex = categories.findIndex((cat) => cat.id === targetId)

		if (draggedIndex === -1 || targetIndex === -1) return

		const newCategories = [...categories]
		const [draggedItem] = newCategories.splice(draggedIndex, 1)
		newCategories.splice(targetIndex, 0, draggedItem)

		// Update order numbers
		const updatedCategories = newCategories.map((cat, index) => ({
			...cat,
			order: index + 1,
		}))

		setCategories(updatedCategories)
		setHasOrderChanged(true)
		setDraggedId(null)
	}

	const handleUpdateCategory = () => {
		if (!hasOrderChanged) {
			// Show message that no changes were made
			setDialogConfig({
				title: 'No Changes',
				description: 'No category order changes detected.',
				actionText: 'OK',
				color: 'blue',
				onConfirm: () => setDialogOpen(false),
			})
			setDialogOpen(true)
			return
		}

		// Save to localStorage
		try {
			localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(categories))
		} catch (error) {
			console.error('Failed to save category order:', error)
		}

		// Show success message
		setDialogConfig({
			title: 'Success',
			description: 'Category order updated successfully!',
			actionText: 'OK',
			color: 'green',
			onConfirm: () => {
				setDialogOpen(false)
				setHasOrderChanged(false)
			},
		})
		setDialogOpen(true)
	}

	const handleEdit = (category: CategoryData) => {
		navigate('/add-category', {
			state: { categoryData: category },
		})
	}

	const handleDelete = (category: CategoryData) => {
		setDialogConfig({
			title: 'Delete Category',
			description: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				const updatedCategories = categories
					.filter((item) => item.id !== category.id)
					.map((cat, index) => ({ ...cat, order: index + 1 }))
				setCategories(updatedCategories)
				// Save updated order to localStorage
				try {
					localStorage.setItem(CATEGORY_ORDER_KEY, JSON.stringify(updatedCategories))
				} catch (error) {
					console.error('Failed to save category order:', error)
				}
				setDialogOpen(false)
				// Show success
				setDialogConfig({
					title: 'Success',
					description: `Category "${category.name}" deleted successfully!`,
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

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
				Category Management
			</Text>

			{/* Search and Buttons Section */}
			<Flex 
				gap="3" 
				align="center" 
				justify="between"
				style={{ marginBottom: '24px' }}
				direction={{ initial: 'column', sm: 'row' }}
				//className="category-search-buttons"
			>
				<TextField.Root
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{ flex: 1, maxWidth: '300px', width: '100%' }}
					//className="category-search-field"
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

				{/* Buttons on the right side */}
				<Flex 
					gap="2" 
					align="center"
					//className="category-buttons"
				>
					<Button
						variant="soft"
						size="2"
						onClick={handleUpdateCategory}
						disabled={!hasOrderChanged}
						style={{
							color: 'white',
							backgroundColor: hasOrderChanged 
								? 'var(--accent-9)' 
								: 'var(--accent-6)',
							whiteSpace: 'nowrap',
							cursor: hasOrderChanged ? 'pointer' : 'not-allowed',
						}}
						className="category-update-btn"
					>
						Update Category
					</Button>

					<Button
						variant="soft"
						size="2"
						onClick={() => navigate('/add-category')}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
							whiteSpace: 'nowrap',
							flexShrink: 0,
						}}
						className="category-add-btn"
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
						Add Category
					</Button>
				</Flex>
			</Flex>

			{/* Category Cards Grid */}
			<Grid
				columns={{ initial: '1', sm: '2', md: '3' }}
				gap="4"
				style={{ marginBottom: '24px' }}
			>
				{filteredCategories.map((category) => (
					<Card
						key={category.id}
						draggable
						onDragStart={(e) => handleDragStart(e, category.id)}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, category.id)}
						style={{
							backgroundColor: 'var(--color-panel)',
							border: draggedId === category.id 
								? '2px dashed var(--accent-9)' 
								: 'none',
							borderRadius: '8px',
							overflow: 'hidden',
							cursor: 'grab',
							transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
							boxShadow: 'none',
							opacity: draggedId === category.id ? 0.5 : 1,
						}}
						onMouseEnter={(e) => {
							if (draggedId !== category.id) {
								e.currentTarget.style.transform = 'translateY(-2px)'
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
								e.currentTarget.style.cursor = 'grab'
							}
						}}
						onMouseLeave={(e) => {
							if (draggedId !== category.id) {
								e.currentTarget.style.transform = 'translateY(0)'
								e.currentTarget.style.boxShadow = 'none'
								e.currentTarget.style.cursor = 'grab'
							}
						}}
					>
						{/* Category Image - Rounded top corners only */}
						<Box
							style={{
								width: '100%',
								height: '200px',
								overflow: 'hidden',
								backgroundColor: 'var(--accent-3)',
								position: 'relative',
								borderTopLeftRadius: '10px',
								borderTopRightRadius: '10px',
								borderBottomLeftRadius: '10px',
								borderBottomRightRadius: '10px',
							}}
						>
							<img
								src={category.image}
								alt={category.name}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									pointerEvents: 'none',
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement
									target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
								}}
							/>
						</Box>

						{/* Category Content */}
						<Box style={{ padding: '16px' }}>
							<Flex justify="between" align="start" style={{ marginBottom: '8px' }}>
								<Box style={{ flex: 1 }}>
									<Text
										size="4"
										weight="bold"
										style={{
											color: 'var(--accent-12)',
											marginBottom: '4px',
											display: 'block',
										}}
									>
										{category.name}
									</Text>
									<Text
										size="2"
										style={{
											color: 'var(--accent-11)',
										}}
									>
										{category.tripCount} Trips
									</Text>
								</Box>

								{/* Action Icons */}
								<Flex gap="2" align="center">
									<IconButton
										variant="ghost"
										size="2"
										onClick={(e) => {
											e.stopPropagation()
											handleEdit(category)
										}}
										onMouseDown={(e) => e.stopPropagation()}
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
											<path
												d="M11.5 2.5L13.5 4.5L4.5 13.5H2.5V11.5L11.5 2.5Z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</IconButton>
									<IconButton
										variant="ghost"
										size="2"
										color="red"
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(category)
										}}
										onMouseDown={(e) => e.stopPropagation()}
										style={{
											cursor: 'pointer',
										}}
									>
										<svg
											width="16"
											height="16"
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
									</IconButton>
								</Flex>
							</Flex>
						</Box>
					</Card>
				))}
			</Grid>

			{/* Empty State */}
			{filteredCategories.length === 0 && (
				<Box
					style={{
						padding: '48px',
						textAlign: 'center',
						color: 'var(--accent-11)',
					}}
				>
					<Text size="3">No categories found</Text>
				</Box>
			)}

			{/* Controlled AlertDialog */}
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

export default Category