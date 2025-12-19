import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchHotels,
    createHotel,
    updateHotelById,
    deleteHotelById,
} from '../../features/HotelSlice'
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
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'
import AddHotelForm from './AddHotelForm'

type HotelData = {
    id: string
    name: string
    city: string
    country: string
    rating: number
    phone: string
}

const Hotel: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const hotelsFromStore = useSelector((state: RootState) => state.hotel.hotels)
    const loading = useSelector((state: RootState) => state.hotel.ui.loading)
    const error = useSelector((state: RootState) => state.hotel.ui.error)

    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['name', 'city', 'country', 'rating', 'phone', 'actions']))
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [editingHotel, setEditingHotel] = useState<HotelData | null>(null)

    // Form panel state
    const [isFormOpen, setIsFormOpen] = useState(false)

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

    // Fetch hotels from Redux on mount
    useEffect(() => {
        dispatch(fetchHotels())
    }, [dispatch])

    // Filter and sort hotels
    const filteredAndSortedHotels = useMemo(() => {
        let filtered = hotelsFromStore

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = hotelsFromStore.filter(
                (hotel) =>
                    hotel.name.toLowerCase().includes(query) ||
                    hotel.city.toLowerCase().includes(query) ||
                    (hotel.country && hotel.country.toLowerCase().includes(query)) ||
                    (hotel.phone && hotel.phone.includes(query))
            )
        }

        // Apply sorting
        if (sortConfig && sortConfig.direction) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key as keyof HotelData]
                const bValue = b[sortConfig.key as keyof HotelData]

                if (aValue === undefined && bValue === undefined) return 0
                if (aValue === undefined) return 1
                if (bValue === undefined) return -1

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                }
                return 0
            })
        }

        return filtered
    }, [hotelsFromStore, searchQuery, sortConfig])

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedHotels = filteredAndSortedHotels.slice(startIndex, endIndex)

    const handleSort = (columnKey: string, direction: 'asc' | 'desc' | null) => {
        setSortConfig(direction ? { key: columnKey, direction } : null)
        setCurrentPage(1) // Reset to first page on sort
    }

    const handleHideColumn = (columnKey: string) => {
        setVisibleColumns((prev) => {
            const newSet = new Set(prev)
            newSet.delete(columnKey)
            return newSet
        })
    }

    const handleEdit = (hotel: HotelData) => {
        // Find the full hotel data from Redux store
        const fullHotel = hotelsFromStore.find(h => h.id === hotel.id)
        
        if (fullHotel) {
            // Pass the full hotel object with all fields
            setEditingHotel({
                id: fullHotel.id,
                name: fullHotel.name,
                city: fullHotel.city || '',
                country: fullHotel.country || '',
                rating: fullHotel.rating || 3,
                phone: fullHotel.phone || '',
            })
        } else {
            setEditingHotel(hotel)
        }
        setIsFormOpen(true)
    }

    const handleDelete = (hotel: HotelData) => {
        setDialogConfig({
            title: 'Delete Hotel',
            description: `Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`,
            actionText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
            onConfirm: async () => {
                await dispatch(deleteHotelById(hotel.id))
                setDialogOpen(false)
                setDialogConfig({
                    title: 'Success',
                    description: `Hotel "${hotel.name}" deleted successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
                setDialogOpen(true)
            },
        })
        setDialogOpen(true)
    }

    const handleAddNew = () => {
        setEditingHotel(null)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (values: Record<string, any>) => {
        try {
            if (editingHotel) {
                // Update existing hotel - include ALL fields
                await dispatch(updateHotelById({
                    id: editingHotel.id,
                    data: {
                        name: values.hotelName || '',
                        address: values.address || '',
                        city: values.city || '',
                        country: values.country || '',
                        rating: parseInt(values.rating) || 3,
                        phone: values.contactPhone || '',
                        description: values.description || '',
                        amenities: values.amenities || '',
                        imageUrls: values.imageUrls || '',
                        contactEmail: values.contactEmail || '',
                        websiteUrl: values.websiteUrl || '',
                        checkInTime: values.checkInTime || '',
                        checkOutTime: values.checkOutTime || '',
                        status: 'active' as 'active',
                    }
                })).unwrap()
                
                // Refetch hotels to get updated data
                await dispatch(fetchHotels())
                
                setDialogConfig({
                    title: 'Success',
                    description: `Hotel "${values.hotelName}" updated successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            } else {
                // Create new hotel
                await dispatch(createHotel({
                    name: values.hotelName || '',
                    city: values.city || '',
                    country: values.country || '',
                    rating: parseInt(values.rating) || 3,
                    phone: values.contactPhone || '',
                    address: values.address || '',
                    description: values.description || '',
                    amenities: values.amenities || '',
                    imageUrls: values.imageUrls || '',
                    contactEmail: values.contactEmail || '',
                    websiteUrl: values.websiteUrl || '',
                    checkInTime: values.checkInTime || '',
                    checkOutTime: values.checkOutTime || '',
                    status: 'active' as 'active',
                })).unwrap()
                
                // Refetch hotels to get updated data
                await dispatch(fetchHotels())
                
                setDialogConfig({
                    title: 'Success',
                    description: `Hotel "${values.hotelName}" added successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            }

            setDialogOpen(true)
            setIsFormOpen(false)
            setEditingHotel(null)
        } catch (error: any) {
            setDialogConfig({
                title: 'Error',
                description: error?.message || `Failed to ${editingHotel ? 'update' : 'create'} hotel`,
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        }
    }

    // Render star rating
    const renderRating = (rating: number) => {
        return (
            <Flex align="center" gap="1">
                <Text size="2" weight="medium">
                    {rating}
                </Text>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: '#fbbf24' }}
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </Flex>
        )
    }

    // Render actions menu
    const renderActions = (hotel: HotelData) => {
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
                    <DropdownMenu.Item onClick={() => handleEdit(hotel)}>
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
                    <DropdownMenu.Item color="red" onClick={() => handleDelete(hotel)}>
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
        },
        {
            key: 'city',
            label: 'City',
            width: '150px',
            sortable: true,
        },
        {
            key: 'country',
            label: 'Country',
            width: '150px',
            sortable: true,
        },
        {
            key: 'rating',
            label: 'Rating',
            width: '120px',
            sortable: true,
            render: (row: HotelData) => renderRating(row.rating),
        },
        {
            key: 'phone',
            label: 'Phone',
            width: '150px',
            sortable: true,
        },
        {
            key: 'actions',
            label: '',
            width: '80px',
            sortable: false,
            render: (row: HotelData) => renderActions(row),
        },
    ].filter((col) => visibleColumns.has(col.key))

    return (
        <Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
            {/* Add Hotel Form Component */}
            <AddHotelForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingHotel(null)
                }}
                onSubmit={handleFormSubmit}
                initialData={editingHotel ? (() => {
                    // Find full hotel data from Redux store
                    const fullHotel = hotelsFromStore.find(h => h.id === editingHotel.id)
                    return fullHotel ? {
                        id: fullHotel.id,
                        name: fullHotel.name,
                        city: fullHotel.city,
                        country: fullHotel.country,
                        rating: fullHotel.rating,
                        phone: fullHotel.phone,
                        description: fullHotel.description,
                        address: fullHotel.address,
                        amenities: fullHotel.amenities,
                        imageUrls: fullHotel.imageUrls,
                        contactEmail: fullHotel.contactEmail,
                        websiteUrl: fullHotel.websiteUrl,
                        checkInTime: fullHotel.checkInTime,
                        checkOutTime: fullHotel.checkOutTime,
                    } : null
                })() : null}
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
                        Manage Hotels
                    </Text>
                    <Text
                        size="2"
                        style={{
                            color: 'var(--accent-11)',
                            display: 'block',
                        }}
                    >
                        Here you can add, edit, and view your Hotels.
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
                                setCurrentPage(1) // Reset to first page on search
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
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button variant="soft" size="2">
                                        Columns
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    {[
                                        { key: 'name', label: 'Name' },
                                        { key: 'city', label: 'City' },
                                        { key: 'country', label: 'Country' },
                                        { key: 'rating', label: 'Rating' },
                                        { key: 'phone', label: 'Phone' },
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
                                Add New Hotel
                            </Button>
                        </Flex>
                    </Flex>
                </Card>

                {/* Table Section */}
                <Card style={{ padding: '16px' }}>
                    <Table
                        columns={columns}
                        rows={paginatedHotels}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        onHideColumn={handleHideColumn}
                    />
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
                        Page {currentPage} of {totalPages || 1}
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
                {filteredAndSortedHotels.length === 0 && (
                    <Box
                        style={{
                            padding: '48px',
                            textAlign: 'center',
                            color: 'var(--accent-11)',
                        }}
                    >
                        <Text size="3">No hotels found</Text>
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

export default Hotel