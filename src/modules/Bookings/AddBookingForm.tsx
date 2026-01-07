import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { Box, Flex, Text, TextField, Button, Select } from '@radix-ui/themes'
import type { Booking } from '../../features/BookingSlice'
import type { Batch } from '../../features/BatchSlice'
import { fetchCustomers } from '../../features/CustomerSlice'
import { fetchItineraries, fetchItineraryById } from '../../features/ItinerarySlice'

interface AddBookingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Booking, 'id'>) => void
  initialData?: Booking | null
}

// Form data type that allows empty strings for number fields
type BookingFormData = Omit<Booking, 'id' | 'total_price' | 'paid_amount' | 'people_count'> & {
  total_price: number | ''
  paid_amount: number | ''
  people_count: number | ''
}

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
  const customersLoading = useSelector((state: RootState) => state.customer.ui.loading)
  const itinerariesLoading = useSelector((state: RootState) => state.itinerary.ui.loading)
  
  // State for selected itinerary data (with batches)
  const [selectedItineraryData, setSelectedItineraryData] = useState<any>(null)
  const [loadingBatches, setLoadingBatches] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      people_count: 1,
      travellers: [],
      itinerary_id: '',
      batch_id: '',
      total_price: '',
      paid_amount: '',
      invoice_link: '',
      txn_id: '',
      transaction_status: 'INITIATED',
      deleted: false,
    },
  })

  // Watch itinerary_id to fetch batches
  const selectedItineraryId = watch('itinerary_id')
  const currentBatchId = watch('batch_id')

  // Helper function to extract ID from string or object
  const extractId = (value: any): string => {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      return value._id || value.id || ''
    }
    return String(value || '')
  }

  // Transform itinerary batches to Batch interface format
  const getBatchesFromItinerary = (itinerary: any): Batch[] => {
    if (!itinerary || !itinerary.batches || !Array.isArray(itinerary.batches)) {
      return []
    }

    return itinerary.batches.map((batch: any) => ({
      id: batch._id || batch.id || '',
      start_date: batch.startDate || batch.start_date || '',
      end_date: batch.endDate || batch.end_date || '',
      is_sold: batch.sold_out || batch.is_sold || false,
      extra_amount: batch.price || batch.extra_amount || 0,
      extra_reason: batch.extra_amount_reason || batch.extra_reason || '',
      itineraryId: itinerary.id || itinerary._id || '',
      createdAt: batch.createdAt || '',
      updatedAt: batch.updatedAt || '',
    }))
  }

  // Filter batches - only show non-expired batches (end_date in the future)
  const filteredBatches = selectedItineraryData
    ? getBatchesFromItinerary(selectedItineraryData).filter((batch) => {
        if (!batch.end_date) return false
        
        const endDate = new Date(batch.end_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to start of day for comparison
        
        // Include batch if end_date is today or in the future
        return endDate >= today
      })
    : []

  // Fetch full itinerary data when itinerary is selected
  useEffect(() => {
    if (selectedItineraryId) {
      setLoadingBatches(true)
      
      // Don't clear batch_id if we're in edit mode and batch_id is already set
      // Only clear if the itinerary actually changed
      const previousItineraryId = selectedItineraryData?.id || selectedItineraryData?._id
      const shouldClearBatch = previousItineraryId !== selectedItineraryId
      
      if (shouldClearBatch) {
        setSelectedItineraryData(null)
        setValue('batch_id', '')
      }
      
      dispatch(fetchItineraryById(selectedItineraryId))
        .unwrap()
        .then((itinerary: any) => {
          setSelectedItineraryData(itinerary)
          setLoadingBatches(false)
          
          // After fetching, verify that the current batch_id is still valid
          // If not, and we're not in edit mode, clear it
          if (!shouldClearBatch && currentBatchId) {
            const allBatches = getBatchesFromItinerary(itinerary)
            const batchExists = allBatches.some(b => b.id === currentBatchId)
            
            // Only clear if batch doesn't exist and we're not in edit mode
            if (!batchExists && !initialData) {
              setValue('batch_id', '')
            }
          }
        })
        .catch((err) => {
          console.error('Failed to fetch itinerary:', err)
          setSelectedItineraryData(null)
          setLoadingBatches(false)
        })
    } else {
      setSelectedItineraryData(null)
      setLoadingBatches(false)
    }
  }, [selectedItineraryId, dispatch, setValue])

  // Fetch data on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCustomers())
      dispatch(fetchItineraries())
    }
  }, [dispatch, isOpen])

  // Handle initial data setup for edit mode
  useEffect(() => {
    if (initialData) {
      const setupInitialData = async () => {
        // Extract IDs safely from initialData (they might be objects)
        const itineraryId = extractId(initialData.itinerary_id)
        const batchId = extractId(initialData.batch_id)
        const customerId = extractId(initialData.customer)
        const transactionId = extractId(initialData.transaction)
        
        // First, reset form with initial data
        reset({
          customer: customerId,
          people_count: initialData.people_count,
          travellers: initialData.travellers || [],
          itinerary_id: itineraryId,
          batch_id: batchId,
          total_price: initialData.total_price,
          paid_amount: initialData.paid_amount,
          invoice_link: initialData.invoice_link,
          transaction: transactionId,
          txn_id: initialData.txn_id,
          transaction_status: initialData.transaction_status,
          deleted: initialData.deleted,
        })
        
        // If itinerary_id exists, fetch the itinerary data to populate batches
        if (itineraryId) {
          try {
            setLoadingBatches(true)
            const itinerary = await dispatch(fetchItineraryById(itineraryId)).unwrap()
            setSelectedItineraryData(itinerary)
            setLoadingBatches(false)
          } catch (err) {
            console.error('Failed to fetch itinerary for edit:', err)
            setLoadingBatches(false)
          }
        }
      }
      
      setupInitialData()
    } else {
      reset({
        people_count: 1,
        travellers: [],
        itinerary_id: '',
        batch_id: '',
        total_price: '',
        paid_amount: '',
        invoice_link: '',
        txn_id: '',
        transaction_status: 'INITIATED',
        deleted: false,
      })
      setSelectedItineraryData(null)
    }
  }, [initialData, reset, dispatch])

  const isValidObjectId = (id: string) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  const handleFormSubmit = (data: BookingFormData) => {
    // Clean up the data before submitting
    const cleanedData: Omit<Booking, 'id'> = {
      people_count: data.people_count === '' ? 1 : Number(data.people_count),
      travellers: data.travellers || [],
      itinerary_id: data.itinerary_id,
      batch_id: data.batch_id,
      // Convert empty strings to numbers for price fields
      total_price: data.total_price === '' ? 0 : Number(data.total_price),
      paid_amount: data.paid_amount === '' ? 0 : Number(data.paid_amount),
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
                rules={{ 
                  required: 'People count is required', 
                  min: { value: 1, message: 'People count must be at least 1' },
                  validate: (value: number | '') => {
                    if (value === '' || value === null || value === undefined) {
                      return 'People count is required'
                    }
                    const numValue = Number(value)
                    if (isNaN(numValue) || numValue < 1) {
                      return 'People count must be at least 1'
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="1"
                    value={field.value ?? ''}
                    placeholder="Enter number of people"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || value === null || value === undefined) {
                        field.onChange('')
                      } else {
                        const intValue = parseInt(value)
                        if (!isNaN(intValue)) {
                          field.onChange(intValue)
                        } else {
                          field.onChange('')
                        }
                      }
                    }}
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
                  <Select.Root 
                    value={field.value || undefined} 
                    onValueChange={field.onChange}
                    disabled={!selectedItineraryId}
                  >
                    <Select.Trigger 
                      placeholder={
                        !selectedItineraryId 
                          ? 'Please select itinerary first'
                          : loadingBatches 
                          ? 'Loading batches...' 
                          : filteredBatches.length === 0
                          ? 'No batches available'
                          : 'Select batch'
                      }
                      style={{ width: '100%' }}
                    />
                    <Select.Content>
                      {filteredBatches.map((batch) => (
                        <Select.Item key={batch.id} value={batch.id}>
                          {new Date(batch.start_date).toLocaleDateString()} - {new Date(batch.end_date).toLocaleDateString()}
                          {batch.extra_amount > 0 && ` (₹${batch.extra_amount})`}
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
                rules={{ 
                  required: 'Total price is required', 
                  min: { value: 0, message: 'Total price must be 0 or greater' },
                  validate: (value: number | '') => {
                    if (value === '' || value === null || value === undefined) {
                      return 'Total price is required'
                    }
                    const numValue = Number(value)
                    if (isNaN(numValue) || numValue < 0) {
                      return 'Total price must be 0 or greater'
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value ?? ''}
                    placeholder="Enter total price"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || value === null || value === undefined) {
                        field.onChange('')
                      } else {
                        const numValue = parseFloat(value)
                        if (!isNaN(numValue)) {
                          field.onChange(numValue)
                        } else {
                          field.onChange('')
                        }
                      }
                    }}
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
                rules={{ 
                  required: 'Paid amount is required', 
                  min: { value: 0, message: 'Paid amount must be 0 or greater' },
                  validate: (value: number | '') => {
                    if (value === '' || value === null || value === undefined) {
                      return 'Paid amount is required'
                    }
                    const numValue = Number(value)
                    if (isNaN(numValue) || numValue < 0) {
                      return 'Paid amount must be 0 or greater'
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <TextField.Root
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value ?? ''}
                    placeholder="Enter paid amount"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || value === null || value === undefined) {
                        field.onChange('')
                      } else {
                        const numValue = parseFloat(value)
                        if (!isNaN(numValue)) {
                          field.onChange(numValue)
                        } else {
                          field.onChange('')
                        }
                      }
                    }}
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