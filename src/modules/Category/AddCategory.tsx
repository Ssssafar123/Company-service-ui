import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Text, Separator, Flex, Button, AlertDialog, Card, Checkbox } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { createCategory, updateCategoryById } from '../../features/CategorySlice'

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
]

const AddCategory: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [initialValues, setInitialValues] = useState<any>({})
	const [isEditMode, setIsEditMode] = useState(false)
	const dispatch = useDispatch<AppDispatch>() // <-- use the typed dispatch

	// Dialog state
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		color?: 'red' | 'blue' | 'green' | 'gray'
		onConfirm: () => void
	} | null>(null)

	// Check if we're in edit mode based on location state
	useEffect(() => {
		const categoryData = location.state?.categoryData
		if (categoryData) {
			setIsEditMode(true)
			
			// Map the full Category object to form initial values
			const mappedValues = {
				category_name: categoryData.name || '',
				short_description: categoryData.short_description || '',
				long_description: categoryData.long_description || '',
				feature_images: categoryData.feature_images && categoryData.feature_images.length > 0 
					? categoryData.feature_images 
					: (categoryData.image ? [categoryData.image] : ['']), // Use image if feature_images is empty
				// itineraries: categoryData.itineraries || [],
				seo_fields: categoryData.seo_fields || null, // Add SEO fields
			}
			
			setInitialValues(mappedValues)
		} else {
			setIsEditMode(false)
			setInitialValues({
				feature_images: [''],
				// itineraries: [],
			})
		}
	}, [location.state])

	const handleSubmit = async (values: Record<string, any>) => {
		// Extract File objects from feature_images
		let featureImageFiles: File[] = [];
		if (Array.isArray(values.feature_images)) {
			featureImageFiles = values.feature_images.filter((img: any) => img instanceof File);
		}

		if (isEditMode) {
			// Update category
			try {
				const id = location.state?.categoryData?.id
				await dispatch(updateCategoryById({
					id,
					data: {
						name: values.category_name,
						short_description: values.short_description,
						long_description: values.long_description,
						// itineraries: values.itineraries,
						seo_fields: values.seo_fields,
						status: 'active',
						// Pass File objects if they exist
						imageFile: featureImageFiles[0],
						featureImageFiles: featureImageFiles,
					}
				})).unwrap()
				setDialogConfig({
					title: 'Success',
					description: 'Category updated successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => {
						setDialogOpen(false)
						navigate('/dashboard/category')
					},
				})
			} catch (error: any) {
				setDialogConfig({
					title: 'Error',
					description: error?.message || 'Failed to update category',
					actionText: 'OK',
					color: 'red',
					onConfirm: () => setDialogOpen(false),
				})
			}
		} else {
			// Create category
			try {
				await dispatch(createCategory({
					name: values.category_name,
					short_description: values.short_description,
					long_description: values.long_description,
					// itineraries: values.itineraries,
					seo_fields: values.seo_fields,
					status: 'active',
					image: '', // Will be replaced by backend with actual binary data
					// Pass File objects
					imageFile: featureImageFiles[0],
					featureImageFiles: featureImageFiles,
				})).unwrap()
				setDialogConfig({
					title: 'Success',
					description: 'Category created successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => {
						setDialogOpen(false)
						navigate('/dashboard/category')
					},
				})
			} catch (error: any) {
				setDialogConfig({
					title: 'Error',
					description: error?.message || 'Failed to create category',
					actionText: 'OK',
					color: 'red',
					onConfirm: () => setDialogOpen(false),
				})
			}
		}
		setDialogOpen(true)
	}

	// Memoize the custom render function for itineraries - use value from form, not external state
	// const renderItinerariesField = useCallback((value: string[] = [], onChange: (value: string[]) => void) => {
	// 	const selectedIds = value || []
		
	// 	const handleToggle = (itineraryId: string) => {
	// 		const newSelection = selectedIds.includes(itineraryId)
	// 			? selectedIds.filter((id) => id !== itineraryId)
	// 			: [...selectedIds, itineraryId]
	// 		onChange(newSelection)
	// 	}
		
	// 	return (
	// 		<Box>
	// 			<Text
	// 				size="2"
	// 				weight="medium"
	// 				style={{
	// 					color: 'var(--accent-12)',
	// 					marginBottom: '12px',
	// 					display: 'block',
	// 				}}
	// 			>
	// 				Total Itineraries{/*  ({dummyItineraries.length}) */}
	// 			</Text>
	// 			<Box
	// 				style={{
	// 					maxHeight: '400px',
	// 					overflowY: 'auto',
	// 					border: '1px solid var(--accent-6)',
	// 					borderRadius: '8px',
	// 					padding: '16px',
	// 					backgroundColor: 'var(--color-panel)',
	// 				}}
	// 			>
	// 				<Flex direction="column" gap="3">
	// 					{dummyItineraries.map((itinerary) => {
	// 						const isSelected = selectedIds.includes(itinerary.id)
							
	// 						return (
	// 							<Card
	// 								key={itinerary.id}
	// 								style={{
	// 									padding: '12px',
	// 									border: isSelected
	// 										? '2px solid var(--accent-9)'
	// 										: '1px solid var(--accent-6)',
	// 									backgroundColor: isSelected
	// 										? 'var(--accent-3)'
	// 										: 'var(--color-panel)',
	// 									cursor: 'pointer',
	// 									transition: 'all 0.2s',
	// 								}}
	// 								onClick={() => handleToggle(itinerary.id)}
	// 							>
	// 								<Flex align="center" gap="3">
	// 									<Checkbox
	// 										checked={isSelected}
	// 										onCheckedChange={() => handleToggle(itinerary.id)}
	// 										onClick={(e) => {
	// 											e.stopPropagation()
	// 										}}
	// 									/>
	// 									<Box style={{ flex: 1 }}>
	// 										<Text
	// 											size="3"
	// 											weight="medium"
	// 											style={{
	// 												color: 'var(--accent-12)',
	// 												marginBottom: '4px',
	// 												display: 'block',
	// 											}}
	// 										>
	// 											{itinerary.name}
	// 										</Text>
	// 										<Text
	// 											size="2"
	// 											style={{
	// 												color: 'var(--accent-11)',
	// 											}}
	// 										>
	// 											{itinerary.city} • {itinerary.priceDisplay}
	// 										</Text>
	// 									</Box>
	// 								</Flex>
	// 							</Card>
	// 						)
	// 					})}
	// 				</Flex>
	// 			</Box>
	// 		</Box>
	// 	)
	// }, []) 

	// Memoize form fields to prevent recreation on every render
	const formFields = useMemo(() => [
		{
			type: 'custom' as const,
			name: 'section1',
			label: 'Basic Information',
			customRender: () => (
				<Text
					size="5"
					weight="bold"
					style={{
						color: 'var(--accent-12)',
						marginBottom: '16px',
						display: 'block',
					}}
				>
					Basic Information
				</Text>
			),
		},
		{
			type: 'text' as const,
			name: 'category_name',
			label: 'Category Name',
			placeholder: 'Enter category name',
			fullWidth: true,
		},
		{
			type: 'richtext' as const,
			name: 'short_description',
			label: 'Short Description',
			placeholder: 'Enter short description...',
		},
		{
			type: 'richtext' as const,
			name: 'long_description',
			label: 'Long Description',
			placeholder: 'Enter long description...',
		},
		{
			type: 'file' as const,
			name: 'feature_images',
			label: 'Feature Image',
		},
		// {
		// 	type: 'custom' as const,
		// 	name: 'itineraries',
		// 	label: 'Total Itineraries',
		// 	customRender: renderItinerariesField,
		// },
		{
			type: 'custom' as const,
			name: '_separator_seo',
			label: '',
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},
		// Add SEO Fields section
		{
			name: 'seo_fields',
			label: 'SEO Settings',
			type: 'seo' as const,
			fullWidth: true,
		},
	], [/*renderItinerariesField*/])

	return (
		<Box style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			<Text
				size="7"
				weight="bold"
				style={{
					color: 'var(--accent-12)',
					marginBottom: '24px',
					display: 'block',
				}}
			>
				{isEditMode ? 'Update Category' : 'Add New Category'}
			</Text>

			<DynamicForm
				key={isEditMode ? `edit-${location.state?.categoryData?.id}` : 'new'} // Add key to force re-render
				fields={formFields}
				buttonText={isEditMode ? 'Update Category' : 'Create Category'}
				onSubmit={handleSubmit}
				initialValues={initialValues}
			/>

			{/* Controlled AlertDialog */}
			{dialogConfig && (
				<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialog.Content maxWidth="450px">
						<AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
						<AlertDialog.Description size="2">
							{dialogConfig.description}
						</AlertDialog.Description>
						<Flex gap="3" mt="4" justify="end">
							<AlertDialog.Action>
								<Button
									variant="solid"
									color={dialogConfig.color || 'green'}
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

export default AddCategory