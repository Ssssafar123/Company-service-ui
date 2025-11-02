import React from 'react'
import { Box, Flex, Text, TextField, Button, Grid, Select } from '@radix-ui/themes'
import ImageUpload from './ImageUpload'

export type HotelDetail = {
	id: string
	name: string
	stars: string // Changed from rating to stars
	reference: string
	images: (File | string)[]
}

type HotelDetailsProps = {
	hotels: HotelDetail[]
	onChange: (hotels: HotelDetail[]) => void
	label?: string
	error?: string
}

const starOptions = [
	{ value: '1', label: '1 Star' },
	{ value: '2', label: '2 Stars' },
	{ value: '3', label: '3 Stars' },
	{ value: '4', label: '4 Stars' },
	{ value: '5', label: '5 Stars' },
]

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotels, onChange, label, error }) => {
	const addHotel = () => {
		const newHotel: HotelDetail = {
			id: Date.now().toString(),
			name: '',
			stars: '', // Changed from rating: 0
			reference: '',
			images: [''],
		}
		onChange([...hotels, newHotel])
	}

	const removeHotel = (id: string) => {
		onChange(hotels.filter((hotel) => hotel.id !== id))
	}

	const updateHotel = (id: string, field: keyof HotelDetail, value: any) => {
		const updated = hotels.map((hotel) =>
			hotel.id === id ? { ...hotel, [field]: value } : hotel
		)
		onChange(updated)
	}

	const moveUp = (index: number) => {
		if (index === 0) return
		const updated = [...hotels]
		;[updated[index], updated[index - 1]] = [updated[index - 1], updated[index]]
		onChange(updated)
	}

	const moveDown = (index: number) => {
		if (index === hotels.length - 1) return
		const updated = [...hotels]
		;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
		onChange(updated)
	}

	return (
		<Box>
			{label && (
				<Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						{label}
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addHotel}>
						+ Add Hotel
					</Button>
				</Flex>
			)}
			<Flex direction="column" gap="4">
				{hotels.length === 0 ? (
					<Box
						style={{
							padding: '24px',
							border: '1px dashed var(--accent-6)',
							borderRadius: '6px',
							textAlign: 'center',
						}}
					>
						<Text size="2" style={{ color: 'var(--accent-11)' }}>
							No hotels added yet. Click "Add Hotel" to start.
						</Text>
					</Box>
				) : (
					hotels.map((hotel, index) => (
						<Box
							key={hotel.id}
							style={{
								border: '1px solid var(--accent-6)',
								borderRadius: '8px',
								padding: '16px',
								backgroundColor: 'var(--color-panel)',
							}}
						>
							<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
								<Text size="4" weight="bold" style={{ color: 'var(--accent-12)' }}>
									Hotel {index + 1}
								</Text>
								<Flex gap="2">
									<Button
										type="button"
										variant="ghost"
										size="1"
										disabled={index === 0}
										onClick={() => moveUp(index)}
									>
										↑
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="1"
										disabled={index === hotels.length - 1}
										onClick={() => moveDown(index)}
									>
										↓
									</Button>
									<Button
										type="button"
										variant="soft"
										color="red"
										size="1"
										onClick={() => removeHotel(hotel.id)}
									>
										Remove
									</Button>
								</Flex>
							</Flex>
							<Grid columns={{ initial: '1', sm: '2' }} gap="3">
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
									>
										Hotel Name
									</Text>
									<TextField.Root
										placeholder="Enter hotel name"
										value={hotel.name}
										onChange={(e) => updateHotel(hotel.id, 'name', e.target.value)}
									/>
								</Box>
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
									>
										Stars
									</Text>
									<Select.Root
										value={hotel.stars || undefined}
										onValueChange={(value) => updateHotel(hotel.id, 'stars', value)}
									>
										<Select.Trigger placeholder="Select stars" />
										<Select.Content>
											{starOptions.map((option) => (
												<Select.Item key={option.value} value={option.value}>
													{option.label}
												</Select.Item>
											))}
										</Select.Content>
									</Select.Root>
								</Box>
								<Box style={{ gridColumn: '1 / -1' }}>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
									>
										Reference
									</Text>
									<TextField.Root
										placeholder="Enter hotel reference"
										value={hotel.reference}
										onChange={(e) => updateHotel(hotel.id, 'reference', e.target.value)}
									/>
								</Box>
								<Box style={{ gridColumn: '1 / -1' }}>
									<ImageUpload
										images={hotel.images}
										onChange={(images) => updateHotel(hotel.id, 'images', images)}
										label="Hotel Images"
									/>
								</Box>
							</Grid>
						</Box>
					))
				)}
			</Flex>
			{hotels.length > 0 && (
				<Button
					type="button"
					variant="outline"
					size="2"
					style={{ marginTop: '16px' }}
					onClick={addHotel}
				>
					+ Add Another Hotel
				</Button>
			)}
			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '8px', display: 'block' }}>
					{error}
				</Text>
			)}
		</Box>
	)
}

export default HotelDetails