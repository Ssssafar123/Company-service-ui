import React, { useState, useEffect } from 'react'
import { Box, Text, Separator, Flex, Button, AlertDialog, TextField, Select, IconButton } from '@radix-ui/themes'
import { useLocation, useNavigate } from 'react-router-dom'
import DynamicForm from '../../../components/dynamicComponents/Form'
import { Plus, HelpCircle, Settings, Trash2 } from 'lucide-react'

// --- Helper for Section Headers ---
const FormSectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Box style={{ gridColumn: '1 / -1', marginBottom: '8px', marginTop: '24px' }}>
        <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
            {title}
        </Text>
        <Separator size="4" style={{ marginTop: '8px' }} />
    </Box>
)

// --- Line Items Component ---
type LineItem = {
    id: string
    item: string
    description: string
    qty: number
    rate: number
    tax: number
    amount: number
}

type LineItemsProps = {
    value?: LineItem[]
    onChange?: (items: LineItem[]) => void
}

const LineItems: React.FC<LineItemsProps> = ({ value = [], onChange }) => {
    const [items, setItems] = useState<LineItem[]>(value)
    const [quantityDisplay, setQuantityDisplay] = useState('Qty')
    const [discount, setDiscount] = useState('0')
    const [discountType, setDiscountType] = useState('%')
    const [adjustment, setAdjustment] = useState('0')

    const addNewItem = () => {
        const newItem: LineItem = {
            id: Date.now().toString(),
            item: '',
            description: '',
            qty: 1,
            rate: 0,
            tax: 5,
            amount: 0
        }
        const updatedItems = [...items, newItem]
        setItems(updatedItems)
        onChange?.(updatedItems)
    }

    const updateItem = (id: string, field: keyof LineItem, value: any) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value }
                if (field === 'qty' || field === 'rate') {
                    updated.amount = updated.qty * updated.rate
                }
                return updated
            }
            return item
        })
        setItems(updatedItems)
        onChange?.(updatedItems)
    }

    const removeItem = (id: string) => {
        const updatedItems = items.filter(item => item.id !== id)
        setItems(updatedItems)
        onChange?.(updatedItems)
    }

    const calculateSubTotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0)
    }

    const calculateDiscount = () => {
        const subtotal = calculateSubTotal()
        const d = parseFloat(discount) || 0
        if (discountType === '%') {
            return (subtotal * d) / 100
        }
        return d
    }

    const calculateTotal = () => {
        const subtotal = calculateSubTotal()
        const discountAmount = calculateDiscount()
        const adj = parseFloat(adjustment) || 0
        return subtotal - discountAmount + adj
    }

    return (
        <Box style={{ width: '100%', gridColumn: '1 / -1' }}>
            {/* Header Controls */}
            <Flex gap="3" align="center" style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'var(--gray-2)', borderRadius: '8px', border: '1px solid var(--gray-6)' }}>
                <Box style={{ flex: 1 }}>
                    <Select.Root defaultValue="add-item">
                        <Select.Trigger style={{ width: '100%' }} placeholder="Add Item" />
                        <Select.Content>
                            <Select.Item value="add-item">Add Item</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>

                <IconButton variant="soft" onClick={addNewItem}>
                    <Plus size={16} />
                </IconButton>

                <Box style={{ flex: 1 }}>
                    <Select.Root defaultValue="bill-tasks">
                        <Select.Trigger style={{ width: '100%' }} placeholder="Bill Tasks" />
                        <Select.Content>
                            <Select.Item value="bill-tasks">Bill Tasks</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Box>

                <IconButton variant="soft">
                    <HelpCircle size={16} />
                </IconButton>

                <Flex align="center" gap="2" style={{ marginLeft: 'auto' }}>
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>Show quantity as:</Text>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Qty'}
                            onChange={() => setQuantityDisplay('Qty')}
                        />
                        <Text size="2">Qty</Text>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Hours'}
                            onChange={() => setQuantityDisplay('Hours')}
                        />
                        <Text size="2">Hours</Text>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Qty/Hours'}
                            onChange={() => setQuantityDisplay('Qty/Hours')}
                        />
                        <Text size="2">Qty/Hours</Text>
                    </label>
                </Flex>
            </Flex>

            {/* Table Header */}
            <Box style={{ 
                display: 'grid', 
                gridTemplateColumns: '40px 200px 1fr 120px 150px 150px 150px 80px',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'var(--gray-3)',
                borderRadius: '8px 8px 0 0',
                border: '1px solid var(--gray-6)',
                borderBottom: 'none'
            }}>
                <Flex align="center" justify="center">
                    <Box style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--gray-12)', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>i</Box>
                </Flex>
                <Text size="2" weight="medium">Item</Text>
                <Text size="2" weight="medium">Description</Text>
                <Text size="2" weight="medium">Qty</Text>
                <Text size="2" weight="medium">Rate</Text>
                <Text size="2" weight="medium">Tax</Text>
                <Text size="2" weight="medium">Amount</Text>
                <Flex align="center" justify="center">
                    <Settings size={16} style={{ color: 'var(--gray-11)' }} />
                </Flex>
            </Box>

            {/* Line Items */}
            <Box style={{ border: '1px solid var(--gray-6)', borderTop: 'none' }}>
                {items.length === 0 ? (
                    <Box style={{ padding: '32px', textAlign: 'center' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>No items added. Click the + button above to add items.</Text>
                    </Box>
                ) : (
                    items.map((item, index) => (
                        <Box 
                            key={item.id}
                            style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '40px 200px 1fr 120px 150px 150px 150px 80px',
                                gap: '12px',
                                padding: '16px',
                                borderBottom: index < items.length - 1 ? '1px solid var(--gray-6)' : 'none',
                                alignItems: 'start'
                            }}
                        >
                            <Box></Box>

                            <textarea
                                value={item.item}
                                onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                placeholder="Item name"
                                style={{ 
                                    height: '120px',
                                    padding: '8px 12px',
                                    border: '1px solid var(--gray-6)',
                                    borderRadius: '6px',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'none'
                                }}
                            />

                            <textarea
                                value={item.description}
                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                placeholder="Long description"
                                style={{ 
                                    height: '120px',
                                    padding: '8px 12px',
                                    border: '1px solid var(--gray-6)',
                                    borderRadius: '6px',
                                    fontFamily: 'inherit',
                                    fontSize: '14px',
                                    resize: 'none'
                                }}
                            />

                            <Box>
                                <TextField.Root
                                    type="number"
                                    value={item.qty.toString()}
                                    onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                />
                                <Text size="1" style={{ color: 'var(--gray-9)', marginTop: '4px', paddingLeft: '8px' }}>Unit</Text>
                            </Box>

                            <TextField.Root
                                type="number"
                                value={item.rate.toString()}
                                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                placeholder="Rate"
                            />

                            <Select.Root 
                                value={item.tax.toString()} 
                                onValueChange={(value) => updateItem(item.id, 'tax', parseFloat(value))}
                            >
                                <Select.Trigger style={{ width: '100%' }} />
                                <Select.Content>
                                    <Select.Item value="0">0.00%</Select.Item>
                                    <Select.Item value="5">5.00%</Select.Item>
                                    <Select.Item value="10">10.00%</Select.Item>
                                    <Select.Item value="12">12.00%</Select.Item>
                                    <Select.Item value="18">18.00%</Select.Item>
                                    <Select.Item value="28">28.00%</Select.Item>
                                </Select.Content>
                            </Select.Root>

                            <Text size="2" weight="medium" style={{ paddingTop: '8px' }}>
                                ₹{item.amount.toFixed(2)}
                            </Text>

                            <Flex align="start" justify="center" style={{ paddingTop: '4px' }}>
                                <IconButton variant="soft" color="red" onClick={() => removeItem(item.id)}>
                                    <Trash2 size={16} />
                                </IconButton>
                            </Flex>
                        </Box>
                    ))
                )}
            </Box>

            {/* Totals Section */}
            <Flex justify="end" style={{ padding: '32px 16px' }}>
                <Box style={{ width: '400px' }}>
                    {/* Sub Total */}
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Sub Total :</Text>
                        <Text size="2" weight="medium">₹{calculateSubTotal().toFixed(2)}</Text>
                    </Flex>

                    {/* Discount */}
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Discount</Text>
                        <Flex align="center" gap="2">
                            <TextField.Root
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                style={{ width: '120px', textAlign: 'right' }}
                            />
                            <Select.Root value={discountType} onValueChange={setDiscountType}>
                                <Select.Trigger style={{ width: '60px' }} />
                                <Select.Content>
                                    <Select.Item value="%">%</Select.Item>
                                    <Select.Item value="₹">₹</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            <Text size="2" weight="medium" style={{ width: '80px', textAlign: 'right' }}>
                                -₹{calculateDiscount().toFixed(2)}
                            </Text>
                        </Flex>
                    </Flex>

                    {/* Adjustment */}
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Adjustment</Text>
                        <Flex align="center" gap="2">
                            <TextField.Root
                                type="number"
                                value={adjustment}
                                onChange={(e) => setAdjustment(e.target.value)}
                                style={{ width: '240px', textAlign: 'right' }}
                            />
                            <Text size="2" weight="medium" style={{ width: '80px', textAlign: 'right' }}>
                                ₹{parseFloat(adjustment || '0').toFixed(2)}
                            </Text>
                        </Flex>
                    </Flex>

                    {/* Total */}
                    <Flex 
                        justify="between" 
                        align="center" 
                        style={{ 
                            paddingTop: '12px', 
                            borderTop: '1px solid var(--gray-6)' 
                        }}
                    >
                        <Text size="3" weight="bold">Total :</Text>
                        <Text size="3" weight="bold">₹{calculateTotal().toFixed(2)}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

