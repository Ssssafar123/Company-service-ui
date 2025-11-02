import React from 'react'
import { Box, Flex, Text, TextField, Button, TextArea, Checkbox } from '@radix-ui/themes'

export type Batch = {
	id: string
	start_date: string
	end_date: string
	extra_amount: number
	extra_amount_reason: string
	sold_out: boolean
}

type BatchManagementProps = {
	batches: Batch[]
	onChange: (batches: Batch[]) => void
	label?: string
	error?: string
}

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

const BatchManagement: React.FC<BatchManagementProps> = ({
	batches,
	onChange,
	label,
	error,
}) => {
	const addBatch = () => {
		const newBatch: Batch = {
			id: Date.now().toString(),
			start_date: '',
			end_date: '',
			extra_amount: 0,
			extra_amount_reason: '',
			sold_out: false,
		}
		onChange([...batches, newBatch])
	}

	const removeBatch = (id: string) => {
		onChange(batches.filter((batch) => batch.id !== id))
	}

	const updateBatch = (id: string, field: keyof Batch, value: string | boolean | number) => {
		const updated = batches.map((batch) =>
			batch.id === id ? { ...batch, [field]: value } : batch
		)
		onChange(updated)
	}

	const handleExtraAmountChange = (id: string, value: string) => {
		const numValue = parsePrice(value)
		updateBatch(id, 'extra_amount', numValue)
	}

	return (
		<Box>
			{label && (
				<Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						{label}
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addBatch}>
						+ Add Batch
					</Button>
				</Flex>
			)}
			<Flex direction="column" gap="4">
				{batches.length === 0 ? (
					<Box
						style={{
							padding: '24px',
							border: '1px dashed var(--accent-6)',
							borderRadius: '6px',
							textAlign: 'center',
						}}
					>
						<Text size="2" style={{ color: 'var(--accent-11)' }}>
							No batches added yet. Click "Add Batch" to start.
						</Text>
					</Box>
				) : (
					batches.map((batch, index) => (
						<Box
							key={batch.id}
							style={{
								border: '1px solid var(--accent-6)',
								borderRadius: '8px',
								padding: '16px',
								backgroundColor: 'var(--color-panel)',
							}}
						>
							<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
								<Text size="4" weight="bold" style={{ color: 'var(--accent-12)' }}>
									Batch {index + 1}
								</Text>
								<Button
									type="button"
									variant="soft"
									color="red"
									size="1"
									onClick={() => removeBatch(batch.id)}
								>
									Remove
								</Button>
							</Flex>
							<Flex direction="column" gap="3">
								<Flex gap="3" style={{ flexWrap: 'wrap' }}>
									<Box style={{ flex: '1', minWidth: '200px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Start Date
										</Text>
										<TextField.Root
											type="datetime-local"
											value={batch.start_date}
											onChange={(e) => updateBatch(batch.id, 'start_date', e.target.value)}
										/>
									</Box>
									<Box style={{ flex: '1', minWidth: '200px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											End Date
										</Text>
										<TextField.Root
											type="datetime-local"
											value={batch.end_date}
											onChange={(e) => updateBatch(batch.id, 'end_date', e.target.value)}
										/>
									</Box>
								</Flex>
								<Flex gap="3" style={{ flexWrap: 'wrap' }}>
									<Box style={{ flex: '1', minWidth: '200px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Extra Amount (₹)
										</Text>
										<TextField.Root
											type="text"
											placeholder="0"
											value={batch.extra_amount ? formatPrice(batch.extra_amount.toString()) : ''}
											onChange={(e) => handleExtraAmountChange(batch.id, e.target.value)}
										/>
									</Box>
									<Box style={{ flex: '1', minWidth: '200px' }}>
										<Text
											size="2"
											weight="medium"
											style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
										>
											Reason for Extra Amount
										</Text>
										<TextField.Root
											placeholder="Enter reason"
											value={batch.extra_amount_reason}
											onChange={(e) =>
												updateBatch(batch.id, 'extra_amount_reason', e.target.value)
											}
										/>
									</Box>
								</Flex>
								<Flex align="center" gap="2">
									<Checkbox
										checked={batch.sold_out || false}
										onCheckedChange={(checked) =>
											updateBatch(batch.id, 'sold_out', checked === true)
										}
									/>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										Sold Out
									</Text>
								</Flex>
							</Flex>
						</Box>
					))
				)}
			</Flex>
			{batches.length > 0 && (
				<Button
					type="button"
					variant="outline"
					size="2"
					style={{ marginTop: '16px' }}
					onClick={addBatch}
				>
					+ Add Another Batch
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

export default BatchManagement