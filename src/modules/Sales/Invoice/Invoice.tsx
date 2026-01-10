import React, { useEffect, useMemo, useState } from 'react'
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
import {
  Search,
  Plus,
  CreditCard,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  X,
  ChevronsLeft,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../../store'
import {
  fetchInvoicesByPage,
  deleteInvoiceById,
  type Invoice as InvoiceType,
} from '../../../features/InvoiceSlice'
import Table from '../../../components/dynamicComponents/Table'
import './invoice.css'

type InvoiceData = {
  id: string
  invoiceNumber: string
  amount: number
  totalTax: number
  date: string
  customer: string
  project?: string
  tags?: string[]
  dueDate: string
  status: 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'draft' | 'cancelled'
  tripStartingDate?: string
  location?: string
  b2bDeal?: string
  gst?: string
  customerPhone?: string
  paidAmount?: number
  tripId?: string
}

// Helper function to convert display date (DD/MM/YYYY) to ISO format
const convertDisplayDateToISO = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString()
  // If already in ISO format or YYYY-MM-DD, try to parse it
  if (dateStr.includes('-')) {
    try {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    } catch (e) {
      // Continue to DD/MM/YYYY parsing
    }
  }
  // Convert DD/MM/YYYY to Date object then to ISO
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]
    const date = new Date(`${year}-${month}-${day}`)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  return new Date(dateStr).toISOString()
}

