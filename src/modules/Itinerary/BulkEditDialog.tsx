import React, { useState, useMemo } from 'react'
import { Box, Text, Button, TextField, Checkbox, Dialog, Flex, Separator } from '@radix-ui/themes'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import moment from 'moment-timezone'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { Batch } from './BatchManagement'

type BulkEditDialogProps = {
  open: boolean
  onClose: () => void
  onApply: (batches: Batch[]) => void
}

const BulkEditDialog: React.FC<BulkEditDialogProps> = ({ open, onClose, onApply }) => {
  const [tripDateRange, setTripDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedDatesOfMonth, setSelectedDatesOfMonth] = useState<number[]>([])
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ]

  const datesOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = moment.months().map((month, index) => ({
    value: index,
    label: month
  }))

  const generateBatches = (): Batch[] => {
    if (!tripDateRange.startDate || !tripDateRange.endDate) return []

    const tripStart = moment(tripDateRange.startDate)
    const tripEnd = moment(tripDateRange.endDate)
    const tripDuration = tripEnd.diff(tripStart, 'days') + 1

    const batchStartDate = moment()
      .year(tripStart.year())
      .month(
        Math.min(
          ...(selectedMonths.length > 0 ? selectedMonths : [tripStart.month()])
        )
      )
      .startOf('month')

    const batchEndDate = moment()
      .year(tripStart.year())
      .month(
        Math.max(
          ...(selectedMonths.length > 0 ? selectedMonths : [tripStart.month()])
        )
      )
      .endOf('month')

    const batches: Batch[] = []
    let currentDate = batchStartDate.clone()

    while (currentDate.isSameOrBefore(batchEndDate)) {
      const isValidMonth =
        selectedMonths.length === 0 ||
        selectedMonths.includes(currentDate.month())

      const isValidDay =
        selectedDays.length === 0 || selectedDays.includes(currentDate.day())

      const isValidDate =
        selectedDatesOfMonth.length === 0 ||
        selectedDatesOfMonth.includes(currentDate.date())

      if (isValidMonth && isValidDay && isValidDate) {
        const batchEndDate = currentDate.clone().add(tripDuration - 1, 'days')

        const startDateStr = currentDate
          .clone()
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DDTHH:mm')
        const endDateStr = batchEndDate
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DDTHH:mm')

        batches.push({
          id: `batch-${currentDate.format('YYYY-MM-DD')}-${Date.now()}`,
          start_date: startDateStr,
          end_date: endDateStr,
          extra_amount: 0,
          extra_amount_reason: '',
          sold_out: false
        })
      }

      currentDate.add(1, 'days')
    }

    return batches
  }

  const batchCount = useMemo(() => {
    if (!tripDateRange.startDate || !tripDateRange.endDate) return 0
    return generateBatches().length
  }, [tripDateRange, selectedDays, selectedDatesOfMonth, selectedMonths])

  const handleApply = () => {
    if (!tripDateRange.startDate || !tripDateRange.endDate) return

    const batches = generateBatches()
    onApply(batches)
    onClose()

    // Reset form
    setTripDateRange({ startDate: '', endDate: '' })
    setSelectedDays([])
    setSelectedDatesOfMonth([])
    setSelectedMonths([])
  }

  const tripDuration = tripDateRange.startDate && tripDateRange.endDate
    ? moment(tripDateRange.endDate).diff(moment(tripDateRange.startDate), 'days') + 1
    : 0

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '800px', width: '90vw' }}>
        <Dialog.Title>Generate Batches</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create multiple batches at once using patterns
        </Dialog.Description>

        <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Trip Dates */}
          <Box>
            <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
              Trip Dates
            </Text>
            <Flex gap="3" style={{ flexWrap: 'wrap' }}>
              <Box style={{ flex: '1', minWidth: '200px' }}>
                <TextField.Root
                  type="date"
                  placeholder="Trip Start Date"
                  value={tripDateRange.startDate}
                  onChange={(e) =>
                    setTripDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value
                    }))
                  }
                />
              </Box>
              <Box style={{ flex: '1', minWidth: '200px' }}>
                <TextField.Root
                  type="date"
                  placeholder="Trip End Date"
                  value={tripDateRange.endDate}
                  onChange={(e) =>
                    setTripDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value
                    }))
                  }
                />
              </Box>
            </Flex>
          </Box>

          {/* Pattern Selection */}
          <Box
            style={{
              padding: '20px',
              border: '1px solid var(--accent-6)',
              borderRadius: '8px',
              backgroundColor: 'var(--color-panel)'
            }}
          >
            <Text size="3" weight="bold" mb="4" style={{ display: 'block' }}>
              Custom Pattern (Optional)
            </Text>

            {/* Days of Week */}
            <Box mb="4">
              <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                Days of Week
              </Text>
              <Flex gap="2" style={{ flexWrap: 'wrap' }}>
                {daysOfWeek.map((day) => (
                  <Flex key={day.value} align="center" gap="2">
                    <Checkbox
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={(checked) => {
                        setSelectedDays((prev) =>
                          checked
                            ? [...prev, day.value]
                            : prev.filter((d) => d !== day.value)
                        )
                      }}
                    />
                    <Text size="2">{day.label}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Dates of Month */}
            <Box mb="4">
              <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                Dates of Month
              </Text>
              <Flex gap="1" style={{ flexWrap: 'wrap', maxHeight: '150px', overflowY: 'auto' }}>
                {datesOfMonth.map((date) => (
                  <Flex key={date} align="center" gap="1">
                    <Checkbox
                      checked={selectedDatesOfMonth.includes(date)}
                      onCheckedChange={(checked) => {
                        setSelectedDatesOfMonth((prev) =>
                          checked
                            ? [...prev, date]
                            : prev.filter((d) => d !== date)
                        )
                      }}
                    />
                    <Text size="1">{date}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Months */}
            <Box>
              <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                Months
              </Text>
              <Flex gap="2" style={{ flexWrap: 'wrap' }}>
                {months.map((month) => (
                  <Flex key={month.value} align="center" gap="2">
                    <Checkbox
                      checked={selectedMonths.includes(month.value)}
                      onCheckedChange={(checked) => {
                        setSelectedMonths((prev) =>
                          checked
                            ? [...prev, month.value]
                            : prev.filter((m) => m !== month.value)
                        )
                      }}
                    />
                    <Text size="2">{month.label}</Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* Preview Info */}
          <Box
             style={{
             padding: '16px',
             backgroundColor: 'var(--accent-3)',
             borderRadius: '8px',
             border: '1px solid var(--accent-6)'
         }}
        >
            <Flex justify="between" align="center" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                  Trip Duration: <strong>{tripDuration} days</strong>
                </Text>
                <Text size="2" weight="medium">
                  This will generate <strong>{batchCount} batches</strong>
                </Text>
              </Box>
              <Button
                variant="outline"
                disabled={batchCount === 0}
                onClick={() => setShowPreviewDialog(true)}
              >
                Preview Batches
              </Button>
            </Flex>
          </Box>
        </Box>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleApply}
            disabled={!tripDateRange.startDate || !tripDateRange.endDate}
          >
            Generate Batches
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default BulkEditDialog