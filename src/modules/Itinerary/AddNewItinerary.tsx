import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { createItinerary, updateItineraryById } from '../../features/ItinerarySlice'
import { Box, Text, Separator, Flex, Button, AlertDialog } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'


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
    const dispatch = useDispatch<AppDispatch>()
    
    const [formData, setFormData] = useState<any>({})
    const [initialValues, setInitialValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

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
            loc => loc.label.toLowerCase() === cityName.toLowerCase()
        )
        return location?.value || ''
    }

    // Check if we're in edit mode based on location state
    useEffect(() => {
        const itineraryData = location.state?.itineraryData
        if (itineraryData) {
            try {
                setIsEditMode(true)
                setEditingId(itineraryData.id || null)
                
                // Safely map itinerary data to form initial values with proper null checks
                const mappedValues: any = {
                    iti_name: itineraryData.name || '',
                    travel_location: findLocationIdByCity(itineraryData.city || '') || '',
                    categories: Array.isArray(itineraryData.categories) ? itineraryData.categories : [],
                    iti_desc: itineraryData.description || '',
                    iti_short_desc: (itineraryData as any).shortDescription || (itineraryData as any).short_description || '',
                    iti_duration: itineraryData.duration || '',
                    price: typeof itineraryData.price === 'number' ? itineraryData.price : 0,
                    start_date: itineraryData.startDate 
                        ? (typeof itineraryData.startDate === 'string' && itineraryData.startDate.includes('T')
                            ? itineraryData.startDate.split('T')[0] 
                            : (typeof itineraryData.startDate === 'string' ? itineraryData.startDate.split(' ')[0] : ''))
                        : '',
                    end_date: itineraryData.endDate 
                        ? (typeof itineraryData.endDate === 'string' && itineraryData.endDate.includes('T')
                            ? itineraryData.endDate.split('T')[0] 
                            : (typeof itineraryData.endDate === 'string' ? itineraryData.endDate.split(' ')[0] : ''))
                        : '',
                    max_travelers: typeof itineraryData.maxTravelers === 'number' ? itineraryData.maxTravelers : 0,
                    available_seats: typeof itineraryData.availableSeats === 'number' ? itineraryData.availableSeats : 0,
                    iti_inclusion: Array.isArray(itineraryData.inclusions) 
                        ? itineraryData.inclusions.join('\n') 
                        : (typeof itineraryData.inclusions === 'string' ? itineraryData.inclusions : ''),
                    iti_exclusion: Array.isArray(itineraryData.exclusions) 
                        ? itineraryData.exclusions.join('\n') 
                        : (typeof itineraryData.exclusions === 'string' ? itineraryData.exclusions : ''),
                    iti_notes: (itineraryData as any).notes || '',
                    status: (itineraryData.status === 'active' || itineraryData.status === 'Active') ? 'Active' : 'Inactive',
                    iti_img: (itineraryData as any).brochureBanner 
                        || (itineraryData as any).brochure_banner 
                        || (Array.isArray((itineraryData as any).images) && (itineraryData as any).images.length > 0 
                            ? (itineraryData as any).images[0] : '')
                        || itineraryData.imageUrl 
                        || '',
                    iti_altitude: (itineraryData as any).altitude || '',
                    iti_scenary: (itineraryData as any).scenary || '',
                    iti_cultural_site: (itineraryData as any).culturalSite || (itineraryData as any).cultural_site || '',
                    iti_brochure_banner: (itineraryData as any).brochureBanner || (itineraryData as any).brochure_banner || '',
                    iti_is_customize: (itineraryData as any).isCustomize || (itineraryData as any).is_customize || 'not_specified',
                    trending: itineraryData.trending || 'No',
                    // Map complex fields - safely handle undefined
                    day_details: Array.isArray((itineraryData as any).daywiseActivities) 
                        ? (itineraryData as any).daywiseActivities 
                        : (Array.isArray((itineraryData as any).daywise_activities) 
                            ? (itineraryData as any).daywise_activities 
                            : []),
                    hotels: Array.isArray((itineraryData as any).hotelDetails) 
                        ? (itineraryData as any).hotelDetails 
                        : (Array.isArray((itineraryData as any).hotel_details) 
                            ? (itineraryData as any).hotel_details 
                            : []),
                    package_details: (() => {
                        const pkgData = (itineraryData as any).packages 
                            || (itineraryData as any).package_details 
                            || {};
                        
                        return {
                            base_packages: Array.isArray(pkgData.base_packages) 
                                ? pkgData.base_packages 
                                : [],
                            pickup_point: Array.isArray(pkgData.pickup_point) 
                                ? pkgData.pickup_point 
                                : [],
                            drop_point: Array.isArray(pkgData.drop_point) 
                                ? pkgData.drop_point 
                                : [],
                        };
                    })(),
                    batches: Array.isArray((itineraryData as any).batches) ? (itineraryData as any).batches : [],
                    seo_fields: (itineraryData as any).seoFields 
                        || (itineraryData as any).seo_fields 
                        || {},
                }
                
                console.log('Mapped Initial Values:', mappedValues) // Debug log
                setInitialValues(mappedValues)
            } catch (error) {
                console.error('Error mapping itinerary data:', error)
                // If mapping fails, still set edit mode but with empty values
                setIsEditMode(true)
                setEditingId(itineraryData.id || null)
                setInitialValues({
                    iti_name: itineraryData.name || '',
                    travel_location: findLocationIdByCity(itineraryData.city || '') || '',
                })
            }
        } else {
            setIsEditMode(false)
            setEditingId(null)
            setInitialValues({})
        }
    }, [location.state])

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            // Map form values to match your backend schema
            const payload = {
                name: values.iti_name, // Backend uses 'name', not 'title'
                city: dummyLocations.find(loc => loc.value === values.travel_location)?.label || '', // Backend uses 'city', not 'destination'
                description: values.iti_desc,
                shortDescription: values.iti_short_desc,
                duration: values.iti_duration, // Keep as string like "5D 4N"
                price: Number(values.price) || 0,
                startDate: values.start_date || new Date().toISOString(),
                endDate: values.end_date || new Date().toISOString(),
                maxTravelers: Number(values.max_travelers) || 0,
                availableSeats: Number(values.available_seats) || 0,
                inclusions: values.iti_inclusion ? values.iti_inclusion.split('.').filter((s: string) => s.trim()) : [],
                exclusions: values.iti_exclusion ? values.iti_exclusion.split('.').filter((s: string) => s.trim()) : [],
                notes: values.iti_notes || '',
                status: values.status || 'Active',
                altitude: values.iti_altitude || '',
                scenary: values.iti_scenary || '',
                culturalSite: values.iti_cultural_site || '',
                brochureBanner: values.iti_brochure_banner || '',
                isCustomize: values.iti_is_customize || 'not_specified',
                images: values.iti_img ? [values.iti_img] : [],
                travelLocation: values.travel_location || '',
                categories: values.categories || [],
                trending: 'No', // Add if available in form
                // Add other fields from your backend schema
                daywiseActivities: values.day_details || [],
                hotelDetails: values.hotels || [],
                packages: values.package_details || {},
                batches: values.batches || [],
                seoFields: values.seo_fields || {},
                termsAndConditions: '',
                cancellationPolicy: '',
            }

            if (isEditMode && editingId) {
                // Update existing itinerary
                await dispatch(updateItineraryById({ id: editingId, data: payload })).unwrap()
                
                setDialogConfig({
                    title: 'Success',
                    description: 'Itinerary updated successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/itinerary')
                    },
                })
            } else {
                // Create new itinerary
                await dispatch(createItinerary(payload)).unwrap()
                
                setDialogConfig({
                    title: 'Success',
                    description: 'Itinerary created successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/itinerary')
                    },
                })
            }
            
            setDialogOpen(true)
            setFormData(values)
            
        } catch (error: any) {
            setDialogConfig({
                title: 'Error',
                description: error.message || 'Failed to save itinerary.',
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
            console.error('API error:', error)
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

			{/* Show loading or error state if needed */}
			{isEditMode && !location.state?.itineraryData && (
				<Box style={{ padding: '24px', textAlign: 'center' }}>
					<Text size="3" color="red">No itinerary data found. Please go back and try again.</Text>
					<Button 
						variant="soft" 
						size="2" 
						onClick={() => navigate('/dashboard/itinerary')}
						style={{ marginTop: '16px' }}
					>
						Back to List
					</Button>
				</Box>
			)}

			<DynamicForm
				key={isEditMode ? `edit-${editingId || 'unknown'}` : 'new'} // Add key to force re-render
				fields={formFields}
				buttonText={isEditMode ? 'Update Itinerary' : 'Create New Itinerary'}
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

export default AddNewItinerary