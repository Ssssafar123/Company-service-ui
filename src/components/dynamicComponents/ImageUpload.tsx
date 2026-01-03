import React, { useRef } from 'react'
import { Box, Flex, Button, Text } from '@radix-ui/themes'

type ImageUploadProps = {
	images: (File | string)[]
	onChange: (images: (File | string)[]) => void
	label?: string
	error?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, label, error }) => {
	const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

	const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const newImages = [...images]
			newImages[index] = file
			onChange(newImages)
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
		const newImages = images.filter((_, i) => i !== index)
		onChange(newImages)
		// Clear the ref for removed index
		delete fileInputRefs.current[index]
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
				{images.map((image, index) => (
					<Flex key={index} align="center" gap="2">
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
									{typeof image === 'string' && image ? 'Change Image' : 'Browse...'}
								</Button>
								<Text size="2" style={{ color: 'var(--accent-11)' }}>
									{getFileDisplayName(image)}
								</Text>
								{images.length > 1 && (
									<Button
										type="button"
										variant="soft"
										color="red"
										size="1"
										onClick={() => removeImage(index)}
									>
										Remove
									</Button>
								)}
							</Flex>
						</Box>
					</Flex>
				))}
				<Button type="button" variant="outline" size="2" onClick={addImageSlot}>
					+ Add Image
				</Button>
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