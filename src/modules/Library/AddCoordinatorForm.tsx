import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import {
    createCoordinator,
    updateCoordinatorById,
    type Coordinator,
} from '../../features/CoordinatorSlice'
import {
    Box,
    Flex,
    Text,
    TextField,
    IconButton,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'

type AddCoordinatorFormProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (values: Record<string, any>) => void
    initialData?: {
        id?: string
        name?: string
        email?: string
        phone?: string
        specialties?: string
        bio?: string
    } | null
}

const AddCoordinatorForm: React.FC<AddCoordinatorFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
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
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email' as const,
            placeholder: 'Enter email',
            fullWidth: true,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text' as const,
            placeholder: 'Enter phone number',
            fullWidth: true,
        },
        {
            name: 'specialties',
            label: 'Specialties (comma-separated)',
            type: 'text' as const,
            placeholder: 'Enter specialties separated by commas',
            fullWidth: true,
        },
        {
            name: 'bio',
            label: 'Bio (Optional)',
            type: 'textarea' as const,
            placeholder: 'Enter bio',
            fullWidth: true,
        },
    ]

    const handleFormSubmit = async (values: Record<string, any>) => {
        try {
            // Convert comma-separated specialties string to array
            const specialtiesArray = values.specialties 
                ? values.specialties.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                : []

            if (initialData?.id) {
                // Update existing coordinator
                const updateData: Partial<Coordinator> = {
                    name: values.name || '',
                    email: values.email || '',
                    phone: values.phone || '',
                    specialties: specialtiesArray,
                    bio: values.bio || '',
                }

                await dispatch(updateCoordinatorById({ 
                    id: initialData.id, 
                    data: updateData 
                })).unwrap()
            } else {
                // Create new coordinator
                const newCoordinator: Omit<Coordinator, 'id'> = {
                    name: values.name || '',
                    email: values.email || '',
                    phone: values.phone || '',
                    specialties: specialtiesArray,
                    bio: values.bio || '',
                    availability: 'available',
                    status: 'active',
                }

                await dispatch(createCoordinator(newCoordinator)).unwrap()
            }

            // Call parent onSubmit for additional handling (like showing success dialog)
            onSubmit(values)
            onClose()
        } catch (error) {
            console.error('Failed to save coordinator:', error)
            // Re-throw to let parent handle error dialog
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
                                {initialData ? 'Edit Coordinator' : 'Add Coordinator'}
                            </Text>
                            <Text 
                                size="2" 
                                style={{ 
                                    color: 'var(--accent-11)',
                                    display: 'block',
                                }}
                            >
                                {initialData ? 'Update the coordinator details below.' : 'Fill out the form to add a new coordinator.'}
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
                            buttonText={initialData ? 'Update Coordinator' : 'Add Coordinator'}
                            onSubmit={handleFormSubmit}
                            initialValues={{
                                name: initialData?.name || '',
                                email: initialData?.email || '',
                                phone: initialData?.phone || '',
                                specialties: initialData?.specialties || '',
                                bio: initialData?.bio || '',
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

export default AddCoordinatorForm