const Invoice: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { invoices, pagination, ui } = useSelector(
    (state: RootState) => state.invoice
  )

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(25)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogConfig, setDialogConfig] = useState<{
    title: string
    description: string
    actionText: string
    cancelText?: string
    onConfirm: () => void
    color?: 'red' | 'blue' | 'green' | 'gray'
  } | null>(null)

  // Fetch invoices on mount and when page/limit changes
  useEffect(() => {
    dispatch(fetchInvoicesByPage({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch, currentPage, itemsPerPage])

  // Map API invoices to component format (for display only)
  const mappedInvoices: InvoiceData[] = useMemo(() => {
    return invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber || '',
      amount: inv.amount || 0,
      totalTax: inv.totalTax || 0,
      date: inv.date ? new Date(inv.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
      customer: inv.customer || '',
      project: inv.project || '',
      tags: inv.tags || [],
      dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
      status: inv.status || 'draft',
      tripStartingDate: inv.tripStartingDate ? new Date(inv.tripStartingDate).toLocaleDateString('en-GB') : '',
      location: inv.location || '',
      b2bDeal: inv.b2bDeal || '',
      gst: inv.gst || '',
      customerPhone: inv.customerPhone || '',
      paidAmount: inv.paidAmount || 0,
      tripId: inv.itineraryId || inv.bookingId || '',
    }))
  }, [invoices])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)

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

  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return <Text size="2" color="gray">-</Text>
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

  const filteredInvoices = useMemo(() => {
    let filtered = mappedInvoices.filter((inv) => {
      if (!searchQuery.trim()) return true
      const searchLower = searchQuery.toLowerCase()
      return (
        inv.invoiceNumber.toLowerCase().includes(searchLower) ||
        inv.customer.toLowerCase().includes(searchLower) ||
        (inv.location || '').toLowerCase().includes(searchLower) ||
        (inv.tags || []).some((tag) => tag.toLowerCase().includes(searchLower)) ||
        (inv.gst || '').toLowerCase().includes(searchLower) ||
        (inv.b2bDeal || '').toLowerCase().includes(searchLower) ||
        (inv.customerPhone || '').toLowerCase().includes(searchLower)
      )
    })

    // Apply sorting
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
  }, [mappedInvoices, searchQuery, sortConfig])

  // Paginate filtered results
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredInvoices, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)

  const handleView = (invoice: InvoiceData) => {
    // Find original invoice from store
    const originalInvoice = invoices.find(inv => inv.id === invoice.id)
    if (originalInvoice) {
      navigate(`/dashboard/invoice/${invoice.id}`, { state: { invoiceData: originalInvoice } })
    } else {
      navigate(`/dashboard/invoice/${invoice.id}`, { state: { invoiceData: invoice } })
    }
  }

  const handleEdit = (invoice: InvoiceData) => {
    // ✅ FIX: Get original invoice from Redux store (has proper ISO date format)
    const originalInvoice = invoices.find(inv => inv.id === invoice.id)
    
    if (originalInvoice) {
      // Use original invoice with proper date formats
      navigate('/dashboard/addInvoice', {
        state: { 
          invoiceData: originalInvoice, // This has ISO dates from API
          isEdit: true 
        },
      })
    } else {
      // Fallback: Convert display dates back to ISO format
      console.warn('Invoice not found in store, converting dates...')
      const invoiceWithProperDates: InvoiceType = {
        ...invoice as any,
        date: invoice.date ? convertDisplayDateToISO(invoice.date) : new Date().toISOString(),
        dueDate: invoice.dueDate ? convertDisplayDateToISO(invoice.dueDate) : new Date().toISOString(),
        tripStartingDate: invoice.tripStartingDate ? convertDisplayDateToISO(invoice.tripStartingDate) : undefined,
      }
      navigate('/dashboard/addInvoice', {
        state: { 
          invoiceData: invoiceWithProperDates,
          isEdit: true 
        },
      })
    }
  }

  const handleDelete = async (invoice: InvoiceData) => {
    setDialogConfig({
      title: 'Delete Invoice',
      description: `Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
      actionText: 'Delete',
      cancelText: 'Cancel',
      color: 'red',
      onConfirm: async () => {
        try {
          await dispatch(deleteInvoiceById(invoice.id)).unwrap()
          dispatch(fetchInvoicesByPage({ page: currentPage, limit: itemsPerPage }))
          setDialogOpen(false)
        } catch (error: any) {
          alert(error.message || 'Failed to delete invoice')
          setDialogOpen(false)
        }
      },
    })
    setDialogOpen(true)
  }

  const handleBatchPayments = () => {
    // Handle batch payments functionality
    navigate('/dashboard/batchPayments')
  }

  const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig(direction ? { key: columnKey, direction } : null)
    setCurrentPage(1)
  }

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

  const columns = [
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
      key: 'invoiceNumber',
      label: 'Invoice #',
      width: '220px',
      sortable: true,
      render: (row: InvoiceData, rowIndex: number) => (
        <Box
          data-row-id={row.id}
          className="invoice-row-invoice-cell"
          onMouseEnter={() => setHoveredRowId(row.id)}
          onMouseLeave={() => setHoveredRowId(null)}
        >
          <Box
            style={{
              color: 'var(--accent-11)',
              cursor: 'pointer',
              textDecoration: 'none',
              marginBottom: '4px',
            }}
            onClick={() => handleView(row)}
          >
            {row.invoiceNumber}
          </Box>
          <Box
            className="invoice-row-actions"
            style={{
              display: hoveredRowId === row.id ? 'flex' : 'none',
              gap: '8px',
              alignItems: 'center',
              fontSize: '12px',
              marginTop: '4px',
            }}
          >
            <Text
              style={{
                color: 'var(--accent-11)',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 400,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleView(row)
              }}
            >
              View
            </Text>
            <Box
              style={{
                width: '1px',
                height: '12px',
                backgroundColor: 'var(--gray-8)',
              }}
            />
            <Text
              style={{
                color: 'var(--accent-11)',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 400,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(row)
              }}
            >
              Edit
            </Text>
          </Box>
        </Box>
      ),
    },
    {
      key: 'amount',
      label: 'Total Amount',
      width: '150px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text weight="medium">{formatCurrency(row.amount)}</Text>
      ),
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      width: '150px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text weight="medium">{formatCurrency(row.paidAmount || 0)}</Text>
      ),
    },
    {
      key: 'date',
      label: 'Date of Invoice',
      width: '140px',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
      width: '180px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text>{row.location || '-'}</Text>
      ),
    },
    {
      key: 'customerPhone',
      label: 'Contact',
      width: '150px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text>{row.customerPhone || '-'}</Text>
      ),
    },
    {
      key: 'tripStartingDate',
      label: 'Date of Trip',
      width: '150px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text>{row.tripStartingDate || '-'}</Text>
      ),
    },
    {
      key: 'tripId',
      label: 'Trip id',
      width: '150px',
      sortable: true,
      render: (row: InvoiceData) => (
        <Text>{row.tripId || '-'}</Text>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      width: '200px',
      sortable: false,
      render: (row: InvoiceData) => renderTags(row.tags),
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      sortable: true,
      render: (row: InvoiceData) => renderStatus(row.status),
    },
    {
      key: 'actions',
      label: '',
      width: '60px',
      sortable: false,
      render: (row: InvoiceData) => renderActions(row),
    },
  ]

  // Show loading state
  if (ui.loading && mappedInvoices.length === 0) {
    return (
      <Box style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
        <Text>Loading invoices...</Text>
      </Box>
    )
  }

  // Show error state
  if (ui.error && mappedInvoices.length === 0) {
    return (
      <Box style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
        <Text color="red">Error: {ui.error}</Text>
        <Button onClick={() => dispatch(fetchInvoicesByPage({ page: currentPage, limit: itemsPerPage }))}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
      <Flex justify="between" align="center" mb="4">
        <Box>
          <Text size="8" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}>
            Invoices
          </Text>
          <Text size="3" style={{ color: 'var(--accent-11)' }}>
            Manage your invoices and billing
          </Text>
        </Box>
        <Flex gap="2">
          <Button
            size="3"
            variant="soft"
            onClick={handleBatchPayments}
            style={{ cursor: 'pointer' }}
          >
            <CreditCard size={16} style={{ marginRight: '8px' }} />
            Batch Payments
          </Button>
          <Button
            size="3"
            onClick={() => navigate('/dashboard/addInvoice')}
            style={{ cursor: 'pointer' }}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Create New Invoice
          </Button>
        </Flex>
      </Flex>

      <Card style={{ padding: '0' }}>
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
            <Flex gap="2" style={{ flex: 1, maxWidth: '400px' }}>
              <TextField.Root
                placeholder="Search invoices..."
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
          </Flex>
          <Flex gap="2" align="center">
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
            <IconButton
              variant="ghost"
              size="2"
              onClick={() => dispatch(fetchInvoicesByPage({ page: currentPage, limit: itemsPerPage }))}
            >
              <RefreshCw size={16} />
            </IconButton>
          </Flex>
        </Flex>

        <Box className='invoice-table' style={{ overflowX: 'auto' }}>
          {ui.loading && mappedInvoices.length > 0 && (
            <Box style={{ padding: '16px', textAlign: 'center' }}>
              <Text size="2" color="blue">Refreshing...</Text>
            </Box>
          )}
          <Table
            columns={columns}
            rows={paginatedInvoices}
            onSort={handleSort}
            sortConfig={sortConfig ? { key: sortConfig.key, direction: sortConfig.direction || 'asc' } : undefined}
          />
        </Box>

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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{' '}
              {filteredInvoices.length} invoices
            </Text>
            <Flex gap="2" align="center">
              <Button
                variant="ghost"
                size="2"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || ui.loading}
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
                disabled={currentPage >= totalPages || ui.loading}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        )}
      </Card>

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