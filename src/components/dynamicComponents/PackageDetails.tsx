import React from 'react'
import { Box, Flex, Text, TextField, Button, Separator, Select } from '@radix-ui/themes'

export type BasePackage = {
	id: string
	type: string // Changed from name to type
	original_price: number
	discounted_price: number
}

export type PickupDropPoint = {
	id: string
	name: string
	price: number
}

export type PackageDetails = {
	base_packages: BasePackage[]
	pickup_point: PickupDropPoint[]
	drop_point: PickupDropPoint[]
}

type PackageDetailsProps = {
	packages: PackageDetails
	onChange: (packages: PackageDetails) => void
	label?: string
	error?: string
}

// Dummy package types (same as locations)
const packageTypes = [
	{ value: 'standard', label: 'Standard' },
	{ value: 'deluxe', label: 'Deluxe' },
	{ value: 'premium', label: 'Premium' },
	{ value: 'luxury', label: 'Luxury' },
	{ value: 'budget', label: 'Budget' },
]

// Format number with commas
const formatPrice = (value: string): string => {
	const numValue = value.replace(/,/g, '')
	if (!numValue) return ''
	const num = parseFloat(numValue)
	if (isNaN(num)) return ''
	return num.toLocaleString('en-IN')
}

// Parse formatted price back to number
const parsePrice = (value: string): number => {
	const numValue = value.replace(/,/g, '')
	return parseFloat(numValue) || 0
}

