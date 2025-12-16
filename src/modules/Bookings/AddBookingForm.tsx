import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { Booking } from '../../features/BookingSlice'

import {
	Box,
	Flex,
	Text,
	IconButton,
	TextField,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import { createBooking } from '../../features/BookingSlice'
import type { AppDispatch } from '../../store'
type AddBookingFormProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (values: Omit<Booking, "id">) => void
	initialData?: Partial<Booking> | null
}

// Dummy itineraries data for dropdown
const dummyItineraries = [
	{ value: 'Manali Kasol | Best Selling - Manali', label: 'Manali Kasol | Best Selling - Manali' },
	{ value: 'Udaipur Mount Abu Weekend Group Trip 2D 1N', label: 'Udaipur Mount Abu Weekend Group Trip 2D 1N' },
	{ value: 'Pachmarhi | Ex- Indore - Pachmarhi', label: 'Pachmarhi | Ex- Indore - Pachmarhi' },
	{ value: 'Goa Beach Tour | 3 Days 2 Nights', label: 'Goa Beach Tour | 3 Days 2 Nights' },
	{ value: 'Kerala Backwaters | Alleppey Houseboat', label: 'Kerala Backwaters | Alleppey Houseboat' },
	{ value: 'Rajasthan Heritage Tour | Jaipur Udaipur', label: 'Rajasthan Heritage Tour | Jaipur Udaipur' },
	{ value: 'Himachal Pradesh | Shimla Manali', label: 'Himachal Pradesh | Shimla Manali' },
	{ value: 'Darjeeling Gangtok | Hill Station Tour', label: 'Darjeeling Gangtok | Hill Station Tour' },
	{ value: 'Varanasi Spiritual Tour | 2 Days', label: 'Varanasi Spiritual Tour | 2 Days' },
	{ value: 'Mumbai City Tour | Gateway of India', label: 'Mumbai City Tour | Gateway of India' },
]

const statusOptions = [
	{ value: 'confirmed', label: 'Confirmed' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'cancelled', label: 'Cancelled' },
	{ value: 'completed', label: 'Completed' },
]

const paymentStatusOptions = [
	{ value: 'paid', label: 'Paid' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'refunded', label: 'Refunded' },
]

const AddBookingForm: React.FC<AddBookingFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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

	const dispatch = useDispatch<AppDispatch>()

	// Form fields configuration
	const formFields = [
		{
			name: 'bookingId',
			label: 'Booking ID',
			type: 'text' as const,
			placeholder: 'Enter booking ID (e.g., BK001)',
			fullWidth: true,
		},
		{
			name: 'customerName',
			label: 'Customer Name',
			type: 'text' as const,
			placeholder: 'Enter customer name',
			fullWidth: true,
		},
		{
			name: 'customerEmail',
			label: 'Customer Email',
			type: 'email' as const,
			placeholder: 'Enter customer email',
			fullWidth: true,
		},
		{
			name: 'customerPhone',
			label: 'Customer Phone',
			type: 'text' as const,
			placeholder: 'Enter customer phone (e.g., +91 98765 43210)',
			fullWidth: true,
		},
		{
			name: 'itinerary',
			label: 'Select Itinerary',
			type: 'select' as const,
			placeholder: 'Select itinerary',
			options: dummyItineraries,
			fullWidth: true,
		},
		{
			name: 'bookingDate',
			label: 'Booking Date',
			type: 'custom' as const,
			placeholder: 'Select booking date',
			fullWidth: true,
			customRender: (value: any, onChange: (value: any) => void) => (
				<TextField.Root
					type="date"
					value={value || ''}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Select booking date"
				/>
			),
		},
		{
			name: 'travelDate',
			label: 'Travel Date',
			type: 'custom' as const,
			placeholder: 'Select travel date',
			fullWidth: true,
			customRender: (value: any, onChange: (value: any) => void) => (
				<TextField.Root
					type="date"
					value={value || ''}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Select travel date"
				/>
			),
		},
		{
			name: 'numberOfTravelers',
			label: 'Number of Travelers',
			type: 'number' as const,
			placeholder: 'Enter number of travelers',
			fullWidth: true,
		},
		{
			name: 'totalAmount',
			label: 'Total Amount (₹)',
			type: 'number' as const,
			placeholder: 'Enter total amount',
			fullWidth: true,
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select' as const,
			placeholder: 'Select status',
			options: statusOptions,
			fullWidth: true,
		},
		{
			name: 'paymentStatus',
			label: 'Payment Status',
			type: 'select' as const,
			placeholder: 'Select payment status',
			options: paymentStatusOptions,
			fullWidth: true,
		},
	]

	


	const handleFormSubmit = (values: Record<string, any>) => {
		dispatch(createBooking(values as Omit<Booking, 'id'>))
		onSubmit(values as Omit<Booking, 'id'>)
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
								{initialData ? 'Edit Booking' : 'Add New Booking'}
							</Text>
							<Text 
								size="2" 
								style={{ 
									color: 'var(--accent-11)',
									display: 'block',
								}}
							>
								{initialData ? 'Update the booking details below.' : 'Fill out the form to add a new booking.'}
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
							buttonText={initialData ? 'Update Booking' : 'Add Booking'}
							onSubmit={handleFormSubmit}
							initialValues={{
								bookingId: initialData?.bookingId || '',
								customerName: initialData?.customerName || '',
								customerEmail: initialData?.customerEmail || '',
								customerPhone: initialData?.customerPhone || '',
								itinerary: initialData?.itinerary || '',
								bookingDate: initialData?.bookingDate || '',
								travelDate: initialData?.travelDate || '',
								numberOfTravelers: initialData?.numberOfTravelers || 1,
								totalAmount: initialData?.totalAmount || 0,
								status: initialData?.status || 'pending',
								paymentStatus: initialData?.paymentStatus || 'pending',
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

export default AddBookingForm