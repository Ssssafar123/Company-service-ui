import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { createUser, updateUserById } from '../../features/UserSlice'
import { fetchRoles } from '../../features/RoleSlice'
import {
  Box,
  Text,
  TextField,
  Button,
  Select,
  AlertDialog,
  Flex,
} from '@radix-ui/themes'

const AddUser: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const rolesFromStore = useSelector((state: RootState) => state.role.roles)

  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    companyId: '',
    role: '',
    password: '',
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
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    const userData = location.state?.userData
    if (userData) {
      setIsEditMode(true)
      setFormData({
        username: userData.username || '',
        companyId: userData.companyId || '',
        role: userData.role?.id || '',
        password: '', // Don't pre-fill password
      })
    } else {
      setIsEditMode(false)
      setFormData({
        username: '',
        companyId: '',
        role: '',
        password: '',
      })
    }
  }, [location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        const id = location.state?.userData?.id
        const updateData: any = {
          username: formData.username,
          companyId: formData.companyId,
        }
        if (formData.role && formData.role.trim() !== '') {
          updateData.role = { id: formData.role }
        }
        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password
        }
        await dispatch(updateUserById({ id, data: updateData })).unwrap()
        setDialogConfig({
          title: 'Success',
          description: 'User updated successfully!',
          actionText: 'OK',
          color: 'green',
          onConfirm: () => {
            setDialogOpen(false)
            navigate('/dashboard/user', { replace: true })
          },
        })
        setDialogOpen(true)
      } else {
        const userPayload: any = {
          username: formData.username,
          companyId: formData.companyId,
          password: formData.password,
        }
        if (formData.role && formData.role.trim() !== '') {
          userPayload.role = { id: formData.role }
        }
        await dispatch(createUser(userPayload)).unwrap()
        setDialogConfig({
          title: 'Success',
          description: 'User created successfully!',
          actionText: 'OK',
          color: 'green',
          onConfirm: () => {
            setDialogOpen(false)
            navigate('/dashboard/user', { replace: true })
          },
        })
        setDialogOpen(true)
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      setDialogConfig({
        title: 'Error',
        description: error?.message || error?.toString() || 'Failed to save user. Please check the console for details.',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
    } finally {
      setLoading(false)
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
        {isEditMode ? 'Edit User' : 'Add New User'}
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
              Username *
            </Text>
            <TextField.Root
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
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
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Company ID *
            </Text>
            <TextField.Root
              value={formData.companyId}
              onChange={(e) =>
                setFormData({ ...formData, companyId: e.target.value })
              }
              placeholder="Enter company ID"
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
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Role
            </Text>
            <Select.Root
              value={formData.role || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value || '' })
              }
            >
              <Select.Trigger placeholder="Select a role (optional)" size="3" />
              <Select.Content>
                {rolesFromStore.map((role) => (
                  <Select.Item key={role.id} value={role.id}>
                    {role.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

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
              Password {isEditMode ? '(leave blank to keep current)' : '*'}
            </Text>
            <TextField.Root
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={isEditMode ? 'Enter new password (optional)' : 'Enter password'}
              required={!isEditMode}
              size="3"
            />
            {!isEditMode && (
              <Text size="1" style={{ color: 'var(--accent-11)', marginTop: '4px' }}>
                Password is required for new users
              </Text>
            )}
          </Box>

          <Flex gap="3" mt="4">
            <Button
              type="submit"
              size="3"
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent-9)',
                color: 'white',
              }}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="soft"
              size="3"
              onClick={() => navigate('/dashboard/user')}
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

export default AddUser

