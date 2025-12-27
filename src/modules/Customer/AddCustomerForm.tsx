import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Flex, Text, TextField, Button, Select } from '@radix-ui/themes'
import type { Customer } from '../../features/CustomerSlice'

interface AddCustomerFormProps {
  isOpen: boolean             
  onClose: () => void         
  onSubmit: (data: Omit<Customer, 'id'>) => void 
  initialData?: Customer | null 
}

// Form data type (without id)
type CustomerFormData = Omit<Customer, 'id'>

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {

  
    const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      base_city: '',
      age: undefined,
      phone: undefined,
      email: '',
      gender: 'OTHER',
      instagram: '',
      refer: '',
      starting_point: '',
      drop_point: '',
    },
  })

  //Fetch data on component mount
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        base_city: initialData.base_city,
        age: initialData.age,
        phone: initialData.phone,
        email: initialData.email,
        gender: initialData.gender,
        instagram: initialData.instagram || '',
        refer: initialData.refer || '',
        starting_point: initialData.starting_point,
        drop_point: initialData.drop_point,
      })
    } else {
      reset()
    }
  }, [initialData, reset])

  
  const handleFormSubmit = (data: CustomerFormData) => {
    //Clean up the data before submitting
    onSubmit({
      ...data,
      instagram: data.instagram?.trim() || undefined,
      refer: data.refer?.trim() || undefined,
    })
    reset()
  }

  // Do not render if drawer is closed
  if (!isOpen) return null

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '420px',
        background: 'var(--color-background)',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '24px',
      }}
    >
      <Flex direction="column" gap="4">
 
        <Flex justify="between" align="center">
          <Text size="6" weight="bold">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </Text>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </Flex>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Flex direction="column" gap="4">

            {/* Name (Required) */}
            <Box>
              <Text size="2" weight="medium">Name *</Text>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="Enter full name" />
                )}
              />
              {errors.name && <Text color="red" size="1">{errors.name.message}</Text>}
            </Box>

            {/* Base City (Required) */}
            <Box>
              <Text size="2" weight="medium">Base City *</Text>
              <Controller
                name="base_city"
                control={control}
                rules={{ required: 'Base city is required' }}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="Enter base city" />
                )}
              />
              {errors.base_city && <Text color="red" size="1">{errors.base_city.message}</Text>}
            </Box>

            {/* Age (Required) */}
            <Box>
              <Text size="2" weight="medium">Age *</Text>
              <Controller
                name="age"
                control={control}
                rules={{ required: 'Age is required', min: 1 }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    placeholder="Enter age"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                )}
              />
              {errors.age && <Text color="red" size="1">{errors.age.message}</Text>}
            </Box>

            {/* Phone (Required) */}
            <Box>
              <Text size="2" weight="medium">Phone *</Text>
              <Controller
                name="phone"
                control={control}
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    placeholder="Enter phone number"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  />
                )}
              />
              {errors.phone && <Text color="red" size="1">{errors.phone.message}</Text>}
            </Box>

            {/* Email (Required) */}
            <Box>
              <Text size="2" weight="medium">Email *</Text>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="Enter email" />
                )}
              />
              {errors.email && <Text color="red" size="1">{errors.email.message}</Text>}
            </Box>

            {/* Gender */}
            <Box>
              <Text size="2" weight="medium">Gender</Text>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="MALE">Male</Select.Item>
                      <Select.Item value="FEMALE">Female</Select.Item>
                      <Select.Item value="OTHER">Other</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Box>

            {/* Instagram */}
            <Box>
              <Text as="label" size="2" weight="medium">
                Instagram (Optional)
              </Text>
              <Controller
                name="instagram"
                control={control}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="@username" />
                )}
              />
              </Box>

            {/* Refer */}
            <Box>
              <Text as="label" size="2" weight="medium">
                Referred By (Optional)
              </Text>
              <Controller
                name="refer"
                control={control}
                render={({ field }) => (
                    <TextField.Root {...field} placeholder="Referral source" />
                )}
              />
            </Box>

            {/* Starting Point */}
            <Box>
              <Text size="2" weight="medium">Starting Point *</Text>
              <Controller
                name="starting_point"
                control={control}
                rules={{ required: 'Starting point is required' }}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="Enter starting point" />
                )}
              />
            </Box>

            {/* Drop Point */}
            <Box>
              <Text size="2" weight="medium">Drop Point *</Text>
              <Controller
                name="drop_point"
                control={control}
                rules={{ required: 'Drop point is required' }}
                render={({ field }) => (
                  <TextField.Root {...field} placeholder="Enter drop point" />
                )}
              />
            </Box>

            <Flex gap="3" mt="4">
              <Button variant="soft" color="gray" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button type="submit" style={{ flex: 1 }}>
                {initialData ? 'Update' : 'Create'}
              </Button>
            </Flex>

          </Flex>
        </form>
      </Flex>
    </Box>
  )
}

export default AddCustomerForm
