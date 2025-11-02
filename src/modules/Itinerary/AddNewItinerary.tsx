import React, { useState } from 'react'
import { Box, Text, Separator, Flex } from '@radix-ui/themes'
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
	const [formData, setFormData] = useState<any>({})

	const handleSubmit = (values: Record<string, any>) => {
		console.log('Form submitted with values:', values)
		setFormData(values)
		alert('Form submitted! Check console for data.')
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
	]

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
				Add New Itinerary
			</Text>

			<DynamicForm
				fields={formFields}
				buttonText="Create New Itinerary"
				onSubmit={handleSubmit}
			/>
		</Box>
	)
}

export default AddNewItinerary