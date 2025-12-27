import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Separator,
  Flex,
  Button,
  AlertDialog,
  TextField,
  Select,
} from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../store'

import { createPayment, type Payment } from '../../../features/PaymentSlice'
import DynamicForm from '../../../components/dynamicComponents/Form'

/* =======================
   Section Header
======================= */
const FormSectionHeader = ({ title }: { title: string }) => (
  <Box style={{ gridColumn: '1 / -1', marginBottom: 8, marginTop: 24 }}>
    <Text size="5" weight="bold">{title}</Text>
    <Separator size="4" mt="2" />
  </Box>
)

/* =======================
   Helpers
======================= */
const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)

/* =======================
   Add Payment
======================= */
const AddPayment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [paymentMode, setPaymentMode] =
    useState<'upi' | 'cash' | 'bank_transfer' | 'card' | 'cheque'>('upi')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =======================
     INITIAL VALUES
  ======================= */
  const initialValues = {
    invoiceId: '',
    invoiceNumber: '',
    customer: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],

    paymentMode: 'upi',
    paymentMethod: 'UPI',

    upiId: '',
    bankName: '',
    accountNumber: '',
    chequeNumber: '',
    cardLast4: '',

    status: 'success',
    remarks: '',
  }

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async (values: any) => {
    setError(null)

    if (!isValidObjectId(values.invoiceId)) {
      setError('Invoice ID must be valid Mongo ObjectId')
      return
    }

    // mode-wise validation
    if (paymentMode === 'upi' && !values.upiId) {
      setError('UPI ID is required')
      return
    }

    if (paymentMode === 'bank_transfer' && (!values.bankName || !values.accountNumber)) {
      setError('Bank Name & Account Number required')
      return
    }

    if (paymentMode === 'cheque' && (!values.bankName || !values.chequeNumber)) {
      setError('Bank Name & Cheque Number required')
      return
    }

    if (paymentMode === 'card' && !values.cardLast4) {
      setError('Card Last 4 digits required')
      return
    }

    const payload: Omit<Payment, 'id'> = {
      paymentId: `PAY-${Date.now()}`,
      transactionId: `TXN-${Date.now()}`,

      invoiceId: values.invoiceId,
      invoiceNumber: values.invoiceNumber,

      customer: values.customer,
      amount: Number(values.amount),
      date: values.date,

      paymentMode,
      paymentMethod: values.paymentMethod,

      upiId: values.upiId || undefined,
      bankName: values.bankName || undefined,
      accountNumber: values.accountNumber || undefined,
      chequeNumber: values.chequeNumber || undefined,
      cardLast4: values.cardLast4 || undefined,

      status: values.status,
      remarks: values.remarks || undefined,
    }

    try {
      await dispatch(createPayment(payload)).unwrap()
      setDialogOpen(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save payment')
    }
  }

  /* =======================
     FORM FIELDS
  ======================= */
  const formFields: any[] = [
    {
      name: '_header',
      label: '',
      type: 'custom',
      customRender: () => <FormSectionHeader title="Payment Details" />,
      fullWidth: true,
    },

    { name: 'invoiceId', label: 'Invoice ID (Mongo _id)', type: 'text', required: true },
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },

    { name: 'customer', label: 'Customer Name', type: 'text', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'date', label: 'Payment Date', type: 'date', required: true },

    // 🔥 CUSTOM PAYMENT MODE FIELD
    {
      name: '_paymentMode',
      label: 'Payment Mode',
      type: 'custom',
      customRender: () => (
        <Select.Root
            value={paymentMode}
            onValueChange={(val) =>
            setPaymentMode(val as 'upi' | 'cash' | 'bank_transfer' | 'card' | 'cheque')
        }
        >

          <Select.Trigger />
          <Select.Content>
            <Select.Item value="upi">UPI</Select.Item>
            <Select.Item value="cash">Cash</Select.Item>
            <Select.Item value="bank_transfer">Bank Transfer</Select.Item>
            <Select.Item value="card">Card</Select.Item>
            <Select.Item value="cheque">Cheque</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
    },

    { name: 'paymentMethod', label: 'Payment Method', type: 'text', required: true },

    ...(paymentMode === 'upi'
      ? [{ name: 'upiId', label: 'UPI ID', type: 'text', required: true }]
      : []),

    ...(paymentMode === 'bank_transfer'
      ? [
          { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
          { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
        ]
      : []),

    ...(paymentMode === 'cheque'
      ? [
          { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
          { name: 'chequeNumber', label: 'Cheque Number', type: 'text', required: true },
        ]
      : []),

    ...(paymentMode === 'card'
      ? [{ name: 'cardLast4', label: 'Card Last 4 Digits', type: 'text', required: true }]
      : []),

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'success', label: 'Success' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
      ],
    },

    { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
  ]

  /* =======================
     RENDER
  ======================= */
  return (
    <Box p="4">
      <Flex justify="between" mb="4">
        <Text size="7" weight="bold">Add Payment</Text>
        <Button variant="soft" onClick={() => navigate('/dashboard/payment')}>
          Back
        </Button>
      </Flex>

      {error && <Text color="red">{error}</Text>}

      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttonText="Save Payment"
      />

      <AlertDialog.Root open={dialogOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>Success</AlertDialog.Title>
          <AlertDialog.Description>
            Payment saved successfully
          </AlertDialog.Description>
          <Flex justify="end" mt="4">
            <AlertDialog.Action>
              <Button onClick={() => navigate('/dashboard/payment')}>
                OK
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  )
}

export default AddPayment
