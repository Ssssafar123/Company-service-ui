import React, { useState, useEffect } from 'react'
import { Box, Text, Separator, Flex, Button, AlertDialog } from '@radix-ui/themes'
import { useLocation, useNavigate } from 'react-router-dom'
import DynamicForm from '../../../components/dynamicComponents/Form'

// --- Helper for Section Headers ---
const FormSectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Box style={{ gridColumn: '1 / -1', marginBottom: '8px', marginTop: '24px' }}>
        <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
            {title}
        </Text>
        <Separator size="4" style={{ marginTop: '8px' }} />
    </Box>
)

type LineItem = {
    id: string
    item: string
    description: string
    qty: number
    rate: number
    tax: number // Assuming tax is a percentage
}

type InvoiceData = {
    id: string
    // Customer Info
    customer: string
    billTo: string
    shipTo: string
    // Invoice Details
    invoiceNumber: string
    date: string
    dueDate: string
    preventOverdueReminders: boolean
    tripStartingDate: string
    location: string
    b2bDeal: string
    gst: string
    tags: string[]
    // Payment & Config
    allowedPaymentModes: string[]
    currency: string
    saleAgent: string
    isRecurring: boolean
    discountType: 'percentage' | 'fixed'
    discountValue: number
    // Items
    lineItems: LineItem[]
    quantityAs: 'Qty' | 'Hours' | 'Qty/Hours'
    // Totals & Notes
    adjustment: number
    adminNote: string
    clientNote: string
    termsAndConditions: string
    status: 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'draft' | 'cancelled'
}

