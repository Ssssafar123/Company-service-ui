import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Button, Text } from '@radix-ui/themes'

type ImageUploadProps = {
	images: (File | string)[]
	onChange: (images: (File | string)[]) => void
	label?: string
	error?: string
	singleImage?: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, label, error, singleImage = false }) => {
	const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
	const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({})
	const prevBlobUrlsRef = useRef<string[]>([])

	// For single image mode, ensure only one image slot
	const displayImages = singleImage ? (images.length > 0 ? [images[0]] : ['']) : images

	// Generate preview URLs for Files and use URLs directly for strings
	useEffect(() => {
		// Cleanup previous blob URLs
		prevBlobUrlsRef.current.forEach(url => {
			URL.revokeObjectURL(url)
		})
		prevBlobUrlsRef.current = []

		const newPreviewUrls: { [key: number]: string } = {}
		
		displayImages.forEach((image, index) => {
			if (image instanceof File) {
				// Create object URL for File objects
				const url = URL.createObjectURL(image)
				newPreviewUrls[index] = url
				prevBlobUrlsRef.current.push(url)
			} else if (typeof image === 'string' && image && image !== '') {
				// Use the URL string directly (Cloudinary URLs are full URLs)
				newPreviewUrls[index] = image
			}
		})

		setPreviewUrls(newPreviewUrls)

		// Cleanup on unmount
		return () => {
			prevBlobUrlsRef.current.forEach(url => {
				URL.revokeObjectURL(url)
			})
			prevBlobUrlsRef.current = []
		}
	}, [images, singleImage]) // React to changes in the images array

	const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (singleImage) {
				// For single image, just set the one image
				onChange([file])
			} else {
				const newImages = [...images]
				newImages[index] = file
				onChange(newImages)
			}
		}
		// Reset the input value so the same file can be selected again
		if (e.target) {
			e.target.value = ''
		}
	}

	const addImageSlot = () => {
		onChange([...images, ''])
	}

	const removeImage = (index: number) => {
		// Clean up preview URL if it's a blob URL
		if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
			URL.revokeObjectURL(previewUrls[index])
		}
		
		if (singleImage) {
			// For single image, clear it
			onChange([''])
		} else {
			const newImages = images.filter((_, i) => i !== index)
			onChange(newImages)
			// Clear the ref for removed index
			delete fileInputRefs.current[index]
		}
	}

	const getFileDisplayName = (image: File | string): string => {
		if (typeof image === 'string') {
			return image ? 'Uploaded' : 'No file selected'
		}
		if (image instanceof File) {
			return image.name
		}
		return 'No file selected'
	}

	const getImageSrc = (index: number): string | undefined => {
		if (previewUrls[index]) {
			return previewUrls[index]
		}
		return undefined
	}

	const hasImage = (image: File | string): boolean => {
		if (image instanceof File) {
			return true
		}
		if (typeof image === 'string' && image && image !== '') {
			return true
		}
		return false
	}

	return (
		<Box>
			{label && (
				<Text
					size="2"
					weight="medium"
					style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
				>
					{label}
				</Text>
			)}
			<Flex direction="column" gap="2">
				{displayImages.map((image, index) => {
					const imageSrc = getImageSrc(index)
					const hasImagePreview = hasImage(image)
					
					return (
						<Flex key={index} direction="column" gap="2">
							{hasImagePreview && imageSrc && (
								<Box
									style={{
										width: '100%',
										maxWidth: '300px',
										height: '200px',
										border: '1px solid var(--accent-6)',
										borderRadius: '6px',
										overflow: 'hidden',
										backgroundColor: 'var(--accent-2)',
									}}
								>
									<img
										src={imageSrc}
										alt={`Preview ${index + 1}`}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
										onError={(e) => {
											const target = e.target as HTMLImageElement
											// Hide image on error
											target.style.display = 'none'
										}}
									/>
								</Box>
							)}
							<Flex align="center" gap="2">
								<Box
									style={{
										border: '1px dashed var(--accent-6)',
										borderRadius: '6px',
										padding: '12px',
										flex: 1,
										backgroundColor: 'var(--accent-2)',
									}}
								>
									<input
										type="file"
										id={`image-upload-${index}`}
										ref={(el) => {
											fileInputRefs.current[index] = el
										}}
										accept="image/*"
										style={{ display: 'none' }}
										onChange={(e) => handleFileChange(index, e)}
									/>
									<Flex align="center" gap="2">
										<Button
											type="button"
											variant="soft"
											size="2"
											onClick={() => {
												const input = fileInputRefs.current[index] || document.getElementById(`image-upload-${index}`) as HTMLInputElement
												if (input) {
													input.click()
												}
											}}
										>
											{hasImagePreview ? 'Change Image' : 'Browse...'}
										</Button>
										<Text size="2" style={{ color: 'var(--accent-11)' }}>
											{getFileDisplayName(image)}
										</Text>
										{hasImagePreview && (
											<Button
												type="button"
												variant="soft"
												color="red"
												size="1"
												onClick={() => removeImage(index)}
											>
												{singleImage ? 'Clear' : 'Remove'}
											</Button>
										)}
									</Flex>
								</Box>
							</Flex>
						</Flex>
					)
				})}
				{!singleImage && (
					<Button type="button" variant="outline" size="2" onClick={addImageSlot}>
						+ Add Image
					</Button>
				)}
			</Flex>
			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '4px' }}>
					{error}
				</Text>
			)}
		</Box>
	)
}

export default ImageUpload