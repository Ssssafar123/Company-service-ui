import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	DropdownMenu,
	Checkbox,
	IconButton,
	AlertDialog,
} from '@radix-ui/themes'
import Table from '../../../components/dynamicComponents/Table'
type PaymentData = {
	id: string
	paymentId: string
	invoiceNumber: string
	paymentMode: string
	transactionId: string
	customer: string
	amount: number
	amountDisplay: string
	date: string
}

const dummyPayments: PaymentData[] = [
    { id: '1', paymentId: '4676', invoiceNumber: 'INVOICE002468/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456789', customer: 'Tejas Rane', amount: 4000.00, amountDisplay: '₹4,000.00', date: '10/11/2025' },
    { id: '2', paymentId: '4675', invoiceNumber: 'INVOICE002468/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456790', customer: 'Tejas Rane', amount: 4000.00, amountDisplay: '₹4,000.00', date: '10/11/2025' },
    { id: '3', paymentId: '4672', invoiceNumber: 'INVOICE002528/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456791', customer: 'Hinal Patel', amount: 8000.00, amountDisplay: '₹8,000.00', date: '22/11/2025' },
    { id: '4', paymentId: '4671', invoiceNumber: 'INVOICE002527/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456792', customer: 'Aryan Singh', amount: 12000.00, amountDisplay: '₹12,000.00', date: '22/11/2025' },
    { id: '5', paymentId: '4670', invoiceNumber: 'INVOICE002526/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456793', customer: 'Dhanitri Boro', amount: 6000.00, amountDisplay: '₹6,000.00', date: '22/11/2025' },
    { id: '6', paymentId: '4669', invoiceNumber: 'INVOICE002526/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456794', customer: 'Dhanitri Boro', amount: 1.00, amountDisplay: '₹1.00', date: '22/11/2025' },
    { id: '7', paymentId: '4668', invoiceNumber: 'INVOICE002509/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456795', customer: 'Ahmed Ali', amount: 2000.00, amountDisplay: '₹2,000.00', date: '21/11/2025' },
    { id: '8', paymentId: '4667', invoiceNumber: 'INVOICE002525/11/2025', paymentMode: 'PayU Money', transactionId: 'TXN123456796', customer: 'Gunjan Dhakate', amount: 4000.00, amountDisplay: '₹4,000.00', date: '20/11/2025' },
    { id: '9', paymentId: '4666', invoiceNumber: 'INVOICE002524/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456797', customer: 'Mamta Mishra', amount: 26000.00, amountDisplay: '₹26,000.00', date: '21/11/2025' },
    { id: '10', paymentId: '4665', invoiceNumber: 'INVOICE002522/11/2025', paymentMode: 'PayU Money', transactionId: 'TXN123456798', customer: 'Jayesh Kasliwal', amount: 10875.00, amountDisplay: '₹10,875.00', date: '20/11/2025' },
    { id: '11', paymentId: '4664', invoiceNumber: 'INVOICE002521/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456799', customer: 'Rahul Chavan', amount: 41600.00, amountDisplay: '₹41,600.00', date: '20/11/2025' },
    { id: '12', paymentId: '4663', invoiceNumber: 'INVOICE002520/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456800', customer: 'Saad Bhujwala', amount: 9000.00, amountDisplay: '₹9,000.00', date: '20/11/2025' },
    { id: '13', paymentId: '4662', invoiceNumber: 'INVOICE002519/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456801', customer: 'Swayam Takalkar', amount: 14000.00, amountDisplay: '₹14,000.00', date: '20/11/2025' },
    { id: '14', paymentId: '4661', invoiceNumber: 'INVOICE002518/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456802', customer: 'Poornima S', amount: 12000.00, amountDisplay: '₹12,000.00', date: '20/11/2025' },
    { id: '15', paymentId: '4660', invoiceNumber: 'INVOICE002516/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456803', customer: 'Srinivas S', amount: 1155.00, amountDisplay: '₹1,155.00', date: '20/11/2025' },
    { id: '16', paymentId: '4659', invoiceNumber: 'INVOICE002503/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456804', customer: 'Varun Anil Budhe', amount: 4000.00, amountDisplay: '₹4,000.00', date: '20/11/2025' },
    { id: '17', paymentId: '4658', invoiceNumber: 'INVOICE002515/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456805', customer: 'Digvi Agarwal', amount: 4000.00, amountDisplay: '₹4,000.00', date: '20/11/2025' },
    { id: '18', paymentId: '4657', invoiceNumber: 'INVOICE002514/11/2025', paymentMode: 'Bank ICICI 1 - Office', transactionId: 'TXN123456806', customer: 'Praharsh Parihar', amount: 6000.00, amountDisplay: '₹6,000.00', date: '19/11/2025' },
]

