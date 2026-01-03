import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
    fetchContents,
    createContent,
    updateContentById,
    deleteContentById,
    type Content as ContentType,
} from '../../features/ContentSlice'
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
    Separator,
    Select,
    VisuallyHidden,
    TextArea,
} from '@radix-ui/themes'
import { Pencil1Icon, DotsHorizontalIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import Table from '../../components/dynamicComponents/Table'
import RichTextEditor from '../../components/dynamicComponents/RichTextEditor'
import EditHeroImage from './EditHeroImage'
import CancellationPolicy from './CancellationPolicy'
import { updateCancellationPolicy } from '../../features/CancellationPolicySlice'


type OfferBannerData = {
    id: string
    offerName: string
    categoryName: string
    expiredDate: string
    status: 'active' | 'inactive'
    imageUrl?: string
}

type OfferDetails = {
    headlines: string
    termsCondition: string
    cancellationPolicy: string[]
}

const Content: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    
    // Get data from Redux store
    const contentsFromStore = useSelector((state: RootState) => state.content.contents)
    const loading = useSelector((state: RootState) => state.content.ui.loading)
    const error = useSelector((state: RootState) => state.content.ui.error)

    const [searchQuery, setSearchQuery] = useState('')
    const [offers, setOffers] = useState<OfferBannerData[]>([])
    const [selectedOffer, setSelectedOffer] = useState<string>('Recent 10 Offers')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [offerToDelete, setOfferToDelete] = useState<string | null>(null)
    const [heroOpen, setHeroOpen] = useState(false)
    const [heroContentId, setHeroContentId] = useState<string | null>(null)
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
    const cancellationPolicyLoading = useSelector(
        (state: RootState) => state.cancellationPolicy.ui.loading
    )

    
    // Offer Details State
    const [offerDetails, setOfferDetails] = useState<OfferDetails>({
        headlines: 'Get 50% OFF on your next booking!',
        termsCondition: 'Terms and conditions apply. Valid for bookings made before June 30, 2024.',
        cancellationPolicy: [
            'Before 30 Days: Full Refund (After Deducting Any Expenses that have been Incurred for Hotel Bookings, Transport, etc.)',
            'Between 21-30 Days: 75% of the Total Trip Cost will be Refunded.',
            'Between 11-20 Days: 50% of the Total Trip cost will be Refunded.',
            'Between 0-10 Days: No Refund.',
        ],
    })
    const [editingField, setEditingField] = useState<string | null>(null)
    
    // Gallery State
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imageError, setImageError] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Add Content Form State
    const [addForm, setAddForm] = useState<Omit<ContentType, 'id'>>({
        offerName: '',
        categoryName: '',
        expiredDate: '',
        status: 'active',
        imageUrl: '',
        images: [],
        headlines: '',
        termsCondition: '',
        cancellationPolicy: '',
        description: '',
        discountPercentage: 0,
        discountAmount: 0,
        applicableCategories: [],
        applicableLocations: [],
        clicks: 0,
    })
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    // Fetch contents on mount
    useEffect(() => {
        dispatch(fetchContents())
    }, [dispatch])

