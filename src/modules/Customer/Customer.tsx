import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
  fetchCustomers,
  fetchCustomersByPage,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
} from '../../features/CustomerSlice'
import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  AlertDialog,
  DropdownMenu,
  IconButton,
  Card,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'
import AddCustomerForm from './AddCustomerForm'
import type { Customer } from '../../features/CustomerSlice'

const Customers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const customersFromStore = useSelector((state: RootState) => state.customer.customers)
  const pagination = useSelector((state: RootState) => state.customer.pagination)
  const loading = useSelector((state: RootState) => state.customer.ui.loading)
  const error = useSelector((state: RootState) => state.customer.ui.error)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['name', 'email', 'phone', 'base_city', 'gender', 'age', 'actions']))
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<{
    title: string
    description: string
    actionText: string
    cancelText?: string
    onConfirm: () => void
    color?: 'red' | 'blue' | 'green' | 'gray'
  } | null>(null)

  // Fetch all customers on mount
  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    // Ensure customersFromStore is always an array
    const customers = Array.isArray(customersFromStore) ? customersFromStore : []
    let filtered = customers

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = customers.filter(
        (customer) =>
          customer?.name?.toLowerCase().includes(query) ||
          customer?.email?.toLowerCase().includes(query) ||
          customer?.phone?.toString().includes(query) ||
          customer?.base_city?.toLowerCase().includes(query)
      )
    }

    // Apply sorting - default to newest first (by createdAt descending)
    if (sortConfig && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Customer]
        const bValue = b[sortConfig.key as keyof Customer]
        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return 1
        if (bValue === undefined) return -1
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    } else {
      // Default sort: newest first (by createdAt descending)
      filtered = [...filtered].sort((a, b) => {
        // Handle missing or invalid dates
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        // If dates are invalid, use updatedAt as fallback
        const aDateFinal = isNaN(aDate) && a.updatedAt ? new Date(a.updatedAt).getTime() : aDate
        const bDateFinal = isNaN(bDate) && b.updatedAt ? new Date(b.updatedAt).getTime() : bDate
        // If still invalid, put at the end
        if (isNaN(aDateFinal) && isNaN(bDateFinal)) return 0
        if (isNaN(aDateFinal)) return 1
        if (isNaN(bDateFinal)) return -1
        return bDateFinal - aDateFinal // Descending order (newest first)
      })
    }

    return filtered
  }, [customersFromStore, searchQuery, sortConfig])

  // Pagination - based on filtered and sorted customers
  const totalCustomers = filteredAndSortedCustomers.length || 0
  const totalPages = Math.ceil(totalCustomers / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCustomers = Array.isArray(filteredAndSortedCustomers) ? filteredAndSortedCustomers.slice(startIndex, endIndex) : []

  const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig(direction ? { key: columnKey, direction } : null)
    setCurrentPage(1)
  }

  const handleHideColumn = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev)
      newSet.delete(columnKey)
      return newSet
    })
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  const handleDelete = (customer: Customer) => {
    setDialogConfig({
      title: 'Delete Customer',
      description: `Are you sure you want to delete "${customer.name}"? This action cannot be undone.`,
      actionText: 'Delete',
      cancelText: 'Cancel',
      color: 'red',
      onConfirm: async () => {
        await dispatch(deleteCustomerById(customer.id))
        setDialogOpen(false)
        setDialogConfig({
          title: 'Success',
          description: `Customer "${customer.name}" deleted successfully!`,
          actionText: 'OK',
          color: 'green',
          onConfirm: () => setDialogOpen(false),
        })
        setDialogOpen(true)
        // Refresh data
        dispatch(fetchCustomers())
      },
    })
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingCustomer(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (values: Record<string, any>) => {
    if (editingCustomer) {
      await dispatch(updateCustomerById({
        id: editingCustomer.id,
        data: {
          name: values.name || '',
          email: values.email || '',
          phone: Number(values.phone) || 0,
          base_city: values.base_city || '',
          age: Number(values.age) || 0,
          gender: values.gender || 'OTHER',
          starting_point: values.starting_point || '',
          drop_point: values.drop_point || '',
          instagram: values.instagram,
          refer: values.refer,
        }
      }))
      setDialogConfig({
        title: 'Success',
        description: `Customer "${values.name}" updated successfully!`,
        actionText: 'OK',
        color: 'green',
        onConfirm: () => setDialogOpen(false),
      })
    } else {
      await dispatch(createCustomer({
        name: values.name || '',
        email: values.email || '',
        phone: Number(values.phone) || 0,
        base_city: values.base_city || '',
        age: Number(values.age) || 0,
        gender: values.gender || 'OTHER',
        starting_point: values.starting_point || '',
        drop_point: values.drop_point || '',
        instagram: values.instagram,
        refer: values.refer,
      }))
      setDialogConfig({
        title: 'Success',
        description: `Customer "${values.name}" added successfully!`,
        actionText: 'OK',
        color: 'green',
        onConfirm: () => setDialogOpen(false),
      })
    }
    setDialogOpen(true)
    setIsFormOpen(false)
    setEditingCustomer(null)
    // Refresh data
    dispatch(fetchCustomers())
  }

  // Render actions menu
  const renderActions = (customer: Customer) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" size="2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => handleEdit(customer)}>
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
          <DropdownMenu.Item color="red" onClick={() => handleDelete(customer)}>
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

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      width: '200px',
      sortable: true,
      render: (row: Customer) => (
        <Flex align="center" gap="2">
          <Box
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--gray-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--accent-12)',
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </Box>
          <Text size="2" weight="medium">{row.name}</Text>
        </Flex>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '200px',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      width: '150px',
      sortable: true,
      render: (row: Customer) => (
        <Text size="2">{row.phone}</Text>
      ),
    },
    {
      key: 'base_city',
      label: 'City',
      width: '150px',
      sortable: true,
    },
    {
      key: 'gender',
      label: 'Gender',
      width: '100px',
      sortable: true,
      render: (row: Customer) => (
        <Text size="2" style={{ textTransform: 'capitalize' }}>{row.gender.toLowerCase()}</Text>
      ),
    },
    {
      key: 'age',
      label: 'Age',
      width: '80px',
      sortable: true,
    },
    {
      key: 'actions',
      label: '',
      width: '80px',
      sortable: false,
      render: (row: Customer) => renderActions(row),
    },
  ].filter((col) => visibleColumns.has(col.key))

  return (
    <Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
      {/* Add Customer Form Component */}
      <AddCustomerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCustomer(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer ? {
          id: editingCustomer.id,
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          base_city: editingCustomer.base_city,
          age: editingCustomer.age,
          gender: editingCustomer.gender,
          starting_point: editingCustomer.starting_point,
          drop_point: editingCustomer.drop_point,
          instagram: editingCustomer.instagram,
          refer: editingCustomer.refer,
        } : null}
      />

      {/* Main Content */}
      <Box style={{ width: '100%' }}>
        {/* Header Section */}
        <Box style={{ marginBottom: '24px' }}>
          <Text
            size="7"
            weight="bold"
            style={{
              color: 'var(--accent-12)',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Manage Customers
          </Text>
          <Text
            size="2"
            style={{
              color: 'var(--accent-11)',
              display: 'block',
            }}
          >
            Here you can add, edit, and view your customers from the Sales module.
          </Text>
        </Box>

        {/* Search and Columns Section */}
        <Card style={{ padding: '16px', marginBottom: '16px' }}>
          <Flex gap="3" align="center" justify="between">
            <TextField.Root
              placeholder="Search all columns..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              style={{ flex: 1, maxWidth: '400px' }}
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

            <Flex gap="2" align="center">
              {/* Columns dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" size="2">
                    Columns
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'base_city', label: 'City' },
                    { key: 'gender', label: 'Gender' },
                    { key: 'age', label: 'Age' },
                  ].map((col) => (
                    <DropdownMenu.Item
                      key={col.key}
                      onSelect={(e) => {
                        e.preventDefault()
                        setVisibleColumns((prev) => {
                          const newSet = new Set(prev)
                          if (newSet.has(col.key)) {
                            newSet.delete(col.key)
                          } else {
                            newSet.add(col.key)
                          }
                          return newSet
                        })
                      }}
                    >
                      <Flex align="center" gap="2">
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <Text size="2">{col.label}</Text>
                      </Flex>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <Button
                variant="soft"
                size="2"
                onClick={handleAddNew}
                style={{
                  color: 'white',
                  backgroundColor: 'var(--accent-9)',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: '8px' }}
                >
                  <path
                    d="M8 3V13M3 8H13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add New Customer
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Table Section */}
        <Card style={{ padding: '16px' }}>
          {loading && <Text>Loading customers...</Text>}
          {error && <Text style={{ color: 'var(--red-9)' }}>Error: {error}</Text>}
          {!loading && !error && Array.isArray(paginatedCustomers) && (
            <Table
              columns={columns}
              rows={paginatedCustomers}
              onSort={handleSort}
              sortConfig={sortConfig}
              onHideColumn={handleHideColumn}
            />
          )}
        </Card>

        {/* Pagination Section */}
        <Flex justify="end" align="center" gap="2" style={{ marginTop: '16px' }}>
          <Button
            variant="soft"
            size="2"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            Previous
          </Button>
          <Text size="2" style={{ color: 'var(--accent-11)' }}>
            Page {currentPage} of {totalPages || 1} ({totalCustomers} total customers)
          </Text>
          <Button
            variant="soft"
            size="2"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            style={{
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.5 : 1,
            }}
          >
            Next
          </Button>
        </Flex>

        {/* Empty State */}
        {(!Array.isArray(filteredAndSortedCustomers) || filteredAndSortedCustomers.length === 0) && !loading && !error && (
          <Box
            style={{
              padding: '48px',
              textAlign: 'center',
              color: 'var(--accent-11)',
            }}
          >
            <Text size="3">No customers found.</Text>
          </Box>
        )}
      </Box>

      {/* Alert Dialog */}
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

export default Customers
