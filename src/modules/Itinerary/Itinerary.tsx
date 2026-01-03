import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { getImageUrl, getApiUrl } from '../../config/api'
import {
    fetchItineraries,
    fetchItineraryById,
    createItinerary,
    updateItineraryById,
    deleteItineraryById,
} from '../../features/ItinerarySlice'
import {
    fetchCategoryById,
    updateCategoryById,
    fetchCategories,
} from '../../features/CategorySlice'
import {
    fetchLocationById,
    updateLocationById,
    fetchLocations,
} from '../../features/LocationSlice'
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
            name: item.name,
            city: item.city,
            price: item.price || 0, // Ensure price is always a number
            priceDisplay: item.priceDisplay || (item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : '₹0'),
            status: item.status === 'active' || item.status === 'Active' ? 'Active' : 'Inactive',
            trending: item.trending || 'No',
        }))
    }, [itinerariesFromStore])

    const itemsPerPage = 10

    const handleEdit = async (itinerary: ItineraryData) => {
        try {
            // Fetch the full itinerary data from the API
            const fullItinerary = await dispatch(fetchItineraryById(itinerary.id)).unwrap()
            
            // Navigate with the full itinerary data
            navigate('/dashboard/add-itinerary', {
                state: { 
                    itineraryData: fullItinerary
                },
            })
        } catch (error) {
            console.error('Error fetching itinerary:', error)
            // Fallback: try to use Redux store data
            const originalItinerary = itinerariesFromStore.find(i => i.id === itinerary.id)
            if (originalItinerary) {
                navigate('/dashboard/add-itinerary', {
                    state: { 
                        itineraryData: originalItinerary
                },
            })
        } else {
                // Last fallback: pass what we have
            navigate('/dashboard/add-itinerary', {
                state: { itineraryData: itinerary },
            })
            }
        }
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
                    // Fetch the full itinerary data from the API
                    const fullItinerary = await dispatch(fetchItineraryById(itinerary.id)).unwrap()
                    
                    // Transform the full itinerary data to match createItinerary payload format
                    const travelLocationValue = (fullItinerary as any).travelLocation;
                    // Only include travelLocation if it's a valid ObjectId string, not null or empty
                    const validTravelLocation = travelLocationValue && 
                        travelLocationValue !== 'null' && 
                        travelLocationValue !== null && 
                        travelLocationValue !== '' 
                        ? travelLocationValue 
                        : undefined;
                    
                    const duplicatePayload: any = {
                        name: `${fullItinerary.name || itinerary.name} (Copy)`,
                        city: fullItinerary.city || '',
                        description: fullItinerary.description || '',
                        shortDescription: (fullItinerary as any).shortDescription || (fullItinerary as any).short_description || '',
                        duration: fullItinerary.duration || '',
                        price: fullItinerary.price || 0,
                        status: (fullItinerary.status === 'active' || fullItinerary.status === 'Active' ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
                        trending: fullItinerary.trending || 'No',
                        ...(validTravelLocation && { travelLocation: validTravelLocation }),
                        categories: Array.isArray(fullItinerary.categories) 
                            ? fullItinerary.categories.map((cat: any) => 
                                typeof cat === 'object' && cat !== null ? (cat._id || cat.id) : cat
                              ).filter((id: any) => id)
                            : [],
                        altitude: (fullItinerary as any).altitude || '',
                        scenary: (fullItinerary as any).scenary || '',
                        culturalSite: (fullItinerary as any).culturalSite || (fullItinerary as any).cultural_site || '',
                        isCustomize: (fullItinerary as any).isCustomize || (fullItinerary as any).is_customize || 'not_specified',
                        notes: (fullItinerary as any).notes || '',
                        inclusions: Array.isArray(fullItinerary.inclusions) ? fullItinerary.inclusions : [],
                        exclusions: Array.isArray(fullItinerary.exclusions) ? fullItinerary.exclusions : [],
                        startDate: fullItinerary.startDate || new Date().toISOString(),
                        endDate: fullItinerary.endDate || new Date().toISOString(),
                        // Map daywise activities
                        daywiseActivities: Array.isArray((fullItinerary as any).daywiseActivities) 
                            ? (fullItinerary as any).daywiseActivities.map((activity: any) => ({
                                day: activity.day || 0,
                                title: activity.title || '',
                                description: activity.description || '',
                                activities: Array.isArray(activity.activities) ? activity.activities : [],
                                meals: Array.isArray(activity.meals) 
                                    ? activity.meals.map((meal: any) => typeof meal === 'string' ? meal : meal.name).filter(Boolean)
                                    : [],
                                accommodation: activity.accommodation || '',
                            }))
                            : [],
                        // Map hotel details
                        hotelDetails: Array.isArray((fullItinerary as any).hotelDetails) 
                            ? (fullItinerary as any).hotelDetails.map((hotel: any) => ({
                                hotelName: hotel.hotelName || hotel.name || '',
                                stars: hotel.stars || '',
                                reference: hotel.reference || '',
                                checkIn: hotel.checkIn || '',
                                checkOut: hotel.checkOut || '',
                                nights: hotel.nights || 0,
                            }))
                            : [],
                        // Map packages
                        packages: (() => {
                            const pkgData = (fullItinerary as any).packages || {};
                            return {
                                basePackages: Array.isArray(pkgData.basePackages) 
                                    ? pkgData.basePackages.map((pkg: any) => ({
                                        packageType: 'base',
                                        name: pkg.name || '',
                                        price: pkg.price || 0,
                                        original_price: pkg.original_price || pkg.originalPrice || 0,
                                        inclusions: pkg.inclusions || [],
                                        exclusions: pkg.exclusions || [],
                                    }))
                                    : [],
                                pickupPoint: Array.isArray(pkgData.pickupPoint) 
                                    ? pkgData.pickupPoint.map((point: any) => ({
                                        packageType: 'pickup',
                                        name: point.name || '',
                                        price: point.price || 0,
                                    }))
                                    : [],
                                dropPoint: Array.isArray(pkgData.dropPoint) 
                                    ? pkgData.dropPoint.map((point: any) => ({
                                        packageType: 'drop',
                                        name: point.name || '',
                                        price: point.price || 0,
                                    }))
                                    : [],
                            };
                        })(),
                        // Map batches
                        batches: Array.isArray((fullItinerary as any).batches) 
                            ? (fullItinerary as any).batches.map((batch: any) => ({
                                batchName: batch.batchName || '',
                                startDate: batch.startDate || batch.start_date || null,
                                endDate: batch.endDate || batch.end_date || null,
                                price: batch.price || batch.extra_amount || 0,
                                availableSeats: batch.availableSeats || 0,
                                bookedSeats: batch.bookedSeats || 0,
                            }))
                            : [],
                        // Map SEO fields
                        seoFields: (fullItinerary as any).seoFields || (fullItinerary as any).seo_fields || {},
                        // Don't include images/brochureBanner in payload - we'll send them as files or URLs separately
                    };

                    // Helper function to convert image URL to File
                    const urlToFile = async (url: string, filename: string): Promise<File | null> => {
                        try {
                            if (!url || url === '' || url.startsWith('blob:')) {
                                console.log('Skipping invalid URL:', url);
                                return null;
                            }
                            
                            // Convert relative URLs to absolute
                            let absoluteUrl = url;
                            if (url.startsWith('/')) {
                                absoluteUrl = getImageUrl(url);
                            } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                absoluteUrl = getImageUrl(`/${url}`);
                            }
                            
                            console.log('Fetching image from:', absoluteUrl);
                            const response = await fetch(absoluteUrl, {
                                credentials: 'include',
                                mode: 'cors',
                            });
                            
                            if (!response.ok) {
                                console.error('Failed to fetch image:', response.status, response.statusText);
                                return null;
                            }
                            
                            const blob = await response.blob();
                            if (blob.size === 0) {
                                console.error('Empty blob received');
                                return null;
                            }
                            
                            return new File([blob], filename, { type: blob.type || 'image/jpeg' });
                        } catch (error) {
                            console.error('Error converting URL to File:', url, error);
                            return null;
                        }
                    };

                    // Fetch and convert images - images are stored as Buffer in MongoDB
                    // We need to fetch them from the backend image endpoints
                    const imageFiles: File[] = [];
                    const images = (fullItinerary as any).images || [];
                    console.log('Original images array:', Array.isArray(images) ? images.length : 'not array');
                    
                    // If images exist (even as Buffer), fetch them from the backend endpoint
                    // Try to fetch images from the itinerary's image endpoint
                    if (Array.isArray(images) && images.length > 0) {
                        for (let i = 0; i < images.length; i++) {
                            try {
                                // Construct URL to fetch image from backend
                                const imageUrl = getImageUrl(`/api/itinerary/${itinerary.id}/image/${i}`);
                                console.log(`Fetching image ${i} from:`, imageUrl);
                                const file = await urlToFile(imageUrl, `image-${i}.jpg`);
                                if (file) {
                                    console.log(`Successfully converted image ${i} to file:`, file.name, file.size);
                                    imageFiles.push(file);
                                } else {
                                    console.warn(`Failed to convert image ${i}`);
                                }
                            } catch (error) {
                                console.warn(`Error fetching image ${i}:`, error);
                            }
                        }
                    } else {
                        // Try fetching from main image endpoint (index 0)
                        try {
                            const imageUrl = getImageUrl(`/api/itinerary/${itinerary.id}/image/0`);
                            console.log('Trying main image endpoint:', imageUrl);
                            const file = await urlToFile(imageUrl, 'image-0.jpg');
                            if (file) imageFiles.push(file);
                        } catch (error) {
                            console.warn('Error fetching main image:', error);
                        }
                    }
                    
                    console.log('Total image files converted:', imageFiles.length);

                    // Fetch and convert brochure banner
                    let brochureBannerFile: File | undefined = undefined;
                    const brochureBanner = (fullItinerary as any).brochureBanner || (fullItinerary as any).brochure_banner;
                    if (brochureBanner && typeof brochureBanner === 'string') {
                        const file = await urlToFile(brochureBanner, 'brochure-banner.jpg');
                        if (file) brochureBannerFile = file;
                    }

                    // Fetch and convert hotel images
                    const hotelImageFiles: { hotelIndex: number, imageIndex: number, file: File }[] = [];
                    if (Array.isArray((fullItinerary as any).hotelDetails)) {
                        for (let hotelIndex = 0; hotelIndex < (fullItinerary as any).hotelDetails.length; hotelIndex++) {
                            const hotel = (fullItinerary as any).hotelDetails[hotelIndex];
                            const hotelImages = hotel?.images || [];
                            if (Array.isArray(hotelImages)) {
                                for (let imageIndex = 0; imageIndex < hotelImages.length; imageIndex++) {
                                    const imageUrl = hotelImages[imageIndex];
                                    if (imageUrl && typeof imageUrl === 'string') {
                                        const file = await urlToFile(imageUrl, `hotel-${hotelIndex}-${imageIndex}.jpg`);
                                        if (file) hotelImageFiles.push({ hotelIndex, imageIndex, file });
                                    }
                                }
                            }
                        }
                    }

                    // Fetch and convert daywise activity images
                    const dayImageFiles: { dayIndex: number, imageIndex: number, file: File }[] = [];
                    const mealImageFiles: { dayIndex: number, mealName: string, imageIndex: number, file: File }[] = [];
                    const stayImageFiles: { dayIndex: number, stayName: string, imageIndex: number, file: File }[] = [];
                    
                    if (Array.isArray((fullItinerary as any).daywiseActivities)) {
                        for (let dayIndex = 0; dayIndex < (fullItinerary as any).daywiseActivities.length; dayIndex++) {
                            const activity = (fullItinerary as any).daywiseActivities[dayIndex];
                            
                            // Day images
                            const dayImages = activity?.images || [];
                            if (Array.isArray(dayImages)) {
                                for (let imageIndex = 0; imageIndex < dayImages.length; imageIndex++) {
                                    const imageUrl = dayImages[imageIndex];
                                    if (imageUrl && typeof imageUrl === 'string') {
                                        const file = await urlToFile(imageUrl, `day-${dayIndex}-${imageIndex}.jpg`);
                                        if (file) dayImageFiles.push({ dayIndex, imageIndex, file });
                                    }
                                }
                            }
                            
                            // Meal images
                            const meals = activity?.meals || [];
                            if (Array.isArray(meals)) {
                                for (const meal of meals) {
                                    const mealName = typeof meal === 'string' ? meal : meal.name;
                                    const mealImages = typeof meal === 'object' ? (meal.images || []) : [];
                                    if (Array.isArray(mealImages)) {
                                        for (let imageIndex = 0; imageIndex < mealImages.length; imageIndex++) {
                                            const imageUrl = mealImages[imageIndex];
                                            if (imageUrl && typeof imageUrl === 'string') {
                                                const file = await urlToFile(imageUrl, `meal-${dayIndex}-${mealName}-${imageIndex}.jpg`);
                                                if (file) mealImageFiles.push({ dayIndex, mealName, imageIndex, file });
                                            }
                                        }
                                    }
                                }
                            }
                            
                            // Stay images
                            const stays = activity?.stays || [];
                            if (Array.isArray(stays)) {
                                for (const stay of stays) {
                                    const stayName = typeof stay === 'string' ? stay : stay.name;
                                    const stayImages = typeof stay === 'object' ? (stay.images || []) : [];
                                    if (Array.isArray(stayImages)) {
                                        for (let imageIndex = 0; imageIndex < stayImages.length; imageIndex++) {
                                            const imageUrl = stayImages[imageIndex];
                                            if (imageUrl && typeof imageUrl === 'string') {
                                                const file = await urlToFile(imageUrl, `stay-${dayIndex}-${stayName}-${imageIndex}.jpg`);
                                                if (file) stayImageFiles.push({ dayIndex, stayName, imageIndex, file });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                        const newItinerary = await dispatch(
                            createItinerary({
                            payload: duplicatePayload,
                            imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
                            brochureBannerFile: brochureBannerFile,
                            hotelImageFiles: hotelImageFiles.length > 0 ? hotelImageFiles : undefined,
                            dayImageFiles: dayImageFiles.length > 0 ? dayImageFiles : undefined,
                            mealImageFiles: mealImageFiles.length > 0 ? mealImageFiles : undefined,
                            stayImageFiles: stayImageFiles.length > 0 ? stayImageFiles : undefined,
                            })
                        ).unwrap()
                        
                        const newItineraryId = newItinerary.id;
                        
                        // Update categories - add duplicate itinerary ID to each selected category
                        const categoryIds = duplicatePayload.categories || [];
                        for (const categoryId of categoryIds) {
                            try {
                                const category = await dispatch(fetchCategoryById(categoryId)).unwrap();
                                const currentItineraries = category.itineraries || [];
                                if (!currentItineraries.includes(newItineraryId)) {
                                    await dispatch(updateCategoryById({
                                        id: categoryId,
                                        data: { itineraries: [...currentItineraries, newItineraryId] }
                                    })).unwrap();
                                }
                            } catch (error) {
                                console.error(`Error updating category ${categoryId}:`, error);
                            }
                        }
                        
                        // Update location - add duplicate itinerary ID to selected location
                        if (validTravelLocation) {
                            try {
                                const location = await dispatch(fetchLocationById(validTravelLocation)).unwrap();
                                const currentItineraries = location.itineraries || [];
                                if (!currentItineraries.includes(newItineraryId)) {
                                    await dispatch(updateLocationById({
                                        id: validTravelLocation,
                                        data: { itineraries: [...currentItineraries, newItineraryId] }
                                    })).unwrap();
                                }
                            } catch (error) {
                                console.error(`Error updating location ${validTravelLocation}:`, error);
                            }
                        }
                        
                        // Refresh the itinerary list, categories, and locations
                        await dispatch(fetchItineraries())
                        dispatch(fetchCategories())
                        dispatch(fetchLocations())
                    
                        setDialogOpen(false)
                        setDialogConfig({
                            title: 'Success',
                            description: `Itinerary "${itinerary.name}" duplicated successfully!`,
                            actionText: 'OK',
                            color: 'green',
                            onConfirm: () => setDialogOpen(false),
                        })
                        setDialogOpen(true)
                } catch (error: any) {
                    console.error('Error duplicating itinerary:', error)
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
                    // Send status as 'Active' or 'Inactive' (capitalized) to match backend expectations
                    await dispatch(updateItineraryById({
                        id: itinerary.id,
                        data: { status: newStatus as 'Active' | 'Inactive' }
                    })).unwrap()
                    
                    // Refresh the itinerary list to show updated status
                    await dispatch(fetchItineraries())
                    
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
                    console.error('Error updating status:', error)
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
                data: { 
                    trending: checked ? 'Yes' : 'No' // Send the trending field
                }
            })).unwrap()
            
            // Refresh the list to show updated status
            dispatch(fetchItineraries())
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