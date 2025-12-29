import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
  fetchBatchesByPage,
  createBatch,
  updateBatchById,
  deleteBatchById,
  type Batch as BatchType,
} from '../../features/BatchSlice'
import { fetchItineraries } from '../../features/ItinerarySlice'
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
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'
import AddBatchForm from './AddBatchForm'

const Batches: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const batches = useSelector((state: RootState) => state.batch.batches)
  const pagination = useSelector((state: RootState) => state.batch.pagination)
  const loading = useSelector((state: RootState) => state.batch.ui.loading)
  const error = useSelector((state: RootState) => state.batch.ui.error)
  const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc' | null
  } | null>(null)

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      'id',
      'start_date',
      'end_date',
      'itinerary',
      'is_sold',
      'extra_amount',
      'actions',
    ])
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<BatchType | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<any>(null)

  /** Fetch data */
  useEffect(() => {
    dispatch(fetchBatchesByPage({ page: currentPage, limit: itemsPerPage }))
    dispatch(fetchItineraries())
  }, [dispatch, currentPage, itemsPerPage])

  /** Filter + Sort */
  const filteredAndSortedBatches = useMemo(() => {
    let data = batches

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.extra_reason?.toLowerCase().includes(q)
      )
    }

    if (sortConfig?.direction) {
      data = [...data].sort((a: any, b: any) => {
        const av = a[sortConfig.key]
        const bv = b[sortConfig.key]
        if (av === undefined) return 1
        if (bv === undefined) return -1
        if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1
        if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return data
  }, [batches, searchQuery, sortConfig])

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig(direction ? { key, direction } : null)
  }

  const handleEdit = (batch: BatchType) => {
    setEditingBatch(batch)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingBatch(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (values: Omit<BatchType, 'id'>) => {
    try {
      if (editingBatch) {
        await dispatch(
          updateBatchById({ id: editingBatch.id, data: values })
        ).unwrap()
      } else {
        await dispatch(createBatch(values)).unwrap()
      }

      await dispatch(fetchBatchesByPage({ page: currentPage, limit: itemsPerPage }))
      setIsFormOpen(false)
      setEditingBatch(null)

      setDialogConfig({
        title: 'Success',
        description: `Batch ${editingBatch ? 'updated' : 'created'} successfully`,
        actionText: 'OK',
        color: 'green',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
    } catch (err) {
      setDialogConfig({
        title: 'Error',
        description: String(err),
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
    }
  }

  const handleDelete = (batch: BatchType) => {
    setDialogConfig({
      title: 'Delete Batch',
      description: 'Are you sure you want to delete this batch?',
      actionText: 'Delete',
      cancelText: 'Cancel',
      color: 'red',
      onConfirm: async () => {
        await dispatch(deleteBatchById(batch.id)).unwrap()
        await dispatch(fetchBatchesByPage({ page: currentPage, limit: itemsPerPage }))
        setDialogOpen(false)
      },
    })
    setDialogOpen(true)
  }

  const renderDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString('en-IN') : 'N/A'

  const renderSold = (value: boolean) =>
    value ? <Badge color="green">Sold</Badge> : <Badge color="gray">Available</Badge>

  const columns = [
    { key: 'id', label: 'Batch ID', width: '220px', sortable: true },
    {
      key: 'start_date',
      label: 'Start Date',
      width: '120px',
      sortable: true,
      render: (row: BatchType) => renderDate(row.start_date),
    },
    {
      key: 'end_date',
      label: 'End Date',
      width: '120px',
      sortable: true,
      render: (row: BatchType) => renderDate(row.end_date),
    },
    {
      key: 'itinerary',
      label: 'Itinerary',
      width: '180px',
      sortable: false,
      render: (row: BatchType) =>
        itineraries.find((i) => i.id === row.itineraryId)?.name || 'N/A',
    },
    {
      key: 'is_sold',
      label: 'Status',
      width: '100px',
      sortable: false,
      render: (row: BatchType) => renderSold(row.is_sold),
    },
    {
      key: 'extra_amount',
      label: 'Extra Amount',
      width: '120px',
      sortable: true,
      render: (row: BatchType) => `₹${row.extra_amount}`,
    },
    {
      key: 'actions',
      label: '',
      width: '80px',
      sortable: false,
      render: (row: BatchType) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="2">⋮</IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={() => handleEdit(row)}>Edit</DropdownMenu.Item>
            <DropdownMenu.Item color="red" onClick={() => handleDelete(row)}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
  ].filter((c) => visibleColumns.has(c.key))

  return (
    <Box style={{ padding: '24px' }}>
      <AddBatchForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBatch}
      />

      <Flex justify="between" mb="4">
        <Text size="7" weight="bold">Batches</Text>
        <Button onClick={handleAddNew}>Add Batch</Button>
      </Flex>

      <TextField.Root
        placeholder="Search batch..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="3"
      />

      <Card>
        <Table
          columns={columns}
          rows={filteredAndSortedBatches}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </Card>

      {dialogConfig && (
        <AlertDialog.Root open={dialogOpen}>
          <AlertDialog.Content>
            <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
            <AlertDialog.Description>
              {dialogConfig.description}
            </AlertDialog.Description>
            <Flex justify="end" gap="3" mt="4">
              {dialogConfig.cancelText && (
                <AlertDialog.Cancel>
                  <Button variant="soft">Cancel</Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action>
                <Button color={dialogConfig.color} onClick={dialogConfig.onConfirm}>
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

export default Batches
