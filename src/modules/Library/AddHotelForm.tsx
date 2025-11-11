import React, { useEffect } from 'react'
import {
	Box,
	Flex,
	Text,
	TextField,
	IconButton,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'

type AddHotelFormProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (values: Record<string, any>) => void
	initialData?: {
		id?: string
		name?: string
		city?: string
		country?: string
		rating?: number
		phone?: string
		description?: string
		address?: string
		amenities?: string
		imageUrls?: string
		contactEmail?: string
		websiteUrl?: string
		checkInTime?: string
		checkOutTime?: string
	} | null
}

const AddHotelForm: React.FC<AddHotelFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
	// Prevent body scroll when form is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		// Cleanup function to restore scroll when component unmounts
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	// Form fields configuration
	const formFields = [
		{
			name: 'hotelName',
			label: 'Hotel Name',
			type: 'text' as const,
			placeholder: 'Enter hotel name',
			fullWidth: true,
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea' as const,
			placeholder: 'Enter hotel description',
			fullWidth: true,
		},
		{
			name: 'address',
			label: 'Address',
			type: 'text' as const,
			placeholder: 'Enter hotel address',
			fullWidth: true,
		},
		{
			name: 'city',
			label: 'City',
			type: 'text' as const,
			placeholder: 'Enter city',
		},
		{
			name: 'country',
			label: 'Country',
			type: 'text' as const,
			placeholder: 'Enter country',
		},
		{
			name: 'rating',
			label: 'Rating (1-5)',
			type: 'number' as const,
			placeholder: '3',
		},
		{
			name: 'amenities',
			label: 'Amenities (comma-separated)',
			type: 'text' as const,
			placeholder: 'WiFi, Pool, Gym, Spa',
			fullWidth: true,
		},
		{
			name: 'imageUrls',
			label: 'Image URLs (comma-separated)',
			type: 'text' as const,
			placeholder: 'https://example.com/image1.jpg, https://example.com/image2.jpg',
			fullWidth: true,
		},
		{
			name: 'contactEmail',
			label: 'Contact Email',
			type: 'email' as const,
			placeholder: 'hotel@example.com',
		},
		{
			name: 'contactPhone',
			label: 'Contact Phone',
			type: 'text' as const,
			placeholder: '+1234567890',
		},
		{
			name: 'websiteUrl',
			label: 'Website URL',
			type: 'text' as const,
			placeholder: 'https://www.hotel.com',
			fullWidth: true,
		},
		{
			name: 'checkInTime',
			label: 'Check-In Time',
			type: 'text' as const,
			placeholder: '15:00',
			customRender: (value: any, onChange: (value: any) => void) => (
				<TextField.Root
					type="time"
					value={value || '15:00'}
					onChange={(e) => onChange(e.target.value)}
				/>
			),
		},
		{
			name: 'checkOutTime',
			label: 'Check-Out Time',
			type: 'text' as const,
			placeholder: '11:00',
			customRender: (value: any, onChange: (value: any) => void) => (
				<TextField.Root
					type="time"
					value={value || '11:00'}
					onChange={(e) => onChange(e.target.value)}
				/>
			),
		},
	]

	const handleFormSubmit = (values: Record<string, any>) => {
		onSubmit(values)
		onClose()
	}

	if (!isOpen) return null

	return (
		<>
			{/* Overlay */}
			<Box
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 1000,
					transition: 'opacity 0.3s ease',
				}}
				onClick={onClose}
			/>

			{/* Slide-in Form Panel */}
			<Box
				style={{
					position: 'fixed',
					top: '70px',
					right: 0,
					width: '600px',
					height: 'calc(100vh - 70px)',
					backgroundColor: 'var(--color-panel)',
					boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
					zIndex: 1001,
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					animation: 'slideIn 0.3s ease',
				}}
			>
				{/* Form Header */}
				<Box
					style={{
						padding: '24px',
						borderBottom: '1px solid var(--accent-6)',
						position: 'sticky',
						top: 0,
						backgroundColor: 'var(--color-panel)',
						zIndex: 10,
					}}
				>
					<Flex justify="between" align="start">
						<Box style={{ flex: 1 }}>
							<Text 
								size="6" 
								weight="bold" 
								style={{ 
									color: 'var(--accent-12)', 
									display: 'block', 
									marginBottom: '8px' 
								}}
							>
								{initialData ? 'Edit Hotel' : 'Add a New Hotel'}
							</Text>
							<Text 
								size="2" 
								style={{ 
									color: 'var(--accent-11)',
									display: 'block',
								}}
							>
								{initialData ? 'Update the hotel details below.' : 'Fill out the form to add a new hotel to the library.'}
							</Text>
						</Box>
						<IconButton
							variant="ghost"
							size="3"
							onClick={onClose}
							style={{ 
								cursor: 'pointer', 
								marginLeft: '16px',
								color: 'var(--accent-11)',
							}}
							title="Close"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</IconButton>
					</Flex>
				</Box>

				{/* Form Content */}
				<Box style={{ padding: '24px', flex: 1 }}>
					<Box style={{ maxWidth: '100%' }}>
						<DynamicForm
							fields={formFields}
							buttonText={initialData ? 'Update Hotel' : 'Add Hotel'}
							onSubmit={handleFormSubmit}
							initialValues={{
								hotelName: initialData?.name || '',
								description: initialData?.description || '',
								address: initialData?.address || '',
								city: initialData?.city || '',
								country: initialData?.country || '',
								rating: initialData?.rating || 3,
								amenities: initialData?.amenities || '',
								imageUrls: initialData?.imageUrls || '',
								contactEmail: initialData?.contactEmail || '',
								contactPhone: initialData?.phone || '',
								websiteUrl: initialData?.websiteUrl || '',
								checkInTime: initialData?.checkInTime || '15:00',
								checkOutTime: initialData?.checkOutTime || '11:00',
							}}
						/>
					</Box>
				</Box>
			</Box>

			{/* CSS Animation */}
			<style>{`
				@keyframes slideIn {
					from {
						transform: translateX(100%);
					}
					to {
						transform: translateX(0);
					}
				}
			`}</style>
		</>
	)
}

export default AddHotelForm