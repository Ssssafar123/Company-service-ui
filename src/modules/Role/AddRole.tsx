import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { createRole, updateRoleById } from '../../features/RoleSlice'
import {
  Box,
  Text,
  TextField,
  Button,
  AlertDialog,
  Flex,
  Checkbox,
  Card,
} from '@radix-ui/themes'

// Common modules that can be assigned to roles
const AVAILABLE_MODULES = [
  'Dashboard',
  'Itinerary',
  'Category',
  'Location',
  'Reviews',
  'Bookings',
  'Content',
  'Leads',
  'Customize Leads',
  'Sales',
  'Invoice',
  'Payment',
  'Ledger',
  'Library',
  'Hotel',
  'Activities',
  'Transport',
  'Coordinator',
  'Local Support',
  'User Management',
  'Role Management',
]

const AddRole: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    modules: [] as string[],
  })
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<{
    title: string
    description: string
    actionText: string
    color?: 'red' | 'blue' | 'green' | 'gray'
    onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    const roleData = location.state?.roleData
    if (roleData) {
      setIsEditMode(true)
      setFormData({
        name: roleData.name || '',
        modules: roleData.modules || [],
      })
    } else {
      setIsEditMode(false)
      setFormData({
        name: '',
        modules: [],
      })
    }
  }, [location.state])

  const handleModuleToggle = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        const id = location.state?.roleData?.id
        await dispatch(
          updateRoleById({
            id,
            data: {
              name: formData.name,
              modules: formData.modules,
            },
          })
        ).unwrap()
        setDialogConfig({
          title: 'Success',
          description: 'Role updated successfully!',
          actionText: 'OK',
          color: 'green',
          onConfirm: () => {
            setDialogOpen(false)
            navigate('/dashboard/role')
          },
        })
      } else {
        await dispatch(
          createRole({
            name: formData.name,
            modules: formData.modules,
          })
        ).unwrap()
        setDialogConfig({
          title: 'Success',
          description: 'Role created successfully!',
          actionText: 'OK',
          color: 'green',
          onConfirm: () => {
            setDialogOpen(false)
            navigate('/dashboard/role')
          },
        })
      }
    } catch (error: any) {
      setDialogConfig({
        title: 'Error',
        description: error?.message || 'Failed to save role',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
    } finally {
      setLoading(false)
      setDialogOpen(true)
    }
  }

  return (
    <Box style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Text
        size="7"
        weight="bold"
        style={{
          color: 'var(--accent-12)',
          marginBottom: '24px',
          display: 'block',
        }}
      >
        {isEditMode ? 'Edit Role' : 'Add New Role'}
      </Text>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Box>
            <Text
              size="2"
              weight="medium"
              style={{
                color: 'var(--accent-11)',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Role Name *
            </Text>
            <TextField.Root
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter role name"
              required
              size="3"
            />
          </Box>

          <Box>
            <Text
              size="2"
              weight="medium"
              style={{
                color: 'var(--accent-11)',
                marginBottom: '12px',
                display: 'block',
              }}
            >
              Modules *
            </Text>
            <Card style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              <Flex direction="column" gap="2">
                {AVAILABLE_MODULES.map((module) => (
                  <Flex key={module} align="center" gap="2">
                    <Checkbox
                      checked={formData.modules.includes(module)}
                      onCheckedChange={() => handleModuleToggle(module)}
                    />
                    <Text size="3">{module}</Text>
                  </Flex>
                ))}
              </Flex>
            </Card>
            {formData.modules.length === 0 && (
              <Text size="1" style={{ color: 'var(--red-11)', marginTop: '8px' }}>
                Please select at least one module
              </Text>
            )}
          </Box>

          <Flex gap="3" mt="4">
            <Button
              type="submit"
              size="3"
              disabled={loading || formData.modules.length === 0}
              style={{
                backgroundColor: 'var(--accent-9)',
                color: 'white',
              }}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Role' : 'Create Role'}
            </Button>
            <Button
              type="button"
              variant="soft"
              size="3"
              onClick={() => navigate('/dashboard/role')}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </form>

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
                  color={dialogConfig.color || 'blue'}
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

export default AddRole