type SortDirection = 'asc' | 'desc' | null

type ColumnConfig = {
	key: string
	label: string
	dropdownLabel: string
	width: string
	sortable: boolean
	render: (row: PaymentData) => React.ReactNode
}

const Payment: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: SortDirection
	} | null>(null)

	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		cancelText?: string
		onConfirm: () => void
		color?: 'red' | 'blue' | 'green' | 'gray'
	} | null>(null)

	const [columnVisibility, setColumnVisibility] = useState({
		paymentId: true,
		invoiceNumber: true,
		paymentMode: true,
		transactionId: true,
		customer: true,
		amount: true,
		date: true,
		actions: true,
	})

	const [payments, setPayments] = useState<PaymentData[]>(dummyPayments)

	const itemsPerPage = 25

	const handleView = (payment: PaymentData) => {
		setDialogConfig({
			title: 'View Payment Details',
			description: `Payment ID: ${payment.paymentId} | Invoice: ${payment.invoiceNumber} | Customer: ${payment.customer}`,
			actionText: 'OK',
			color: 'blue',
			onConfirm: () => setDialogOpen(false),
		})
		setDialogOpen(true)
	}

	const handleExport = (payment: PaymentData) => {
		setDialogConfig({
			title: 'Export Payment',
			description: `Export payment record for ${payment.customer}?`,
			actionText: 'Export',
			cancelText: 'Cancel',
			color: 'blue',
			onConfirm: () => {
				// Export logic here
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: 'Payment record exported successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const handleDelete = (payment: PaymentData) => {
		setDialogConfig({
			title: 'Delete Payment',
			description: `Are you sure you want to delete payment #${payment.paymentId}? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setPayments(prev => prev.filter(item => item.id !== payment.id))
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: 'Payment deleted successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const allColumns: ColumnConfig[] = [
		{
			key: 'paymentId',
			label: 'Payment #',
			dropdownLabel: 'Payment #',
			width: '120px',
			sortable: true,
			render: (row: PaymentData) => (
				<Text size="2" style={{ color: 'blue', fontWeight: '500' }}>
					{row.paymentId}
				</Text>
			),
		},
		{
			key: 'invoiceNumber',
			label: 'Invoice #',
			dropdownLabel: 'Invoice #',
			width: '220px',
			sortable: true,
			render: (row: PaymentData) => (
				<Text size="2" style={{ color: 'blue' }}>
					{row.invoiceNumber}
				</Text>
			),
		},
		{
			key: 'paymentMode',
			label: 'Payment Mode',
			dropdownLabel: 'Payment Mode',
			width: '180px',
			sortable: true,
			render: (row: PaymentData) => <Text size="2">{row.paymentMode}</Text>,
		},
		{
			key: 'transactionId',
			label: 'Transaction ID',
			dropdownLabel: 'Transaction ID',
			width: '180px',
			sortable: true,
			render: (row: PaymentData) => <Text size="2">{row.transactionId}</Text>,
		},
		{
			key: 'customer',
			label: 'Customer',
			dropdownLabel: 'Customer',
			width: '180px',
			sortable: true,
			render: (row: PaymentData) => (
				<Text size="2" style={{ color: 'blue' }}>
					{row.customer}
				</Text>
			),
		},
		{
			key: 'amount',
			label: 'Amount',
			dropdownLabel: 'Amount',
			width: '150px',
			sortable: true,
			render: (row: PaymentData) => (
				<Text size="2" weight="medium">
					{row.amountDisplay}
				</Text>
			),
		},
		{
			key: 'date',
			label: 'Date',
			dropdownLabel: 'Date',
			width: '130px',
			sortable: true,
			render: (row: PaymentData) => <Text size="2">{row.date}</Text>,
		},
		{
			key: 'actions',
			label: '',
			dropdownLabel: 'Actions',
			width: '80px',
			sortable: false,
			render: (row: PaymentData) => (
				<Flex gap="2" align="center" justify="center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<IconButton
								variant="ghost"
								size="2"
								style={{
									cursor: 'pointer',
									color: 'var(--accent-11)',
								}}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle cx="8" cy="3" r="1.5" fill="currentColor" />
									<circle cx="8" cy="8" r="1.5" fill="currentColor" />
									<circle cx="8" cy="13" r="1.5" fill="currentColor" />
								</svg>
							</IconButton>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							style={{
								minWidth: '180px',
								backgroundColor: 'var(--color-panel)',
								border: '1px solid var(--accent-6)',
							}}
						>
							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleView(row)
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8 3C5.5 3 3.3 4.2 2 6C3.3 7.8 5.5 9 8 9C10.5 9 12.7 7.8 14 6C12.7 4.2 10.5 3 8 3ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										View Details
									</Text>
								</Flex>
							</DropdownMenu.Item>

							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleExport(row)
								}}
								style={{ cursor: 'pointer' }}
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8 2V10M8 10L5 7M8 10L11 7M3 12H13V14H3V12Z"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										Export Payment
									</Text>
								</Flex>
							</DropdownMenu.Item>

							<DropdownMenu.Separator />

							<DropdownMenu.Item
								onSelect={(e) => {
									e.preventDefault()
									handleDelete(row)
								}}
								style={{ cursor: 'pointer' }}
								color="red"
							>
								<Flex align="center" gap="2">
									<svg
										width="14"
										height="14"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5ZM6 1V2H10V1H6ZM4 4V13C4 13.6 4.4 14 5 14H11C11.6 14 12 13.6 12 13V4H4Z"
											fill="currentColor"
										/>
										<path
											d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z"
											fill="currentColor"
										/>
									</svg>
									<Text size="2" style={{ color: 'var(--red-11)' }}>
										Delete
									</Text>
								</Flex>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Flex>
			),
		},
	]

	const visibleColumns = useMemo(() => {
		return allColumns.filter((col) => columnVisibility[col.key as keyof typeof columnVisibility])
	}, [columnVisibility])

	const handleColumnToggle = (columnKey: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnKey]: !prev[columnKey as keyof typeof prev],
		}))
	}

	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return payments
		}

		const query = searchQuery.toLowerCase()
		return payments.filter(
			(item) =>
				item.paymentId.toLowerCase().includes(query) ||
				item.invoiceNumber.toLowerCase().includes(query) ||
				item.paymentMode.toLowerCase().includes(query) ||
				item.transactionId.toLowerCase().includes(query) ||
				item.customer.toLowerCase().includes(query) ||
				item.amountDisplay.toLowerCase().includes(query) ||
				item.date.toLowerCase().includes(query)
		)
	}, [searchQuery, payments])

	const sortedData = useMemo(() => {
		if (!sortConfig || !sortConfig.direction) {
			return filteredData
		}

		return [...filteredData].sort((a, b) => {
			let aValue: any = a[sortConfig.key as keyof PaymentData]
			let bValue: any = b[sortConfig.key as keyof PaymentData]

			if (sortConfig.key === 'amount') {
				return sortConfig.direction === 'asc'
					? a.amount - b.amount
					: b.amount - a.amount
			}

			if (aValue == null && bValue == null) return 0
			if (aValue == null) return 1
			if (bValue == null) return -1

			const aStr = String(aValue).toLowerCase()
			const bStr = String(bValue).toLowerCase()

			if (aStr < bStr)
				return sortConfig.direction === 'asc' ? -1 : 1
			if (aStr > bStr)
				return sortConfig.direction === 'asc' ? 1 : -1
			return 0
		})
	}, [filteredData, sortConfig])

	const totalPages = Math.ceil(sortedData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedData = sortedData.slice(startIndex, endIndex)

	const handleSort = (columnKey: string, direction: SortDirection) => {
		setSortConfig(direction ? { key: columnKey, direction } : null)
		setCurrentPage(1)
	}

	const handleHideColumn = (columnKey: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnKey]: false,
		}))
	}

	const handleExportAll = () => {
		setDialogConfig({
			title: 'Export All Payments',
			description: 'Export all payment records to CSV?',
			actionText: 'Export',
			cancelText: 'Cancel',
			color: 'blue',
			onConfirm: () => {
				// Export all logic here
				setDialogOpen(false)
				setDialogConfig({
					title: 'Success',
					description: 'All payment records exported successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => setDialogOpen(false),
				})
				setDialogOpen(true)
			},
		})
		setDialogOpen(true)
	}

	const tableRows = paginatedData.map((item) => ({
		...item,
	}))

	return (
		<Box style={{ padding: '24px' }}>
			<Text
				size="7"
				weight="bold"
				style={{
					color: 'var(--accent-12)',
					marginBottom: '24px',
					display: 'block',
				}}
			>
				Payment Management
			</Text>

			<Flex gap="3" align="center" justify="between" style={{ marginBottom: '24px' }}>
				<Flex gap="2" align="center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button
								variant="soft"
								size="2"
								style={{
									color: 'var(--accent-12)',
									backgroundColor: 'var(--accent-3)',
									border: '1px solid var(--accent-6)',
									minWidth: '80px',
								}}
							>
								25
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							style={{
								minWidth: '100px',
								backgroundColor: 'var(--color-panel)',
								border: '1px solid var(--accent-6)',
							}}
						>
							{[10, 25, 50, 100].map((count) => (
								<DropdownMenu.Item
									key={count}
									onSelect={(e) => {
										e.preventDefault()
										// Update items per page logic
									}}
									style={{ cursor: 'pointer' }}
								>
									<Text size="2" style={{ color: 'var(--accent-12)' }}>
										{count}
									</Text>
								</DropdownMenu.Item>
							))}
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<Button
						variant="soft"
						size="2"
						onClick={handleExportAll}
						style={{
							color: 'var(--accent-12)',
							backgroundColor: 'var(--accent-3)',
							border: '1px solid var(--accent-6)',
						}}
					>
						Export
					</Button>

					<Button
						variant="ghost"
						size="2"
						style={{
							color: 'var(--accent-11)',
						}}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8 3V13M8 3L11 6M8 3L5 6"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Button>
				</Flex>

				<Flex gap="2" align="center">
					<TextField.Root
						placeholder="Search.."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value)
							setCurrentPage(1)
						}}
						style={{ minWidth: '250px' }}
					>
						<TextField.Slot>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z"
									stroke="var(--accent-11)"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</TextField.Slot>
					</TextField.Root>

					<IconButton
						variant="ghost"
						size="2"
						style={{
							color: 'var(--accent-11)',
						}}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</IconButton>
				</Flex>
			</Flex>

			<Box
				style={{
					backgroundColor: 'var(--color-panel)',
					borderRadius: '8px',
					overflow: 'hidden',
					border: '1px solid var(--accent-6)',
				}}
			>
				<Table
					columns={visibleColumns}
					rows={tableRows}
					onSort={handleSort}
					sortConfig={sortConfig}
					onHideColumn={handleHideColumn}
				/>
			</Box>

			{sortedData.length > 0 && (
				<Flex
					justify="between"
					align="center"
					gap="3"
					style={{ marginTop: '16px' }}
				>
					<Text size="2" style={{ color: 'var(--accent-11)' }}>
						Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
					</Text>
					
					<Flex gap="2" align="center">
						<Button
							variant="soft"
							size="2"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							style={{
								color: 'var(--accent-12)',
								backgroundColor: 'var(--accent-3)',
								border: '1px solid var(--accent-6)',
							}}
						>
							Previous
						</Button>

						{/* First page */}
						<Button
							variant={currentPage === 1 ? "solid" : "soft"}
							size="2"
							onClick={() => setCurrentPage(1)}
							style={{
								color: currentPage === 1 ? 'white' : 'var(--accent-12)',
								backgroundColor: currentPage === 1 ? 'var(--blue-9)' : 'var(--accent-3)',
								border: '1px solid var(--accent-6)',
								minWidth: '40px',
							}}
						>
							1
						</Button>

						{/* Show pages around current page */}
						{currentPage > 3 && (
							<Text size="2" style={{ color: 'var(--accent-11)', padding: '0 8px' }}>
								...
							</Text>
						)}

						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter(page => {
								// Show pages within 1 of current page, but not first or last
								return page !== 1 && 
									   page !== totalPages && 
									   page >= currentPage - 1 && 
									   page <= currentPage + 1
							})
							.map(page => (
								<Button
									key={page}
									variant={currentPage === page ? "solid" : "soft"}
									size="2"
									onClick={() => setCurrentPage(page)}
									style={{
										color: currentPage === page ? 'white' : 'var(--accent-12)',
										backgroundColor: currentPage === page ? 'var(--blue-9)' : 'var(--accent-3)',
										border: '1px solid var(--accent-6)',
										minWidth: '40px',
									}}
								>
									{page}
								</Button>
							))}

						{currentPage < totalPages - 2 && totalPages > 1 && (
							<Text size="2" style={{ color: 'var(--accent-11)', padding: '0 8px' }}>
								...
							</Text>
						)}

						{/* Last page */}
						{totalPages > 1 && (
							<Button
								variant={currentPage === totalPages ? "solid" : "soft"}
								size="2"
								onClick={() => setCurrentPage(totalPages)}
								style={{
									color: currentPage === totalPages ? 'white' : 'var(--accent-12)',
									backgroundColor: currentPage === totalPages ? 'var(--blue-9)' : 'var(--accent-3)',
									border: '1px solid var(--accent-6)',
									minWidth: '40px',
								}}
							>
								{totalPages}
							</Button>
						)}

						<Button
							variant="soft"
							size="2"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
							style={{
								color: 'var(--accent-12)',
								backgroundColor: 'var(--accent-3)',
								border: '1px solid var(--accent-6)',
							}}
						>
							Next
						</Button>

						{/* Page selector dropdown */}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button
									variant="soft"
									size="2"
									style={{
										color: 'var(--accent-12)',
										backgroundColor: 'var(--accent-3)',
										border: '1px solid var(--accent-6)',
										minWidth: '60px',
									}}
								>
									{currentPage}
									<svg
										width="12"
										height="12"
										viewBox="0 0 12 12"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										style={{ marginLeft: '4px' }}
									>
										<path
											d="M3 4.5L6 7.5L9 4.5"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content
								style={{
									minWidth: '100px',
									maxHeight: '300px',
									overflowY: 'auto',
									backgroundColor: 'var(--color-panel)',
									border: '1px solid var(--accent-6)',
								}}
							>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<DropdownMenu.Item
										key={page}
										onSelect={(e) => {
											e.preventDefault()
											setCurrentPage(page)
										}}
										style={{ cursor: 'pointer' }}
									>
										<Text size="2" style={{ color: 'var(--accent-12)' }}>
											{page}
										</Text>
									</DropdownMenu.Item>
								))}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Flex>
				</Flex>
			)}

			{dialogConfig && (
				<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialog.Content maxWidth="450px">
						<AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
						<AlertDialog.Description size="2">
							{dialogConfig.description}
						</AlertDialog.Description>
						<Flex gap="3" mt="4" justify="end">
							{dialogConfig.cancelText && (
								<AlertDialog.Cancel>
									<Button variant="soft" color="gray">
										{dialogConfig.cancelText}
									</Button>
								</AlertDialog.Cancel>
							)}
							<AlertDialog.Action>
								<Button 
									variant="solid" 
									color={dialogConfig.color || 'red'} 
									onClick={dialogConfig.onConfirm}
								>
									{dialogConfig.actionText}
								</Button>
							</AlertDialog.Action>
						</Flex>
					</AlertDialog.Content>
				</AlertDialog.Root>
			)}
		</Box>
	)
}

export default Payment