const AddInvoice: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        onConfirm: () => void
    } | null>(null)

    useEffect(() => {
        const invoiceToEdit = location.state?.invoiceData
        if (invoiceToEdit) {
            setIsEditMode(true)
            setInitialValues({
                ...invoiceToEdit,
                tags: invoiceToEdit.tags?.join(', ') || '',
            })
        } else {
            setIsEditMode(false)
            setInitialValues({
                date: new Date().toISOString().split('T')[0],
                status: 'draft',
                billTo: '',
                shipTo: '',
                preventOverdueReminders: false,
                allowedPaymentModes: [],
                currency: 'INR',
                saleAgent: '',
                isRecurring: false,
                discountType: 'percentage',
                discountValue: 0,
                lineItems: [],
                quantityAs: 'Qty',
                adjustment: 0,
                adminNote: '',
                clientNote: 'As per company policy, 100% of the payment will be collected at the start of the trip',
                termsAndConditions: '',
            })
        }
    }, [location.state])

    const handleSubmit = (values: Record<string, any>) => {
        const finalInvoiceData = {
            ...values,
            tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
        }

        if (isEditMode) {
            console.log('Invoice updated with values:', finalInvoiceData)
            setDialogConfig({
                title: 'Success',
                description: 'The invoice has been updated successfully!',
                actionText: 'OK',
                onConfirm: () => {
                    setDialogOpen(false)
                    navigate('/invoice')
                },
            })
        } else {
            console.log('New invoice created with values:', finalInvoiceData)
            setDialogConfig({
                title: 'Success',
                description: 'A new invoice has been created successfully!',
                actionText: 'OK',
                onConfirm: () => {
                    setDialogOpen(false)
                    navigate('/invoice')
                },
            })
        }
        setDialogOpen(true)
    }

    const formFields = [
        // --- Customer Section ---
        { name: '_header_customer', type: 'custom' as const, customRender: () => <FormSectionHeader title="Customer & Billing" />, fullWidth: true },
        { name: 'customer', label: 'Customer Name', type: 'text' as const, placeholder: 'Select or add a customer', required: true },
        { name: 'billTo', label: 'Bill To', type: 'textarea' as const, placeholder: 'Billing address', fullWidth: true },
        { name: 'shipTo', label: 'Ship To', type: 'textarea' as const, placeholder: 'Shipping address', fullWidth: true },

        // --- Invoice Details Section ---
        { name: '_header_details', type: 'custom' as const, customRender: () => <FormSectionHeader title="Invoice Details" />, fullWidth: true },
        { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' as const, placeholder: 'e.g., INV-002530', required: true },
        { name: 'date', label: 'Invoice Date', type: 'date' as const, required: true },
        { name: 'dueDate', label: 'Due Date', type: 'date' as const },
        { name: 'tripStartingDate', label: 'Trip Starting Date', type: 'date' as const },
        { name: 'location', label: 'Location', type: 'text' as const, placeholder: 'e.g., Manali Trip' },
        { name: 'b2bDeal', label: 'B2B Deal', type: 'text' as const, placeholder: 'Reference if B2B' },
        { name: 'gst', label: 'GST Number', type: 'text' as const, placeholder: 'e.g., 23AANCP1460D1ZQ' },
        { name: 'tags', label: 'Tags', type: 'text' as const, placeholder: 'Comma-separated, e.g., urgent, new-client', fullWidth: true },
        { name: 'preventOverdueReminders', label: 'Prevent sending overdue reminders for this invoice', type: 'checkbox' as const, fullWidth: true },

        // --- Payment & Config Section ---
        { name: '_header_payment', type: 'custom' as const, customRender: () => <FormSectionHeader title="Payment & Configuration" />, fullWidth: true },
        { name: 'allowedPaymentModes', label: 'Allowed Payment Modes', type: 'multiselect' as const, options: [ {value: 'upi', label: 'UPI'}, {value: 'cash', label: 'Cash'}, {value: 'bank_transfer', label: 'Bank Transfer'} /* Add all modes here */ ], fullWidth: true },
        { name: 'currency', label: 'Currency', type: 'select' as const, options: [{value: 'INR', label: 'INR'}, {value: 'USD', label: 'USD'}] },
        { name: 'saleAgent', label: 'Sale Agent', type: 'select' as const, options: [/* Add agents here */] },
        { name: 'isRecurring', label: 'Recurring Invoice?', type: 'checkbox' as const },
        { name: 'discountType', label: 'Discount Type', type: 'select' as const, options: [{value: 'percentage', label: '%'}, {value: 'fixed', label: 'Fixed Amount'}] },
        { name: 'quantityAs', label: 'Show Quantity As', type: 'select' as const, options: [{value: 'Qty', label: 'Qty'}, {value: 'Hours', label: 'Hours'}, {value: 'Qty/Hours', label: 'Qty/Hours'}] },

        // --- Line Items Section ---
        { name: '_header_items', type: 'custom' as const, customRender: () => <FormSectionHeader title="Invoice Items" />, fullWidth: true },
        { name: 'lineItems', label: '', type: 'lineItems' as const, fullWidth: true },

        // --- Notes Section ---
        { name: '_header_notes', type: 'custom' as const, customRender: () => <FormSectionHeader title="Notes & Terms" />, fullWidth: true },
        { name: 'adminNote', label: 'Admin Note', type: 'textarea' as const, placeholder: 'Internal notes, not visible to client', fullWidth: true },
        { name: 'clientNote', label: 'Client Note', type: 'textarea' as const, placeholder: 'Visible to the client on the invoice', fullWidth: true },
        { name: 'termsAndConditions', label: 'Terms & Conditions', type: 'textarea' as const, placeholder: 'Your company terms and conditions', fullWidth: true },
        
        // --- Status ---
        { name: 'status', label: 'Status', type: 'select' as const, options: [ { value: 'draft', label: 'Draft' }, { value: 'unpaid', label: 'Unpaid' }, { value: 'partially_paid', label: 'Partially Paid' }, { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' }, { value: 'cancelled', label: 'Cancelled' } ], required: true },
    ]

    return (
        <Box style={{ padding: '24px' }}>
            <Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
                <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                    {isEditMode ? 'Update Invoice' : 'Create New Invoice'}
                </Text>
                <Button variant="soft" size="2" onClick={() => navigate('/invoice')} style={{ cursor: 'pointer' }}>
                    Back to List
                </Button>
            </Flex>

            <DynamicForm
                fields={formFields}
                buttonText={isEditMode ? 'Update Invoice' : 'Save Invoice'}
                onSubmit={handleSubmit}
                initialValues={initialValues}
            />

            {dialogConfig && (
                <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
                        <AlertDialog.Description size="2">{dialogConfig.description}</AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Action>
                                <Button variant="solid" color="green" onClick={dialogConfig.onConfirm}>
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

export default AddInvoice