const PackageDetails: React.FC<PackageDetailsProps> = ({
	packages,
	onChange,
	label,
	error,
}) => {
	// Base Packages
	const addBasePackage = () => {
		const newPackage: BasePackage = {
			id: Date.now().toString(),
			type: '', // Changed from name to type
			original_price: 0,
			discounted_price: 0,
		}
		onChange({
			...packages,
			base_packages: [...packages.base_packages, newPackage],
		})
	}

	const removeBasePackage = (id: string) => {
		onChange({
			...packages,
			base_packages: packages.base_packages.filter((pkg) => pkg.id !== id),
		})
	}

	const updateBasePackage = (id: string, field: keyof BasePackage, value: string | number) => {
		onChange({
			...packages,
			base_packages: packages.base_packages.map((pkg) =>
				pkg.id === id ? { ...pkg, [field]: value } : pkg
			),
		})
	}

	// Handle price input with formatting
	const handlePriceChange = (
		id: string,
		field: 'original_price' | 'discounted_price',
		value: string
	) => {
		const formatted = formatPrice(value)
		const numValue = parsePrice(value)
		updateBasePackage(id, field, numValue)
	}

	// Pickup Points
	const addPickupPoint = () => {
		const newPoint: PickupDropPoint = {
			id: Date.now().toString(),
			name: '',
			price: 0,
		}
		onChange({
			...packages,
			pickup_point: [...packages.pickup_point, newPoint],
		})
	}

	const removePickupPoint = (id: string) => {
		onChange({
			...packages,
			pickup_point: packages.pickup_point.filter((point) => point.id !== id),
		})
	}

	const updatePickupPoint = (id: string, field: keyof PickupDropPoint, value: string | number) => {
		onChange({
			...packages,
			pickup_point: packages.pickup_point.map((point) =>
				point.id === id ? { ...point, [field]: value } : point
			),
		})
	}

	const handlePickupPriceChange = (id: string, value: string) => {
		const formatted = formatPrice(value)
		const numValue = parsePrice(value)
		updatePickupPoint(id, 'price', numValue)
	}

	// Drop Points
	const addDropPoint = () => {
		const newPoint: PickupDropPoint = {
			id: Date.now().toString(),
			name: '',
			price: 0,
		}
		onChange({
			...packages,
			drop_point: [...packages.drop_point, newPoint],
		})
	}

	const removeDropPoint = (id: string) => {
		onChange({
			...packages,
			drop_point: packages.drop_point.filter((point) => point.id !== id),
		})
	}

	const updateDropPoint = (id: string, field: keyof PickupDropPoint, value: string | number) => {
		onChange({
			...packages,
			drop_point: packages.drop_point.map((point) =>
				point.id === id ? { ...point, [field]: value } : point
			),
		})
	}

	const handleDropPriceChange = (id: string, value: string) => {
		const formatted = formatPrice(value)
		const numValue = parsePrice(value)
		updateDropPoint(id, 'price', numValue)
	}

	return (
		<Box>
			{label && (
				<Text size="3" weight="medium" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
					{label}
				</Text>
			)}

			{/* Base Packages Section */}
			<Box style={{ marginBottom: '24px' }}>
				<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						Base Packages
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addBasePackage}>
						+ Add Package
					</Button>
				</Flex>
				<Flex direction="column" gap="3">
					{packages.base_packages.length === 0 ? (
						<Box
							style={{
								padding: '16px',
								border: '1px dashed var(--accent-6)',
								borderRadius: '6px',
								textAlign: 'center',
							}}
						>
							<Text size="2" style={{ color: 'var(--accent-11)' }}>
								No packages added yet.
							</Text>
						</Box>
					) : (
						packages.base_packages.map((pkg) => (
							<Box
								key={pkg.id}
								style={{
									border: '1px solid var(--accent-6)',
									borderRadius: '6px',
									padding: '12px',
									backgroundColor: 'var(--color-panel)',
								}}
							>
								<Flex direction="column" gap="3">
									<Flex justify="end">
										<Button
											type="button"
											variant="soft"
											color="red"
											size="1"
											onClick={() => removeBasePackage(pkg.id)}
										>
											Remove
										</Button>
									</Flex>
									<Flex gap="3" style={{ flexWrap: 'wrap' }}>
										<Box style={{ flex: '1', minWidth: '200px' }}>
											<Text
												size="2"
												weight="medium"
												style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
											>
												Package Type
											</Text>
											<Select.Root
												value={pkg.type || undefined}
												onValueChange={(value) => updateBasePackage(pkg.id, 'type', value)}
											>
												<Select.Trigger placeholder="Select package type" />
												<Select.Content>
													{packageTypes.map((option) => (
														<Select.Item key={option.value} value={option.value}>
															{option.label}
														</Select.Item>
													))}
												</Select.Content>
											</Select.Root>
										</Box>
										<Box style={{ flex: '1', minWidth: '150px' }}>
											<Text
												size="2"
												weight="medium"
												style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
											>
												Original Price (₹)
											</Text>
											<TextField.Root
												type="text"
												placeholder="0"
												value={pkg.original_price ? formatPrice(pkg.original_price.toString()) : ''}
												onChange={(e) =>
													handlePriceChange(pkg.id, 'original_price', e.target.value)
												}
											/>
										</Box>
										<Box style={{ flex: '1', minWidth: '150px' }}>
											<Text
												size="2"
												weight="medium"
												style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
											>
												Discounted Price (₹)
											</Text>
											<TextField.Root
												type="text"
												placeholder="0"
												value={pkg.discounted_price ? formatPrice(pkg.discounted_price.toString()) : ''}
												onChange={(e) =>
													handlePriceChange(pkg.id, 'discounted_price', e.target.value)
												}
											/>
										</Box>
									</Flex>
								</Flex>
							</Box>
						))
					)}
				</Flex>
			</Box>

			<Separator size="4" style={{ margin: '24px 0' }} />

			{/* Pickup Points Section */}
			<Box style={{ marginBottom: '24px' }}>
				<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						Pickup Points
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addPickupPoint}>
						+ Add Pickup Point
					</Button>
				</Flex>
				<Flex direction="column" gap="3">
					{packages.pickup_point.length === 0 ? (
						<Box
							style={{
								padding: '16px',
								border: '1px dashed var(--accent-6)',
								borderRadius: '6px',
								textAlign: 'center',
							}}
						>
							<Text size="2" style={{ color: 'var(--accent-11)' }}>
								No pickup points added yet.
							</Text>
						</Box>
					) : (
						packages.pickup_point.map((point) => (
							<Box
								key={point.id}
								style={{
									border: '1px solid var(--accent-6)',
									borderRadius: '6px',
									padding: '12px',
									backgroundColor: 'var(--color-panel)',
								}}
							>
								<Flex justify="between" align="center" gap="3">
									<Box style={{ flex: '1' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Point Name
										</Text>
										<TextField.Root
											placeholder="Enter pickup point name"
											value={point.name}
											onChange={(e) => updatePickupPoint(point.id, 'name', e.target.value)}
										/>
									</Box>
									<Box style={{ width: '150px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Price (₹)
										</Text>
										<TextField.Root
											type="text"
											placeholder="0"
											value={point.price ? formatPrice(point.price.toString()) : ''}
											onChange={(e) => handlePickupPriceChange(point.id, e.target.value)}
										/>
									</Box>
									<Button
										type="button"
										variant="soft"
										color="red"
										size="2"
										onClick={() => removePickupPoint(point.id)}
										style={{ marginTop: '20px' }}
									>
										Remove
									</Button>
								</Flex>
							</Box>
						))
					)}
				</Flex>
			</Box>

			<Separator size="4" style={{ margin: '24px 0' }} />

			{/* Drop Points Section */}
			<Box style={{ marginBottom: '24px' }}>
				<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						Drop Points
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addDropPoint}>
						+ Add Drop Point
					</Button>
				</Flex>
				<Flex direction="column" gap="3">
					{packages.drop_point.length === 0 ? (
						<Box
							style={{
								padding: '16px',
								border: '1px dashed var(--accent-6)',
								borderRadius: '6px',
								textAlign: 'center',
							}}
						>
							<Text size="2" style={{ color: 'var(--accent-11)' }}>
								No drop points added yet.
							</Text>
						</Box>
					) : (
						packages.drop_point.map((point) => (
							<Box
								key={point.id}
								style={{
									border: '1px solid var(--accent-6)',
									borderRadius: '6px',
									padding: '12px',
									backgroundColor: 'var(--color-panel)',
								}}
							>
								<Flex justify="between" align="center" gap="3">
									<Box style={{ flex: '1' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Point Name
										</Text>
										<TextField.Root
											placeholder="Enter drop point name"
											value={point.name}
											onChange={(e) => updateDropPoint(point.id, 'name', e.target.value)}
										/>
									</Box>
									<Box style={{ width: '150px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Price (₹)
										</Text>
										<TextField.Root
											type="text"
											placeholder="0"
											value={point.price ? formatPrice(point.price.toString()) : ''}
											onChange={(e) => handleDropPriceChange(point.id, e.target.value)}
										/>
									</Box>
									<Button
										type="button"
										variant="soft"
										color="red"
										size="2"
										onClick={() => removeDropPoint(point.id)}
										style={{ marginTop: '20px' }}
									>
										Remove
									</Button>
								</Flex>
							</Box>
						))
					)}
				</Flex>
			</Box>

			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '8px', display: 'block' }}>
					{error}
				</Text>
			)}
		</Box>
	)
}

export default PackageDetails