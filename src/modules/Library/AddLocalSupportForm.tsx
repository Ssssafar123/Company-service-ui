import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import {
    createLocalSupport,
    updateLocalSupportById,
    type LocalSupport as LocalSupportType,
} from '../../features/LocalSupportSlice'
import {
    Box,
    Flex,
    Text,
    TextField,
    IconButton,
    Select,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'

type AddLocalSupportFormProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (values: Record<string, any>) => void
    initialData?: {
        id?: string
        name?: string
        contact?: string
        location?: string
        supportType?: string
        rating?: number
    } | null
}

const AddLocalSupportForm: React.FC<AddLocalSupportFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const dispatch = useDispatch<AppDispatch>()

    // Prevent body scroll when form is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Form fields configuration
    const formFields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text' as const,
            placeholder: 'Enter name',
            fullWidth: true,
            required: true, 
        },
        {
            name: 'contact',
            label: 'Contact',
            type: 'text' as const,
            placeholder: 'Enter contact number',
            fullWidth: true,
            required: true, 
        },
        {
            name: 'supportType',
            label: 'Support Type',
            type: 'select' as const,
            placeholder: 'Select support type',
            options: [
                { value: 'Guide', label: 'Guide' },
                { value: 'Driver', label: 'Driver' },
                { value: 'Translator', label: 'Translator' },
                { value: 'Other', label: 'Other' },
            ],
            required: true, 
        },
        {
            name: 'rating',
            label: 'Rating (Optional)',
            type: 'number' as const,
            placeholder: 'Enter rating (1-10)',
            required: true, 
        },
        {
            name: 'location',
            label: 'Location',
            type: 'text' as const,
            placeholder: 'Enter location',
            fullWidth: true,
            required: true, 
        },
    ]

    const handleFormSubmit = async (values: Record<string, any>) => {
        try {
            // if (initialData?.id) {
            //     // Update existing local support
            //     const updateData: Partial<LocalSupportType> = {
            //         name: values.name || '',
            //         contact: values.contact || '',
            //         location: values.location || '',
            //         supportType: values.supportType as any || 'Guide',
            //         rating: parseInt(values.rating) || 0,
            //     }

            //     await dispatch(updateLocalSupportById({ 
            //         id: initialData.id, 
            //         data: updateData 
            //     })).unwrap()
            // } else {
            //     // Create new local support
            //     const newLocalSupport: Omit<LocalSupportType, 'id'> = {
            //         name: values.name || '',
            //         contact: values.contact || '',
            //         location: values.location || '',
            //         supportType: values.supportType as any || 'Guide',
            //         rating: parseInt(values.rating) || 0,
            //         availability: 'available',
            //         status: 'active',
            //     }

            //     await dispatch(createLocalSupport(newLocalSupport)).unwrap()
            // }

            // Call parent onSubmit for additional handling (like showing success dialog)
            onSubmit(values)
            onClose()
        } catch (error) {
            console.error('Failed to save local support:', error)
            // You can add error handling here or pass it to parent
            throw error
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <Box
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    transition: 'opacity 0.3s ease',
                }}
                onClick={onClose}
            />

            {/* Slide-in Form Panel */}
            <Box
                style={{
                    position: 'fixed',
                    top: '70px',
                    right: 0,
                    width: '600px',
                    height: 'calc(100vh - 70px)',
                    backgroundColor: 'var(--color-panel)',
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
                    zIndex: 1001,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease',
                }}
            >
                {/* Form Header */}
                <Box
                    style={{
                        padding: '24px',
                        borderBottom: '1px solid var(--accent-6)',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'var(--color-panel)',
                        zIndex: 10,
                    }}
                >
                    <Flex justify="between" align="start">
                        <Box style={{ flex: 1 }}>
                            <Text 
                                size="6" 
                                weight="bold" 
                                style={{ 
                                    color: 'var(--accent-12)', 
                                    display: 'block', 
                                    marginBottom: '8px' 
                                }}
                            >
                                {initialData ? 'Edit Local Support' : 'Add Support Contact'}
                            </Text>
                            <Text 
                                size="2" 
                                style={{ 
                                    color: 'var(--accent-11)',
                                    display: 'block',
                                }}
                            >
                                {initialData ? 'Update the local support details below.' : 'Fill out the form to add a new local support contact.'}
                            </Text>
                        </Box>
                        <IconButton
                            variant="ghost"
                            size="3"
                            onClick={onClose}
                            style={{ 
                                cursor: 'pointer', 
                                marginLeft: '16px',
                                color: 'var(--accent-11)',
                            }}
                            title="Close"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </IconButton>
                    </Flex>
                </Box>

                {/* Form Content */}
                <Box style={{ padding: '24px', flex: 1 }}>
                    <Box style={{ maxWidth: '100%' }}>
                        <DynamicForm
                            fields={formFields}
                            buttonText={initialData ? 'Update Local Support' : 'Add Local Support'}
                            onSubmit={handleFormSubmit}
                            initialValues={{
                                name: initialData?.name || '',
                                contact: initialData?.contact || '',
                                supportType: initialData?.supportType || '',
                                rating: initialData?.rating || '',
                                location: initialData?.location || '',
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* CSS Animation */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    )
}

export default AddLocalSupportForm