// --- Main Invoice Data Types ---
type InvoiceData = {
    id: string
    customer: string
    billTo: string
    shipTo: string
    invoiceNumber: string
    date: string
    dueDate: string
    preventOverdueReminders: boolean
    tripStartingDate: string
    location: string
    b2bDeal: string
    gst: string
    tags: string[]
    allowedPaymentModes: string[]
    currency: string
    saleAgent: string
    isRecurring: boolean
    discountType: 'percentage' | 'fixed'
    discountValue: number
    lineItems: LineItem[]
    quantityAs: 'Qty' | 'Hours' | 'Qty/Hours'
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
        { name: 'b2bDeal', label: 'B2B Deal', type: 'checkbox' as const },
        { name: 'gst', label: 'GST Number', type: 'text' as const, placeholder: 'e.g., 23AANCP1460D1ZQ' },
        { name: 'tags', label: 'Tags', type: 'text' as const, placeholder: 'Comma-separated, e.g., urgent, new-client', fullWidth: true },
        { name: 'preventOverdueReminders', label: 'Prevent sending overdue reminders for this invoice', type: 'checkbox' as const, fullWidth: true },

        // --- Payment & Config Section ---
        { name: 'allowedPaymentModes', label: 'Allowed Payment Modes', type: 'multiselect' as const, options: [ {value: 'upi', label: 'UPI'}, {value: 'cash', label: 'Cash'}, {value: 'bank_transfer', label: 'Bank Transfer'} ], fullWidth: true },
        { name: 'currency', label: 'Currency', type: 'select' as const, options: [{value: 'INR', label: 'INR'}, {value: 'USD', label: 'USD'}] },
        { name: 'saleAgent', label: 'Sale Agent', type: 'select' as const, options: [] },
        { name: 'isRecurring', label: 'Recurring Invoice?', type: 'select' as const },
        { name: 'discountType', label: 'Discount Type', type: 'select' as const, options: [{value: 'percentage', label: '%'}, {value: 'fixed', label: 'Fixed Amount'}] },
        { name: 'adminNote', label: 'Admin Note', type: 'textarea' as const, placeholder: 'Internal notes, not visible to client', fullWidth: true },

        // --- Line Items Section ---
        { name: '_header_items', type: 'custom' as const, customRender: () => <FormSectionHeader title="Invoice Items" />, fullWidth: true },
        { name: 'lineItems', type: 'custom' as const, customRender: (value: any, onChange: any) => (
            <LineItems value={value} onChange={onChange} />
        ), fullWidth: true },

        // --- Notes Section ---
        { name: 'clientNote', label: 'Client Note', type: 'textarea' as const, placeholder: 'Visible to the client on the invoice', fullWidth: true },
        { name: 'termsAndConditions', label: 'Terms & Conditions', type: 'textarea' as const, placeholder: 'Your company terms and conditions', fullWidth: true },
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