import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { createLocation, updateLocationById } from '../../features/LocationSlice'
import { fetchItineraries } from '../../features/ItinerarySlice'
import { Box, Text, Separator, Flex, Button, AlertDialog, Card, Checkbox } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'

const AddLocation: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [initialValues, setInitialValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)

    // Fetch itineraries from Redux store - FIX: use 'itineraries' instead of 'itinerary'
    const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)
    const itinerariesLoading = useSelector((state: RootState) => state.itinerary.ui.loading)

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        color?: 'red' | 'blue' | 'green' | 'gray'
        onConfirm: () => void
    } | null>(null)

    // Fetch itineraries on component mount
    useEffect(() => {
        dispatch(fetchItineraries())
    }, [dispatch])

    // Check if we're in edit mode based on location state
    useEffect(() => {
        const locationData = location.state?.locationData
        if (locationData) {
            setIsEditMode(true)
            
            // Map the full Location object to form initial values
            const mappedValues = {
                location_name: locationData.name || '',
                short_description: locationData.short_description || locationData.shortDescription || '',
                long_description: locationData.long_description || locationData.longDescription || '',
                // Handle image: if it's a URL string (from Cloudinary), wrap it in array
                // The ImageUpload component will display it as a preview
                image: locationData.image && typeof locationData.image === 'string' 
                    ? [locationData.image] 
                    : (locationData.image ? [locationData.image] : ['']),
                itineraries: locationData.itineraries || locationData.itineraryIds || [],
                seo_fields: locationData.seo_fields || locationData.seoData || null,
            }
            
            setInitialValues(mappedValues)
        } else {
            setIsEditMode(false)
            setInitialValues({
                image: [''],
                itineraries: [],
                seo_fields: null,
            })
        }
    }, [location.state])

    const handleSubmit = async (values: Record<string, any>) => {
        // Extract File object from image (single image)
        // Only send imageFile if there's actually a File object (not just a URL string)
        let imageFile: File | undefined;
        let imageRemoved: boolean = false;
        
        if (Array.isArray(values.image)) {
            // Find the first File object in the array (if user uploaded a new image)
            const fileImage = values.image.find((img: any) => img instanceof File);
            imageFile = fileImage;
            
            // Check if image was removed: no File object and no valid URL string
            // Valid image = File object OR non-empty URL string
            const hasValidImage = fileImage || values.image.some((img: any) => 
                typeof img === 'string' && img && img !== '' && img !== 'null' && img !== 'undefined'
            );
            
            // In edit mode, if there was originally an image but now there's no valid image,
            // the user removed it. In create mode, empty is normal (no image yet).
            if (isEditMode && !hasValidImage) {
                // User removed the image (array is empty or contains only empty strings)
                imageRemoved = true;
            }
        } else if (values.image instanceof File) {
            imageFile = values.image;
        } else if (isEditMode && (!values.image || values.image === '' || values.image === 'null' || values.image === 'undefined')) {
            // In edit mode, if image is explicitly null/empty (not array), it was removed
            imageRemoved = true;
        }
        
        // If imageFile is undefined and imageRemoved is false, backend will keep existing image
        // If imageRemoved is true, backend will remove the image

        if (isEditMode) {
            // Update location
            try {
                const id = location.state?.locationData?.id
                await dispatch(updateLocationById({
                    id,
                    data: {
                        name: values.location_name,
                        short_description: values.short_description,
                        long_description: values.long_description,
                        itineraries: values.itineraries,
                        seo_fields: values.seo_fields,
                        status: 'active',
                        imageFile: imageFile,
                        imageRemoved: imageRemoved,
                    } as any
                })).unwrap()
                setDialogConfig({
                    title: 'Success',
                    description: 'Location updated successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/location')
                    },
                })
            } catch (error: any) {
                setDialogConfig({
                    title: 'Error',
                    description: error?.message || 'Failed to update location',
                    actionText: 'OK',
                    color: 'red',
                    onConfirm: () => setDialogOpen(false),
                })
            }
        } else {
            // Create location
            try {
                const payload = {
                    name: values.location_name,
                    short_description: values.short_description,
                    long_description: values.long_description,
                    itineraries: values.itineraries,
                    seo_fields: values.seo_fields,
                    image: '', // Will be replaced by backend with actual binary data
                    status: 'active' as 'active',
                    country: 'India',
                    // Pass File object
                    imageFile: imageFile,
                };
                await dispatch(createLocation(payload)).unwrap();
                setDialogConfig({
                    title: 'Success',
                    description: 'Location created successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false);
                        navigate('/dashboard/location');
                    },
                });
            } catch (error: any) {
                setDialogConfig({
                    title: 'Error',
                    description: error?.message || 'Failed to create location',
                    actionText: 'OK',
                    color: 'red',
                    onConfirm: () => setDialogOpen(false),
                });
            }
        }
        setDialogOpen(true)
    }

    // Memoize the custom render function for itineraries
    const renderItinerariesField = useCallback((value: string[] = [], onChange: (value: string[]) => void) => {
        const selectedIds = value || []
        
        const handleToggle = (itineraryId: string) => {
            const newSelection = selectedIds.includes(itineraryId)
                ? selectedIds.filter((id) => id !== itineraryId)
                : [...selectedIds, itineraryId]
            onChange(newSelection)
        }
        
        if (itinerariesLoading) {
            return (
                <Box style={{ padding: '20px', textAlign: 'center' }}>
                    <Text>Loading itineraries...</Text>
                </Box>
            )
        }

        if (!itineraries || itineraries.length === 0) {
            return (
                <Box style={{ padding: '20px', textAlign: 'center' }}>
                    <Text color="gray">No itineraries available</Text>
                </Box>
            )
        }
        
        return (
            <Box>
                <Box
                    style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        border: '1px solid var(--accent-6)',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: 'var(--color-panel)',
                    }}
                >
                    <Flex direction="column" gap="3">
                        {itineraries.map((itinerary) => {
                            const isSelected = selectedIds.includes(itinerary.id)
                            
                            return (
                                <Card
                                    key={itinerary.id}
                                    style={{
                                        padding: '12px',
                                        border: isSelected
                                            ? '2px solid var(--accent-9)'
                                            : '1px solid var(--accent-6)',
                                        backgroundColor: isSelected
                                            ? 'var(--accent-3)'
                                            : 'var(--color-panel)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onClick={() => handleToggle(itinerary.id)}
                                >
                                    <Flex align="center" gap="3">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggle(itinerary.id)}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        />
                                        <Box style={{ flex: 1 }}>
                                            <Text
                                                size="3"
                                                weight="medium"
                                                style={{
                                                    color: 'var(--accent-12)',
                                                    marginBottom: '4px',
                                                    display: 'block',
                                                }}
                                            >
                                                {itinerary.name}
                                            </Text>
                                            <Text
                                                size="2"
                                                style={{
                                                    color: 'var(--accent-11)',
                                                }}
                                            >
                                                {itinerary.city} • ₹{itinerary.price?.toLocaleString('en-IN') || 'N/A'}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Card>
                            )
                        })}
                    </Flex>
                </Box>
            </Box>
        )
    }, [itineraries, itinerariesLoading])

    // Memoize form fields to prevent recreation on every render
    const formFields = useMemo(() => [
        {
            type: 'custom' as const,
            name: 'section1',
            label: 'Basic Information',
            customRender: () => (
                <Text
                    size="5"
                    weight="bold"
                    style={{
                        color: 'var(--accent-12)',
                        marginBottom: '16px',
                        display: 'block',
                    }}
                >
                    Basic Information
                </Text>
            ),
        },
        {
            type: 'text' as const,
            name: 'location_name',
            label: 'Location Name',
            placeholder: 'Enter location name',
            fullWidth: true,
        },
        {
            type: 'richtext' as const,
            name: 'short_description',
            label: 'Short Description',
            placeholder: 'Enter short description...',
        },
        {
            type: 'richtext' as const,
            name: 'long_description',
            label: 'Long Description',
            placeholder: 'Enter long description...',
        },
        {
            type: 'file' as const,
            name: 'image',
            label: 'Image',
            singleImage: true, // Only allow single image upload
        },
        {
            type: 'custom' as const,
            name: '_separator_seo',
            label: '',
            customRender: () => (
                <Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
                    <Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
                </Box>
            ),
            fullWidth: true,
        },
        {
            name: 'seo_fields',
            label: 'SEO Settings',
            type: 'seo' as const,
            fullWidth: true,
        },
    ], [renderItinerariesField])

    return (
        <Box style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Text
                size="7"
                weight="bold"
                style={{
                    color: 'var(--accent-12)',
                    marginBottom: '24px',
                    display: 'block',
                }}
            >
                {isEditMode ? 'Update Location' : 'Add New Location'}
            </Text>

            <DynamicForm
                key={isEditMode ? `edit-${location.state?.locationData?.id}` : 'new'}
                fields={formFields}
                buttonText={isEditMode ? 'Update Location' : 'Create Location'}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            />

            {/* Controlled AlertDialog */}
            {dialogConfig && (
                <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                            {dialogConfig.description}
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Action>
                                <Button
                                    variant="solid"
                                    color={dialogConfig.color || 'green'}
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

export default AddLocation