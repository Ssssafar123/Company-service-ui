import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState, AppDispatch } from '../../../store'

import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  AlertDialog,
  DropdownMenu,
  IconButton,
} from '@radix-ui/themes'

import { MoreVertical } from 'lucide-react'

import Table from '../../../components/dynamicComponents/Table'
import {
  fetchPayments,
  fetchPaymentById,
  deletePaymentById,
} from '../../../features/PaymentSlice'

/* ================= TYPES ================= */

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

type SortDirection = 'asc' | 'desc' | null

type ColumnConfig = {
  key: string
  label: string
  dropdownLabel: string
  width: string
  sortable: boolean
  render: (row: PaymentData) => React.ReactNode
}

/* ================= COMPONENT ================= */

const Payment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { payments, ui } = useSelector((state: RootState) => state.payment)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: SortDirection
  } | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null)

  /* ================= FETCH ================= */

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  /* ================= MAP DATA ================= */

  const tableRows: PaymentData[] = payments.map((p) => ({
    id: p.id,
    paymentId: p.paymentId,
    invoiceNumber: p.invoiceNumber,
    paymentMode: p.paymentMode,
    transactionId: p.transactionId,
    customer: p.customer,
    amount: p.amount,
    amountDisplay: `₹${p.amount.toLocaleString('en-IN')}`,
    date: new Date(p.date).toLocaleDateString(),
  }))

  /* ================= VIEW ================= */

  const handleView = async (id: string) => {
    const result = await dispatch(fetchPaymentById(id)).unwrap()

    setDialogContent(
      <Box>
        <Text><b>Payment ID:</b> {result.paymentId}</Text><br />
        <Text><b>Invoice #:</b> {result.invoiceNumber}</Text><br />
        <Text><b>Customer:</b> {result.customer}</Text><br />
        <Text><b>Amount:</b> ₹{result.amount}</Text><br />
        <Text><b>Payment Mode:</b> {result.paymentMode}</Text><br />
        <Text><b>Status:</b> {result.status}</Text><br />
        <Text><b>Date:</b> {new Date(result.date).toLocaleString()}</Text>
        {result.remarks && (
          <>
            <br />
            <Text><b>Remarks:</b> {result.remarks}</Text>
          </>
        )}
      </Box>
    )

    setDialogOpen(true)
  }

  /* ================= EDIT ================= */

  const handleEdit = (row: PaymentData) => {
    const payment = payments.find((p) => p.id === row.id)
    if (!payment) return

    navigate('/dashboard/payment/add', {
      state: {
        paymentData: payment,
      },
    })
  }

  /* ================= DELETE ================= */

  const handleDelete = (id: string) => {
    dispatch(deletePaymentById(id))
  }

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return tableRows
    const q = searchQuery.toLowerCase()

    return tableRows.filter(
      (p) =>
        p.paymentId.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q)
    )
  }, [searchQuery, tableRows])

  /* ================= SORT ================= */

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal: any = a[sortConfig.key as keyof PaymentData]
      const bVal: any = b[sortConfig.key as keyof PaymentData]

      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount
      }

      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredData, sortConfig])

  /* ================= COLUMNS ================= */

  const columns: ColumnConfig[] = [
    {
      key: 'paymentId',
      label: 'Payment',
      dropdownLabel: 'Payment',
      width: '130px',
      sortable: true,
      render: (row) => <Text weight="medium">{row.paymentId}</Text>,
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      dropdownLabel: 'Invoice',
      width: '200px',
      sortable: true,
      render: (row) => <Text>{row.invoiceNumber}</Text>,
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      dropdownLabel: 'Payment Mode',
      width: '180px',
      sortable: true,
      render: (row) => <Text>{row.paymentMode}</Text>,
    },
    {
      key: 'transactionId',
      label: 'Transaction ID',
      dropdownLabel: 'Transaction ID',
      width: '200px',
      sortable: true,
      render: (row) => <Text>{row.transactionId}</Text>,
    },
    {
      key: 'customer',
      label: 'Customer',
      dropdownLabel: 'Customer',
      width: '180px',
      sortable: true,
      render: (row) => <Text>{row.customer}</Text>,
    },
    {
      key: 'amount',
      label: 'Amount',
      dropdownLabel: 'Amount',
      width: '140px',
      sortable: true,
      render: (row) => <Text>{row.amountDisplay}</Text>,
    },
    {
      key: 'date',
      label: 'Date',
      dropdownLabel: 'Date',
      width: '120px',
      sortable: true,
      render: (row) => <Text>{row.date}</Text>,
    },
    {
      key: 'actions',
      label: '',
      dropdownLabel: 'Actions',
      width: '60px',
      sortable: false,
      render: (row) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="2">
              <MoreVertical size={16} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onClick={() => handleView(row.id)}>
              View Details
            </DropdownMenu.Item>

            <DropdownMenu.Item onClick={() => handleEdit(row)}>
              Edit Payment
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

            <DropdownMenu.Item
              color="red"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
  ]

  /* ================= RENDER ================= */

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Text size="7" weight="bold">
          Payments
        </Text>

        <Button onClick={() => navigate('/dashboard/payment/add')}>
          + Add Payment
        </Button>
      </Flex>

      <TextField.Root
        placeholder="Search payments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="3"
      />

      {ui.loading && <Text>Loading...</Text>}
      {ui.error && <Text color="red">{ui.error}</Text>}

      <Table
        columns={columns}
        rows={sortedData}
        onSort={(key, dir) =>
          setSortConfig(dir ? { key, direction: dir } : null)
        }
        sortConfig={sortConfig}
      />

      <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Content maxWidth="500px">
          <AlertDialog.Title>Payment Details</AlertDialog.Title>
          <AlertDialog.Description>
            {dialogContent}
          </AlertDialog.Description>
          <Flex justify="end" mt="4">
            <AlertDialog.Action>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  )
}

export default Payment
