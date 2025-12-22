import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
	fetchLocations,
	createLocation,
	updateLocationById,
	deleteLocationById,
	type Location as LocationType,
} from '../../features/LocationSlice'
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

type LocationData = {
	id: string
	name: string
	image: string
	tripCount: number
	order?: number
}

const Location: React.FC = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	
	// Get data from Redux store
	const locationsFromStore = useSelector((state: RootState) => state.location.locations)
	const loading = useSelector((state: RootState) => state.location.ui.loading)
	const error = useSelector((state: RootState) => state.location.ui.error)

	const [searchQuery, setSearchQuery] = useState('')
	const [locations, setLocations] = useState<LocationData[]>([])
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

	// Fetch locations on mount
	useEffect(() => {
		dispatch(fetchLocations())
	}, [dispatch])

	// Map Redux data to local format
	useEffect(() => {
		const mappedLocations = locationsFromStore.map((item) => ({
			id: item.id,
			name: item.name,
			// Set image to 'has-image' if binary data exists, empty otherwise
			image: 'binary', // Always use binary endpoint
			tripCount: item.tripCount || 0,
			order: item.order || 0,
		}))
		setLocations(mappedLocations)
	}, [locationsFromStore])

	const filteredLocations = useMemo(() => {
		if (!searchQuery.trim()) {
			return locations.sort((a, b) => (a.order || 0) - (b.order || 0))
		}

		const query = searchQuery.toLowerCase()
		return locations
			.filter((location) => location.name.toLowerCase().includes(query))
			.sort((a, b) => (a.order || 0) - (b.order || 0))
	}, [searchQuery, locations])

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

		const draggedIndex = locations.findIndex((loc) => loc.id === draggedId)
		const targetIndex = locations.findIndex((loc) => loc.id === targetId)

		if (draggedIndex === -1 || targetIndex === -1) return

		const newLocations = [...locations]
		const [draggedItem] = newLocations.splice(draggedIndex, 1)
		newLocations.splice(targetIndex, 0, draggedItem)

		const updatedLocations = newLocations.map((loc, index) => ({
			...loc,
			order: index + 1,
		}))

		setLocations(updatedLocations)
		setHasOrderChanged(true)
		setDraggedId(null)
	}

	const handleUpdateLocation = async () => {
		if (!hasOrderChanged) {
			setDialogConfig({
				title: 'No Changes',
				description: 'No location order changes detected.',
				actionText: 'OK',
				color: 'blue',
				onConfirm: () => setDialogOpen(false),
			})
			setDialogOpen(true)
			return
		}

		try {
			// Update each location's order
			for (const location of locations) {
				const originalLocation = locationsFromStore.find(l => l.id === location.id)
				if (originalLocation && originalLocation.order !== location.order) {
					await dispatch(updateLocationById({
						id: location.id,
						data: { order: location.order }
					})).unwrap()
				}
			}

			setDialogConfig({
				title: 'Success',
				description: 'Location order updated successfully!',
				actionText: 'OK',
				color: 'green',
				onConfirm: () => {
					setDialogOpen(false)
					setHasOrderChanged(false)
					dispatch(fetchLocations())
				},
			})
			setDialogOpen(true)
		} catch (error: any) {
			setDialogConfig({
				title: 'Error',
				description: error.message || 'Failed to update location order.',
				actionText: 'OK',
				color: 'red',
				onConfirm: () => setDialogOpen(false),
			})
			setDialogOpen(true)
		}
	}


