import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchBookings,
    fetchBookingsByPage,
    createBooking,
    updateBookingById,
    deleteBookingById,
    type Booking as BookingType,
} from '../../features/BookingSlice'
import { fetchCustomers } from '../../features/CustomerSlice'
import { fetchBatches } from '../../features/BatchSlice'
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
import AddBookingForm from './AddBookingForm'

const Bookings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const bookings = useSelector((state: RootState) => state.booking.booking)
    const pagination = useSelector((state: RootState) => state.booking.pagination)
    const loading = useSelector((state: RootState) => state.booking.ui.loading)
    const error = useSelector((state: RootState) => state.booking.ui.error)
    const customers = useSelector((state: RootState) => state.customer.customers)
    const batches = useSelector((state: RootState) => state.batch.batches)

    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(['id', 'fullname', 'booking_date', 'starting_point', 'dropping_point', 'paid_amount', 'total_amount', 'status', 'actions'])
    )

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    // Form panel state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingBooking, setEditingBooking] = useState<BookingType | null>(null)

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        cancelText?: string
        onConfirm: () => void
        color?: 'red' | 'blue' | 'green' | 'gray'
    } | null>(null)

    // Fetch paginated data on mount and when page changes
    useEffect(() => {
        const loadBookings = async () => {
            try {
                await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage })).unwrap()
                dispatch(fetchCustomers())
                dispatch(fetchBatches())
            } catch (error) {
                console.error('Failed to load bookings:', error)
            }
        }
        loadBookings()
    }, [dispatch, currentPage, itemsPerPage])

    // Filter bookings (client-side filtering only for search - pagination is handled by backend)
    const filteredBookings = useMemo(() => {
        // If there's a search query, filter the current page's bookings
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            return bookings.filter(
                (booking: BookingType) =>
                    booking.txn_id?.toLowerCase().includes(query) ||
                    booking.id.toLowerCase().includes(query) ||
                    ((booking.customer as any)?.name?.toLowerCase() || '').includes(query)
            )
        }
        // No search - return all bookings from current page (already sorted by backend)
        return bookings
    }, [bookings, searchQuery])

    // Apply client-side sorting only if user manually sorts (backend already sorts by createdAt desc)
    const sortedBookings = useMemo(() => {
        if (sortConfig && sortConfig.direction && sortConfig.key !== 'booking_date') {
            return [...filteredBookings].sort((a: BookingType, b: BookingType) => {
                const aValue = a[sortConfig.key as keyof BookingType]
                const bValue = b[sortConfig.key as keyof BookingType]

                if (aValue === undefined && bValue === undefined) return 0
                if (aValue === undefined) return 1
                if (bValue === undefined) return -1

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }
        return filteredBookings
    }, [filteredBookings, sortConfig])

    const totalPages = pagination.totalPages || 1
    const paginatedBookings = sortedBookings

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

    const handleEdit = (booking: BookingType) => {
        setEditingBooking(booking)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingBooking(null)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (values: Omit<BookingType, 'id'>) => {
        try {
            if (editingBooking) {
                await dispatch(
                    updateBookingById({
                        id: editingBooking.id,
                        data: values,
                    })
                ).unwrap()

                setDialogConfig({
                    title: 'Success',
                    description: `Booking updated successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            } else {
                await dispatch(createBooking(values)).unwrap()

                setDialogConfig({
                    title: 'Success',
                    description: `Booking created successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            }

            await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))
            setDialogOpen(true)
            setIsFormOpen(false)
            setEditingBooking(null)
        } catch (error) {
            setDialogConfig({
                title: 'Error',
                description: `Failed to ${editingBooking ? 'update' : 'create'} booking: ${error}`,
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        }
    }

    const handleDelete = (booking: BookingType) => {
        setDialogConfig({
            title: 'Delete Booking',
            description: `Are you sure you want to delete this booking? This action cannot be undone.`,
            actionText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
            onConfirm: async () => {
                try {
                    await dispatch(deleteBookingById(booking.id)).unwrap()
                    await dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))

                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Success',
                        description: 'Booking deleted successfully.',
                        actionText: 'OK',
                        color: 'green',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                } catch (error) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: `Failed to delete booking: ${error}`,
                        actionText: 'OK',
                        color: 'red',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                }
            },
        })
        setDialogOpen(true)
    }

    // Render status badge
    const renderStatus = (status?: 'INITIATED' | 'SUCCESS' | 'FAILED') => {
        if (!status) return <Badge color="gray">N/A</Badge>

        const statusConfig = {
            INITIATED: { label: 'Initiated', color: 'yellow' as const },
            SUCCESS: { label: 'Success', color: 'green' as const },
            FAILED: { label: 'Failed', color: 'red' as const },
        }

        const config = statusConfig[status]
        return (
            <Badge color={config.color} size="2">
                {config.label}
            </Badge>
        )
    }

    // Render amount with currency
    const renderAmount = (amount?: number) => {
        return `₹${(amount ?? 0).toLocaleString('en-IN')}`
    }

    // Render date in readable format
    const renderDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Render actions menu
    const renderActions = (booking: BookingType) => {
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <IconButton variant="ghost" size="2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => handleEdit(booking)}>
                        <Flex align="center" gap="2">
                            <Text size="2">Edit</Text>
                        </Flex>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red" onClick={() => handleDelete(booking)}>
                        <Flex align="center" gap="2">
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
            key: 'id',
            label: 'Booking ID',
            width: '200px',
            sortable: true,
        },
        {
            key: 'fullname',
            label: 'Full Name',
            width: '150px',
            sortable: true,
            render: (row: BookingType) => (row.customer as any)?.name || 'N/A',
        },
        {
            key: 'booking_date',
            label: 'Booking Date',
            width: '120px',
            sortable: true,
            render: (row: BookingType) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }) : 'N/A',
        },
        {
            key: 'starting_point',
            label: 'Starting Point',
            width: '150px',
            sortable: true,
            render: (row: BookingType) => (row.customer as any)?.starting_point || 'N/A',
        },
        {
            key: 'dropping_point',
            label: 'Dropping Point',
            width: '150px',
            sortable: true,
            render: (row: BookingType) => (row.customer as any)?.drop_point || 'N/A',
        },
        {
            key: 'paid_amount',
            label: 'Paid Amount',
            width: '120px',
            sortable: true,
            render: (row: BookingType) => renderAmount(row.paid_amount),
        },
        {
            key: 'total_amount',
            label: 'Total Amount',
            width: '120px',
            sortable: true,
            render: (row: BookingType) => renderAmount(row.total_price),
        },
        {
            key: 'status',
            label: 'Status',
            width: '100px',
            sortable: false,
            render: (row: BookingType) => renderStatus(row.transaction_status),
        },
        {
            key: 'actions',
            label: '',
            width: '80px',
            sortable: false,
            render: (row: BookingType) => renderActions(row),
        },
    ].filter((col) => visibleColumns.has(col.key))

    return (
        <Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
            {/* Loading indicator */}
            {loading && (
                <Box style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.1)', 
                    zIndex: 1000, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <Text>Loading...</Text>
                </Box>
            )}

            {/* Error display */}
            {error && (
                <Box style={{ 
                    marginBottom: '16px', 
                    padding: '12px', 
                    background: 'var(--red-3)', 
                    borderRadius: '4px',
                    border: '1px solid var(--red-6)'
                }}>
                    <Flex justify="between" align="center">
                        <Text size="2" color="red" weight="medium">
                            Error: {error}
                        </Text>
                        <Button 
                            variant="soft" 
                            size="1" 
                            color="red"
                            onClick={() => {
                                dispatch(fetchBookingsByPage({ page: currentPage, limit: itemsPerPage }))
                            }}
                        >
                            Retry
                        </Button>
                    </Flex>
                </Box>
            )}

            {/* Add Booking Form Component */}
            <AddBookingForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingBooking(null)
                }}
                onSubmit={handleFormSubmit}
                initialData={editingBooking}
            />

            {/* Header */}
            <Flex justify="between" align="center" mb="4">
                <Text size="7" weight="bold">
                    Bookings
                </Text>
            </Flex>

            {/* Search and Controls */}
            <Flex gap="3" mb="4" align="center" wrap="wrap">
                <TextField.Root
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                    }}
                    style={{ flex: 1, minWidth: '300px' }}
                >
                    <TextField.Slot>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path
                                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                        </svg>
                    </TextField.Slot>
                </TextField.Root>

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
                    Add Booking
                </Button>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft" size="2">
                            Columns
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 9L1 4H11L6 9Z" fill="currentColor" />
                            </svg>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content style={{ minWidth: '200px' }}>
                        {[
                            { key: 'id', label: 'Booking ID' },
                            { key: 'fullname', label: 'Full Name' },
                            { key: 'booking_date', label: 'Booking Date' },
                            { key: 'starting_point', label: 'Starting Point' },
                            { key: 'dropping_point', label: 'Dropping Point' },
                            { key: 'paid_amount', label: 'Paid Amount' },
                            { key: 'total_amount', label: 'Total Amount' },
                            { key: 'status', label: 'Status' },
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
                                style={{ cursor: 'pointer' }}
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
            </Flex>

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    rows={paginatedBookings}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onHideColumn={handleHideColumn}
                />
            </Card>

            {/* Pagination */}
            <Flex justify="between" align="center" gap="3" style={{ marginTop: '16px' }}>
                <Text size="2" style={{ color: 'var(--accent-11)' }}>
                    Showing {((pagination.page || currentPage) - 1) * itemsPerPage + 1} to {Math.min((pagination.page || currentPage) * itemsPerPage, pagination.totalRecords || 0)} of {pagination.totalRecords || 0} bookings
                </Text>
                {totalPages > 1 && (
                    <Flex align="center" gap="2">
                        <Button 
                            variant="soft" 
                            size="2" 
                            disabled={currentPage === 1 || loading} 
                            onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage(prev => prev - 1)
                                }
                            }}
                        >
                            Previous
                        </Button>
                        <Flex align="center" gap="1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }
                                
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "solid" : "soft"}
                                        size="2"
                                        disabled={loading}
                                        onClick={() => setCurrentPage(pageNum)}
                                        style={{
                                            minWidth: '36px',
                                            backgroundColor: currentPage === pageNum ? 'var(--accent-9)' : undefined,
                                            color: currentPage === pageNum ? 'white' : undefined,
                                        }}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                        </Flex>
                        <Button 
                            variant="soft" 
                            size="2" 
                            disabled={currentPage >= totalPages || loading} 
                            onClick={() => {
                                if (currentPage < totalPages) {
                                    setCurrentPage(prev => prev + 1)
                                }
                            }}
                        >
                            Next
                        </Button>
                    </Flex>
                )}
            </Flex>

            {/* Alert Dialog */}
            {dialogConfig && (
                <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
                        <AlertDialog.Description size="3">{dialogConfig.description}</AlertDialog.Description>
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
                                    color={dialogConfig.color || 'blue'}
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

export default Bookings
