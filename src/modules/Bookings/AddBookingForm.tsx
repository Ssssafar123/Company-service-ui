import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { Box, Flex, Text, TextField, Button, Select } from '@radix-ui/themes'
import type { Booking } from '../../features/BookingSlice'
import { fetchCustomers } from '../../features/CustomerSlice'
import { fetchItineraries } from '../../features/ItinerarySlice'
import { fetchBatches } from '../../features/BatchSlice'

interface AddBookingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Booking, 'id'>) => void
  initialData?: Booking | null
}

type BookingFormData = Omit<Booking, 'id'>

const AddBookingForm: React.FC<AddBookingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  
  // Fetch data from Redux store
  const customers = useSelector((state: RootState) => state.customer.customers)
  const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)
  const batches = useSelector((state: RootState) => state.batch.batches)
  const customersLoading = useSelector((state: RootState) => state.customer.ui.loading)
  const itinerariesLoading = useSelector((state: RootState) => state.itinerary.ui.loading)
  const batchesLoading = useSelector((state: RootState) => state.batch.ui.loading)
  
  // Debug logs
  console.log('Customers in state:', customers)
  console.log('Customers count:', customers.length)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      people_count: 1,
      travellers: [],
      itinerary_id: '',
      batch_id: '',
      total_price: 0,
      paid_amount: 0,
      invoice_link: '',
      txn_id: '',
      transaction_status: 'INITIATED',
      deleted: false,
    },
  })

  // Fetch data on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCustomers())
      dispatch(fetchItineraries())
      dispatch(fetchBatches())
    }
  }, [dispatch, isOpen])

  useEffect(() => {
    if (initialData) {
      reset({
        customer: initialData.customer,
        people_count: initialData.people_count,
        travellers: initialData.travellers,
        itinerary_id: initialData.itinerary_id,
        batch_id: initialData.batch_id,
        total_price: initialData.total_price,
        paid_amount: initialData.paid_amount,
        invoice_link: initialData.invoice_link,
        transaction: initialData.transaction,
        txn_id: initialData.txn_id,
        transaction_status: initialData.transaction_status,
        deleted: initialData.deleted,
      })
    } else {
      reset({
        people_count: 1,
        travellers: [],
        itinerary_id: '',
        batch_id: '',
        total_price: 0,
        paid_amount: 0,
        invoice_link: '',
        txn_id: '',
        transaction_status: 'INITIATED',
        deleted: false,
      })
    }
  }, [initialData, reset])

  const isValidObjectId = (id: string) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  const handleFormSubmit = (data: BookingFormData) => {
    // Clean up the data before submitting
    const cleanedData: any = {
      people_count: data.people_count,
      itinerary_id: data.itinerary_id,
      batch_id: data.batch_id,
      total_price: data.total_price,
      paid_amount: data.paid_amount,
      txn_id: data.txn_id,
      transaction_status: data.transaction_status,
      deleted: data.deleted || false,
    }

    // Only include optional ObjectId fields if they are valid
    if (data.customer && isValidObjectId(data.customer)) {
      cleanedData.customer = data.customer
    }

    if (data.transaction && isValidObjectId(data.transaction)) {
      cleanedData.transaction = data.transaction
    }

    // Only include invoice_link if it's not empty
    if (data.invoice_link && data.invoice_link.trim()) {
      cleanedData.invoice_link = data.invoice_link
    }

    // Include travellers array
    cleanedData.travellers = data.travellers || []

    onSubmit(cleanedData)
    reset()
  }

  if (!isOpen) return null

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '500px',
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
            {initialData ? 'Edit Booking' : 'Add New Booking'}
          </Text>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </Flex>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Flex direction="column" gap="4">
            {/* Customer (Optional) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Customer (Optional)
              </Text>
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select.Root value={field.value || undefined} onValueChange={field.onChange}>
                    <Select.Trigger 
                      placeholder={customersLoading ? 'Loading customers...' : 'Select customer (optional)'}
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {customers.map((customer) => (
                        <Select.Item key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.customer && (
                <Text size="1" color="red">{errors.customer.message}</Text>
              )}
            </Box>

            {/* People Count (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Number of People <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="people_count"
                control={control}
                rules={{ required: 'People count is required', min: 1 }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="1"
                    value={field.value}
                    placeholder="Enter number of people"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
              {errors.people_count && (
                <Text size="1" color="red">{errors.people_count.message}</Text>
              )}
            </Box>

            {/* Itinerary (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Itinerary <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="itinerary_id"
                control={control}
                rules={{ required: 'Itinerary is required' }}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger 
                      placeholder={itinerariesLoading ? 'Loading itineraries...' : 'Select itinerary'}
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {itineraries.map((itinerary) => (
                        <Select.Item key={itinerary.id} value={itinerary.id}>
                          {itinerary.name} - {itinerary.city}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.itinerary_id && (
                <Text size="1" color="red">{errors.itinerary_id.message}</Text>
              )}
            </Box>

            {/* Batch (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Batch <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="batch_id"
                control={control}
                rules={{ required: 'Batch is required' }}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger 
                      placeholder={batchesLoading ? 'Loading batches...' : 'Select batch'}
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {batches.map((batch) => (
                        <Select.Item key={batch.id} value={batch.id}>
                          {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.batch_id && (
                <Text size="1" color="red">{errors.batch_id.message}</Text>
              )}
            </Box>

            {/* Total Price (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Total Price <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="total_price"
                control={control}
                rules={{ required: 'Total price is required', min: 0 }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value}
                    placeholder="Enter total price"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.total_price && (
                <Text size="1" color="red">{errors.total_price.message}</Text>
              )}
            </Box>

            {/* Paid Amount (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Paid Amount <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="paid_amount"
                control={control}
                rules={{ required: 'Paid amount is required', min: 0 }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value}
                    placeholder="Enter paid amount"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.paid_amount && (
                <Text size="1" color="red">{errors.paid_amount.message}</Text>
              )}
            </Box>

            {/* Transaction ID (Required) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Transaction ID <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="txn_id"
                control={control}
                rules={{ required: 'Transaction ID is required' }}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    placeholder="Enter transaction ID"
                  />
                )}
              />
              {errors.txn_id && (
                <Text size="1" color="red">{errors.txn_id.message}</Text>
              )}
            </Box>

            {/* Transaction Reference (Optional) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Transaction Reference (Optional)
              </Text>
              <Controller
                name="transaction"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter transaction reference (optional)"
                  />
                )}
              />
              {errors.transaction && (
                <Text size="1" color="red">{errors.transaction.message}</Text>
              )}
            </Box>

            {/* Transaction Status */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Transaction Status
              </Text>
              <Controller
                name="transaction_status"
                control={control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="Select status" />
                    <Select.Content>
                      <Select.Item value="INITIATED">Initiated</Select.Item>
                      <Select.Item value="SUCCESS">Success</Select.Item>
                      <Select.Item value="FAILED">Failed</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </Box>

            {/* Invoice Link (Optional) */}
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Invoice Link (Optional)
              </Text>
              <Controller
                name="invoice_link"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter invoice link"
                  />
                )}
              />
            </Box>

            {/* Form Actions */}
            <Flex gap="3" mt="4">
              <Button
                type="button"
                variant="soft"
                color="gray"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                style={{ flex: 1 }}
              >
                {initialData ? 'Update' : 'Create'}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Box>
  )
}

export default AddBookingForm