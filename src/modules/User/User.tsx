import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
  fetchUsers,
  deleteUserById,
  type User as UserType,
} from '../../features/UserSlice'
import { fetchRoles } from '../../features/RoleSlice'
import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  IconButton,
  AlertDialog,
  Card,
  Table,
  Select,
} from '@radix-ui/themes'

const User: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()

  const usersFromStore = useSelector((state: RootState) => state.user.users)
  const rolesFromStore = useSelector((state: RootState) => state.role.roles)
  const loading = useSelector((state: RootState) => state.user.ui.loading)
  const error = useSelector((state: RootState) => state.user.ui.error)

  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<{
    title: string
    description: string
    actionText: string
    cancelText?: string
    onConfirm: () => void
    color?: 'red' | 'blue' | 'green' | 'gray'
  } | null>(null)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchRoles())
  }, [dispatch, location.key])

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return usersFromStore
    }
    const query = searchQuery.toLowerCase()
    return usersFromStore.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.companyId.toLowerCase().includes(query) ||
        user.role?.name.toLowerCase().includes(query)
    )
  }, [searchQuery, usersFromStore])

  const handleEdit = (user: UserType) => {
    navigate('/dashboard/edit-user', {
      state: { userData: user },
    })
  }

  const handleDelete = (user: UserType) => {
    setDialogConfig({
      title: 'Delete User',
      description: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
      actionText: 'Delete',
      cancelText: 'Cancel',
      color: 'red',
      onConfirm: async () => {
        try {
          await dispatch(deleteUserById(user.id)).unwrap()
          setDialogOpen(false)
          setDialogConfig({
            title: 'Success',
            description: `User "${user.username}" deleted successfully!`,
            actionText: 'OK',
            color: 'green',
            onConfirm: () => setDialogOpen(false),
          })
          setDialogOpen(true)
        } catch (error: any) {
          setDialogOpen(false)
          setDialogConfig({
            title: 'Error',
            description: error.message || 'Failed to delete user.',
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

  return (
    <Box style={{ padding: '24px' }}>
      <Text
        size="7"
        weight="bold"
        style={{
          color: 'var(--accent-12)',
          marginBottom: '24px',
          display: 'block',
        }}
      >
        User Management
      </Text>

      <Flex
        gap="3"
        align="center"
        justify="between"
        style={{ marginBottom: '24px' }}
        direction={{ initial: 'column', sm: 'row' }}
      >
        <TextField.Root
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, maxWidth: '300px', width: '100%' }}
        >
          <TextField.Slot>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 14L10.5355 10.5355M10.5355 10.5355C11.473 9.59802 12 8.32608 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11C9.32608 11 10.598 10.473 10.5355 10.5355Z"
                stroke="var(--accent-11)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TextField.Slot>
        </TextField.Root>

        <Button
          variant="soft"
          size="2"
          onClick={() => navigate('/dashboard/add-user')}
          style={{
            color: 'white',
            backgroundColor: 'var(--accent-9)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '8px' }}
          >
            <path
              d="M8 3V13M3 8H13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add User
        </Button>
      </Flex>

      {loading && (
        <Box style={{ padding: '48px', textAlign: 'center' }}>
          <Text size="3" style={{ color: 'var(--accent-11)' }}>
            Loading...
          </Text>
        </Box>
      )}

      {error && (
        <Box
          style={{
            padding: '16px',
            backgroundColor: 'var(--red-3)',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <Text size="3" style={{ color: 'var(--red-11)' }}>
            Error: {error}
          </Text>
        </Box>
      )}

      {!loading && !error && (
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Company ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ textAlign: 'right' }}>
                  Actions
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Text size="3" weight="medium">
                      {user.username}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="3">{user.companyId}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="3">{user.role?.name || 'No Role'}</Text>
                  </Table.Cell>
                  <Table.Cell style={{ textAlign: 'right' }}>
                    <Flex gap="2" justify="end">
                      <IconButton
                        variant="ghost"
                        size="2"
                        onClick={() => handleEdit(user)}
                        style={{
                          cursor: 'pointer',
                          color: 'var(--accent-11)',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5 2.5L13.5 4.5L4.5 13.5H2.5V11.5L11.5 2.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </IconButton>
                      <IconButton
                        variant="ghost"
                        size="2"
                        color="red"
                        onClick={() => handleDelete(user)}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 2V1C5 0.4 5.4 0 6 0H10C10.6 0 11 0.4 11 1V2H14V4H13V13C13 14.1 12.1 15 11 15H5C3.9 15 3 14.1 3 13V4H2V2H5ZM6 1V2H10V1H6ZM4 4V13C4 13.6 4.4 14 5 14H11C11.6 14 12 13.6 12 13V4H4Z"
                            fill="currentColor"
                          />
                          <path
                            d="M6 6V12H7V6H6ZM9 6V12H10V6H9Z"
                            fill="currentColor"
                          />
                        </svg>
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {filteredUsers.length === 0 && (
            <Box
              style={{
                padding: '48px',
                textAlign: 'center',
                color: 'var(--accent-11)',
              }}
            >
              <Text size="3">No users found</Text>
            </Box>
          )}
        </Card>
      )}

      {dialogConfig && (
        <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
            <AlertDialog.Description size="2">
              {dialogConfig.description}
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              {dialogConfig.cancelText && (
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    {dialogConfig.cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action>
                <Button
                  variant="solid"
                  color={dialogConfig.color || 'red'}
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

export default User

