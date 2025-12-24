import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import {
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
  type Customer as CustomerType,
} from '../../features/CustomerSlice'
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
import AddCustomerForm from './AddCustomerForm'

const Customers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [customers, setCustomers] = useState<CustomerType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form panel state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<any>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `http://localhost:8000/api/customer/pagination?page=${currentPage}&limit=${itemsPerPage}`,
        { credentials: 'include' }
      )

      if (!res.ok) throw new Error('Failed to fetch customers')

      const json = await res.json()

      const data: CustomerType[] = (json.data || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        base_city: c.base_city,
        age: c.age,
        phone: c.phone,
        email: c.email,
        gender: c.gender,
        instagram: c.instagram,
        refer: c.refer,
        starting_point: c.starting_point,
        drop_point: c.drop_point,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))

      setCustomers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch paginated data on mount and when page changes
  useEffect(() => {
    fetchCustomers()
  }, [currentPage])

  // Filter and sort bookings
  const filteredAndSortedCustomers = useMemo(() => {
    let data = customers

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          String(c.phone).includes(q)
      )
    }

    //Apply sorting
    if (sortConfig?.direction) {
      data = [...data].sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return data
  }, [customers, searchQuery, sortConfig])

  const handleSubmit = async (data: Omit<CustomerType, 'id'>) => {
    try {
      if (editingCustomer) {
        await dispatch(updateCustomerById({ id: editingCustomer.id, data })).unwrap()
      } else {
        await dispatch(createCustomer(data)).unwrap()
      }

      setIsFormOpen(false)
      setEditingCustomer(null)
      fetchCustomers()
    } catch (err) {
      alert('Error saving customer')
    }
  }

  const handleDelete = async (customer: CustomerType) => {
    await dispatch(deleteCustomerById(customer.id))
    fetchCustomers()
  }

  const renderActions = (row: CustomerType) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost">⋮</IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => {
          setEditingCustomer(row)
          setIsFormOpen(true)
        }}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={() => handleDelete(row)}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )

  const columns = [
    { key: 'name', label: 'Name', width: '150px' },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'phone', label: 'Phone', width: '120px' },
    { key: 'gender', label: 'Gender', width: '100px', render: (r: CustomerType) => <Badge>{r.gender}</Badge> },
    { key: 'base_city', label: 'Base City', width: '120px' },
    { key: 'starting_point', label: 'Start', width: '120px' },
    { key: 'drop_point', label: 'Drop', width: '120px' },
    { key: 'actions', label: '', width: '80px', render: renderActions },
  ]

  return (
    <Box p="4">
      <AddCustomerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingCustomer(null)
        }}
        initialData={editingCustomer}
        onSubmit={handleSubmit}
      />

      <Flex justify="between" mb="4">
        <Text size="7" weight="bold">Customers</Text>
        <Button onClick={() => setIsFormOpen(true)}>Add Customer</Button>
      </Flex>

      <TextField.Root
        placeholder="Search customers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="3"
      />

      {loading && <Text>Loading...</Text>}
      {error && <Text color="red">{error}</Text>}

      <Card>
        <Table
          columns={columns}
          rows={filteredAndSortedCustomers}
          onSort={(key, dir) => setSortConfig(dir ? { key, direction: dir } : null)}
          sortConfig={sortConfig}
        />
      </Card>
    </Box>
  )
}

export default Customers
