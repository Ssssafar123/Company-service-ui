import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Text, Separator, Flex, Button, AlertDialog } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import axios from 'axios'


// Dummy data for options
const dummyLocations = [
	{ value: '1', label: 'Pachmarhi' },
	{ value: '2', label: 'Kerala' },
	{ value: '3', label: 'Spiti Valley' },
	{ value: '4', label: 'Udaipur' },
	{ value: '5', label: 'Goa' },
]

const dummyCategories = [
	{ value: '1', label: 'Adventure' },
	{ value: '2', label: 'Beach' },
	{ value: '3', label: 'Cultural' },
	{ value: '4', label: 'Mountain' },
	{ value: '5', label: 'Desert' },
]

const dummyPackageTypes = [
	{ value: 'standard', label: 'Standard' },
	{ value: 'deluxe', label: 'Deluxe' },
	{ value: 'premium', label: 'Premium' },
	{ value: 'luxury', label: 'Luxury' },
	{ value: 'budget', label: 'Budget' },
]

const AddNewItinerary: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [formData, setFormData] = useState<any>({})
	const [initialValues, setInitialValues] = useState<any>({})
	const [isEditMode, setIsEditMode] = useState(false)

	// Add dialog state
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		color?: 'red' | 'blue' | 'green' | 'gray'
		onConfirm: () => void 
	} | null>(null)
  

	// Helper function to find location ID by city name
	const findLocationIdByCity = (cityName: string): string => {
		const location = dummyLocations.find(
			loc => loc.label.toLowerCase() === cityName.toLowerCase() ||
				   cityName.toLowerCase().includes(loc.label.toLowerCase())
		)
		return location?.value || ''
	}

	// Check if we're in edit mode based on location state
	useEffect(() => {
		const itineraryData = location.state?.itineraryData
		if (itineraryData) {
			setIsEditMode(true)
			
			// Map itinerary data to form initial values
			// Adjust this mapping based on your actual backend data structure
			const mappedValues = {
				iti_name: itineraryData.name || '',
				travel_location: findLocationIdByCity(itineraryData.city) || '',
				categories: [], 
			}
			
			setInitialValues(mappedValues)
		} else {
			setIsEditMode(false)
			setInitialValues({})
		}
	}, [location.state])

	

	const handleSubmit = async (values: Record<string, any>) => {
		try {
			// Map your form values to the API payload structure here
			const sanitizeImages = (img: any) => {
				if (!img) return [];
				if (Array.isArray(img)) {
					return img.filter((i) => typeof i === 'string' && i.trim() !== '');
				}
				if (typeof img === 'string' && img.trim() !== '') {
					return [img];
				}
				return [];
			};

			const payload = {
				name: values.iti_name,
				city: dummyLocations.find(loc => loc.value === values.travel_location)?.label || '',
				price: values.price || 12000,
				priceDisplay: values.priceDisplay || "₹12,000",
				status: values.status || "Active",
				trending: values.trending || "Yes",
				description: values.iti_desc,
				shortDescription: values.iti_short_desc,
				altitude: values.iti_altitude,
				scenary: values.iti_scenary,
				culturalSite: values.iti_cultural_site,
				brochureBanner: values.iti_brochure_banner,
				isCustomize: values.iti_is_customize,
				notes: values.iti_notes,
				images: sanitizeImages(values.iti_img),
				daywiseActivities: values.day_details || [],
				hotelDetails: values.hotels || [],
				packages: values.package_details || {},
				batches: values.batches || [],
				seoFields: values.seo_fields || {},
				duration: values.iti_duration,
				inclusions: values.iti_inclusion ? [values.iti_inclusion] : [],
				exclusions: values.iti_exclusion ? [values.iti_exclusion] : [],
				termsAndConditions: values.termsAndConditions || "",
				cancellationPolicy: values.cancellationPolicy || "",
			};

			const response = await axios.post('http://localhost:8000/api/itinerary', payload);

			setFormData(values);
			setDialogConfig({
				title: 'Success',
				description: 'Itinerary created successfully!',
				actionText: 'OK',
				color: 'green',
				onConfirm: () => {
					setDialogOpen(false);
					navigate('/dashboard/itinerary');
				},
			});
			setDialogOpen(true);
		} catch (error) {
			setDialogConfig({
				title: 'Error',
				description: 'Failed to create itinerary.',
				actionText: 'OK',
				color: 'red',
				onConfirm: () => setDialogOpen(false),
			});
			setDialogOpen(true);
			console.error('API error:', error);
		}
	}

	const formFields = [
		// Section 1: Basic Information - Add heading separator
		{
			name: '_section_1_header',
			label: 'Basic Information',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginBottom: '8px', marginTop: '16px' }}>
					<Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
						Basic Information
					</Text>
					<Separator size="4" style={{ marginTop: '8px' }} />
				</Box>
			),
			fullWidth: true,
		},
		{
			name: 'iti_name',
			label: 'Itinerary Name',
			type: 'text' as const,
			placeholder: 'Enter name of Itinerary',
		},
		{
			name: 'travel_location',
			label: 'Travel Location',
			type: 'select' as const,
			placeholder: 'Select Travel Location',
			options: dummyLocations,
		},
		{
			name: 'categories',
			label: 'Choose Categories',
			type: 'multiselect' as const,
			placeholder: 'Select Categories',
			options: dummyCategories,
		},

		// Section 2: Images (Full Width)
		{
			name: 'iti_img',
			label: 'View Images',
			type: 'file' as const,
			fullWidth: true,
		},

		// Section 3: Descriptions (Full Width)
		{
			name: 'iti_short_desc',
			label: 'Short Description',
			type: 'richtext' as const,
			placeholder: 'Enter short description about the itinerary',
			fullWidth: true,
		},
		{
			name: 'iti_desc',
			label: 'Description',
			type: 'richtext' as const,
			placeholder: 'Add detailed description about the itinerary',
			fullWidth: true,
		},

		// Section 4: Additional Details
		{
			name: 'iti_is_customize',
			label: 'Is Customizable?',
			type: 'select' as const,
			placeholder: 'Select option',
			options: [
				{ value: 'not_specified', label: 'Not specified' },
				{ value: 'true', label: 'Yes' },
				{ value: 'false', label: 'No' },
			],
		},
		{
			name: 'iti_duration',
			label: 'Duration (In Days)',
			type: 'number' as const,
			placeholder: 'Add Duration',
		},
		{
			name: 'iti_altitude',
			label: 'Altitude',
			type: 'text' as const,
			placeholder: 'Enter your Altitude',
		},
		{
			name: 'iti_scenary',
			label: 'Scenary',
			type: 'text' as const,
			placeholder: 'Enter your View',
		},
		{
			name: 'iti_cultural_site',
			label: 'Cultural Site',
			type: 'text' as const,
			placeholder: 'Add Cultural Site',
		},

		// Section 5: Brochure
		{
			name: 'iti_brochure_banner',
			label: 'Brochure Banner',
			type: 'text' as const,
			placeholder: 'Paste the Drive link to Brochure',
			fullWidth: true,
		},

		{
			name: '_separator_daywise',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 8: Daywise Activities (Full Width)
		{
			name: 'day_details',
			label: 'Daywise Activities',
			type: 'daywise' as const,
			fullWidth: true,
		},

		{
			name: '_separator_hotels',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 9: Hotel Details (Full Width)
		{
			name: 'hotels',
			label: 'Hotel Details',
			type: 'hotels' as const,
			fullWidth: true,
		},

		{
			name: '_separator_inclusions',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 6: Inclusions & Exclusions (Full Width)
		{
			name: 'iti_inclusion',
			label: 'Inclusions',
			type: 'richtext' as const,
			placeholder: 'Enter inclusions separated by full stops (.)',
			fullWidth: true,
		},
		{
			name: 'iti_exclusion',
			label: 'Exclusions',
			type: 'richtext' as const,
			placeholder: 'Enter exclusions separated by full stops (.)',
			fullWidth: true,
		},

		// Section 7: Notes (Full Width)
		{
			name: 'iti_notes',
			label: 'Notes',
			type: 'richtext' as const,
			placeholder: 'Enter notes separated by full stops (.)',
			fullWidth: true,
		},

		{
			name: '_separator_packages',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 10: Package Details (Full Width)
		{
			name: 'package_details',
			label: 'Package Details',
			type: 'packages' as const,
			fullWidth: true,
		},

		{
			name: '_separator_batches',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},
		// Section 11: Batch Management (Full Width)
		{
			name: 'batches',
			label: 'Batch Management',
			type: 'batches' as const,
			fullWidth: true,
		},

		{
			name: '_separator_seo',
			label: '',
			type: 'custom' as const,
			customRender: () => (
			  <Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
				<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
			  </Box>
			),
			fullWidth: true,
		  },
		  // Section 12: SEO Fields (Full Width)
		  {
			name: 'seo_fields',
			label: 'SEO Settings',
			type: 'seo' as const,
			fullWidth: true,
		  },
	]

	return (
		<Box style={{ padding: '24px' }}>
			<Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
				<Text
					size="7"
					weight="bold"
					style={{
						color: 'var(--accent-12)',
						display: 'block',
					}}
				>
					{isEditMode ? 'Update Itinerary' : 'Add New Itinerary'}
				</Text>
				
				{isEditMode && (
					<Button
						variant="soft"
						size="2"
						onClick={() => navigate('/dashboard/itinerary')}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
						}}
					>
						Back to List
					</Button>
				)}
			</Flex>

			<DynamicForm
				fields={formFields}
				buttonText={isEditMode ? 'Update Itinerary' : 'Create New Itinerary'}
				onSubmit={handleSubmit}
				initialValues={initialValues}
			/>
			{/* Controlled AlertDialog - replaces alerts */}
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

export default AddNewItinerary