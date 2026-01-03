import React, { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    Text,
    Button,
    Card,
    AlertDialog,
    DropdownMenu,
    IconButton,
    TextArea,
} from '@radix-ui/themes'
import { Pencil1Icon, DotsHorizontalIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

// Custom Eye Icon component
const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

type CancellationPolicyProps = {
    policies: string[]
    onSave: (policies: string[]) => void
    loading?: boolean
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({ 
    policies: initialPolicies, 
    onSave,
    loading = false 
}) => {
    const [policies, setPolicies] = useState<string[]>(initialPolicies)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingPolicies, setEditingPolicies] = useState<string[]>([])

    // Update local state when props change
    useEffect(() => {
        setPolicies(initialPolicies)
    }, [initialPolicies])

    const handleViewPolicy = () => {
        setViewModalOpen(true)
    }

    const handleEditPolicy = () => {
        setEditingPolicies([...policies])
        setEditModalOpen(true)
    }

    const handleSavePolicy = () => {
        // Filter out empty policies
        const validPolicies = editingPolicies.filter(p => p.trim() !== '')
        setPolicies(validPolicies)
        onSave(validPolicies)
        setEditModalOpen(false)
    }

    const handleAddPolicyField = () => {
        setEditingPolicies([...editingPolicies, ''])
    }

    const handleUpdatePolicyField = (index: number, value: string) => {
        const updated = [...editingPolicies]
        updated[index] = value
        setEditingPolicies(updated)
    }

    const handleRemovePolicyField = (index: number) => {
        setEditingPolicies(editingPolicies.filter((_, i) => i !== index))
    }

    const handleCancelEdit = () => {
        setEditingPolicies([...policies])
        setEditModalOpen(false)
    }

    return (
        <>
            {/* Cancellation Policy Card */}
            <Card style={{ padding: '16px', backgroundColor: 'var(--accent-2)' }}>
                <Flex justify="between" align="start">
                    <Box style={{ flex: 1 }}>
                        <Text 
                            size="2" 
                            weight="medium" 
                            style={{ 
                                color: 'var(--accent-11)', 
                                marginBottom: '8px', 
                                display: 'block' 
                            }}
                        >
                            Cancellation Policy
                        </Text>
                        <Text size="3" style={{ color: 'var(--accent-12)' }}>
                            {policies.length} policy rule(s) configured
                        </Text>
                    </Box>
                    <Flex gap="2">
                        {/* <IconButton
                            variant="ghost"
                            size="2"
                            onClick={handleViewPolicy}
                            style={{ color: '#FF6B35' }}
                        >
                            <EyeIcon />
                        </IconButton> */}
                        <IconButton
                            variant="ghost"
                            size="2"
                            onClick={handleEditPolicy}
                            style={{ color: '#FF6B35' }}
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
                                <DropdownMenu.Item onClick={handleViewPolicy}>
                                    View
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={handleEditPolicy}>
                                    Edit
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                </Flex>
            </Card>

            {/* View Cancellation Policy Modal */}
            <AlertDialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
                <AlertDialog.Content maxWidth="600px">
                    <Flex justify="between" align="center" mb="4">
                        <AlertDialog.Title>Cancellation Policy</AlertDialog.Title>
                        <IconButton
                            variant="ghost"
                            size="2"
                            onClick={() => setViewModalOpen(false)}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Flex>
                    
                    <AlertDialog.Description>
                        <Box style={{ marginBottom: '24px' }}>
                            {policies.length === 0 ? (
                                <Text size="3" style={{ color: 'var(--accent-11)' }}>
                                    No cancellation policy rules configured.
                                </Text>
                            ) : (
                               <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
  {policies.map((policy, index) => (
    <li key={index} style={{ marginBottom: '12px' }}>
      <Box
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--accent-2)',
          borderRadius: '8px',
          border: '1px solid var(--accent-6)',
        }}
      >
        <Text size="3" style={{ color: 'var(--accent-12)' }}>
          {policy}
        </Text>
      </Box>
    </li>
  ))}
</ul>

                            )}
                        </Box>
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <Button
                            variant="outline"
                            onClick={() => setViewModalOpen(false)}
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            style={{ backgroundColor: '#FF6B35', color: 'white' }}
                            onClick={() => {
                                setViewModalOpen(false)
                                handleEditPolicy()
                            }}
                        >
                            Edit
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>

            {/* Edit Cancellation Policy Modal */}
            <AlertDialog.Root open={editModalOpen} onOpenChange={setEditModalOpen}>
                <AlertDialog.Content maxWidth="700px">
                    <Flex justify="between" align="center" mb="4">
                        <AlertDialog.Title>Cancellation Policy</AlertDialog.Title>
                        <IconButton
                            variant="ghost"
                            size="2"
                            onClick={handleCancelEdit}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Flex>
                    
                    <AlertDialog.Description>
                        <Box style={{ marginBottom: '24px' }}>
                            {editingPolicies.length === 0 ? (
                                <Text size="3" style={{ color: 'var(--accent-11)', marginBottom: '16px' }}>
                                    No policy rules. Click "Add Field" to create one.
                                </Text>
                            ) : (
                                <Flex direction="column" gap="3">
                                    {editingPolicies.map((policy, index) => (
                                        <Box
                                            key={index}
                                            style={{
                                                padding: '12px',
                                                backgroundColor: 'var(--accent-2)',
                                                borderRadius: '8px',
                                                border: '1px solid var(--accent-6)',
                                            }}
                                        >
                                            <Flex gap="2" align="start">
                                                <TextArea
                                                    value={policy}
                                                    onChange={(e) => handleUpdatePolicyField(index, e.target.value)}
                                                    placeholder={`Policy rule ${index + 1}`}
                                                    style={{
                                                        flex: 1,
                                                        minHeight: '60px',
                                                        resize: 'vertical',
                                                    }}
                                                />
                                                <IconButton
                                                    variant="ghost"
                                                    color="red"
                                                    size="2"
                                                    onClick={() => handleRemovePolicyField(index)}
                                                    style={{ marginTop: '4px' }}
                                                >
                                                    <Cross2Icon />
                                                </IconButton>
                                            </Flex>
                                        </Box>
                                    ))}
                                </Flex>
                            )}
                        </Box>

                        <Button
                            variant="outline"
                            onClick={handleAddPolicyField}
                            style={{
                                width: '100%',
                                marginBottom: '16px',
                                borderColor: '#FF6B35',
                                color: '#FF6B35',
                            }}
                        >
                            <PlusIcon style={{ marginRight: '8px' }} />
                            Add Field
                        </Button>
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ backgroundColor: '#FF6B35', color: 'white' }}
                            onClick={handleSavePolicy}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Submit'}
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default CancellationPolicy