import React, { useState, useMemo } from 'react'
import { Table as RadixTable, Flex, Box, DropdownMenu, Text } from '@radix-ui/themes'

type SortDirection = 'asc' | 'desc' | null

type Column = {
	key: string
	label: string
	accessor?: string
	width: string
	sortable?: boolean
	render?: (row: any, rowIndex: number) => React.ReactNode
}

type Props = {
	columns: Column[]
	rows: any[]
	onSort?: (columnKey: string, direction: SortDirection) => void
	sortConfig?: { key: string; direction: SortDirection } | null
	onHideColumn?: (columnKey: string) => void
}

const Table = ({ columns, rows, onSort, sortConfig, onHideColumn }: Props) => {
	const [internalSortConfig, setInternalSortConfig] = useState<{
		key: string
		direction: SortDirection
	} | null>(null)

	// Use external sortConfig if provided, otherwise use internal state
	const activeSortConfig = sortConfig !== undefined ? sortConfig : internalSortConfig

	const handleSort = (columnKey: string, direction: SortDirection) => {
		if (onSort) {
			onSort(columnKey, direction)
		} else {
			setInternalSortConfig(direction ? { key: columnKey, direction } : null)
		}
	}

	const handleHideColumn = (columnKey: string) => {
		if (onHideColumn) {
			onHideColumn(columnKey)
		}
	}

	const getSortIcon = (columnKey: string) => {
		if (!activeSortConfig || activeSortConfig.key !== columnKey) {
			return (
				<Box
					style={{
						display: 'inline-flex',
						flexDirection: 'column',
						marginLeft: '6px',
						opacity: 0.3,
						verticalAlign: 'middle',
					}}
				>
					<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
						<path d="M5 0L6.5 3.5H3.5L5 0Z" fill="currentColor" />
						<path d="M5 10L3.5 6.5H6.5L5 10Z" fill="currentColor" />
					</svg>
				</Box>
			)
		}

		if (activeSortConfig.direction === 'asc') {
			return (
				<Box
					style={{
						display: 'inline-flex',
						marginLeft: '6px',
						verticalAlign: 'middle',
					}}
				>
					<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
						<path d="M5 0L6.5 3.5H3.5L5 0Z" fill="currentColor" />
					</svg>
				</Box>
			)
		}

		return (
			<Box
				style={{
					display: 'inline-flex',
					marginLeft: '6px',
					verticalAlign: 'middle',
				}}
			>
				<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
					<path d="M5 10L3.5 6.5H6.5L5 10Z" fill="currentColor" />
				</svg>
			</Box>
		)
	}

	if (!columns) return null

	return (
		<RadixTable.Root>
			<RadixTable.Header>
				<RadixTable.Row>
					{columns.map((col) => (
						<RadixTable.ColumnHeaderCell
							key={col.key}
							style={{
								width: col.width,
								cursor: col.sortable !== false ? 'pointer' : 'default',
								userSelect: 'none',
							}}
						>
							{col.sortable !== false ? (
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Flex
											align="center"
											style={{
												width: '100%',
												cursor: 'pointer',
											}}
										>
											{col.label}
											{getSortIcon(col.key)}
										</Flex>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content
										style={{
											minWidth: '120px',
											backgroundColor: 'var(--color-panel)',
											border: '1px solid var(--accent-6)',
										}}
									>
										<DropdownMenu.Item
											onSelect={(e) => {
												e.preventDefault()
												handleSort(col.key, 'asc')
											
											}}
											style={{ cursor: 'pointer' }}
										>
											<Flex align="center" gap="2">
												<svg
													width="15"
													height="15"
													viewBox="0 0 10 10"
													fill="none"
												>
													<path
														d="M5 0L6.5 3.5H3.5L5 0Z"
														fill="currentColor"
													/>
												</svg>
												<Text size="2" style={{ color: 'var(--accent-12)' }}>
													Asc
												</Text>
											</Flex>
										</DropdownMenu.Item>
										<DropdownMenu.Item
											onSelect={(e) => {
												e.preventDefault()
												handleSort(col.key, 'desc')
											}}
											style={{ cursor: 'pointer' }}
										>
											<Flex align="center" gap="2">
												<svg
													width="15"
													height="15"
													viewBox="0 0 10 10"
													fill="none"
												>
													<path
														d="M5 10L3.5 6.5H6.5L5 10Z"
														fill="currentColor"
													/>
												</svg>
												<Text size="2" style={{ color: 'var(--accent-12)' }}>
													Desc
												</Text>
											</Flex>
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											onSelect={(e) => {
												e.preventDefault()
												handleHideColumn(col.key)
											}}
											style={{ cursor: 'pointer' }}
										>
											<Flex align="center" gap="2">
												<svg
													width="15"
													height="15"
													viewBox="0 0 12 12"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
													<path
														d="M7.5 4.5L4.5 7.5M4.5 4.5L7.5 7.5"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
													<path
														d="M2 2L2 2C2.55228 2 3 2.44772 3 3V3M10 10L10 10C10.5523 10 11 9.55228 11 9V9"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
												</svg>
												<Text size="2" style={{ color: 'var(--accent-12)' }}>
													Hide
												</Text>
											</Flex>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							) : (
								<Flex align="center">
									{col.label}
								</Flex>
							)}
						</RadixTable.ColumnHeaderCell>
					))}
				</RadixTable.Row>
			</RadixTable.Header>

			<RadixTable.Body>
				{rows.map((row, index) => (
					<RadixTable.Row key={index}>
						{columns.map((col) => (
							<RadixTable.Cell key={col.key}>
								{col.render
									? col.render(row, index)
									: row[col.key] ?? '-'}
							</RadixTable.Cell>
						))}
					</RadixTable.Row>
				))}
			</RadixTable.Body>
		</RadixTable.Root>
	)
}

export default Table