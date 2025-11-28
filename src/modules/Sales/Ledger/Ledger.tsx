import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
	Box,
	Flex,
	Text,
	TextField,
	Button,
	Card,
	Dialog,
	Select,
	IconButton,
	Table,
	Badge,
} from '@radix-ui/themes'
import { Plus, Download, Upload, RotateCcw, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import TableComponent from '../../../components/dynamicComponents/Table'

// ============================================================================
// TYPES
// ============================================================================

type Transaction = {
	id: number
	date: string // 'YYYY-MM-DD'
	description: string
	category: string
	type: 'debit' | 'credit'
	amount: number
}

type SortConfig = {
	key: 'date' | 'amount'
	direction: 'asc' | 'desc'
} | null

// ============================================================================
// STORAGE KEY & SAMPLE DATA
// ============================================================================

const STORAGE_KEY = 'tour_ledger_v1'

const sampleTransactions: Transaction[] = [
	{
		id: 1,
		date: '2024-01-15',
		description: 'Hotel booking payment - Manali trip',
		category: 'Accommodation',
		type: 'debit',
		amount: 25000,
	},
	{
		id: 2,
		date: '2024-01-20',
		description: 'Customer payment - Group tour booking',
		category: 'Revenue',
		type: 'credit',
		amount: 45000,
	},
	{
		id: 3,
		date: '2024-02-01',
		description: 'Transportation cost - Bus rental',
		category: 'Transport',
		type: 'debit',
		amount: 15000,
	},
	{
		id: 4,
		date: '2024-02-05',
		description: 'Customer payment - Individual booking',
		category: 'Revenue',
		type: 'credit',
		amount: 18000,
	},
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Ledger: React.FC = () => {
	// State
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all')
	const [categoryFilter, setCategoryFilter] = useState<string>('all')
	const [sortConfig, setSortConfig] = useState<SortConfig>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [perPage, setPerPage] = useState(10)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Load from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			try {
				const parsed = JSON.parse(stored)
				if (Array.isArray(parsed) && parsed.length > 0) {
					setTransactions(parsed)
				} else {
					setTransactions(sampleTransactions)
					localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions))
				}
			} catch {
				setTransactions(sampleTransactions)
				localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions))
			}
		} else {
			setTransactions(sampleTransactions)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions))
		}
	}, [])

	// Save to localStorage on every change
	useEffect(() => {
		if (transactions.length > 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
		}
	}, [transactions])

	// Get unique categories from transactions
	const categories = useMemo(() => {
		const cats = new Set(transactions.map((t) => t.category))
		return Array.from(cats).sort()
	}, [transactions])

	// Filter and sort transactions
	const filteredAndSorted = useMemo(() => {
		let filtered = [...transactions]

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(t) =>
					t.description.toLowerCase().includes(query) ||
					t.category.toLowerCase().includes(query) ||
					t.date.includes(query) ||
					t.amount.toString().includes(query)
			)
		}

		// Date filter
		if (dateFrom) {
			filtered = filtered.filter((t) => t.date >= dateFrom)
		}
		if (dateTo) {
			filtered = filtered.filter((t) => t.date <= dateTo)
		}

		// Type filter
		if (typeFilter !== 'all') {
			filtered = filtered.filter((t) => t.type === typeFilter)
		}

		// Category filter
		if (categoryFilter !== 'all') {
			filtered = filtered.filter((t) => t.category === categoryFilter)
		}

		// Sort
		if (sortConfig) {
			filtered.sort((a, b) => {
				if (sortConfig.key === 'date') {
					const dateA = new Date(a.date).getTime()
					const dateB = new Date(b.date).getTime()
					return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
				} else {
					return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
				}
			})
		}

		return filtered
	}, [transactions, searchQuery, dateFrom, dateTo, typeFilter, categoryFilter, sortConfig])

	// Calculate running balance (globally, sorted by date ascending)
	const runningBalances = useMemo(() => {
		const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		const balances = new Map<number, number>()
		let running = 0

		sorted.forEach((t) => {
			if (t.type === 'credit') {
				running += t.amount
			} else {
				running -= t.amount
			}
			balances.set(t.id, running)
		})

		return balances
	}, [transactions])

	// Pagination
	const totalPages = Math.ceil(filteredAndSorted.length / perPage)
	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * perPage
		return filteredAndSorted.slice(start, start + perPage)
	}, [filteredAndSorted, currentPage, perPage])

	// Totals for filtered set
	const totals = useMemo(() => {
		const credits = filteredAndSorted.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)
		const debits = filteredAndSorted.filter((t) => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)
		return {
			credit: credits,
			debit: debits,
			net: credits - debits,
		}
	}, [filteredAndSorted])

	// Handlers
	const handleAdd = () => {
		setEditingTransaction(null)
		setIsDialogOpen(true)
	}

	const handleEdit = (transaction: Transaction) => {
		setEditingTransaction(transaction)
		setIsDialogOpen(true)
	}

	const handleDelete = (id: number) => {
		// TODO: Replace with Radix AlertDialog for better UX
		if (window.confirm('Are you sure you want to delete this transaction?')) {
			setTransactions((prev) => prev.filter((t) => t.id !== id))
			if (paginatedData.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1)
			}
		}
	}

	const handleSave = (formData: Omit<Transaction, 'id'>) => {
		if (editingTransaction) {
			setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? { ...formData, id: editingTransaction.id } : t)))
		} else {
			const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1
			setTransactions((prev) => [...prev, { ...formData, id: newId }])
		}
		setIsDialogOpen(false)
		setEditingTransaction(null)
	}

	const handleSort = (key: 'date' | 'amount') => {
		setSortConfig((prev) => {
			if (prev?.key === key) {
				if (prev.direction === 'desc') {
					return null
				}
				return { key, direction: 'desc' }
			}
			return { key, direction: 'asc' }
		})
	}

	const handleExportCSV = () => {
		const headers = ['id', 'date', 'description', 'category', 'type', 'amount']
		const rows = filteredAndSorted.map((t) => [t.id, t.date, t.description, t.category, t.type, t.amount].join(','))
		const csv = [headers.join(','), ...rows].join('\n')
		const blob = new Blob([csv], { type: 'text/csv' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `ledger_${new Date().toISOString().slice(0, 10)}.csv`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			const text = e.target?.result as string
			const lines = text.split('\n').filter((line) => line.trim())
			if (lines.length < 2) {
				alert('Invalid CSV file')
				return
			}

			const dataLines = lines.slice(1)
			let imported = 0
			let skipped = 0
			const newTransactions: Transaction[] = []

			// TODO: Replace with robust CSV parser (e.g., Papa Parse) for production
			dataLines.forEach((line) => {
				const cols = line.split(',').map((col) => col.trim().replace(/^"|"$/g, ''))
				if (cols.length < 5) {
					skipped++
					return
				}

				const id = cols[0] ? parseInt(cols[0], 10) : null
				const date = cols[1] || cols[0]
				const description = cols[2] || cols[1]
				const category = cols[3] || cols[2]
				const type = (cols[4] || cols[3])?.toLowerCase()
				const amount = parseFloat(cols[5] || cols[4] || '0')

				if (!date || !description || !category || (type !== 'debit' && type !== 'credit') || isNaN(amount) || amount <= 0) {
					skipped++
					return
				}

				const finalId = id && !isNaN(id) ? id : Math.max(...transactions.map((t) => t.id), 0) + newTransactions.length + 1

				newTransactions.push({
					id: finalId,
					date: date.slice(0, 10),
					description,
					category,
					type: type as 'debit' | 'credit',
					amount,
				})
				imported++
			})

			if (newTransactions.length > 0) {
				setTransactions((prev) => [...prev, ...newTransactions])
				alert(`Imported ${imported} rows, skipped ${skipped} invalid rows`)
			} else {
				alert(`No valid rows imported. Skipped ${skipped} invalid rows`)
			}

			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
		reader.readAsText(file)
	}

	const handleReset = () => {
		if (window.confirm('Are you sure you want to reset to sample data? This will replace all current transactions.')) {
			setTransactions(sampleTransactions)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions))
		}
	}

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1)
	}, [searchQuery, dateFrom, dateTo, typeFilter, categoryFilter])

	// Table columns
	const columns = useMemo(
		() => [
			{ key: 'date', label: 'Date', width: '120px', sortable: true },
			{ key: 'description', label: 'Description', width: '300px', sortable: false },
			{ key: 'category', label: 'Category', width: '150px', sortable: false },
			{ key: 'type', label: 'Type', width: '100px', sortable: false },
			{ key: 'amount', label: 'Amount', width: '150px', sortable: true },
			{ key: 'balance', label: 'Running Balance', width: '150px', sortable: false },
			{ key: 'actions', label: 'Actions', width: '100px', sortable: false },
		],
		[]
	)

	// Table rows
	const tableRows = useMemo(() => {
		return paginatedData.map((transaction) => {
			const balance = runningBalances.get(transaction.id) ?? 0
			return {
				id: transaction.id,
				date: new Date(transaction.date).toLocaleDateString('en-IN'),
				description: transaction.description,
				category: transaction.category,
				type: transaction.type,
				amount: transaction.amount,
				balance: balance,
			}
		})
	}, [paginatedData, runningBalances])

	return (
		<Box style={{ padding: '24px' }}>
			{/* Header / Toolbar */}
			<Card mb="6">
				<Flex direction="column" gap="4" p="4">
					<Flex align="center" justify="between" wrap="wrap" gap="4">
						<Text size="7" weight="bold">
							Tour Ledger
						</Text>
						<Flex gap="2" wrap="wrap">
							<Button onClick={handleAdd} size="3" variant="soft">
								<Plus />
								Add Transaction
							</Button>
							<Button onClick={handleExportCSV} size="3" variant="soft" color="green">
								<Download />
								Export CSV
							</Button>
                            <label style={{ cursor: 'pointer', display: 'inline-block' }}>
								<input
									ref={fileInputRef}
									type="file"
									accept=".csv"
									onChange={handleImportCSV}
									style={{ display: 'none' }}
								/>
								<Box
									as="span"
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										padding: '8px 16px',
										borderRadius: '6px',
										backgroundColor: 'var(--purple-3)',
										color: 'var(--purple-11)',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: '500',
									}}
								>
									<Upload size={16} />
									Import CSV
								</Box>
							</label>
							<Button onClick={handleReset} size="3" variant="soft" color="red">
								<RotateCcw />
								Reset
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Card>

			{/* Filters */}
			<Card mb="6">
				<Flex direction="column" gap="4" p="4">
					<Flex direction={{ initial: 'column', md: 'row' }} gap="4" wrap="wrap">
						<TextField.Root
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ flex: 1, minWidth: '200px' }}
						>
							<TextField.Slot>
								<Search size="16" />
							</TextField.Slot>
						</TextField.Root>

						<TextField.Root
							type="date"
							placeholder="From Date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							style={{ minWidth: '150px' }}
						/>

						<TextField.Root
							type="date"
							placeholder="To Date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							style={{ minWidth: '150px' }}
						/>

						<Flex gap="2">
							<Button
								variant={typeFilter === 'all' ? 'solid' : 'soft'}
								onClick={() => setTypeFilter('all')}
								size="3"
							>
								All
							</Button>
							<Button
								variant={typeFilter === 'credit' ? 'solid' : 'soft'}
								color="green"
								onClick={() => setTypeFilter('credit')}
								size="3"
							>
								Credit
							</Button>
							<Button
								variant={typeFilter === 'debit' ? 'solid' : 'soft'}
								color="red"
								onClick={() => setTypeFilter('debit')}
								size="3"
							>
								Debit
							</Button>
						</Flex>
					</Flex>

					<Flex direction={{ initial: 'column', md: 'row' }} gap="4" wrap="wrap">
						<Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
							<Select.Trigger placeholder="All Categories" style={{ minWidth: '200px' }} />
							<Select.Content>
								<Select.Item value="all">All Categories</Select.Item>
								{categories.map((cat) => (
									<Select.Item key={cat} value={cat}>
										{cat}
									</Select.Item>
								))}
							</Select.Content>
						</Select.Root>

						<Flex gap="2">
							<Button
								variant={sortConfig?.key === 'date' ? 'solid' : 'soft'}
								onClick={() => handleSort('date')}
								size="3"
							>
								Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
							</Button>
							<Button
								variant={sortConfig?.key === 'amount' ? 'solid' : 'soft'}
								onClick={() => handleSort('amount')}
								size="3"
							>
								Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Card>

			{/* Totals */}
			<Card mb="6">
				<Flex gap="4" wrap="wrap" p="4">
					<Box style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '16px', backgroundColor: 'var(--green-3)', borderRadius: '8px' }}>
						<Text size="2" color="gray">
							Credit Total
						</Text>
						<Text size="6" weight="bold" color="green">
							₹{totals.credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</Text>
					</Box>
					<Box style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '16px', backgroundColor: 'var(--red-3)', borderRadius: '8px' }}>
						<Text size="2" color="gray">
							Debit Total
						</Text>
						<Text size="6" weight="bold" color="red">
							₹{totals.debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</Text>
					</Box>
					<Box style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '16px', backgroundColor: 'var(--blue-3)', borderRadius: '8px' }}>
						<Text size="2" color="gray">
							Net
						</Text>
						<Text size="6" weight="bold" color={totals.net >= 0 ? 'green' : 'red'}>
							₹{totals.net.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</Text>
					</Box>
				</Flex>
			</Card>

			{/* Table */}
			<Card mb="6">
				<Box style={{ overflowX: 'auto' }}>
					<TableComponent
						columns={columns.map((col) => ({
							...col,
							render: col.key === 'type' 
								? (row: any) => (
										<Badge color={row.type === 'credit' ? 'green' : 'red'} variant="soft">
											{row.type}
										</Badge>
									)
								: col.key === 'amount'
								? (row: any) => (
										<Text align="right" weight="medium">
											{row.type === 'credit' ? '+' : '-'}₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</Text>
									)
								: col.key === 'balance'
								? (row: any) => (
										<Text align="right" weight="medium">
											₹{row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</Text>
									)
								: col.key === 'actions'
								? (row: any) => {
										const transaction = transactions.find((t) => t.id === row.id)
										return transaction ? (
											<Flex gap="2" justify="center">
												<IconButton
													size="2"
													variant="ghost"
													color="blue"
													onClick={() => handleEdit(transaction)}
												>
													<Edit2 size="16" />
												</IconButton>
												<IconButton
													size="2"
													variant="ghost"
													color="red"
													onClick={() => handleDelete(transaction.id)}
												>
													<Trash2 size="16" />
												</IconButton>
											</Flex>
										) : null
									}
								: undefined,
						}))}
						rows={tableRows}
						onSort={(key, direction) => {
							if (key === 'date' || key === 'amount') {
								handleSort(key)
							}
						}}
						sortConfig={sortConfig ? { key: sortConfig.key, direction: sortConfig.direction } : null}
					/>
				</Box>
			</Card>

			{/* Pagination */}
			<Card>
				<Flex align="center" justify="between" wrap="wrap" gap="4" p="4">
					<Flex align="center" gap="2">
						<Text size="2">Per page:</Text>
						<Select.Root
							value={perPage.toString()}
							onValueChange={(value) => {
								setPerPage(Number(value))
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
					</Flex>
					<Flex align="center" gap="2">
						<IconButton
							variant="soft"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						>
							<ChevronLeft />
						</IconButton>
						<Text size="2">
							Page {currentPage} / {totalPages || 1}
						</Text>
						<IconButton
							variant="soft"
							disabled={currentPage >= totalPages}
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						>
							<ChevronRight />
						</IconButton>
					</Flex>
				</Flex>
			</Card>

			{/* Add/Edit Dialog */}
			<Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<Dialog.Content style={{ maxWidth: 500 }}>
					<Dialog.Title>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</Dialog.Title>
					<TransactionForm transaction={editingTransaction} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
				</Dialog.Content>
			</Dialog.Root>

			{/* Footer Note */}
			<Box mt="6" style={{ textAlign: 'center' }}>
				<Text size="2" color="gray">
					Built for frontend demo — replace localStorage with secure backend & authentication for production.
				</Text>
			</Box>
		</Box>
	)
}

// ============================================================================
// TRANSACTION FORM COMPONENT
// ============================================================================

type TransactionFormProps = {
	transaction: Transaction | null
	onSave: (data: Omit<Transaction, 'id'>) => void
	onCancel: () => void
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSave, onCancel }) => {
	const [date, setDate] = useState(transaction?.date || new Date().toISOString().slice(0, 10))
	const [description, setDescription] = useState(transaction?.description || '')
	const [category, setCategory] = useState(transaction?.category || '')
	const [type, setType] = useState<'debit' | 'credit'>(transaction?.type || 'debit')
	const [amount, setAmount] = useState(transaction?.amount.toString() || '')

	const [availableCategories, setAvailableCategories] = useState<string[]>([])
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as Transaction[]
				const cats = new Set(parsed.map((t) => t.category))
				setAvailableCategories(Array.from(cats).sort())
			} catch {
				// Ignore
			}
		}
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!description.trim()) {
			alert('Description is required')
			return
		}
		const amountNum = parseFloat(amount)
		if (isNaN(amountNum) || amountNum <= 0) {
			alert('Amount must be greater than 0')
			return
		}
		if (!category.trim()) {
			alert('Category is required')
			return
		}

		onSave({
			date,
			description: description.trim(),
			category: category.trim(),
			type,
			amount: amountNum,
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<Flex direction="column" gap="4" mt="4">
				<Box>
					<Text size="2" weight="medium" mb="2" as="label" htmlFor="date">
						Date <Text color="red">*</Text>
					</Text>
					<TextField.Root
						id="date"
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
					/>
				</Box>

				<Box>
					<Text size="2" weight="medium" mb="2" as="label" htmlFor="description">
						Description <Text color="red">*</Text>
					</Text>
					<TextField.Root
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						placeholder="Enter transaction description"
					/>
				</Box>

				<Box>
					<Text size="2" weight="medium" mb="2" as="label" htmlFor="category">
						Category <Text color="red">*</Text>
					</Text>
					{availableCategories.length > 0 ? (
						<Select.Root value={category} onValueChange={setCategory}>
							<Select.Trigger id="category" placeholder="Select category" />
							<Select.Content>
								{availableCategories.map((cat) => (
									<Select.Item key={cat} value={cat}>
										{cat}
									</Select.Item>
								))}
							</Select.Content>
						</Select.Root>
					) : (
						<TextField.Root
							id="category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							placeholder="Enter category"
							required
						/>
					)}
				</Box>

				<Box>
					<Text size="2" weight="medium" mb="2">
						Type <Text color="red">*</Text>
					</Text>
					<Flex gap="2">
						<Button
							type="button"
							variant={type === 'credit' ? 'solid' : 'soft'}
							color="green"
							onClick={() => setType('credit')}
							style={{ flex: 1 }}
						>
							Credit
						</Button>
						<Button
							type="button"
							variant={type === 'debit' ? 'solid' : 'soft'}
							color="red"
							onClick={() => setType('debit')}
							style={{ flex: 1 }}
						>
							Debit
						</Button>
					</Flex>
				</Box>

				<Box>
					<Text size="2" weight="medium" mb="2" as="label" htmlFor="amount">
						Amount <Text color="red">*</Text>
					</Text>
					<TextField.Root
						id="amount"
						type="number"
						step="0.01"
						min="0.01"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
						placeholder="0.00"
					/>
				</Box>

				<Flex gap="2" mt="4">
					<Button type="button" variant="soft" onClick={onCancel} style={{ flex: 1 }}>
						Cancel
					</Button>
					<Button type="submit" style={{ flex: 1 }}>
						Save
					</Button>
				</Flex>
			</Flex>
		</form>
	)
}

export default Ledger