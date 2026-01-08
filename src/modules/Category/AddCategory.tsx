import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Text, Separator, Flex, Button, AlertDialog } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { createCategory, updateCategoryById } from '../../features/CategorySlice'

const AddCategory: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const dispatch = useDispatch<AppDispatch>()

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        color?: 'red' | 'blue' | 'green' | 'gray'
        onConfirm: () => void
    } | null>(null)

    // Check if we're in edit mode based on location state
    useEffect(() => {
        const categoryData = location.state?.categoryData
        if (categoryData) {
            setIsEditMode(true)
            
            const mappedValues = {
                category_name: categoryData.name || '',
                short_description: categoryData.short_description || '',
                long_description: categoryData.long_description || '',
                // Handle image: if it's a URL string (from Cloudinary), wrap it in array
                // The ImageUpload component will display it as a preview
                image: categoryData.image && typeof categoryData.image === 'string' 
                    ? [categoryData.image] 
                    : (categoryData.image ? [categoryData.image] : ['']),
                seo_fields: categoryData.seo_fields || null,
            }
            
            setInitialValues(mappedValues)
        } else {
            setIsEditMode(false)
            setInitialValues({
                image: [''],
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
            // Update category
            try {
                const id = location.state?.categoryData?.id
                await dispatch(updateCategoryById({
                    id,
                    data: {
                        name: values.category_name,
                        short_description: values.short_description,
                        long_description: values.long_description,
                        seo_fields: values.seo_fields,
                        status: 'active',
                        imageFile: imageFile,
                        imageRemoved: imageRemoved,
                    } as any
                })).unwrap()
                setDialogConfig({
                    title: 'Success',
                    description: 'Category updated successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/category')
                    },
                })
            } catch (error: any) {
                setDialogConfig({
                    title: 'Error',
                    description: error?.message || 'Failed to update category',
                    actionText: 'OK',
                    color: 'red',
                    onConfirm: () => setDialogOpen(false),
                })
            }
        } else {
            // Create category
            try {
                await dispatch(createCategory({
                    name: values.category_name,
                    short_description: values.short_description,
                    long_description: values.long_description,
                    seo_fields: values.seo_fields,
                    status: 'active',
                    image: '',
                    imageFile: imageFile,
                })).unwrap()
                setDialogConfig({
                    title: 'Success',
                    description: 'Category created successfully!',
                    actionText: 'OK',
                    color: 'green',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/category')
                    },
                })
            } catch (error: any) {
                setDialogConfig({
                    title: 'Error',
                    description: error?.message || 'Failed to create category',
                    actionText: 'OK',
                    color: 'red',
                    onConfirm: () => setDialogOpen(false),
                })
            }
        }
        setDialogOpen(true)
    }

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
            name: 'category_name',
            label: 'Category Name',
            placeholder: 'Enter category name',
            fullWidth: true,
            required: true,
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
            singleImage: true,
            required: true,
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
    ], [])

    return (
        <Box style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
                <Text
                    size="7"
                    weight="bold"
                    style={{
                        color: 'var(--accent-12)',
                        display: 'block',
                    }}
                >
                    {isEditMode ? 'Update Category' : 'Add New Category'}
                </Text>
                
                <Button
                    variant="soft"
                    size="2"
                    onClick={() => navigate('/dashboard/category')}
                    style={{
                        color: 'white',
                        backgroundColor: 'var(--accent-9)',
                    }}
                >
                    Back to List
                </Button>
            </Flex>

            <DynamicForm
                key={isEditMode ? `edit-${location.state?.categoryData?.id}` : 'new'}
                fields={formFields}
                buttonText={isEditMode ? 'Update Category' : 'Create Category'}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            />

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

export default AddCategory