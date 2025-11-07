import React, { useState } from 'react'
import { Box, Flex, Text, TextField, Button, TextArea, RadioGroup } from '@radix-ui/themes'

export type SEOData = {
	index_status: 'index' | 'notindex'
	seo_title: string
	seo_description: string
	seo_keywords: string
	author: string
}

type SEOFieldsProps = {
	seoData: SEOData | null
	onChange: (seoData: SEOData) => void
	label?: string
	error?: string
}

const SEOFields: React.FC<SEOFieldsProps> = ({
	seoData,
	onChange,
	label,
	error,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [localData, setLocalData] = useState<SEOData>(
		seoData || {
			index_status: 'index',
			seo_title: '',
			seo_description: '',
			seo_keywords: '',
			author: 'Safarwanderlust',
		}
	)

	const handleFieldChange = (field: keyof SEOData, value: string) => {
		const updated = { ...localData, [field]: value }
		setLocalData(updated)
	}

	const handleSave = () => {
		onChange(localData)
		setIsOpen(false)
	}

	return (
		<Box>
			{label && (
				<Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						{label}
					</Text>
					<Button
						type="button"
						variant="soft"
						size="2"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? 'Hide SEO' : 'SEO'}
					</Button>
				</Flex>
			)}

			{isOpen && (
				<Box
					style={{
						border: '1px solid var(--accent-6)',
						borderRadius: '8px',
						padding: '16px',
						backgroundColor: 'var(--color-panel)',
						marginTop: '16px',
					}}
				>
					<Flex direction="column" gap="4">
						{/* Index/Not Index Radio Buttons */}
						<Box>
							<Text
								size="2"
								weight="medium"
								style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
							>
								Index Status
							</Text>
							<RadioGroup.Root
								value={localData.index_status}
								onValueChange={(value) => handleFieldChange('index_status', value as 'index' | 'notindex')}
							>
								<Flex gap="4">
									<Flex align="center" gap="2">
										<RadioGroup.Item value="index" id="seo-index" />
										<Text as="label" size="2" htmlFor="seo-index">
											Index
										</Text>
									</Flex>
									<Flex align="center" gap="2">
										<RadioGroup.Item value="notindex" id="seo-notindex" />
										<Text as="label" size="2" htmlFor="seo-notindex">
											Not Index
										</Text>
									</Flex>
								</Flex>
							</RadioGroup.Root>
						</Box>

						{/* SEO Title */}
						<Box>
							<Text
								size="2"
								weight="medium"
								style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
							>
								SEO Title
							</Text>
							<TextField.Root
								placeholder="Enter SEO title"
								value={localData.seo_title}
								onChange={(e) => handleFieldChange('seo_title', e.target.value)}
							/>
						</Box>

						{/* SEO Description */}
						<Box>
							<Text
								size="2"
								weight="medium"
								style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
							>
								SEO Description
							</Text>
							<TextArea
								placeholder="Enter SEO description"
								value={localData.seo_description}
								onChange={(e) => handleFieldChange('seo_description', e.target.value)}
								style={{ minHeight: '100px' }}
							/>
						</Box>

						{/* SEO Keywords */}
						<Box>
							<Text
								size="2"
								weight="medium"
								style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
							>
								SEO Keywords
							</Text>
							<TextField.Root
								placeholder="Enter SEO keywords (comma separated)"
								value={localData.seo_keywords}
								onChange={(e) => handleFieldChange('seo_keywords', e.target.value)}
							/>
						</Box>

						{/* Author */}
						<Box>
							<Text
								size="2"
								weight="medium"
								style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
							>
								Author
							</Text>
							<TextField.Root
								placeholder="Enter author name"
								value={localData.author}
								onChange={(e) => handleFieldChange('author', e.target.value)}
							/>
						</Box>

						{/* Save Button */}
						<Flex justify="end" style={{ marginTop: '8px' }}>
							<Button type="button" variant="solid" onClick={handleSave}>
								Save
							</Button>
						</Flex>
					</Flex>
				</Box>
			)}

			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '8px', display: 'block' }}>
					{error}
				</Text>
			)}
		</Box>
	)
}

export default SEOFields