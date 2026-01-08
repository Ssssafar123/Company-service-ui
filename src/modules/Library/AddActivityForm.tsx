import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { createActivity, updateActivityById } from '../../features/ActivitySlice'
import {
	Box,
	Flex,
	Text,
	TextField,
	IconButton,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'

type AddActivityFormProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit: (values: Record<string, any>) => void
	initialData?: {
		id?: string
		name?: string
		location?: string
		locationLink?: string // Added
		duration?: number
		price?: number
		shortDescription?: string
		fullDescription?: string
		images?: string[] // Added
		videos?: string[] // Added
	} | null
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const dispatch = useDispatch<AppDispatch>()
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [videoFiles, setVideoFiles] = useState<File[]>([])

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

	// Reset files when form closes or initialData changes
	useEffect(() => {
		if (!isOpen) {
			setImageFiles([])
			setVideoFiles([])
		}
	}, [isOpen])

	// Form fields configuration
	const formFields = [
		{
			name: 'name',
			label: 'Activity Name',
			type: 'text' as const,
			placeholder: 'Enter activity name',
			fullWidth: true,
			required: true,
		},
		{
			name: 'shortDescription',
			label: 'Short Description (Optional)',
			type: 'textarea' as const,
			placeholder: 'Enter short description',
			fullWidth: true,
			required: false,
		},
		{
			name: 'fullDescription',
			label: 'Full Description',
			type: 'textarea' as const,
			placeholder: 'Enter full description',
			fullWidth: true,
		},
		{
			name: 'location',
			label: 'Location',
			type: 'text' as const,
			placeholder: 'Enter location name',
			fullWidth: true,
			required: true,
		},
		{
			name: 'locationLink',
			label: 'Location Link',
			type: 'text' as const,
			placeholder: 'Enter location link (e.g., Google Maps URL)',
			fullWidth: true,
			required: false,
		},
		{
			name: 'images',
			label: 'Images',
			type: 'file' as const,
			placeholder: 'Select images',
			fullWidth: true,
			required: false,
			multiple: true,
			accept: 'image/*',
		},
		{
			name: 'videos',
			label: 'Videos',
			type: 'file' as const,
			placeholder: 'Select videos',
			fullWidth: true,
			required: false,
			multiple: true,
			accept: 'video/*',
		},
		{
			name: 'duration',
			label: 'Duration (in hours)',
			type: 'number' as const,
			placeholder: 'Enter duration in hours',
			required: true,
		},
		{
			name: 'price',
			label: 'Price',
			type: 'number' as const,
			placeholder: 'Enter price',
			required: true,
		},
	]

	const handleFormSubmit = async (values: Record<string, any>) => {
		try {
			// Extract file arrays from values - handle FileList properly
			let imageFilesArray: File[] = [];
			let videoFilesArray: File[] = [];

			// Handle images - could be FileList, File[], or empty
			if (values.images) {
				if (values.images instanceof FileList) {
					imageFilesArray = Array.from(values.images);
				} else if (Array.isArray(values.images)) {
					imageFilesArray = values.images.filter((f: any) => f instanceof File);
				} else if (values.images instanceof File) {
					imageFilesArray = [values.images];
				}
			}

			// Handle videos - could be FileList, File[], or empty
			if (values.videos) {
				if (values.videos instanceof FileList) {
					videoFilesArray = Array.from(values.videos);
				} else if (Array.isArray(values.videos)) {
					videoFilesArray = values.videos.filter((f: any) => f instanceof File);
				} else if (values.videos instanceof File) {
					videoFilesArray = [values.videos];
				}
			}

			// Prepare activity data (exclude file fields)
			const activityData: any = {
				name: values.name || '',
				location: values.location || '',
				locationLink: values.locationLink || '',
				duration: Number(values.duration) || 1,
				price: Number(values.price) || 0,
				shortDescription: values.shortDescription || '',
				fullDescription: values.fullDescription || '',
				status: 'active',
			}

			// If editing, preserve existing images and videos if no new files
			if (initialData?.id) {
				if (initialData.images && imageFilesArray.length === 0) {
					activityData.images = initialData.images;
				}
				if (initialData.videos && videoFilesArray.length === 0) {
					activityData.videos = initialData.videos;
				}
			}

			if (initialData?.id) {
				// Update existing activity
				await dispatch(updateActivityById({
					id: initialData.id,
					data: activityData,
					imageFiles: imageFilesArray.length > 0 ? imageFilesArray : undefined,
					videoFiles: videoFilesArray.length > 0 ? videoFilesArray : undefined,
				})).unwrap()
			} else {
				// Create new activity
				await dispatch(createActivity({
					activity: activityData,
					imageFiles: imageFilesArray.length > 0 ? imageFilesArray : undefined,
					videoFiles: videoFilesArray.length > 0 ? videoFilesArray : undefined,
				})).unwrap()
			}

			onSubmit(values)
			onClose()
		} catch (error) {
			console.error('Failed to save activity:', error)
			throw error
		}
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
								{initialData ? 'Edit Activity' : 'Add a New Activity'}
							</Text>
							<Text 
								size="2" 
								style={{ 
									color: 'var(--accent-11)',
									display: 'block',
								}}
							>
								{initialData ? 'Update the activity details below.' : 'Fill out the form to add a new activity to the library.'}
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
							buttonText={initialData ? 'Update Activity' : 'Add Activity'}
							onSubmit={handleFormSubmit}
							initialValues={{
								name: initialData?.name || '',
								shortDescription: initialData?.shortDescription || '',
								fullDescription: initialData?.fullDescription || '',
								location: initialData?.location || '',
								locationLink: initialData?.locationLink || '',
								duration: initialData?.duration || 1,
								price: initialData?.price || 0,
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

export default AddActivityForm