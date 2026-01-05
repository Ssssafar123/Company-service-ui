import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import {
	Box,
	Flex,
	Text,
	IconButton,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import { fetchItineraries } from '../../features/ItinerarySlice'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

type AddReviewFormProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (values: Record<string, any>) => void
	initialData?: {
		id?: string
		customerName?: string
		reviewerImageUrl?: string
		reviewText?: string
		rating?: number
		itineraryId?: string
		packageName?: string
		isLandingPage?: boolean
	} | null
}

// Dummy itineraries data for dropdown


const AddReviewForm: React.FC<AddReviewFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const dispatch = useDispatch<AppDispatch>()

	const itineraries = useSelector((state : RootState) => state.itinerary.itineraries)


	// Prevent body scroll when form is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			dispatch(fetchItineraries());
		} else {
			document.body.style.overflow = 'unset'
		}

		// Cleanup function to restore scroll when component unmounts
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, dispatch])

	// Star Rating Component
	const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
		return (
			<Flex align="center" gap="2">
				{[1, 2, 3, 4, 5].map((star) => (
					<Box
						key={star}
						onClick={() => onChange(star)}
						style={{
							cursor: 'pointer',
							fontSize: '24px',
							color: star <= value ? '#fbbf24' : '#e5e7eb',
							transition: 'color 0.2s',
						}}
					>
						★
					</Box>
				))}
				<Text size="2" style={{ marginLeft: '8px', color: 'var(--accent-11)' }}>
					({value} {value === 1 ? 'star' : 'stars'})
				</Text>
			</Flex>
		)
	}

	const itineraryOptions = itineraries.map((itinerary)=>({
		value : itinerary.id,
		label : itinerary.name
	}))

	// Form fields configuration
	const formFields = [
		{
			name: 'reviewerName',
			label: 'Reviewer Name',
			type: 'text' as const,
			placeholder: 'Enter reviewer name',
			fullWidth: true,
		},
		{
			name: 'reviewerImageUrl',
			label: 'Reviewer Image URL',
			type: 'text' as const,
			placeholder: 'Enter image URL',
			fullWidth: true,
		},
		{
			name: 'reviewText',
			label: 'Review Text',
			type: 'textarea' as const,
			placeholder: 'Enter review text',
			fullWidth: true,
		},
		{
			name: 'rating',
			label: 'Rating',
			type: 'custom' as const,
			fullWidth: true,
			customRender: (value: any, onChange: (value: any) => void) => (
				<StarRating
					value={value || 5}
					onChange={(newRating) => {
						onChange(newRating)
					}}
				/>
			),
		},
		{
			name: 'itineraryId',
			label: 'Select Itinerary',
			type: 'select' as const,
			placeholder: 'Select itinerary',
			options: itineraryOptions,
			fullWidth: true,
		},
		{
			name: 'isLandingPage',
			label: 'Show on Website',
			type: 'checkbox' as const,
			fullWidth: true,
		},
	]

	const handleFormSubmit = async (values: Record<string, any>) => {
		// Convert empty string to null for itineraryId
		const itineraryId = values.itineraryId && values.itineraryId.trim() !== '' 
			? values.itineraryId 
			: null
		
		const formData = {
			...values,
			rating: values.rating || 5,
			itineraryId: itineraryId, // Pass null if empty
		}
		
		// Don't dispatch here - parent handles it
		onSubmit(formData)
		// Don't close here - let parent handle it after success
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
								{initialData ? 'Edit Review' : 'Add New Review'}
							</Text>
							<Text 
								size="2" 
								style={{ 
									color: 'var(--accent-11)',
									display: 'block',
								}}
							>
								{initialData ? 'Update the review details below.' : 'Fill out the form to add a new review.'}
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
							key={initialData?.id || 'new'}
							fields={formFields}
							buttonText={initialData ? 'Update Review' : 'Add Review'}
							onSubmit={handleFormSubmit}
							initialValues={{
								reviewerName: initialData?.customerName || '',
								reviewerImageUrl: initialData?.reviewerImageUrl || '',
								reviewText: initialData?.reviewText || '',
								rating: initialData?.rating || 5,
								itineraryId: initialData?.itineraryId || '',
								isLandingPage: initialData?.isLandingPage || false,
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

export default AddReviewForm