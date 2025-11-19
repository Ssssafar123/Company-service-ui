import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Card,
	AlertDialog,
	DropdownMenu,
	IconButton,
	Badge,
	Select,
} from '@radix-ui/themes'
import { Search, ChevronDown, Plus, CreditCard, RefreshCw, Download, List, Filter, ChevronLeft, FileText, ChevronsLeft, BarChart3, X } from 'lucide-react'
import Table from '../../../components/dynamicComponents/Table'

type InvoiceData = {
	id: string
	invoiceNumber: string
	amount: number
	totalTax: number
	date: string
	customer: string
	project: string
	tags: string[]
	dueDate: string
	status: 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'draft' | 'cancelled'
	tripStartingDate: string
	location: string
	b2bDeal: string
	gst: string
}

// Dummy invoice data with ALL columns from both images
const dummyInvoices: InvoiceData[] = [
	{
		id: '1',
		invoiceNumber: 'INVOICE002514/11/2025',
		amount: 16800.00,
		totalTax: 800.00,
		date: '19/11/2025',
		customer: 'Praharsh Parihar',
		project: '',
		tags: ['Manali - Kasol', '25 nov'],
		dueDate: '25/11/2025',
		status: 'partially_paid',
		tripStartingDate: '25/11/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '2',
		invoiceNumber: 'INVOICE002512/11/2025',
		amount: 14700.00,
		totalTax: 700.00,
		date: '19/11/2025',
		customer: 'Mailarlinga k',
		project: '',
		tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
		dueDate: '22/11/2025',
		status: 'partially_paid',
		tripStartingDate: '22/11/2025',
		location: 'Udaipur weekend',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '3',
		invoiceNumber: 'INVOICE002511/11/2025',
		amount: 9450.00,
		totalTax: 450.00,
		date: '18/11/2025',
		customer: 'Omkar chowdhary',
		project: '',
		tags: ['Manali - Kasol', '02 Dec'],
		dueDate: '02/12/2025',
		status: 'partially_paid',
		tripStartingDate: '02/12/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '4',
		invoiceNumber: 'INVOICE002510/11/2025',
		amount: 9975.00,
		totalTax: 475.00,
		date: '18/11/2025',
		customer: 'Manpreet kaur',
		project: '',
		tags: ['Manali - Kasol', '21 Nov'],
		dueDate: '21/11/2025',
		status: 'partially_paid',
		tripStartingDate: '21/11/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '5',
		invoiceNumber: 'INVOICE002508/11/2025',
		amount: 17800.00,
		totalTax: 800.00,
		date: '17/11/2025',
		customer: 'Mohan Laxman Gavhane',
		project: '',
		tags: ['Manali - Kasol - Kheerganga', '28 NOV'],
		dueDate: '28/11/2025',
		status: 'partially_paid',
		tripStartingDate: '28/11/2025',
		location: 'Manali - Kasol - Kheerganga',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '6',
		invoiceNumber: 'INVOICE002506/11/2025',
		amount: 22050.00,
		totalTax: 1050.00,
		date: '17/11/2025',
		customer: 'Pranay Badugu',
		project: '',
		tags: ['Manali Kasol', '16 Dec', 'Instagram'],
		dueDate: '16/12/2025',
		status: 'partially_paid',
		tripStartingDate: '16/12/2025',
		location: 'Manali kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '7',
		invoiceNumber: 'INVOICE002505/11/2025',
		amount: 12600.00,
		totalTax: 600.00,
		date: '16/11/2025',
		customer: 'Rajesh Kumar',
		project: '',
		tags: ['Manali - Kasol', '30 Nov'],
		dueDate: '30/11/2025',
		status: 'unpaid',
		tripStartingDate: '30/11/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '8',
		invoiceNumber: 'INVOICE002504/11/2025',
		amount: 18900.00,
		totalTax: 900.00,
		date: '16/11/2025',
		customer: 'Priya Sharma',
		project: '',
		tags: ['Manali - Kasol', '5 Dec'],
		dueDate: '05/12/2025',
		status: 'paid',
		tripStartingDate: '05/12/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '9',
		invoiceNumber: 'INVOICE002503/11/2025',
		amount: 15750.00,
		totalTax: 750.00,
		date: '15/11/2025',
		customer: 'Amit Patel',
		project: '',
		tags: ['Manali - Kasol', '12 Dec'],
		dueDate: '12/12/2025',
		status: 'partially_paid',
		tripStartingDate: '12/12/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
	{
		id: '10',
		invoiceNumber: 'INVOICE002502/11/2025',
		amount: 21000.00,
		totalTax: 1000.00,
		date: '15/11/2025',
		customer: 'Sneha Reddy',
		project: '',
		tags: ['Manali - Kasol', '20 Dec'],
		dueDate: '20/12/2025',
		status: 'overdue',
		tripStartingDate: '20/12/2025',
		location: 'Manali - Kasol',
		b2bDeal: '',
		gst: '23AANCP1460D1ZQ',
	},
]

const Invoice: React.FC = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [invoices, setInvoices] = useState<InvoiceData[]>(dummyInvoices)
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(25)
	const [showQuickStats, setShowQuickStats] = useState(false)
	const [selectedYear, setSelectedYear] = useState('2025')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogConfig, setDialogConfig] = useState<{
		title: string
		description: string
		actionText: string
		cancelText?: string
		onConfirm: () => void
		color?: 'red' | 'blue' | 'green' | 'gray'
	} | null>(null)

	// Calculate stats from invoices
	const stats = useMemo(() => {
		const totalInvoices = invoices.length
		const unpaid = invoices.filter((inv) => inv.status === 'unpaid').length
		const paid = invoices.filter((inv) => inv.status === 'paid').length
		const partiallyPaid = invoices.filter((inv) => inv.status === 'partially_paid').length
		const overdue = invoices.filter((inv) => inv.status === 'overdue').length
		const draft = invoices.filter((inv) => inv.status === 'draft').length

		const outstandingAmount = invoices
			.filter((inv) => inv.status === 'unpaid' || inv.status === 'partially_paid')
			.reduce((sum, inv) => sum + inv.amount, 0)

		const pastDueAmount = invoices
			.filter((inv) => inv.status === 'overdue')
			.reduce((sum, inv) => sum + inv.amount, 0)

		const paidAmount = invoices
			.filter((inv) => inv.status === 'paid')
			.reduce((sum, inv) => sum + inv.amount, 0)

		return {
			totalInvoices,
			unpaid,
			paid,
			partiallyPaid,
			overdue,
			draft,
			outstandingAmount,
			pastDueAmount,
			paidAmount,
		}
	}, [invoices])

	// Format currency in Indian Rupees
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			minimumFractionDigits: 2,
		}).format(amount)
	}

	// Render status badge
	const renderStatus = (status: string) => {
		const statusConfig: Record<string, { label: string; color: 'yellow' | 'green' | 'red' | 'blue' | 'gray' }> = {
			paid: { label: 'Paid', color: 'green' },
			partially_paid: { label: 'Partially Paid', color: 'yellow' },
			unpaid: { label: 'Unpaid', color: 'red' },
			overdue: { label: 'Overdue', color: 'red' },
			cancelled: { label: 'Cancelled', color: 'gray' },
			draft: { label: 'Draft', color: 'gray' },
		}

		const config = statusConfig[status] || { label: status, color: 'gray' }
		return (
			<Badge
				size="2"
				variant="solid"
				color={config.color}
				style={{
					textTransform: 'capitalize',
				}}
			>
				{config.label}
			</Badge>
		)
	}

	// Render tags
	const renderTags = (tags: string[]) => {
		return (
			<Flex gap="1" wrap="wrap">
				{tags.map((tag, index) => (
					<Badge
						key={index}
						size="1"
						variant="soft"
						style={{
							fontSize: '11px',
							padding: '2px 8px',
						}}
					>
						{tag}
					</Badge>
				))}
			</Flex>
		)
	}

	// Render actions dropdown
	const renderActions = (invoice: InvoiceData) => {
		return (
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<IconButton variant="ghost" size="2">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<circle cx="8" cy="3" r="1" fill="currentColor" />
							<circle cx="8" cy="8" r="1" fill="currentColor" />
							<circle cx="8" cy="13" r="1" fill="currentColor" />
						</svg>
					</IconButton>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onClick={() => handleView(invoice)}>
						<Flex align="center" gap="2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path
									d="M8 3C5 3 2.5 5.5 1 8C2.5 10.5 5 13 8 13C11 13 13.5 10.5 15 8C13.5 5.5 11 3 8 3Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="8" cy="8" r="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<Text size="2">View</Text>
						</Flex>
					</DropdownMenu.Item>
					<DropdownMenu.Item onClick={() => handleEdit(invoice)}>
						<Flex align="center" gap="2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path
									d="M11.5 2.5L13.5 4.5L4.5 13.5H2.5V11.5L11.5 2.5Z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<Text size="2">Edit</Text>
						</Flex>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item color="red" onClick={() => handleDelete(invoice)}>
						<Flex align="center" gap="2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path
									d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5Z"
									fill="currentColor"
								/>
								<path
									d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z"
									fill="currentColor"
								/>
							</svg>
							<Text size="2">Delete</Text>
						</Flex>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		)
	}

	// Filter and sort data
	const filteredAndSortedData = useMemo(() => {
		let filtered = invoices.filter((invoice) => {
			const searchLower = searchQuery.toLowerCase()
			return (
				invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
				invoice.customer.toLowerCase().includes(searchLower) ||
				invoice.location.toLowerCase().includes(searchLower) ||
				invoice.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
				invoice.gst.toLowerCase().includes(searchLower) ||
				invoice.b2bDeal.toLowerCase().includes(searchLower)
			)
		})

		if (sortConfig && sortConfig.direction) {
			filtered = [...filtered].sort((a, b) => {
				const aValue = a[sortConfig.key as keyof InvoiceData]
				const bValue = b[sortConfig.key as keyof InvoiceData]

				if (aValue === undefined || aValue === null) return 1
				if (bValue === undefined || bValue === null) return -1

				if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
				}

				const aStr = String(aValue)
				const bStr = String(bValue)
				return sortConfig.direction === 'asc'
					? aStr.localeCompare(bStr)
					: bStr.localeCompare(aStr)
			})
		}

		return filtered
	}, [invoices, searchQuery, sortConfig])

	// Pagination
	const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedData = filteredAndSortedData.slice(startIndex, endIndex)

	const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
		setSortConfig(direction ? { key: columnKey, direction } : null)
		setCurrentPage(1)
	}

	const handleView = (invoice: InvoiceData) => {
		// Navigate to invoice detail page or open modal
		console.log('View invoice:', invoice)
	}

	const handleEdit = (invoice: InvoiceData) => {
		// Open edit form
		console.log('Edit invoice:', invoice)
	}

	const handleDelete = (invoice: InvoiceData) => {
		setDialogConfig({
			title: 'Delete Invoice',
			description: `Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
			actionText: 'Delete',
			cancelText: 'Cancel',
			color: 'red',
			onConfirm: () => {
				setInvoices(invoices.filter((inv) => inv.id !== invoice.id))
				setDialogOpen(false)
			},
		})
		setDialogOpen(true)
	}

	const handleCreateNew = () => {
		// Open create invoice form
		console.log('Create new invoice')
	}

	const handleBatchPayments = () => {
		// Open batch payments modal
		console.log('Batch payments')
	}

	const handleRecurringInvoices = () => {
		// Navigate to recurring invoices
		console.log('Recurring invoices')
	}

	const handleExport = () => {
		// Export invoices
		console.log('Export invoices')
	}

	// Define table columns - ALL columns from both images
	const columns = [
		{
			key: 'invoiceNumber',
			label: 'Invoice #',
			width: '200px',
			sortable: true,
			render: (row: InvoiceData) => (
				<Text
					style={{
						color: 'var(--accent-11)',
						cursor: 'pointer',
						textDecoration: 'none',
					}}
					onClick={() => handleView(row)}
				>
					{row.invoiceNumber}
				</Text>
			),
		},
		{
			key: 'amount',
			label: 'Amount',
			width: '150px',
			sortable: true,
			render: (row: InvoiceData) => (
				<Text weight="medium">{formatCurrency(row.amount)}</Text>
			),
		},
		{
			key: 'totalTax',
			label: 'Total Tax',
			width: '130px',
			sortable: true,
			render: (row: InvoiceData) => formatCurrency(row.totalTax),
		},
		{
			key: 'date',
			label: 'Date',
			width: '120px',
			sortable: true,
		},
		{
			key: 'customer',
			label: 'Customer',
			width: '180px',
			sortable: true,
			render: (row: InvoiceData) => (
				<Text
					style={{
						color: 'var(--accent-11)',
						cursor: 'pointer',
						textDecoration: 'none',
					}}
					onClick={() => handleView(row)}
				>
					{row.customer}
				</Text>
			),
		},
		{
			key: 'project',
			label: 'Project',
			width: '120px',
			sortable: true,
			render: (row: InvoiceData) => (
				<Text style={{ color: row.project ? 'var(--gray-12)' : 'var(--gray-9)' }}>
					{row.project || '-'}
				</Text>
			),
		},
		{
			key: 'tags',
			label: 'Tags',
			width: '300px',
			sortable: false,
			render: (row: InvoiceData) => renderTags(row.tags),
		},
		{
			key: 'dueDate',
			label: 'Due Date',
			width: '120px',
			sortable: true,
		},
		{
			key: 'status',
			label: 'Status',
			width: '140px',
			sortable: true,
			render: (row: InvoiceData) => renderStatus(row.status),
		},
		{
			key: 'tripStartingDate',
			label: 'Trip Starting Date',
			width: '150px',
			sortable: true,
		},
		{
			key: 'location',
			label: 'Location',
			width: '200px',
			sortable: true,
		},
		{
			key: 'b2bDeal',
			label: 'B2B DEAL',
			width: '120px',
			sortable: true,
			render: (row: InvoiceData) => (
				<Text style={{ color: row.b2bDeal ? 'var(--gray-12)' : 'var(--gray-9)' }}>
					{row.b2bDeal || '-'}
				</Text>
			),
		},
		{
			key: 'gst',
			label: 'GST',
			width: '180px',
			sortable: true,
		},
		{
			key: 'actions',
			label: '',
			width: '60px',
			sortable: false,
			render: (row: InvoiceData) => renderActions(row),
		},
	]

	const tableRows = paginatedData.map((invoice) => ({
		...invoice,
	}))

	return (
		<Box style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
			{/* Quick Stats Section - Toggleable */}
			{showQuickStats && (
				<Card style={{ marginBottom: '24px', padding: '24px' }}>
					{/* Header with Year Selector */}
					<Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
						<Select.Root value={selectedYear} onValueChange={setSelectedYear}>
							<Select.Trigger style={{ width: '100px' }} />
							<Select.Content>
								<Select.Item value="2025">2025</Select.Item>
								<Select.Item value="2024">2024</Select.Item>
								<Select.Item value="2023">2023</Select.Item>
							</Select.Content>
						</Select.Root>
						<IconButton variant="ghost" size="2" onClick={() => setShowQuickStats(false)}>
							<X size={16} />
						</IconButton>
					</Flex>

					{/* Financial Overview Cards */}
					<Flex gap="4" wrap="wrap" style={{ marginBottom: '24px' }}>
						<Card style={{ flex: 1, minWidth: '200px', padding: '20px' }}>
							<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '8px' }}>
								Outstanding Invoices
							</Text>
							<Text size="6" weight="bold" style={{ color: '#FF6B35' }}>
								{formatCurrency(stats.outstandingAmount)}
							</Text>
						</Card>
						<Card style={{ flex: 1, minWidth: '200px', padding: '20px' }}>
							<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '8px' }}>
								Past Due Invoices
							</Text>
							<Text size="6" weight="bold" style={{ color: 'var(--accent-11)' }}>
								{formatCurrency(stats.pastDueAmount)}
							</Text>
						</Card>
						<Card style={{ flex: 1, minWidth: '200px', padding: '20px' }}>
							<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '8px' }}>
								Paid Invoices
							</Text>
							<Text size="6" weight="bold" style={{ color: 'var(--green-11)' }}>
								{formatCurrency(stats.paidAmount)}
							</Text>
						</Card>
					</Flex>

					{/* Invoice Status Breakdown */}
					<Flex gap="3" wrap="wrap">
						{/* Unpaid */}
						<Card
							style={{
								flex: 1,
								minWidth: '180px',
								padding: '16px',
								borderLeft: '4px solid var(--red-9)',
							}}
						>
							<Flex justify="between" align="center">
								<Box>
									<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '4px' }}>
										Unpaid
									</Text>
									<Text size="4" weight="bold" style={{ color: 'var(--red-11)' }}>
										{stats.unpaid} / {stats.totalInvoices}
									</Text>
									<Text size="1" style={{ color: 'var(--gray-10)' }}>
										{stats.totalInvoices > 0 ? ((stats.unpaid / stats.totalInvoices) * 100).toFixed(2) : '0.00'}%
									</Text>
								</Box>
								<Button variant="ghost" size="1">
									View
								</Button>
							</Flex>
						</Card>

						{/* Paid */}
						<Card
							style={{
								flex: 1,
								minWidth: '180px',
								padding: '16px',
								borderLeft: '4px solid var(--green-9)',
							}}
						>
							<Flex justify="between" align="center">
								<Box>
									<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '4px' }}>
										Paid
									</Text>
									<Text size="4" weight="bold" style={{ color: 'var(--green-11)' }}>
										{stats.paid} / {stats.totalInvoices}
									</Text>
									<Text size="1" style={{ color: 'var(--gray-10)' }}>
										{stats.totalInvoices > 0 ? ((stats.paid / stats.totalInvoices) * 100).toFixed(2) : '0.00'}%
									</Text>
								</Box>
								<Button variant="ghost" size="1">
									View
								</Button>
							</Flex>
						</Card>

						{/* Partially Paid */}
						<Card
							style={{
								flex: 1,
								minWidth: '180px',
								padding: '16px',
								borderLeft: '4px solid #FF6B35',
							}}
						>
							<Flex justify="between" align="center">
								<Box>
									<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '4px' }}>
										Partially Paid
									</Text>
									<Text size="4" weight="bold" style={{ color: '#FF6B35' }}>
										{stats.partiallyPaid} / {stats.totalInvoices}
									</Text>
									<Text size="1" style={{ color: 'var(--gray-10)' }}>
										{stats.totalInvoices > 0 ? ((stats.partiallyPaid / stats.totalInvoices) * 100).toFixed(2) : '0.00'}%
									</Text>
								</Box>
								<Button variant="ghost" size="1">
									View
								</Button>
							</Flex>
						</Card>

						{/* Overdue */}
						<Card
							style={{
								flex: 1,
								minWidth: '180px',
								padding: '16px',
								borderLeft: '4px solid var(--accent-9)',
							}}
						>
							<Flex justify="between" align="center">
								<Box>
									<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '4px' }}>
										Overdue
									</Text>
									<Text size="4" weight="bold" style={{ color: 'var(--accent-11)' }}>
										{stats.overdue} / {stats.totalInvoices}
									</Text>
									<Text size="1" style={{ color: 'var(--gray-10)' }}>
										{stats.totalInvoices > 0 ? ((stats.overdue / stats.totalInvoices) * 100).toFixed(2) : '0.00'}%
									</Text>
								</Box>
								<Button variant="ghost" size="1">
									View
								</Button>
							</Flex>
						</Card>

						{/* Draft */}
						<Card
							style={{
								flex: 1,
								minWidth: '180px',
								padding: '16px',
								borderLeft: '4px solid var(--gray-8)',
							}}
						>
							<Flex justify="between" align="center">
								<Box>
									<Text size="2" style={{ color: 'var(--gray-11)', marginBottom: '4px' }}>
										Draft
									</Text>
									<Text size="4" weight="bold" style={{ color: 'var(--gray-11)' }}>
										{stats.draft} / {stats.totalInvoices}
									</Text>
									<Text size="1" style={{ color: 'var(--gray-10)' }}>
										{stats.totalInvoices > 0 ? ((stats.draft / stats.totalInvoices) * 100).toFixed(2) : '0.00'}%
									</Text>
								</Box>
								<Button variant="ghost" size="1">
									View
								</Button>
							</Flex>
						</Card>
					</Flex>
				</Card>
			)}

			{/* Top Action Buttons */}
			<Flex
				direction="column"
				gap="4"
				style={{
					marginBottom: '24px',
				}}
			>
				<Flex justify="between" align="center" wrap="wrap" gap="3">
					<Flex gap="3" wrap="wrap">
						<Button
							size="3"
							variant="soft"
							onClick={handleCreateNew}
							style={{ cursor: 'pointer' }}
						>
							<Plus size={16} />
							Create New Invoice
						</Button>
						<Button
							size="3"
							variant="soft"
							onClick={handleBatchPayments}
							style={{ cursor: 'pointer' }}
						>
							<CreditCard size={16} />
							Batch Payments
						</Button>
						<Button
							size="3"
							variant="ghost"
							onClick={handleRecurringInvoices}
							style={{ cursor: 'pointer' }}
						>
							<RefreshCw size={16} />
							Recurring Invoices
						</Button>
					</Flex>
					<Flex gap="2">
						<IconButton variant="ghost" size="3">
							<ChevronsLeft size={16} />
						</IconButton>
						<IconButton variant="ghost" size="3">
							<ChevronLeft size={16} />
						</IconButton>
						<IconButton variant="ghost" size="3" style={{ border: '1px solid var(--accent-9)' }}>
							<List size={16} />
						</IconButton>
						<IconButton variant="ghost" size="3">
							<ChevronDown size={16} />
						</IconButton>
					</Flex>
				</Flex>
			</Flex>

			{/* Table Card */}
			<Card style={{ padding: '0' }}>
				{/* Table Controls */}
				<Flex
					justify="between"
					align="center"
					wrap="wrap"
					gap="3"
					style={{
						padding: '16px 24px',
						borderBottom: '1px solid var(--gray-6)',
					}}
				>
					<Flex gap="3" align="center" wrap="wrap">
						<Select.Root
							value={itemsPerPage.toString()}
							onValueChange={(value) => {
								setItemsPerPage(Number(value))
								setCurrentPage(1)
							}}
						>
							<Select.Trigger style={{ width: '80px' }} />
							<Select.Content>
								<Select.Item value="10">10</Select.Item>
								<Select.Item value="25">25</Select.Item>
								<Select.Item value="50">50</Select.Item>
								<Select.Item value="100">100</Select.Item>
							</Select.Content>
						</Select.Root>
						<Button variant="ghost" size="2" onClick={handleExport}>
							<Download size={16} />
							Export
						</Button>
						<IconButton variant="ghost" size="2">
							<RefreshCw size={16} />
						</IconButton>
					</Flex>
					<Flex gap="2" align="center" wrap="wrap">
						<Flex gap="2" style={{ flex: 1, maxWidth: '400px' }}>
							<TextField.Root
								placeholder="Search.."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value)
									setCurrentPage(1)
								}}
								style={{ flex: 1 }}
							>
								<TextField.Slot>
									<Search size={16} />
								</TextField.Slot>
							</TextField.Root>
						</Flex>
						<Button
							variant="soft"
							size="2"
							onClick={() => setShowQuickStats(!showQuickStats)}
						>
							<BarChart3 size={16} />
							View Quick Stats
						</Button>
					</Flex>
				</Flex>

				{/* Table */}
				<Box style={{ overflowX: 'auto' }}>
					<Table
						columns={columns}
						rows={tableRows}
						onSort={handleSort}
						sortConfig={sortConfig ? { key: sortConfig.key, direction: sortConfig.direction || 'asc' } : undefined}
					/>
				</Box>

				{/* Pagination */}
				{totalPages > 1 && (
					<Flex
						justify="between"
						align="center"
						wrap="wrap"
						gap="3"
						style={{
							padding: '16px 24px',
							borderTop: '1px solid var(--gray-6)',
						}}
					>
						<Text size="2" style={{ color: 'var(--gray-11)' }}>
							Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of{' '}
							{filteredAndSortedData.length} invoices
						</Text>
						<Flex gap="2" align="center">
							<Button
								variant="ghost"
								size="2"
								onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
								disabled={currentPage === 1}
							>
								Previous
							</Button>
							<Text size="2">
								Page {currentPage} of {totalPages}
							</Text>
							<Button
								variant="ghost"
								size="2"
								onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
								disabled={currentPage === totalPages}
							>
								Next
							</Button>
						</Flex>
					</Flex>
				)}
			</Card>

			{/* Chat Icon (Fixed Bottom Right) */}
			<Box
				style={{
					position: 'fixed',
					bottom: '24px',
					right: '24px',
					width: '56px',
					height: '56px',
					borderRadius: '50%',
					backgroundColor: 'var(--accent-9)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					zIndex: 1000,
				}}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="2"
				>
					<path
						d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Box>

			{/* Delete Confirmation Dialog */}
			<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
				<AlertDialog.Content style={{ maxWidth: '450px' }}>
					<AlertDialog.Title>{dialogConfig?.title}</AlertDialog.Title>
					<AlertDialog.Description size="2">
						{dialogConfig?.description}
					</AlertDialog.Description>
					<Flex gap="3" mt="4" justify="end">
						<AlertDialog.Cancel>
							<Button variant="soft" color="gray">
								{dialogConfig?.cancelText || 'Cancel'}
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action>
							<Button
								variant="solid"
								color={dialogConfig?.color || 'red'}
								onClick={dialogConfig?.onConfirm}
							>
								{dialogConfig?.actionText}
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Box>
	)
}

export default Invoice