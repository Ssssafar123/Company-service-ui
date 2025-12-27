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
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../../store'
import {
  fetchInvoices,
  deleteInvoiceById,
} from '../../../features/InvoiceSlice'
import Table from '../../../components/dynamicComponents/Table'

const Invoice: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { invoices, pagination, ui } = useSelector(
    (state: RootState) => state.invoice
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchInvoices())
  }, [dispatch, currentPage, itemsPerPage])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)

  const renderStatus = (status: string) => {
    const colors: any = {
      paid: 'green',
      unpaid: 'red',
      partially_paid: 'yellow',
      overdue: 'red',
      draft: 'gray',
      cancelled: 'gray',
    }
    return (
      <Badge variant="solid" color={colors[status] || 'gray'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [invoices, searchQuery])

  const handleDelete = (invoice: any) => {
    setDialogConfig({
      title: 'Delete Invoice',
      description: `Delete invoice ${invoice.invoiceNumber}?`,
      actionText: 'Delete',
      onConfirm: () => {
        dispatch(deleteInvoiceById(invoice.id))
        setDialogOpen(false)
      },
    })
    setDialogOpen(true)
  }

  const columns = [
  {
    key: 'invoiceNumber',
    label: 'Invoice #',
    width: '160px',
    render: (row: any) => (
      <Text
        color="blue"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate('/dashboard/addInvoice', { state: { invoiceData: row } })
        }
      >
        {row.invoiceNumber}
      </Text>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    width: '120px',
    render: (row: any) => formatCurrency(row.amount),
  },
  {
    key: 'totalTax',
    label: 'Tax',
    width: '120px',
    render: (row: any) => formatCurrency(row.totalTax),
  },
  {
    key: 'date',
    label: 'Date',
    width: '130px',
  },
  {
    key: 'customer',
    label: 'Customer',
    width: '200px',
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    width: '130px',
  },
  {
    key: 'status',
    label: 'Status',
    width: '120px',
    render: (row: any) => renderStatus(row.status),
  },
  {
    key: 'actions',
    label: '',
    width: '80px',
    render: (row: any) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost">⋮</IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={() =>
              navigate('/dashboard/addInvoice', {
                state: { invoiceData: row },
              })
            }
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item color="red" onClick={() => handleDelete(row)}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ),
  },
]


  return (
    <Box p="4">
      <Flex justify="between" mb="4">
        <Text size="7" weight="bold">
          Invoices
        </Text>
        <Button onClick={() => navigate('/dashboard/addInvoice')}>
          <Plus size={16} /> Create Invoice
        </Button>
      </Flex>

      <Card>
        <Flex p="3" justify="between">
          <TextField.Root
            placeholder="Search invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>

          <Select.Root
            value={itemsPerPage.toString()}
            onValueChange={(v) => setItemsPerPage(Number(v))}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="10">10</Select.Item>
              <Select.Item value="25">25</Select.Item>
              <Select.Item value="50">50</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Table columns={columns} rows={filteredInvoices} />

        <Flex justify="between" p="3">
          <Text>
            Page {pagination.page} of {pagination.totalPages}
          </Text>
          <Flex gap="2">
            <Button
              disabled={pagination.page === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Card>

      <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>{dialogConfig?.title}</AlertDialog.Title>
          <AlertDialog.Description>
            {dialogConfig?.description}
          </AlertDialog.Description>
          <Flex justify="end" gap="3" mt="4">
            <AlertDialog.Cancel>
              <Button variant="soft">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={dialogConfig?.onConfirm}>
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
