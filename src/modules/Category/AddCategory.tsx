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
                feature_images: categoryData.feature_images && categoryData.feature_images.length > 0 
                    ? categoryData.feature_images 
                    : (categoryData.image ? [categoryData.image] : ['']),
                seo_fields: categoryData.seo_fields || null,
            }
            
            setInitialValues(mappedValues)
        } else {
            setIsEditMode(false)
            setInitialValues({
                feature_images: [''],
            })
        }
    }, [location.state])

    const handleSubmit = async (values: Record<string, any>) => {
        // Extract File objects from feature_images
        let featureImageFiles: File[] = [];
        if (Array.isArray(values.feature_images)) {
            featureImageFiles = values.feature_images.filter((img: any) => img instanceof File);
        }

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
                        imageFile: featureImageFiles[0],
                        featureImageFiles: featureImageFiles,
                    }
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
                    imageFile: featureImageFiles[0],
                    featureImageFiles: featureImageFiles,
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
            name: 'feature_images',
            label: 'Feature Image',
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
            <Text
                size="7"
                weight="bold"
                style={{
                    color: 'var(--accent-12)',
                    marginBottom: '24px',
                    display: 'block',
                }}
            >
                {isEditMode ? 'Update Category' : 'Add New Category'}
            </Text>

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