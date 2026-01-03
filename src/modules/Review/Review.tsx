import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'

import {
    fetchReviews,
    createReview,
    updateReviewById,
    deleteReviewById,
} from '../../features/ReviewSlice'
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
    Tabs,
} from '@radix-ui/themes'
import Table from '../../components/dynamicComponents/Table'
import AddReviewForm from './AddReviewForm'

type GoogleReviewData = {
    author_name: string
    rating: number
    text: string
    time: number
    profile_photo_url?: string
    relative_time_description?: string
}

type ReviewData = {
    id: string
    customerName: string
    rating: number
    reviewText: string
    date: string
    status: 'Approved' | 'Pending' | 'Rejected'
    packageName?: string
    packageCode?: string
    reviewerImageUrl?: string
    itineraryId?: string
}

const Review: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const reviews = useSelector((state: RootState) => state.review.reviews)
    const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)
    const loading = useSelector((state: RootState) => state.review.ui.loading)
    const error = useSelector((state: RootState) => state.review.ui.error)
    
    // Debug logging for customer reviews
    useEffect(() => {
        console.log("Customer Reviews from Redux:", reviews)
        console.log("Customer Reviews Count:", reviews.length)
        console.log("Loading:", loading)
        console.log("Error:", error)
    }, [reviews, loading, error])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null } | null>(null)
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(['customerName', 'rating', 'reviewText', 'date', 'status', 'packageName', 'actions'])
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<ReviewData | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [googleReview, setGoogleReview] = useState<GoogleReviewData[]>([])
    const [activeTab, setActiveTab] = useState('customer')
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        cancelText?: string
        onConfirm: () => void
        color?: 'red' | 'blue' | 'green' | 'gray'
    } | null>(null)

    useEffect(() => {
        const googleReviews = async () => {
            try {
                const response = await fetch(
                    getApiUrl("googleReview")
                )
                const data = await response.json()
                
                // Extract reviews from the nested response structure
                console.log("Google Reviews API Response:", data)
                
                if (data.success && data.data && data.data.reviews) {
                    // Map the transformed reviews to match GoogleReviewData type
                    const googleReviewsData = data.data.reviews.map((review: any) => ({
                        author_name: review.reviewer_name || review.customerName || review.author_name || 'Anonymous',
                        rating: review.rating || 0,
                        text: review.text || review.reviewText || '',
                        time: review.time || Date.now(),
                        profile_photo_url: review.reviewer_image || review.reviewerImageUrl || review.profile_photo_url,
                        relative_time_description: review.relative_time_description || ''
                    }))
                    console.log("Mapped Google Reviews:", googleReviewsData)
                    setGoogleReview(googleReviewsData)
                } else {
                    console.error("No reviews found in response. Response structure:", data)
                    setGoogleReview([])
                }
            } catch (error) {
                console.error("Failed to fetch Google reviews:", error)
                setGoogleReview([])
            }
        }

        googleReviews()
        dispatch(fetchReviews())
        dispatch(fetchItineraries())
    }, [dispatch])

    // Filter and sort reviews
    const filteredAndSortedReviews = useMemo(() => {
        console.log("Filtering Customer Reviews. Total:", reviews.length, "Search:", searchQuery)
        let filtered = reviews

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = reviews.filter(
                (review) =>
                    (review.customerName && review.customerName.toLowerCase().includes(query)) ||
                    (review.reviewText && review.reviewText.toLowerCase().includes(query)) ||
                    review.rating.toString().includes(query) ||
                    (review.date && review.date.includes(query)) ||
                    (review.status && review.status.toLowerCase().includes(query)) ||
                    (review.packageName && review.packageName.toLowerCase().includes(query)) ||
                    (review.packageCode && review.packageCode.includes(query))
            )
        }

        if (sortConfig && sortConfig.direction) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key as keyof ReviewData]
                const bValue = b[sortConfig.key as keyof ReviewData]

                if (aValue === undefined && bValue === undefined) return 0
                if (aValue === undefined) return 1
                if (bValue === undefined) return -1

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        console.log("Filtered Customer Reviews:", filtered.length)
        return filtered
    }, [reviews, searchQuery, sortConfig])

    // Filter Google reviews
    const filteredGoogleReviews = useMemo(() => {
        console.log("Filtering Google Reviews. Total:", googleReview.length, "Search:", searchQuery)
        if (!searchQuery.trim()) return googleReview

        const query = searchQuery.toLowerCase()
        const filtered = googleReview.filter(
            (review) =>
                review.author_name.toLowerCase().includes(query) ||
                review.text.toLowerCase().includes(query) ||
                review.rating.toString().includes(query)
        )
        console.log("Filtered Google Reviews:", filtered.length)
        return filtered
    }, [googleReview, searchQuery])

    // Pagination
    const currentReviews = activeTab === 'customer' ? filteredAndSortedReviews : filteredGoogleReviews
    const totalPages = Math.ceil(currentReviews.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedReviews = currentReviews.slice(startIndex, endIndex)
    
    // Debug logging
    console.log("Current Tab:", activeTab)
    console.log("Customer Reviews (filtered):", filteredAndSortedReviews.length)
    console.log("Google Reviews (filtered):", filteredGoogleReviews.length)
    console.log("Current Reviews Count:", currentReviews.length)
    console.log("Paginated Reviews Count:", paginatedReviews.length)
    if (activeTab === 'customer') {
        console.log("Paginated Customer Reviews:", paginatedReviews)
    } else {
        console.log("Paginated Google Reviews:", paginatedReviews)
    }

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

    const handleEdit = (review: ReviewData) => {
        setEditingReview(review)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingReview(null)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (values: Record<string, any>) => {
        const itineraryId = values.itineraryId && values.itineraryId.trim() !== '' 
            ? values.itineraryId 
            : null
        
        const packageName = values.packageName || null
        const today = new Date()
        const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

        try {
            if (editingReview) {
                await dispatch(updateReviewById({
                    id: editingReview.id,
                    data: {
                        customerName: values.reviewerName || '',
                        reviewerImageUrl: values.reviewerImageUrl || '',
                        reviewText: values.reviewText || '',
                        rating: values.rating || 5,
                        itineraryId: itineraryId,
                        packageName: packageName,
                    },
                })).unwrap()
                setDialogConfig({
                    title: 'Success',
                    description: `Review updated successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            } else {
                await dispatch(createReview({
                    customerName: values.reviewerName || '',
                    reviewerImageUrl: values.reviewerImageUrl || '',
                    reviewText: values.reviewText || '',
                    rating: values.rating || 5,
                    date: date,
                    status: 'Pending',
                    packageName: packageName,
                    itineraryId: itineraryId,
                })).unwrap()
                setDialogConfig({
                    title: 'Success',
                    description: `Review added successfully!`,
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => setDialogOpen(false),
                })
            }
            setDialogOpen(true)
            setIsFormOpen(false)
            setEditingReview(null)
        } catch (error: any) {
            setDialogConfig({
                title: 'Error',
                description: error?.message || 'Failed to save review',
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        }
    }

    const handleDelete = (review: ReviewData) => {
        setDialogConfig({
            title: 'Delete Review',
            description: `Are you sure you want to delete the review by "${review.customerName}"? This action cannot be undone.`,
            actionText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
            onConfirm: async () => {
                try {
                    await dispatch(deleteReviewById(review.id)).unwrap()
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Success',
                        description: `Review deleted successfully!`,
                        actionText: 'OK',
                        color: 'green',
                        onConfirm: () => setDialogOpen(false),
                    })
                    setDialogOpen(true)
                } catch (error: any) {
                    setDialogOpen(false)
                    setDialogConfig({
                        title: 'Error',
                        description: error?.message || 'Failed to delete review',
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

    const handleStatusChange = async (review: ReviewData, newStatus: 'Approved' | 'Pending' | 'Rejected') => {
        try {
            await dispatch(updateReviewById({
                id: review.id,
                data: { status: newStatus },
            })).unwrap()
            setDialogConfig({
                title: 'Success',
                description: `Review status updated to "${newStatus}"!`,
                actionText: 'OK',
                color: 'green',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        } catch (error: any) {
            setDialogConfig({
                title: 'Error',
                description: error?.message || 'Failed to update status',
                actionText: 'OK',
                color: 'red',
                onConfirm: () => setDialogOpen(false),
            })
            setDialogOpen(true)
        }
    }

    // Render rating
    const renderRating = (rating: number) => {
        return (
            <Flex align="center" gap="1">
                <Text size="2" weight="medium">
                    {rating}
                </Text>
                <Text size="2" style={{ color: '#fbbf24' }}>
                    {'★'.repeat(rating)}
                </Text>
                <Text size="2" style={{ color: '#e5e7eb' }}>
                    {'★'.repeat(5 - rating)}
                </Text>
            </Flex>
        )
    }

    // Render status
    const renderStatus = (status: 'Approved' | 'Pending' | 'Rejected') => {
        const colorMap = {
            Approved: 'green',
            Pending: 'yellow',
            Rejected: 'red',
        }
        return (
            <Badge color={colorMap[status] as any} size="2">
                {status}
            </Badge>
        )
    }

    // Render review text
    const renderReviewText = (text: string | undefined) => {
        if (!text) return <Text size="2">No review text</Text>
        const maxLength = 100
        const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
        return (
            <Text size="2" style={{ maxWidth: '300px' }}>
                {truncated}
            </Text>
        )
    }

    // Render actions
    const renderActions = (review: ReviewData) => {
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
                    <DropdownMenu.Item onClick={() => handleEdit(review)}>
                        <Flex align="center" gap="2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11.5 2.5L13.5 4.5L4.5 13.5H2.5V11.5L11.5 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <Text size="2">Edit</Text>
                        </Flex>
                    </DropdownMenu.Item>
                    {review.status !== 'Approved' && (
                        <DropdownMenu.Item onClick={() => handleStatusChange(review, 'Approved')}>
                            <Flex align="center" gap="2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M13.5 4.5L6 12L2.5 8.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <Text size="2">Approve</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    )}
                    {review.status !== 'Rejected' && (
                        <DropdownMenu.Item color="red" onClick={() => handleStatusChange(review, 'Rejected')}>
                            <Flex align="center" gap="2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 4L12 12M12 4L4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <Text size="2">Reject</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red" onClick={() => handleDelete(review)}>
                        <Flex align="center" gap="2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5Z" fill="currentColor" />
                                <path d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z" fill="currentColor" />
                            </svg>
                            <Text size="2">Delete</Text>
                        </Flex>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        )
    }

    // Google review helpers
    const renderGoogleReviewText = (text: string | undefined) => {
        if (!text) return <Text size="2">No review text</Text>
        const maxLength = 150
        const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text
        return (
            <Text size="2" style={{ maxWidth: '400px', lineHeight: '1.5' }}>
                {truncated}
            </Text>
        )
    }

    const renderReviewer = (review: GoogleReviewData) => {
        return (
            <Flex align="center" gap="2">
                {review.profile_photo_url && (
                    <img 
                        src={review.profile_photo_url} 
                        alt={review.author_name}
                        style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                )}
                <Text size="2" weight="medium">
                    {review.author_name}
                </Text>
            </Flex>
        )
    }

    // Customer reviews columns
    const customerColumns = [
        {
            key: 'customerName',
            label: 'Customer Name',
            width: '200px',
            sortable: true,
            render: (row: ReviewData) => (
                <Flex align="center" gap="2">
                    {row.reviewerImageUrl && (
                        <img 
                            src={row.reviewerImageUrl} 
                            alt={row.customerName}
                            style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                    <Text size="2" weight="medium">
                        {row.customerName}
                    </Text>
                </Flex>
            ),
        },
        {
            key: 'rating',
            label: 'Rating',
            width: '150px',
            sortable: true,
            render: (row: ReviewData) => renderRating(row.rating),
        },
        {
            key: 'reviewText',
            label: 'Review',
            width: '300px',
            sortable: false,
            render: (row: ReviewData) => renderReviewText(row.reviewText),
        },
        {
            key: 'packageName',
            label: 'Package',
            width: '200px',
            sortable: true,
            render: (row: ReviewData) => (
                <Text size="2">
                    {row.packageName || 'N/A'}
                </Text>
            ),
        },
        {
            key: 'date',
            label: 'Date',
            width: '120px',
            sortable: true,
            render: (row: ReviewData) => (
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                    {row.date}
                </Text>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            width: '120px',
            sortable: true,
            render: (row: ReviewData) => renderStatus(row.status),
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '80px',
            sortable: false,
            render: (row: ReviewData) => renderActions(row),
        },
    ]

    // Google reviews columns
    const googleColumns = [
        {
            key: 'author_name',
            label: 'Reviewer',
            width: '200px',
            sortable: true,
            render: (row: GoogleReviewData) => renderReviewer(row),
        },
        {
            key: 'rating',
            label: 'Rating',
            width: '150px',
            sortable: true,
            render: (row: GoogleReviewData) => renderRating(row.rating),
        },
        {
            key: 'text',
            label: 'Review',
            width: '400px',
            sortable: false,
            render: (row: GoogleReviewData) => renderGoogleReviewText(row.text), // Use row.text, not row.reviewText
        },
        {
            key: 'relative_time_description',
            label: 'Date',
            width: '150px',
            sortable: false,
            render: (row: GoogleReviewData) => (
                <Text size="2" style={{ color: 'var(--gray-11)' }}>
                    {row.relative_time_description || new Date(row.time * 1000).toLocaleDateString()}
                </Text>
            ),
        },
    ]

    return (
        <Box style={{ padding: '24px', position: 'relative', width: '100%' }}>
            <AddReviewForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false)
                    setEditingReview(null)
                }}
                onSubmit={handleFormSubmit}
                initialData={editingReview ? {
                    id: editingReview.id,
                    customerName: editingReview.customerName,
                    reviewerImageUrl: editingReview.reviewerImageUrl,
                    reviewText: editingReview.reviewText,
                    rating: editingReview.rating,
                    itineraryId: editingReview.itineraryId,
                    packageName: editingReview.packageName,
                } : null}
            />

            <Box style={{ width: '100%' }}>
                <Box style={{ marginBottom: '24px' }}>
                    <Text size="7" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}>
                        Manage Reviews
                    </Text>
                    <Text size="2" style={{ color: 'var(--accent-11)', display: 'block' }}>
                        View and manage customer reviews and Google reviews in one place.
                    </Text>
                </Box>

                <Card style={{ padding: '16px', marginBottom: '16px' }}>
                    <Flex gap="3" align="center" justify="between">
                        <TextField.Root
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            style={{ flex: 1, maxWidth: '400px' }}
                        >
                            <TextField.Slot>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

                        {activeTab === 'customer' && (
                            <Button variant="soft" size="2" onClick={handleAddNew} style={{ color: 'white', backgroundColor: 'var(--accent-9)', whiteSpace: 'nowrap' }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                                    <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Add New Review
                            </Button>
                        )}
                    </Flex>
                </Card>

                <Tabs.Root value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentPage(1); }}>
                    <Tabs.List>
                        <Tabs.Trigger value="customer">
                            Customer Reviews ({filteredAndSortedReviews.length})
                        </Tabs.Trigger>
                        <Tabs.Trigger value="google">
                            Google Reviews ({filteredGoogleReviews.length})
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Box style={{ marginTop: '16px' }}>
                        <Tabs.Content value="customer">
                            <Card style={{ padding: '16px' }}>
                                <Table
                                    columns={customerColumns}
                                    rows={paginatedReviews as ReviewData[]}
                                    onSort={handleSort}
                                    sortConfig={sortConfig}
                                    onHideColumn={handleHideColumn}
                                />
                            </Card>
                        </Tabs.Content>

                        <Tabs.Content value="google">
                            <Card style={{ padding: '16px' }}>
                                <Table
                                    columns={googleColumns}
                                    rows={paginatedReviews as GoogleReviewData[]}
                                    onSort={() => {}}
                                    sortConfig={null}
                                    onHideColumn={() => {}}
                                />
                            </Card>
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>

                <Flex justify="end" align="center" gap="2" style={{ marginTop: '16px' }}>
                    <Button
                        variant="soft"
                        size="2"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
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
                    >
                        Next
                    </Button>
                </Flex>

                {currentReviews.length === 0 && (
                    <Box style={{ padding: '48px', textAlign: 'center', color: 'var(--gray-11)' }}>
                        <Text size="3">No reviews found.</Text>
                    </Box>
                )}
            </Box>

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
                                <Button variant="solid" color={dialogConfig.color || 'red'} onClick={dialogConfig.onConfirm}>
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

export default Review