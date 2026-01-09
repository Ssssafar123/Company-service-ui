import React, { useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
} from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import type { Customer } from '../../features/CustomerSlice'

type AddCustomerFormProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: Record<string, any>) => void
  initialData?: Customer | null
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, placeholder: 'Enter customer name', required: true },
    { name: 'email', label: 'Email', type: 'email' as const, placeholder: 'Enter email', required: true },
    { name: 'phone', label: 'Phone', type: 'number' as const, placeholder: 'Enter phone number', required: true },
    { name: 'base_city', label: 'Base City', type: 'text' as const, placeholder: 'Enter base city', required: true },
    { name: 'age', label: 'Age', type: 'number' as const, placeholder: 'Enter age', required: true },
    { 
      name: 'gender', 
      label: 'Gender', 
      type: 'select' as const, 
      options: [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'Other' }
      ],
      required: true 
    },
    { name: 'starting_point', label: 'Starting Point', type: 'text' as const, placeholder: 'Enter starting point', required: true },
    { name: 'drop_point', label: 'Drop Point', type: 'text' as const, placeholder: 'Enter drop point', required: true },
    { name: 'instagram', label: 'Instagram', type: 'text' as const, placeholder: 'Enter Instagram handle' },
    { name: 'refer', label: 'Refer', type: 'text' as const, placeholder: 'Enter referrer' },
  ]

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
                {initialData ? 'Edit Customer' : 'Add a New Customer'}
              </Text>
              <Text 
                size="2" 
                style={{ 
                  color: 'var(--accent-11)',
                  display: 'block',
                }}
              >
                {initialData ? 'Update the customer details below.' : 'Fill out the form to add a new customer.'}
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
              buttonText={initialData ? 'Update Customer' : 'Add Customer'}
              onSubmit={onSubmit}
              initialValues={{
                name: initialData?.name || '',
                email: initialData?.email || '',
                phone: initialData?.phone || 0,
                base_city: initialData?.base_city || '',
                age: initialData?.age || 0,
                gender: initialData?.gender || 'OTHER',
                starting_point: initialData?.starting_point || '',
                drop_point: initialData?.drop_point || '',
                instagram: initialData?.instagram || '',
                refer: initialData?.refer || '',
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

export default AddCustomerForm
