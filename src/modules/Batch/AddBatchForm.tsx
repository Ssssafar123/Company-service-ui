import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import { Box, Flex, Text, TextField, Button, Select, Switch } from '@radix-ui/themes'
import type { Batch } from '../../features/BatchSlice'
import { fetchItineraries } from '../../features/ItinerarySlice'

interface AddBatchFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Batch, 'id'>) => void
  initialData?: Batch | null
}

type BatchFormData = Omit<Batch, 'id'>

const AddBatchForm: React.FC<AddBatchFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)
  const itinerariesLoading = useSelector((state: RootState) => state.itinerary.ui.loading)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchFormData>({
    defaultValues: {
      start_date: '',
      end_date: '',
      is_sold: false,
      extra_amount: 0,
      extra_reason: '',
      itineraryId: '',
    },
  })

  /** Fetch itineraries when drawer opens */
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchItineraries())
    }
  }, [dispatch, isOpen])

  /** Fill form when editing */
  useEffect(() => {
    if (initialData) {
      reset({
        start_date: initialData.start_date?.slice(0, 10),
        end_date: initialData.end_date?.slice(0, 10),
        is_sold: initialData.is_sold,
        extra_amount: initialData.extra_amount,
        extra_reason: initialData.extra_reason || '',
        itineraryId: initialData.itineraryId,
      })
    } else {
      reset({
        start_date: '',
        end_date: '',
        is_sold: false,
        extra_amount: 0,
        extra_reason: '',
        itineraryId: '',
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = (data: BatchFormData) => {
    const cleanedData: BatchFormData = {
      start_date: data.start_date,
      end_date: data.end_date,
      is_sold: data.is_sold,
      extra_amount: data.extra_amount || 0,
      extra_reason: data.extra_reason?.trim() || '',
      itineraryId: data.itineraryId,
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
        width: '480px',
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
            {initialData ? 'Edit Batch' : 'Add New Batch'}
          </Text>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </Flex>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Flex direction="column" gap="4">

            {/* Start Date */}
            <Box>
              <Text as="label" size="2" weight="medium">
                Start Date <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: 'Start date is required' }}
                render={({ field }) => (
                  <TextField.Root type="date" {...field} />
                )}
              />
              {errors.start_date && (
                <Text size="1" color="red">{errors.start_date.message}</Text>
              )}
            </Box>

            {/* End Date */}
            <Box>
              <Text as="label" size="2" weight="medium">
                End Date <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: 'End date is required' }}
                render={({ field }) => (
                  <TextField.Root type="date" {...field} />
                )}
              />
              {errors.end_date && (
                <Text size="1" color="red">{errors.end_date.message}</Text>
              )}
            </Box>

            {/* Itinerary */}
            <Box>
              <Text as="label" size="2" weight="medium">
                Itinerary <span style={{ color: 'red' }}>*</span>
              </Text>
              <Controller
                name="itineraryId"
                control={control}
                rules={{ required: 'Itinerary is required' }}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger
                      placeholder={
                        itinerariesLoading
                          ? 'Loading itineraries...'
                          : 'Select itinerary'
                      }
                    />
                    <Select.Content>
                      {itineraries.map((itinerary) => (
                        <Select.Item key={itinerary.id} value={itinerary.id}>
                          {itinerary.name} – {itinerary.city}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.itineraryId && (
                <Text size="1" color="red">{errors.itineraryId.message}</Text>
              )}
            </Box>

            {/* Is Sold */}
            <Box>
              <Flex align="center" gap="3">
                <Controller
                  name="is_sold"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <Text size="2">Is Sold</Text>
              </Flex>
            </Box>

            {/* Extra Amount */}
            <Box>
            <Text as="label" size="2" weight="medium">
                Extra Amount
            </Text>
            <Controller
                name="extra_amount"
                control={control}
                render={({ field }) => (
                <TextField.Root
                    type="number"
                    min="0"
                    value={field.value ?? ''}
                    placeholder="Enter extra amount"
                    onChange={(e) => {
                    const value = e.target.value

                    // 👇 agar user 0 ya empty type kare → clear
                    if (value === '' || Number(value) === 0) {
                        field.onChange(undefined)
                    } else {
                        field.onChange(Number(value))
                    }
                    }}
                />
                )}
            />
            </Box>


            {/* Extra Reason */}
            <Box>
              <Text as="label" size="2" weight="medium">
                Extra Reason
              </Text>
              <Controller
                name="extra_reason"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    value={field.value || ''}
                    placeholder="Reason for extra amount"
                  />
                )}
              />
            </Box>

            {/* Actions */}
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

export default AddBatchForm
