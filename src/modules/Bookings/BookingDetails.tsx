import React, { useEffect, useState } from 'react'
import { Dialog, Box, Flex, Text } from '@radix-ui/themes'
import type { Booking as BookingType } from '../../features/BookingSlice'

interface Customer {
  id: string
  name: string
  base_city: string
  age: number
  phone: number
  email: string
  instagram?: string
  refer?: string
  starting_point: string
  drop_point: string
}

interface BookingDetailsProps {
  open: boolean
  onClose: () => void
  booking: BookingType | null
}

const normalizeCustomer = (raw: any): Customer => {
  const c = raw?.data?.customer || raw?.customer || raw?.data || raw

  return {
    id: c.id || c._id,
    name: c.name || '',
    base_city: c.base_city || '',
    age: Number(c.age || 0),
    phone: Number(c.phone || 0),
    email: c.email || '',
    instagram: c.instagram,
    refer: c.refer,
    starting_point: c.starting_point || '',
    drop_point: c.drop_point || '',
  }
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ open, onClose, booking }) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !booking?.customer) return

    const getCustomerId = (customer: any): string | null => {
  if (!customer) return null
  if (typeof customer === 'string') return customer
  if (typeof customer === 'object') return customer._id || customer.id
  return null
}

const customerId = getCustomerId(booking.customer)

    if (!customerId) return

    setLoading(true)
    setCustomer(null)

    fetch(`http://localhost:8000/api/customer/${customerId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => setCustomer(normalizeCustomer(res)))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [open, booking?.customer])

  if (!open || !booking) return null

  const itinerary =
    typeof booking.itinerary_id === 'object'
      ? (booking.itinerary_id as any)
      : null

  const batch =
    typeof booking.batch_id === 'object'
      ? (booking.batch_id as any)
      : null

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Content maxWidth="900px">

        {/* ACCESSIBILITY FIX */}
        <Flex align="center" justify="between" mb="4">
  {/* LEFT EMPTY SPACE */}
  <Box style={{ width: 32 }} />

  {/* CENTER TITLE */}
  <Dialog.Title>
    <Text size="6" weight="bold" align="center">
      Booking Details
    </Text>
  </Dialog.Title>

  {/* RIGHT CLOSE BUTTON */}
  <Text
    size="5"
    style={{ cursor: 'pointer' }}
    onClick={onClose}
  >
    ✕
  </Text>
</Flex>

        
        {/* BASIC INFO */}
      <Box mb="5" mt="4">
  <Flex direction="column" gap="2">
    <Text><b>Booking ID:</b> {booking.id}</Text>
    <Text><b>Itinerary Name:</b> {itinerary?.name || 'N/A'}</Text>
    <Text>
      <b>Start Date:</b>{' '}
      {batch?.start_date
        ? new Date(batch.start_date).toLocaleDateString('en-IN')
        : 'N/A'}
    </Text>
  </Flex>
</Box>


        {/* PERSON DETAILS */}
<Box mt="5">
  {Array.from({ length: booking.people_count || 1 }).map((_, index) => (
    <Box key={index} mb="5">
      <Text weight="bold" mb="3">
        Person {index + 1}
      </Text>

      {loading && index === 0 && (
        <Text color="gray">Loading customer details...</Text>
      )}

      {!loading && customer && (
        <Box
          p="4"
          style={{
            border: '1px solid var(--gray-5)',
            borderRadius: '8px',
            background: 'var(--gray-2)',
          }}
        >
          <Flex justify="between" wrap="wrap">
            <Text><b>Full Name:</b> {customer.name}</Text>
            <Text><b>Base City:</b> {customer.base_city}</Text>
            <Text><b>Age:</b> {customer.age}</Text>
          </Flex>

          <Flex justify="between" wrap="wrap" mt="2">
            <Text><b>Contact No:</b> {customer.phone}</Text>
            <Text><b>Email Address:</b> {customer.email}</Text>
          </Flex>

          <Flex justify="between" wrap="wrap" mt="2">
            <Text><b>Instagram:</b> {customer.instagram || 'N/A'}</Text>
            <Text><b>Ref:</b> {customer.refer || 'N/A'}</Text>
            <Text><b>Package:</b> Default</Text>
          </Flex>

          <Flex justify="between" wrap="wrap" mt="2">
            <Text><b>Starting:</b> {customer.starting_point}</Text>
            <Text><b>Dropping:</b> {customer.drop_point}</Text>
          </Flex>
        </Box>
      )}

      {!loading && !customer && index === 0 && (
        <Text color="red">Customer details not found</Text>
      )}
    </Box>
  ))}
</Box>


      </Dialog.Content>
    </Dialog.Root>
  )
}

export default BookingDetails