const handleEdit = (location: LocationData) => {
	// Find the full location data from Redux store
	const fullLocation = locationsFromStore.find(l => l.id === location.id)
	
	if (fullLocation) {
		// Pass the full Location object with all fields properly mapped
		navigate('/dashboard/add-location', {
			state: { 
				locationData: {
					...fullLocation,
					// Map to the format AddLocation expects
					shortDescription: fullLocation.short_description,
					longDescription: fullLocation.long_description,
					images: fullLocation.feature_images && fullLocation.feature_images.length > 0 
						? fullLocation.feature_images 
						: (fullLocation.image ? [fullLocation.image] : []),
					itineraryIds: [], // Location type doesn't have this, but form expects it
					seoData: fullLocation.seo_fields,
				}
			},
		})
	} else {
		// Fallback: pass what we have
		navigate('/dashboard/add-location', {
			state: { locationData: location },
		})
	}
}

	const handleDelete = (location: LocationData) => {
		setDialogConfig({
			title: 'Delete Location',
			description: `Are you sure you want to delete "${location.name}"? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: async () => {
				try {
					await dispatch(deleteLocationById(location.id)).unwrap()
					setDialogOpen(false)
					setDialogConfig({
						title: 'Success',
						description: `Location "${location.name}" deleted successfully!`,
						actionText: 'OK',
						color: 'green',
						onConfirm: () => setDialogOpen(false),
					})
					setDialogOpen(true)
				} catch (error: any) {
					setDialogOpen(false)
					setDialogConfig({
						title: 'Error',
						description: error.message || 'Failed to delete location.',
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
				Location Management
			</Text>

			<Flex 
				gap="3" 
				align="center" 
				justify="between"
				style={{ marginBottom: '24px' }}
				direction={{ initial: 'column', sm: 'row' }}
			>
				<TextField.Root
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{ flex: 1, maxWidth: '300px', width: '100%' }}
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
						onClick={handleUpdateLocation}
						disabled={!hasOrderChanged}
						style={{
							color: 'white',
							backgroundColor: hasOrderChanged 
								? 'var(--accent-9)' 
								: 'var(--accent-6)',
							whiteSpace: 'nowrap',
							cursor: hasOrderChanged ? 'pointer' : 'not-allowed',
						}}
					>
						Update Location
					</Button>

					<Button
						variant="soft"
						size="2"
						onClick={() => navigate('/dashboard/add-location')}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
							whiteSpace: 'nowrap',
							flexShrink: 0,
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
						Add Location
					</Button>
				</Flex>
			</Flex>

			<Grid
				columns={{ initial: '1', sm: '2', md: '3' }}
				gap="4"
				style={{ marginBottom: '24px' }}
			>
				{filteredLocations.map((location) => (
					<Card
						key={location.id}
						draggable
						onDragStart={(e) => handleDragStart(e, location.id)}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, location.id)}
						style={{
							backgroundColor: 'var(--color-panel)',
							border: draggedId === location.id 
								? '2px dashed var(--accent-9)' 
								: 'none',
							borderRadius: '8px',
							overflow: 'hidden',
							cursor: 'grab',
							transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
							boxShadow: 'none',
							opacity: draggedId === location.id ? 0.5 : 1,
						}}
						onMouseEnter={(e) => {
							if (draggedId !== location.id) {
								e.currentTarget.style.transform = 'translateY(-2px)'
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
								e.currentTarget.style.cursor = 'grab'
							}
						}}
						onMouseLeave={(e) => {
							if (draggedId !== location.id) {
								e.currentTarget.style.transform = 'translateY(0)'
								e.currentTarget.style.boxShadow = 'none'
								e.currentTarget.style.cursor = 'grab'
							}
						}}
					>
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
								src={`http://localhost:8000/api/location/${location.id}/image?t=${Date.now()}`}
								alt={location.name}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									pointerEvents: 'none',
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement
									// Prevent infinite error loop
									if (!target.src.includes('data:image')) {
										target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
									}
								}}
							/>
						</Box>

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
										{location.name}
									</Text>
									<Text
										size="2"
										style={{
											color: 'var(--accent-11)',
										}}
									>
										{location.tripCount} Trips
									</Text>
								</Box>

								<Flex gap="2" align="center">
									<IconButton
										variant="ghost"
										size="2"
										onClick={(e) => {
											e.stopPropagation()
											handleEdit(location)
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
											handleDelete(location)
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

			{filteredLocations.length === 0 && (
				<Box
					style={{
						padding: '48px',
						textAlign: 'center',
						color: 'var(--accent-11)',
					}}
				>
					<Text size="3">No locations found</Text>
				</Box>
			)}

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

export default Location