// ✅ IMPROVED: Filter to show only actual offers (exclude hero-only records)
useEffect(() => {
    const mappedOffers = contentsFromStore
        .filter((item) => !!item.offerName && item.offerName.trim() !== '')
        .map((item) => ({
            id: item.id,
            offerName: item.offerName || '',
            categoryName: item.categoryName || '',
            expiredDate: item.expiredDate || new Date().toISOString().split('T')[0],
            status: item.status || 'active',
            imageUrl: item.imageUrl,
        }))
    setOffers(mappedOffers)
    
    // Auto-select first content if editingOfferId is not set
    // Use ANY content, not just ones with offerName (for cancellation policy)
    if (contentsFromStore.length > 0 && !editingOfferId) {
        // First try to find one with offerName
        let contentToUse = contentsFromStore.find((item) => !!item.offerName && item.offerName.trim() !== '')
        
        // If none found, use the first content anyway
        if (!contentToUse) {
            contentToUse = contentsFromStore[0]
        }
        
        if (contentToUse && contentToUse.id) {
            setEditingOfferId(contentToUse.id)
            
            // Load cancellation policy from content
            const cancellationPolicyArray = contentToUse.cancellationPolicy
                ? (typeof contentToUse.cancellationPolicy === 'string'
                    ? contentToUse.cancellationPolicy.split('\n').filter(p => p.trim() !== '')
                    : Array.isArray(contentToUse.cancellationPolicy)
                    ? contentToUse.cancellationPolicy
                    : [])
                : []
            
            setOfferDetails({
                headlines: contentToUse.headlines || '',
                termsCondition: contentToUse.termsCondition || '',
                cancellationPolicy: cancellationPolicyArray,
            })
        }
    }
}, [contentsFromStore, editingOfferId])
    // Calculate statistics
    const stats = useMemo(() => {
        const active = offers.filter((o) => o.status === 'active').length
        const inactive = offers.filter((o) => o.status === 'inactive').length
        const clicks = offers.reduce((sum, o) => sum + (o.status === 'active' ? Math.floor(Math.random() * 1000) : 0), 0)
        return { active, inactive, clicks }
    }, [offers])

    // Filter offers based on selected filter
    const filteredOffers = useMemo(() => {
        let filtered = [...offers]
        
        if (selectedOffer === 'Recent 10 Offers') {
            filtered = filtered.slice(0, 10)
        } else if (selectedOffer === 'Active Only') {
            filtered = filtered.filter((o) => o.status === 'active')
        } else if (selectedOffer === 'Inactive Only') {
            filtered = filtered.filter((o) => o.status === 'inactive')
        }
        
        if (searchQuery) {
            filtered = filtered.filter(
                (offer) =>
                    offer.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    offer.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        return filtered
    }, [offers, selectedOffer, searchQuery])

    // Pagination
    const paginatedOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredOffers.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredOffers, currentPage])

    const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const imageFiles = files.filter((file) => file.type.startsWith('image/'))
        
        if (imageFiles.length === 0) {
            setImageError('Please select valid image files')
            return
        }
        
        setUploadedImages((prev) => [...prev, ...imageFiles])
        setImageError('')
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        
        const files = Array.from(e.dataTransfer.files)
        const imageFiles = files.filter((file) => file.type.startsWith('image/'))
        
        if (imageFiles.length === 0) {
            setImageError('Please drop valid image files')
            return
        }
        
        setUploadedImages((prev) => [...prev, ...imageFiles])
        setImageError('')
    }

    const handleRemoveImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleUpload = () => {
        if (uploadedImages.length === 0) {
            setImageError('Please add an image to continue')
            return
        }
        
        // Here you would typically upload to server
        alert('Images uploaded successfully!')
        setUploadedImages([])
        setImageError('')
    }

    const handleDismiss = () => {
        setUploadedImages([])
        setImageError('')
    }

    // ✅ IMPROVED: Add new content with validation
    const handleAddContent = async () => {
        try {
            if (!addForm.offerName.trim()) {
                alert('Offer name is required')
                return
            }
            await dispatch(createContent(addForm)).unwrap()
            setAddDialogOpen(false)
            setAddForm({
                offerName: '',
                categoryName: '',
                expiredDate: '',
                status: 'active',
                imageUrl: '',
                images: [],
                headlines: '',
                termsCondition: '',
                cancellationPolicy: '',
                description: '',
                discountPercentage: 0,
                discountAmount: 0,
                applicableCategories: [],
                applicableLocations: [],
                clicks: 0,
            })
            dispatch(fetchContents())
        } catch (error: any) {
            alert(error.message || 'Failed to add content')
        }
    }

    const handleDelete = (id: string) => {
        setOfferToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (offerToDelete) {
            try {
                await dispatch(deleteContentById(offerToDelete)).unwrap()
                setDeleteDialogOpen(false)
                setOfferToDelete(null)
                dispatch(fetchContents())
            } catch (error: any) {
                alert(error.message || 'Failed to delete offer')
            }
        }
    }

    const handleEditField = (field: string) => {
        setEditingField(field)
    }

    const handleSaveField = async (field: keyof OfferDetails, value: string | string[]) => {
        try {
            setOfferDetails((prev) => ({ ...prev, [field]: value }))
            setEditingField(null)
            // If you have editingOfferId, update it:
            // if (editingOfferId) {
            //   const updateData: any = { [field]: value }
            //   // Convert cancellationPolicy array to string for backend
            //   if (field === 'cancellationPolicy' && Array.isArray(value)) {
            //     updateData.cancellationPolicy = value.join('\n')
            //   }
            //   await dispatch(updateContentById({ id: editingOfferId, data: updateData })).unwrap()
            //   dispatch(fetchContents())
            // }
        } catch (error: any) {
            alert(error.message || 'Failed to save field')
        }
    }

    const handleCancelEdit = () => {
        setEditingField(null)
    }

    // ✅ IMPROVED: Better edit handler
    const handleEditOffer = (offerId: string) => {
        const offerToEdit = contentsFromStore.find((c) => c.id === offerId)
        if (offerToEdit) {
            setEditingOfferId(offerId)
            
            // Convert cancellationPolicy from string to array if needed
            const cancellationPolicyArray = offerToEdit.cancellationPolicy
                ? (typeof offerToEdit.cancellationPolicy === 'string'
                    ? offerToEdit.cancellationPolicy.split('\n').filter(p => p.trim() !== '')
                    : Array.isArray(offerToEdit.cancellationPolicy)
                    ? offerToEdit.cancellationPolicy
                    : [])
                : []
            
            setOfferDetails({
                headlines: offerToEdit.headlines || '',
                termsCondition: offerToEdit.termsCondition || '',
                cancellationPolicy: cancellationPolicyArray,
            })
        }
    }

     // Add this new handler function
    const handleSaveCancellationPolicy = async (policies: string[]) => {
        try {
            // Update local state immediately
            setOfferDetails(prev => ({
                ...prev,
                cancellationPolicy: policies
            }))
            
            // Determine which content ID to use
            let contentIdToUse = editingOfferId
            
            // If no editingOfferId, try to use ANY content (not just ones with offerName)
            if (!contentIdToUse) {
                if (contentsFromStore.length > 0) {
                    // Use first content, even if it doesn't have offerName
                    const firstContent = contentsFromStore[0]
                    if (firstContent && firstContent.id) {
                        contentIdToUse = firstContent.id
                        setEditingOfferId(firstContent.id)
                    }
                }
            }
            
            // If still no content ID, create a default content
            if (!contentIdToUse) {
                try {
                    const defaultContent = {
                        offerName: 'Default Content',
                        categoryName: 'General',
                        expiredDate: new Date().toISOString().split('T')[0],
                        status: 'active' as const,
                        cancellationPolicy: policies, // Save policies during creation
                    }
                    
                    const newContent = await dispatch(createContent(defaultContent)).unwrap()
                    contentIdToUse = newContent.id
                    setEditingOfferId(newContent.id)
                    
                    // Refresh contents
                    await dispatch(fetchContents())
                } catch (createError: any) {
                    alert('Failed to create content. Please create a content/offer first.')
                    return
                }
            }
            
            // Now save the cancellation policy
            if (contentIdToUse) {
                await dispatch(updateCancellationPolicy({
                    contentId: contentIdToUse,
                    policies: policies
                })).unwrap()
                
                // Refresh contents to get updated data
                await dispatch(fetchContents())
                
                // Show success message
                alert('Cancellation policy saved successfully!')
            } else {
                throw new Error('Unable to determine content ID')
            }
        } catch (error: any) {
            alert(error.message || 'Failed to save cancellation policy. Please check the console for details.')
        }
    }
    // Table columns
    const columns = [
        { key: 'srNo', label: 'Sr No.', width: '80px', sortable: false },
        { key: 'offerName', label: 'Offer Name', width: '200px', sortable: true },
        { key: 'categoryName', label: 'Category Name', width: '150px', sortable: true },
        { key: 'expiredDate', label: 'Expired Date', width: '140px', sortable: true },
        { key: 'status', label: 'Status', width: '120px', sortable: true },
        { key: 'actions', label: 'Actions', width: '100px', sortable: false },
    ]

    const renderActions = (row: OfferBannerData) => {
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <IconButton variant="ghost" size="2">
                        <DotsHorizontalIcon />
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => handleEditOffer(row.id)}>
                        Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        color="red"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        )
    }

    const tableData = paginatedOffers.map((offer, index) => ({
        ...offer,
        srNo: (currentPage - 1) * itemsPerPage + index + 1,
        status: (
            <Badge
                color={offer.status === 'active' ? 'green' : 'gray'}
                variant="soft"
            >
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Badge>
        ),
        expiredDate: new Date(offer.expiredDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }),
        actions: renderActions(offer),
    }))

    return (
        <Box style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
            {/* ✅ IMPROVED: Show loading/error states */}
            {loading && <Text color="blue" mb="3">Loading content...</Text>}
            {error && <Text color="red" mb="3">Error: {error}</Text>}

            {/* Add Content Dialog */}
            <AlertDialog.Root open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <AlertDialog.Content maxWidth="500px">
                    <AlertDialog.Title>Add New Content</AlertDialog.Title>
                    <AlertDialog.Description>
                        Fill in the details to add a new content/offer.
                    </AlertDialog.Description>
                    <Box mt="3">
                        <TextField.Root
                            placeholder="Offer Name *"
                            value={addForm.offerName}
                            onChange={e => setAddForm(f => ({ ...f, offerName: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextField.Root
                            placeholder="Category Name"
                            value={addForm.categoryName}
                            onChange={e => setAddForm(f => ({ ...f, categoryName: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextField.Root
                            placeholder="Expired Date (YYYY-MM-DD)"
                            type="date"
                            value={addForm.expiredDate}
                            onChange={e => setAddForm(f => ({ ...f, expiredDate: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <Select.Root
                            value={addForm.status}
                            onValueChange={v => setAddForm(f => ({ ...f, status: v as 'active' | 'inactive' }))}
                        >
                            <Select.Trigger style={{ width: '100%', marginBottom: 12 }} />
                            <Select.Content>
                                <Select.Item value="active">Active</Select.Item>
                                <Select.Item value="inactive">Inactive</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <TextField.Root
                            placeholder="Image URL"
                            value={addForm.imageUrl}
                            onChange={e => setAddForm(f => ({ ...f, imageUrl: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextArea
                            placeholder="Headlines"
                            value={addForm.headlines}
                            onChange={e => setAddForm(f => ({ ...f, headlines: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextArea
                            placeholder="Terms & Conditions"
                            value={addForm.termsCondition}
                            onChange={e => setAddForm(f => ({ ...f, termsCondition: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextArea
                            placeholder="Description"
                            value={addForm.description}
                            onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextField.Root
                            placeholder="Discount Percentage"
                            type="number"
                            value={addForm.discountPercentage?.toString() || ''}
                            onChange={e => setAddForm(f => ({ ...f, discountPercentage: Number(e.target.value) }))}
                            style={{ marginBottom: 12 }}
                        />
                        <TextField.Root
                            placeholder="Discount Amount"
                            type="number"
                            value={addForm.discountAmount?.toString() || ''}
                            onChange={e => setAddForm(f => ({ ...f, discountAmount: Number(e.target.value) }))}
                            style={{ marginBottom: 12 }}
                        />
                    </Box>
                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <Button color="green" onClick={handleAddContent} disabled={loading}>
                            Add
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>

            {/* Header */}
            <Flex justify="between" align="center" mb="6">
                <Box>
                    <Text size="8" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}>
                        Content Management
                    </Text>
                    <Text size="3" style={{ color: 'var(--accent-11)' }}>
                        Manage your website content, promotional offers, and hero sections
                    </Text>
                </Box>
                <Flex gap="2">
                    <Button
                        size="3"
                        variant="soft"
                        onClick={() => {
                            setHeroContentId(contentsFromStore[0]?.id || 'temp-hero')
                            setHeroOpen(true)
                        }}
                    >
                        Edit Hero Section
                    </Button>
                    <Button
                        size="3"
                        variant="soft"
                        onClick={() => setAddDialogOpen(true)}
                    >
                        Add Content
                    </Button>
                </Flex>
            </Flex>

            <Flex gap="6" direction={{ initial: 'column', lg: 'row' }}>
                {/* Left Column */}
                <Box style={{ flex: 1 }}>
                    {/* Offer Details Section */}
                    <Card style={{ padding: '24px', marginBottom: '24px' }}>
                        <Text size="6" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '20px', display: 'block' }}>
                            Offer Details
                        </Text>
                        
                        {/* Offer Headlines Card */}
                        <Card style={{ padding: '16px', marginBottom: '16px', backgroundColor: 'var(--accent-2)' }}>
                            <Flex justify="between" align="start">
                                <Box style={{ flex: 1 }}>
                                    <Text size="2" weight="medium" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                                        Offer Headlines
                                    </Text>
                                    {editingField === 'headlines' ? (
                                        <Box>
                                            <TextArea
                                                value={offerDetails.headlines}
                                                onChange={(e) => setOfferDetails((prev) => ({ ...prev, headlines: e.target.value }))}
                                                style={{ marginBottom: '8px', minHeight: '80px' }}
                                            />
                                            <Flex gap="2">
                                                <Button size="2" onClick={() => handleSaveField('headlines', offerDetails.headlines)}>
                                                    Save
                                                </Button>
                                                <Button size="2" variant="soft" onClick={handleCancelEdit}>
                                                    Cancel
                                                </Button>
                                            </Flex>
                                        </Box>
                                    ) : (
                                        <Text size="3" style={{ color: 'var(--accent-12)' }}>
                                            {offerDetails.headlines}
                                        </Text>
                                    )}
                                </Box>
                                <Flex gap="2">
                                    <IconButton
                                        variant="ghost"
                                        size="2"
                                        onClick={() => handleEditField('headlines')}
                                    >
                                        <Pencil1Icon />
                                    </IconButton>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <IconButton variant="ghost" size="2">
                                                <DotsHorizontalIcon />
                                            </IconButton>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item>View</DropdownMenu.Item>
                                            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Flex>
                            </Flex>
                        </Card>

                        {/* Terms & Condition Card */}
                        <Card style={{ padding: '16px', marginBottom: '16px', backgroundColor: 'var(--accent-2)' }}>
                            <Flex justify="between" align="start">
                                <Box style={{ flex: 1 }}>
                                    <Text size="2" weight="medium" style={{ color: 'var(--accent-11)', marginBottom: '8px', display: 'block' }}>
                                        Terms & Condition
                                    </Text>
                                    {editingField === 'termsCondition' ? (
                                        <Box>
                                            <RichTextEditor
                                                value={offerDetails.termsCondition}
                                                onChange={(value) => setOfferDetails((prev) => ({ ...prev, termsCondition: value }))}
                                                placeholder="Enter terms and conditions..."
                                                height="150px"
                                            />
                                            <Flex gap="2" mt="3">
                                                <Button size="2" onClick={() => handleSaveField('termsCondition', offerDetails.termsCondition)}>
                                                    Save
                                                </Button>
                                                <Button size="2" variant="soft" onClick={handleCancelEdit}>
                                                    Cancel
                                                </Button>
                                            </Flex>
                                        </Box>
                                    ) : (
                                        <Text size="3" style={{ color: 'var(--accent-12)' }}>
                                            {offerDetails.termsCondition}
                                        </Text>
                                    )}
                                </Box>
                                <Flex gap="2">
                                    <IconButton
                                        variant="ghost"
                                        size="2"
                                        onClick={() => handleEditField('termsCondition')}
                                    >
                                        <Pencil1Icon style={{ color: '#FF6B35' }} />
                                    </IconButton>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger>
                                            <IconButton variant="ghost" size="2">
                                                <DotsHorizontalIcon />
                                            </IconButton>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item>View</DropdownMenu.Item>
                                            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Flex>
                            </Flex>
                        </Card>

                        {/* Cancellation Policy Card */}
                        <CancellationPolicy
                            policies={offerDetails.cancellationPolicy}
                            onSave={handleSaveCancellationPolicy}
                            loading={cancellationPolicyLoading}
                        />
                    </Card>

                    

                    {/* Gallery Section */}
                    <Card style={{ padding: '24px' }}>
                        <Text size="6" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '16px', display: 'block' }}>
                            Gallery
                        </Text>
                        
                        <Text size="4" weight="medium" style={{ color: 'var(--accent-11)', marginBottom: '16px', display: 'block' }}>
                            Upload & View Images
                        </Text>

                        <Flex gap="4" direction={{ initial: 'column', md: 'row' }}>
                            {/* Upload Zone */}
                            <Box style={{ flex: 1 }}>
                                <Box
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    style={{
                                        border: `2px dashed ${isDragging ? 'var(--accent-9)' : 'var(--accent-6)'}`,
                                        borderRadius: '8px',
                                        padding: '40px',
                                        textAlign: 'center',
                                        backgroundColor: isDragging ? 'var(--accent-2)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="image/*,.zip,.pdf,.doc,.docx"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                    />
                                    <Box style={{ marginBottom: '16px' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-11)' }}>
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </Box>
                                    <Text size="3" weight="medium" style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}>
                                        Drag & Drop or choose file to upload
                                    </Text>
                                    <Text size="2" style={{ color: 'var(--accent-11)' }}>
                                        Select zip, image, pdf or ms.word
                                    </Text>
                                </Box>
                                {imageError && (
                                    <Text size="2" style={{ color: 'var(--red-9)', marginTop: '8px', display: 'block' }}>
                                        {imageError}
                                    </Text>
                                )}
                            </Box>

                            {/* Uploaded Pictures */}
                            <Box style={{ flex: 1 }}>
                                <Text size="3" weight="medium" style={{ color: 'var(--accent-12)', marginBottom: '12px', display: 'block' }}>
                                    Uploaded Pictures ({uploadedImages.length})
                                </Text>
                                {uploadedImages.length === 0 ? (
                                    <Box
                                        style={{
                                            border: '1px dashed var(--accent-6)',
                                            borderRadius: '8px',
                                            padding: '40px',
                                            textAlign: 'center',
                                            backgroundColor: 'var(--accent-2)',
                                        }}
                                    >
                                        <Text size="2" style={{ color: 'var(--accent-11)' }}>
                                            No images uploaded yet
                                        </Text>
                                    </Box>
                                ) : (
                                    <Box
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                            gap: '12px',
                                        }}
                                    >
                                        {uploadedImages.map((image, index) => (
                                            <Box
                                                key={index}
                                                style={{
                                                    position: 'relative',
                                                    aspectRatio: '1',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    border: '1px solid var(--accent-6)',
                                                }}
                                            >
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Uploaded ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <IconButton
                                                    variant="solid"
                                                    color="red"
                                                    size="1"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        right: '4px',
                                                    }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <Cross2Icon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Flex>

                        {/* Action Buttons */}
                        <Flex gap="3" mt="4">
                            <Button
                                variant="outline"
                                size="3"
                                onClick={handleDismiss}
                            >
                                Dismiss
                            </Button>
                            <Button
                                size="3"
                                variant="soft"
                                onClick={handleUpload}
                                disabled={uploadedImages.length === 0}
                            >
                                Upload
                            </Button>
                        </Flex>
                    </Card>
                </Box>

                {/* Right Column */}
                <Box style={{ width: '100%', maxWidth: '500px' }}>
                    {/* Summary Card */}
                    <Card style={{ padding: '24px', marginBottom: '24px', backgroundColor: 'var(--accent-3)' }}>
                        <Text size="6" weight="bold" style={{ color: 'var(--accent-12)', marginBottom: '20px', display: 'block' }}>
                            Promotional Offers Banners
                        </Text>
                        
                        <Flex direction="column" gap="3">
                            <Flex justify="between" align="center">
                                <Text size="4" style={{ color: 'var(--accent-11)' }}>
                                    Active Offers:
                                </Text>
                                <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
                                    {stats.active}
                                </Text>
                            </Flex>
                            <Flex justify="between" align="center">
                                <Text size="4" style={{ color: 'var(--accent-11)' }}>
                                    Inactive:
                                </Text>
                                <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
                                    {stats.inactive}
                                </Text>
                            </Flex>
                            <Flex justify="between" align="center">
                                <Text size="4" style={{ color: 'var(--accent-11)' }}>
                                    Clicks:
                                </Text>
                                <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
                                    {stats.clicks}
                                </Text>
                            </Flex>
                        </Flex>

                        <Button
                            size="3"
                            variant="soft"
                            style={{ width: '100%', marginTop: '20px' }}
                            onClick={() => setAddDialogOpen(true)}
                        >
                            <PlusIcon style={{ marginRight: '8px' }} />
                            Upload new banner
                        </Button>
                    </Card>

                    {/* Offers Table */}
                    <Card style={{ padding: '24px' }}>
                        <Flex justify="between" align="center" mb="4">
                            <Text size="6" weight="bold" style={{ color: 'var(--accent-12)' }}>
                                Offers List
                            </Text>
                            <Select.Root value={selectedOffer} onValueChange={setSelectedOffer}>
                                <Select.Trigger style={{ width: '180px' }} />
                                <Select.Content>
                                    <Select.Item value="Recent 10 Offers">Recent 10 Offers</Select.Item>
                                    <Select.Item value="All Offers">All Offers</Select.Item>
                                    <Select.Item value="Active Only">Active Only</Select.Item>
                                    <Select.Item value="Inactive Only">Inactive Only</Select.Item>
                                </Select.Content>
                            </Select.Root>
                        </Flex>

                        <Box mb="4">
                            <TextField.Root
                                placeholder="Search offers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            >
                                <TextField.Slot>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="7" cy="7" r="6" />
                                        <path d="m12 12-3-3" />
                                    </svg>
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        <Table
                            columns={columns}
                            rows={tableData}
                            onSort={(key, direction) => console.log('Sort:', key, direction)}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Flex justify="between" align="center" mt="4">
                                <Text size="2" style={{ color: 'var(--accent-11)' }}>
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOffers.length)} of {filteredOffers.length} offers
                                </Text>
                                <Flex gap="2">
                                    <Button
                                        variant="outline"
                                        size="2"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Text size="2" style={{ color: 'var(--accent-11)', alignSelf: 'center' }}>
                                        Page {currentPage} of {totalPages}
                                    </Text>
                                    <Button
                                        variant="outline"
                                        size="2"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    </Card>
                </Box>
            </Flex>

            {/* Delete Confirmation Dialog */}
            <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialog.Content>
                    <AlertDialog.Title>Delete Offer</AlertDialog.Title>
                    <AlertDialog.Description>
                        Are you sure you want to delete this offer? This action cannot be undone.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button color="red" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>

            {/* HERO EDIT MODAL */}
            {heroOpen && heroContentId && (
  <AlertDialog.Root open={heroOpen} onOpenChange={setHeroOpen}>
    <AlertDialog.Content maxWidth="600px">
      <AlertDialog.Title>
        <VisuallyHidden>Edit Hero Section</VisuallyHidden>
      </AlertDialog.Title>

      <AlertDialog.Description>
        Update hero title, description, background image, and cards.
      </AlertDialog.Description>

      <EditHeroImage
        contentId={heroContentId}
        onClose={() => setHeroOpen(false)}
      />
    </AlertDialog.Content>
  </AlertDialog.Root>
)}

        </Box>
    )
}

export default Content