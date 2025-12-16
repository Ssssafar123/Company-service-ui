import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchItineraries,
    createItinerary,
    updateItineraryById,
    deleteItineraryById,
    type Itinerary as ItineraryType,
} from '../../features/ItinerarySlice'
import {
    Box,
    Flex,
    Text,
    TextField,
    Button,
    Badge,
    DropdownMenu,
    Checkbox,
    IconButton,
    AlertDialog,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'


type ItineraryData = {
    id: string
    name: string
    city: string
    price: number 
    priceDisplay: string 
    status: 'Active' | 'Inactive'
    trending: string
}

type SortDirection = 'asc' | 'desc' | null

type ColumnConfig = {
    key: string
    label: string
    dropdownLabel: string
    width: string
    sortable: boolean
    render: (row: ItineraryData) => React.ReactNode
}

const Itinerary: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    
    // Get data from Redux store
    const itinerariesFromStore = useSelector((state: RootState) => state.itinerary.itineraries)
    const loading = useSelector((state: RootState) => state.itinerary.ui.loading)
    const error = useSelector((state: RootState) => state.itinerary.ui.error)

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
        name: true,
        city: true,
        price: true,
        trending: true,
        status: true,
        edit: true,
        actions: true,
    })

    // Fetch itineraries on mount
    useEffect(() => {
        dispatch(fetchItineraries())
    }, [dispatch])

    // Map Redux data to local format
    const itineraries: ItineraryData[] = useMemo(() => {
        return itinerariesFromStore.map((item) => ({
            id: item.id,
            name: item.name, // Now it exists
            city: item.city, // Now it exists
            price: item.price,
            priceDisplay: item.priceDisplay || `₹${item.price.toLocaleString('en-IN')}`,
            status: item.status === 'active' || item.status === 'Active' ? 'Active' : 'Inactive',
            trending: item.trending || 'No',
        }))
    }, [itinerariesFromStore])

    const itemsPerPage = 10

    const handleEdit = (itinerary: ItineraryData) => {
        // Find the original itinerary from store
        const originalItinerary = itinerariesFromStore.find(i => i.id === itinerary.id)
        console.log('Editing itinerary:', originalItinerary) // Debug log
        navigate('/dashboard/add-itinerary', {
            state: { itineraryData: originalItinerary },
        })
    }

    const handleDuplicate = (itinerary: ItineraryData) => {
        setDialogConfig({
            title: 'Duplicate Itinerary',
            description: `Are you sure you want to duplicate "${itinerary.name}"?`,
            actionText: 'Duplicate',
            cancelText: 'Cancel',
            color: 'blue',
            onConfirm: async () => {
                try {
                    const originalItinerary = itinerariesFromStore.find(i => i.id === itinerary.id)
                    if (originalItinerary) {
                        const { id, ...duplicateData } = originalItinerary
                        await dispatch(createItinerary({
                            ...duplicateData,
                            name: `${duplicateData.name} (Copy)`,
                        })).unwrap()
                        
                        setDialogOpen(false)
                        setDialogConfig({
                            title: 'Success',
                            description: `Itinerary "${itinerary.name}" duplicated successfully!`,
                            actionText: 'OK',
                            color: 'green',
                            onConfirm: () => setDialogOpen(false),
                        })
                        setDialogOpen(true)
                    }
                } catch (error: any) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: error.message || 'Failed to duplicate itinerary.',
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

    const handleToggleStatus = (itinerary: ItineraryData) => {
        const newStatus = itinerary.status === 'Active' ? 'Inactive' : 'Active'
        setDialogConfig({
            title: 'Change Status',
            description: `Are you sure you want to change status to "${newStatus}"?`,
            actionText: 'Change',
            cancelText: 'Cancel',
            color: 'blue',
            onConfirm: async () => {
                try {
                    await dispatch(updateItineraryById({
                        id: itinerary.id,
                        data: { status: newStatus === 'Active' ? 'active' : 'inactive' }
                    })).unwrap()
                    
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Success',
                        description: `Status changed to "${newStatus}" successfully!`,
                        actionText: 'OK',
                        color: 'green',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                } catch (error: any) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: error.message || 'Failed to update status.',
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

    const handleDelete = (itinerary: ItineraryData) => {
        setDialogConfig({
            title: 'Delete Itinerary',
            description: `Are you sure you want to delete "${itinerary.name}"? This action cannot be undone.`,
            actionText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
            onConfirm: async () => {
                try {
                    await dispatch(deleteItineraryById(itinerary.id)).unwrap()
                    
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Success',
                        description: `Itinerary "${itinerary.name}" deleted successfully!`,
                        actionText: 'OK',
                        color: 'green',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                } catch (error: any) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: error.message || 'Failed to delete itinerary.',
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

    const handleTrendingChange = async (id: string, checked: boolean) => {
        try {
            await dispatch(updateItineraryById({
                id,
                data: { /* Add trending field to your Itinerary interface if needed */ }
            })).unwrap()
        } catch (error) {
            console.error('Failed to update trending status:', error)
        }
    }

    const allColumns: ColumnConfig[] = [
        {
            key: 'name',
            label: 'Itinerary Name',
            dropdownLabel: 'Title',
            width: '300px',
            sortable: true,
            render: (row: ItineraryData) => <Text size="2">{row.name}</Text>,
        },
        {
            key: 'city',
            label: 'City',
            dropdownLabel: 'City',
            width: '200px',
            sortable: true,
            render: (row: ItineraryData) => <Text size="2">{row.city}</Text>,
        },
        {
            key: 'price',
            label: 'Price',
            dropdownLabel: 'Startin_price',
            width: '150px',
            sortable: true,
            render: (row: ItineraryData) => (
                <Text size="2" weight="medium">
                    {row.priceDisplay}
                </Text>
            ),
        },
        {
            key: 'trending',
            label: 'Trending',
            dropdownLabel: 'Is_trending',
            width: '120px',
            sortable: false,
            render: (row: ItineraryData) => {
                const isChecked = row.trending === 'Yes'
                
                return (
                    <Flex align="center" justify="center">
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                                handleTrendingChange(row.id, checked === true)
                            }}
                        />
                    </Flex>
                )
            },
        },
        {
            key: 'status',
            label: 'Status',
            dropdownLabel: 'Is_active',
            width: '120px',
            sortable: true,
            render: (row: ItineraryData) => renderStatus(row.status),
        },
        {
            key: 'edit',
            label: '',
            dropdownLabel: 'Edit',
            width: '80px',
            sortable: false,
            render: (row: ItineraryData) => (
                <Flex gap="2" align="center" justify="center">
                    <Button
                        variant="soft"
                        size="1"
                        onClick={() => handleEdit(row)}
                        style={{
                            color: 'white',
                            backgroundColor: 'var(--accent-9)',
                            cursor: 'pointer',
                        }}
                    >
                        Edit
                    </Button>
                </Flex>
            ),
        },
        {
            key: 'actions',
            label: '',
            dropdownLabel: 'Actions',
            width: '80px',
            sortable: false,
            render: (row: ItineraryData) => (
                <Flex gap="2" align="center" justify="center">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <IconButton variant="ghost" size="2" style={{ cursor: 'pointer', color: 'var(--accent-11)' }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                                </svg>
                            </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content style={{ minWidth: '180px' }}>
                            <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); handleEdit(row) }} style={{ cursor: 'pointer' }}>
                                <Text size="2">Edit Itinerary</Text>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); handleDuplicate(row) }} style={{ cursor: 'pointer' }}>
                                <Text size="2">Duplicate Itinerary</Text>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); handleToggleStatus(row) }} style={{ cursor: 'pointer' }}>
                                <Text size="2">Status ({row.status === 'Active' ? 'Set Inactive' : 'Set Active'})</Text>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); handleDelete(row) }} style={{ cursor: 'pointer' }} color="red">
                                <Text size="2" style={{ color: 'var(--red-11)' }}>Delete</Text>
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
        if (!searchQuery.trim()) return itineraries
        const query = searchQuery.toLowerCase()
        return itineraries.filter(
            (item) =>
                item.name.toLowerCase().includes(query) ||
                item.city.toLowerCase().includes(query) ||
                item.priceDisplay.toLowerCase().includes(query) ||
                item.status.toLowerCase().includes(query)
        )
    }, [searchQuery, itineraries])

    const sortedData = useMemo(() => {
        if (!sortConfig || !sortConfig.direction) return filteredData

        return [...filteredData].sort((a, b) => {
            if (sortConfig.key === 'price') {
                return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price
            }

            if (sortConfig.key === 'status') {
                const aStatus = a.status === 'Active' ? 1 : 0
                const bStatus = b.status === 'Active' ? 1 : 0
                return sortConfig.direction === 'asc' ? aStatus - bStatus : bStatus - aStatus
            }

            let aValue: any = a[sortConfig.key as keyof ItineraryData]
            let bValue: any = b[sortConfig.key as keyof ItineraryData]

            if (aValue == null && bValue == null) return 0
            if (aValue == null) return 1
            if (bValue == null) return -1

            const aStr = String(aValue).toLowerCase()
            const bStr = String(bValue).toLowerCase()

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1
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
        setColumnVisibility((prev) => ({ ...prev, [columnKey]: false }))
    }

    const renderStatus = (status: string) => {
        const isActive = status === 'Active'
        return (
            <Badge size="2" variant="solid" color={isActive ? 'green' : 'red'} style={{ textTransform: 'capitalize' }}>
                {status}
            </Badge>
        )
    }

    const tableRows = paginatedData.map((item) => ({ ...item, price: item.priceDisplay }))

    return (
        <Box style={{ padding: '24px' }}>
            <Text size="7" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '24px', display: 'block' }}>
                Manage Itinerary
            </Text>

            <Flex gap="3" align="center" justify="between" style={{ marginBottom: '24px' }}>
                <TextField.Root
                    placeholder="Search all columns..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    style={{ flex: 1, maxWidth: '400px' }}
                >
                    <TextField.Slot>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z" stroke="var(--accent-11)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </TextField.Slot>
                </TextField.Root>

                <Flex gap="2" align="center">
                    <Button variant="soft" size="2" onClick={() => navigate('/dashboard/add-itinerary')} style={{ color: 'white', backgroundColor: 'var(--accent-9)', width: '200px' }}>
                        Add New Itinerary
                    </Button>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <Button variant="soft" size="2" style={{ color: 'white', backgroundColor: 'var(--accent-9)', width: '100px' }}>
                                Columns
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content style={{ minWidth: '160px' }}>
                            {allColumns.map((col) => (
                                <DropdownMenu.Item key={col.key} onSelect={(e) => { e.preventDefault(); handleColumnToggle(col.key) }} style={{ cursor: 'pointer' }}>
                                    <Flex align="center" gap="3">
                                        <Checkbox checked={columnVisibility[col.key as keyof typeof columnVisibility]} onCheckedChange={() => handleColumnToggle(col.key)} style={{ pointerEvents: 'none' }} />
                                        <Text size="2">{col.dropdownLabel}</Text>
                                    </Flex>
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Flex>
            </Flex>

            <Box style={{ backgroundColor: 'var(--color-panel)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--accent-6)' }}>
                <Table columns={visibleColumns} rows={tableRows} onSort={handleSort} sortConfig={sortConfig} onHideColumn={handleHideColumn} />
            </Box>

            {sortedData.length > itemsPerPage && (
                <Flex justify="end" align="center" gap="3" style={{ marginTop: '16px' }}>
                    <Text size="2" style={{ color: 'var(--accent-11)' }}>Page {currentPage} of {totalPages}</Text>
                    <Button variant="soft" size="2" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>Previous</Button>
                    <Button variant="soft" size="2" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}>Next</Button>
                </Flex>
            )}

            {dialogConfig && (
                <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
                        <AlertDialog.Description size="2">{dialogConfig.description}</AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            {dialogConfig.cancelText && (
                                <AlertDialog.Cancel><Button variant="soft" color="gray">{dialogConfig.cancelText}</Button></AlertDialog.Cancel>
                            )}
                            <AlertDialog.Action><Button variant="solid" color={dialogConfig.color || 'red'} onClick={dialogConfig.onConfirm}>{dialogConfig.actionText}</Button></AlertDialog.Action>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            )}
        </Box>
    )
}

export default Itinerary