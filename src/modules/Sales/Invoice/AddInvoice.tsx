import React, { useState, useEffect } from 'react'
import { Box, Text, Separator, Flex, Button, AlertDialog, TextField, Select, IconButton, Checkbox, DropdownMenu, TextArea, Tooltip } from '@radix-ui/themes'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../store'
import { Plus, HelpCircle, Settings, Trash2, Pencil, ChevronDown, Calendar, Tag } from 'lucide-react'
import {
	createInvoice,
	updateInvoiceById,
	fetchInvoiceById,
	fetchNextInvoiceNumber,
	type Invoice as InvoiceType,
} from '../../../features/InvoiceSlice'
import { fetchUsers } from '../../../features/UserSlice'

const FormSectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Box style={{ marginBottom: '16px', marginTop: '24px' }}>
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
    tax: number
    amount: number
}

type LineItemsProps = {
    value?: LineItem[]
    onChange?: (items: LineItem[]) => void
    quantityAs?: 'Qty' | 'Hours' | 'Qty/Hours'
    onQuantityAsChange?: (value: 'Qty' | 'Hours' | 'Qty/Hours') => void
}

const LineItems: React.FC<LineItemsProps> = ({ value = [], onChange, quantityAs = 'Qty', onQuantityAsChange }) => {
    const [items, setItems] = useState<LineItem[]>(value)
    const [quantityDisplay, setQuantityDisplay] = useState<'Qty' | 'Hours' | 'Qty/Hours'>(quantityAs)
    const [discount, setDiscount] = useState('0')
    const [discountType, setDiscountType] = useState<'%' | '₹'>('%')
    const [adjustment, setAdjustment] = useState('0')
    const [showAddItemInput, setShowAddItemInput] = useState(false)
    const [showBillTasksInput, setShowBillTasksInput] = useState(false)
    const [addItemInput, setAddItemInput] = useState('')
    const [billTaskInput, setBillTaskInput] = useState('')

    useEffect(() => {
        if (value) {
            setItems(value)
        }
    }, [value])

    useEffect(() => {
        setQuantityDisplay(quantityAs)
    }, [quantityAs])

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
                    updated.amount = updated.qty * updated.rate * (1 + (updated.tax || 0) / 100)
                }
                if (field === 'tax') {
                    updated.amount = updated.qty * updated.rate * (1 + (value || 0) / 100)
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

    const handleAddItemClick = () => {
        setShowAddItemInput(true)
    }

    const handleBillTasksClick = () => {
        setShowBillTasksInput(true)
    }

    const handleAddItemSubmit = () => {
        if (addItemInput.trim()) {
            const newItem: LineItem = {
                id: Date.now().toString(),
                item: addItemInput.trim(),
                description: '',
                qty: 1,
                rate: 0,
                tax: 5,
                amount: 0
            }
            const updatedItems = [...items, newItem]
            setItems(updatedItems)
            onChange?.(updatedItems)
            setAddItemInput('')
            setShowAddItemInput(false)
        }
    }

    const handleBillTaskSubmit = () => {
        if (billTaskInput.trim()) {
            const newItem: LineItem = {
                id: Date.now().toString(),
                item: billTaskInput.trim(),
                description: 'Bill Task',
                qty: 1,
                rate: 0,
                tax: 5,
                amount: 0
            }
            const updatedItems = [...items, newItem]
            setItems(updatedItems)
            onChange?.(updatedItems)
            setBillTaskInput('')
            setShowBillTasksInput(false)
        }
    }

    const calculateSubTotal = () => {
        return items.reduce((sum, item) => sum + (item.qty * item.rate), 0)
    }

    const calculateDiscount = () => {
        const subtotal = calculateSubTotal()
        const d = parseFloat(discount) || 0
        if (discountType === '%') {
            return (subtotal * d) / 100
        }
        return d
    }

    const calculateTotalTax = () => {
        return items.reduce((sum, item) => {
            const itemTotal = item.qty * item.rate
            return sum + (itemTotal * (item.tax || 0) / 100)
        }, 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubTotal()
        const discountAmount = calculateDiscount()
        const taxAmount = calculateTotalTax()
        const adj = parseFloat(adjustment) || 0
        return subtotal - discountAmount + taxAmount + adj
    }

    return (
        <Box style={{ width: '100%' }}>
            <Flex gap="3" align="center" style={{ marginBottom: '16px', padding: '16px', backgroundColor: 'var(--gray-2)', borderRadius: '8px', border: '1px solid var(--gray-6)' }}>
                <Box style={{ flex: 1 }}>
                    {showAddItemInput ? (
                        <Flex gap="2" align="center">
                            <TextField.Root
                                value={addItemInput}
                                onChange={(e) => setAddItemInput(e.target.value)}
                                placeholder="Enter item name"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddItemSubmit()
                                    } else if (e.key === 'Escape') {
                                        setShowAddItemInput(false)
                                        setAddItemInput('')
                                    }
                                }}
                                style={{ flex: 1 }}
                                autoFocus
                            />
                            <Button size="1" onClick={handleAddItemSubmit}>Add</Button>
                            <Button size="1" variant="soft" onClick={() => {
                                setShowAddItemInput(false)
                                setAddItemInput('')
                            }}>Cancel</Button>
                        </Flex>
                    ) : (
                        <Select.Root onValueChange={(value) => {
                            if (value === 'add-item') {
                                handleAddItemClick()
                            }
                        }}>
                            <Select.Trigger style={{ width: '100%' }} placeholder="Add Item" />
                            <Select.Content>
                                <Select.Item value="add-item">Add Item</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    )}
                </Box>

                <IconButton variant="soft" onClick={addNewItem} type="button">
                    <Plus size={16} />
                </IconButton>

                <Box style={{ flex: 1 }}>
                    {showBillTasksInput ? (
                        <Flex gap="2" align="center">
                            <TextField.Root
                                value={billTaskInput}
                                onChange={(e) => setBillTaskInput(e.target.value)}
                                placeholder="Enter task name"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleBillTaskSubmit()
                                    } else if (e.key === 'Escape') {
                                        setShowBillTasksInput(false)
                                        setBillTaskInput('')
                                    }
                                }}
                                style={{ flex: 1 }}
                                autoFocus
                            />
                            <Button size="1" onClick={handleBillTaskSubmit}>Add</Button>
                            <Button size="1" variant="soft" onClick={() => {
                                setShowBillTasksInput(false)
                                setBillTaskInput('')
                            }}>Cancel</Button>
                        </Flex>
                    ) : (
                        <Select.Root onValueChange={(value) => {
                            if (value === 'bill-tasks') {
                                handleBillTasksClick()
                            }
                        }}>
                            <Select.Trigger style={{ width: '100%' }} placeholder="Bill Tasks" />
                            <Select.Content>
                                <Select.Item value="bill-tasks">Bill Tasks</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    )}
                </Box>

                <Tooltip content="Projects tasks are not included in this list" side="top">
                    <IconButton 
                        variant="soft" 
                        type="button"
                    >
                        <HelpCircle size={16} />
                    </IconButton>
                </Tooltip>

                <Flex align="center" gap="2" style={{ marginLeft: 'auto' }}>
                    <Text size="2" style={{ color: 'var(--gray-11)' }}>Show quantity as:</Text>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Qty'}
                            onChange={() => {
                                setQuantityDisplay('Qty')
                                onQuantityAsChange?.('Qty')
                                onChange?.(items)
                            }}
                        />
                        <Text size="2">Qty</Text>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Hours'}
                            onChange={() => {
                                setQuantityDisplay('Hours')
                                onQuantityAsChange?.('Hours')
                                onChange?.(items)
                            }}
                        />
                        <Text size="2">Hours</Text>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input 
                            type="radio" 
                            name="qty-display" 
                            checked={quantityDisplay === 'Qty/Hours'}
                            onChange={() => {
                                setQuantityDisplay('Qty/Hours')
                                onQuantityAsChange?.('Qty/Hours')
                                onChange?.(items)
                            }}
                        />
                        <Text size="2">Qty/Hours</Text>
                    </label>
                </Flex>
            </Flex>

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
                <Text size="2" weight="medium">{quantityDisplay}</Text>
                <Text size="2" weight="medium">Rate</Text>
                <Text size="2" weight="medium">Tax</Text>
                <Text size="2" weight="medium">Amount</Text>
                <Flex align="center" justify="center">
                    <Settings size={16} style={{ color: 'var(--gray-11)' }} />
                </Flex>
            </Box>

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

            <Flex justify="end" style={{ padding: '32px 16px' }}>
                <Box style={{ width: '400px' }}>
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Sub Total :</Text>
                        <Text size="2" weight="medium">₹{calculateSubTotal().toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Tax :</Text>
                        <Text size="2" weight="medium">₹{calculateTotalTax().toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
                        <Text size="2" style={{ color: 'var(--gray-11)' }}>Discount</Text>
                        <Flex align="center" gap="2">
                            <TextField.Root
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                style={{ width: '120px', textAlign: 'right' }}
                            />
                            <Select.Root value={discountType} onValueChange={(value: '%' | '₹') => setDiscountType(value)}>
                                <Select.Trigger style={{ width: '60px' }} />
                                <Select.Content>
                                    <Select.Item value="%">%</Select.Item>
                                    <Select.Item value="₹">Fixed Amount</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            <Text size="2" weight="medium" style={{ width: '80px', textAlign: 'right' }}>
                                -₹{calculateDiscount().toFixed(2)}
                            </Text>
                        </Flex>
                    </Flex>
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

type InvoiceStatus =
  | 'paid'
  | 'partially_paid'
  | 'unpaid'
  | 'overdue'
  | 'draft'
  | 'cancelled'

type InvoiceData = {
    id?: string
    customer: string
    invoiceNumber: string
    date: string
    dueDate: string
    status: InvoiceStatus
    billTo?: string
    shipTo?: string
    preventOverdueReminders?: boolean
    tripStartingDate?: string
    location?: string
    b2bDeal?: string
    gst?: string
    tags?: string[]
    currency?: string
    saleAgent?: string
    discountType?: 'No' | 'Before-tax' | 'After-tax'
    lineItems?: {
        description: string
        quantity: number
        rate: number
        amount: number
        tax?: number
    }[]
    quantityAs?: 'Qty' | 'Hours' | 'Qty/Hours'
    adjustment?: number
    amount: number
    totalTax: number
    adminNote?: string
    clientNote?: string
    termsAndConditions?: string
}

const AddInvoice: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const navigate = useNavigate()
    const [formValues, setFormValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchingInvoiceNumber, setFetchingInvoiceNumber] = useState(false)
    const [saleAgentOptions, setSaleAgentOptions] = useState<{ value: string; label: string }[]>([])

    // ✅ Fetch users from Redux store
    const users = useSelector((state: RootState) => state.user.users)
    const usersLoading = useSelector((state: RootState) => state.user.ui.loading)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        onConfirm: () => void
    } | null>(null)

    // ✅ Fetch users on component mount
    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    // ✅ Update saleAgent options when users are loaded
    useEffect(() => {
        if (users && users.length > 0) {
            const options = users.map(user => ({
                value: user.id,
                label: `${user.username}${user.companyId ? ` (${user.companyId})` : ''}`
            }))
            setSaleAgentOptions(options)
        }
    }, [users])

    useEffect(() => {
        const invoiceToEdit = location.state?.invoiceData
        const invoiceId = location.state?.invoiceId || location.pathname.split('/').pop()
        
        // Helper function to convert ISO date to YYYY-MM-DD for date inputs
        const formatDateForInput = (dateValue: string | undefined): string => {
            if (!dateValue) return ''
            try {
                if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateValue
                }
                const date = new Date(dateValue)
                if (isNaN(date.getTime())) return ''
                return date.toISOString().split('T')[0]
            } catch (e) {
                console.error('Date conversion error:', e)
                return ''
            }
        }
        
        if (invoiceToEdit) {
            setIsEditMode(true)
            const initial = {
                ...invoiceToEdit,
                date: formatDateForInput(invoiceToEdit.date),
                dueDate: formatDateForInput(invoiceToEdit.dueDate),
                tripStartingDate: formatDateForInput(invoiceToEdit.tripStartingDate),
                tags: Array.isArray(invoiceToEdit.tags) 
                    ? invoiceToEdit.tags.join(', ') 
                    : (typeof invoiceToEdit.tags === 'string' ? invoiceToEdit.tags : ''),
                lineItems: invoiceToEdit.lineItems?.map((item: any, index: number) => ({
                    id: item.id || index.toString(),
                    item: item.description || item.item || '',
                    description: item.description || '',
                    qty: item.quantity || item.qty || 1,
                    rate: item.rate || 0,
                    tax: item.tax || 5,
                    amount: item.amount || ((item.quantity || item.qty || 1) * (item.rate || 0)),
                })) || [],
                discountType: invoiceToEdit.discountType === 'percentage' || invoiceToEdit.discountType === 'fixed' ? 'No' : (invoiceToEdit.discountType || 'No'),
                adjustment: invoiceToEdit.adjustment || 0,
                quantityAs: invoiceToEdit.quantityAs || 'Qty',
                preventOverdueReminders: invoiceToEdit.preventOverdueReminders || false,
                currency: invoiceToEdit.currency || 'INR',
                billTo: invoiceToEdit.billTo || '',
                shipTo: invoiceToEdit.shipTo || '',
                location: invoiceToEdit.location || '',
                b2bDeal: invoiceToEdit.b2bDeal || '',
                gst: invoiceToEdit.gst || '',
                adminNote: invoiceToEdit.adminNote || '',
                clientNote: invoiceToEdit.clientNote || '',
                termsAndConditions: invoiceToEdit.termsAndConditions || '',
                saleAgent: invoiceToEdit.saleAgent || '',
            }
            setFormValues(initial)
        } else if (invoiceId && invoiceId !== 'addInvoice' && invoiceId !== 'new') {
            setIsEditMode(true)
            setLoading(true)
            dispatch(fetchInvoiceById(invoiceId))
                .unwrap()
                .then((invoice) => {
                    const formatDateForInput = (dateValue: string | undefined): string => {
                        if (!dateValue) return ''
                        try {
                            if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                return dateValue
                            }
                            const date = new Date(dateValue)
                            if (isNaN(date.getTime())) return ''
                            return date.toISOString().split('T')[0]
                        } catch (e) {
                            return ''
                        }
                    }
                    
                    const initial = {
                        ...invoice,
                        date: formatDateForInput(invoice.date),
                        dueDate: formatDateForInput(invoice.dueDate),
                        tripStartingDate: formatDateForInput(invoice.tripStartingDate),
                        tags: Array.isArray(invoice.tags) ? invoice.tags.join(', ') : (invoice.tags || ''),
                        lineItems: invoice.lineItems?.map((item: any, index: number) => ({
                            id: item.id || index.toString(),
                            item: item.description || item.item || '',
                            description: item.description || '',
                            qty: item.quantity || item.qty || 1,
                            rate: item.rate || 0,
                            tax: item.tax || 5,
                            amount: item.amount || ((item.quantity || item.qty || 1) * (item.rate || 0)),
                        })) || [],
                        discountType: invoice.discountType === 'percentage' || invoice.discountType === 'fixed' ? 'No' : (invoice.discountType || 'No'),
                        adjustment: invoice.adjustment || 0,
                        quantityAs: invoice.quantityAs || 'Qty',
                        preventOverdueReminders: invoice.preventOverdueReminders || false,
                        currency: invoice.currency || 'INR',
                        billTo: invoice.billTo || '',
                        shipTo: invoice.shipTo || '',
                        location: invoice.location || '',
                        b2bDeal: invoice.b2bDeal || '',
                        gst: invoice.gst || '',
                        adminNote: invoice.adminNote || '',
                        clientNote: invoice.clientNote || '',
                        termsAndConditions: invoice.termsAndConditions || '',
                        saleAgent: invoice.saleAgent || '',
                    }
                    setFormValues(initial)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error('Failed to fetch invoice:', error)
                    setLoading(false)
                    setDialogConfig({
                        title: 'Error',
                        description: error.message || 'Failed to load invoice. Please try again.',
                        actionText: 'OK',
                        onConfirm: () => {
                            setDialogOpen(false)
                            navigate('/dashboard/invoice')
                        },
                    })
                    setDialogOpen(true)
                })
        } else {
            setIsEditMode(false)
            // Fetch next invoice number for new invoices
            setFetchingInvoiceNumber(true)
            dispatch(fetchNextInvoiceNumber())
                .unwrap()
                .then((invoiceNumber) => {
                    setFormValues({
                        date: new Date().toISOString().split('T')[0],
                        invoiceNumber: invoiceNumber, // Auto-generated invoice number
                        status: 'paid',
                        billTo: '',
                        shipTo: '',
                        preventOverdueReminders: false,
                        currency: 'INR',
                        saleAgent: '',
                        discountType: 'No',
                        lineItems: [],
                        quantityAs: 'Qty',
                        adjustment: 0,
                        adminNote: '',
                        clientNote: '* As per company policy, 100% of the payment will be collected at the start of the trip',
                        termsAndConditions: 'Cancelation Policy :-\n*BEFORE 30 DAYS: FULL REFUND (AFTER DEDUCTING ANY EXPENSES THAT HAVE EEN INCURRED FOR HOTEL BOOKINGS, TRANSPORT, ETC.)\n*BETWEEN 21-30 DAYS: 75% OF THE TOTAL TRIP COST WILL BE REFUNDED.\n*BETWEEN 11-20 DAYS: 50% OF THE TOTAL TRIP COST WILL BE REFUNDED.\n*BETWEEN 0-10 DAYS: NO REFUND.\n\nBy traveling with Safar Wanderlust, you agree to our terms and conditions, as outlined in the itinerary.',
                    })
                    setFetchingInvoiceNumber(false)
                })
                .catch((error) => {
                    console.error('Failed to fetch invoice number:', error)
                    setFetchingInvoiceNumber(false)
                    // Still set form values with empty invoice number as fallback
                    setFormValues({
                        date: new Date().toISOString().split('T')[0],
                        invoiceNumber: '',
                        status: 'paid',
                        billTo: '',
                        shipTo: '',
                        preventOverdueReminders: false,
                        currency: 'INR',
                        saleAgent: '',
                        discountType: 'No',
                        lineItems: [],
                        quantityAs: 'Qty',
                        adjustment: 0,
                        adminNote: '',
                        clientNote: '* As per company policy, 100% of the payment will be collected at the start of the trip',
                        termsAndConditions: 'Cancelation Policy :-\n*BEFORE 30 DAYS: FULL REFUND (AFTER DEDUCTING ANY EXPENSES THAT HAVE EEN INCURRED FOR HOTEL BOOKINGS, TRANSPORT, ETC.)\n*BETWEEN 21-30 DAYS: 75% OF THE TOTAL TRIP COST WILL BE REFUNDED.\n*BETWEEN 11-20 DAYS: 50% OF THE TOTAL TRIP COST WILL BE REFUNDED.\n*BETWEEN 0-10 DAYS: NO REFUND.\n\nBy traveling with Safar Wanderlust, you agree to our terms and conditions, as outlined in the itinerary.',
                    })
                })
        }
    }, [location.state, location.pathname, dispatch, navigate])

    const handleChange = (name: string, value: any) => {
        setFormValues((prev: any) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            
            // Calculate totals from line items
            const lineItems = formValues.lineItems || []
            const subtotal = lineItems.reduce((sum: number, item: LineItem) => sum + (item.qty * item.rate), 0)
            const totalTax = lineItems.reduce((sum: number, item: LineItem) => {
                const itemTotal = item.qty * item.rate
                return sum + (itemTotal * (item.tax || 0) / 100)
            }, 0)
            
            // Calculate adjustment
            const adjustment = parseFloat(formValues.adjustment || 0)
            
            // Calculate total - no discount since discountValue is removed
            const totalAmount = subtotal + totalTax + adjustment

            // Format line items for API
            const formattedLineItems = lineItems.map((item: LineItem) => ({
                description: item.description || item.item,
                quantity: item.qty,
                rate: item.rate,
                amount: item.qty * item.rate,
                tax: item.tax || 0,
            }))

            const finalInvoiceData: Partial<InvoiceType> = {
                customer: formValues.customer || '',
                billTo: formValues.billTo || '',
                shipTo: formValues.shipTo || '',
                invoiceNumber: formValues.invoiceNumber || '',
                date: formValues.date ? new Date(formValues.date).toISOString() : new Date().toISOString(),
                dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : new Date().toISOString(),
                preventOverdueReminders: formValues.preventOverdueReminders || false,
                tripStartingDate: formValues.tripStartingDate ? new Date(formValues.tripStartingDate).toISOString() : undefined,
                location: formValues.location || '',
                b2bDeal: formValues.b2bDeal || '',
                gst: formValues.gst || '',
                tags: formValues.tags ? formValues.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
                currency: formValues.currency || 'INR',
                saleAgent: formValues.saleAgent || '',
                discountType: formValues.discountType || 'No',
                lineItems: formattedLineItems,
                quantityAs: formValues.quantityAs || 'Qty',
                adjustment: adjustment,
                adminNote: formValues.adminNote || '',
                clientNote: formValues.clientNote || '',
                termsAndConditions: formValues.termsAndConditions || '',
                status: formValues.status || 'draft',
                amount: totalAmount,
                totalTax: totalTax,
            }

            if (isEditMode && formValues.id) {
                await dispatch(updateInvoiceById({
                    id: formValues.id,
                    data: finalInvoiceData
                })).unwrap()
                
                setDialogConfig({
                    title: 'Success',
                    description: 'The invoice has been updated successfully!',
                    actionText: 'OK',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/invoice')
                    },
                })
            } else {
                await dispatch(createInvoice(finalInvoiceData as Omit<InvoiceType, 'id'>)).unwrap()
                
                setDialogConfig({
                    title: 'Success',
                    description: 'A new invoice has been created successfully!',
                    actionText: 'OK',
                    onConfirm: () => {
                        setDialogOpen(false)
                        navigate('/dashboard/invoice')
                    },
                })
            }
            setLoading(false)
            setDialogOpen(true)
        } catch (error: any) {
            console.error('Invoice save error:', error)
            setLoading(false)
            setDialogConfig({
                title: 'Error',
                description: error.message || 'Failed to save invoice. Please try again.',
                actionText: 'OK',
                onConfirm: () => {
                    setDialogOpen(false)
                },
            })
            setDialogOpen(true)
        }
    }

    if (loading && isEditMode && !formValues.id) {
        return (
            <Box style={{ padding: '24px' }}>
                <Text>Loading invoice...</Text>
            </Box>
        )
    }

    return (
        <Box style={{ padding: '24px' }}>
            <Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
                <Text size="7" weight="bold" style={{ color: 'var(--accent-12)' }}>
                    {isEditMode ? 'Update Invoice' : 'Create New Invoice'}
                </Text>
                <Button variant="soft" size="2" onClick={() => navigate('/dashboard/invoice')} style={{ cursor: 'pointer' }}>
                    Back to List
                </Button>
            </Flex>

            <form onSubmit={handleSubmit}>
                {/* Main Two-Column Box */}
                <Box style={{
                    padding: '24px',
                    backgroundColor: 'var(--gray-2)',
                    borderRadius: '8px',
                    border: '1px solid var(--gray-6)',
                    marginBottom: '24px'
                }}>
                    <Box style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px'
                    }}>
                        {/* Left Column */}
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Customer */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Customer Name <Text style={{ color: 'var(--red-9)' }}>*</Text>
                                </Text>
                                <TextField.Root
                                    value={formValues.customer || ''}
                                    onChange={(e) => handleChange('customer', e.target.value)}
                                    placeholder="Select or add a customer"
                                    required
                                />
                            </Box>

                            {/* Bill To and Ship To in one row */}
                            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Bill To
                                    </Text>
                                    <TextArea
                                        value={formValues.billTo || ''}
                                        onChange={(e) => handleChange('billTo', e.target.value)}
                                        placeholder="Billing address"
                                        style={{ minHeight: '80px' }}
                                    />
                                </Box>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Ship To
                                    </Text>
                                    <TextArea
                                        value={formValues.shipTo || ''}
                                        onChange={(e) => handleChange('shipTo', e.target.value)}
                                        placeholder="Shipping address"
                                        style={{ minHeight: '80px' }}
                                    />
                                </Box>
                            </Box>

                            {/* Invoice Number */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Invoice Number <Text style={{ color: 'var(--red-9)' }}>*</Text>
                                </Text>
                                {fetchingInvoiceNumber && !isEditMode ? (
                                    <Text size="3" style={{ color: 'var(--gray-11)', padding: '8px 12px' }}>
                                        Generating invoice number...
                                    </Text>
                                ) : (
                                    <Text 
                                        size="4" 
                                        weight="medium" 
                                        style={{ 
                                            padding: '8px 12px', 
                                            backgroundColor: 'var(--gray-3)', 
                                            borderRadius: '6px',
                                            border: '1px solid var(--gray-6)',
                                            display: 'inline-block',
                                            minWidth: '200px'
                                        }}
                                    >
                                        {formValues.invoiceNumber || '-'}
                                    </Text>
                                )}
                            </Box>

                            {/* Invoice Date and Due Date in one row */}
                            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Invoice Date <Text style={{ color: 'var(--red-9)' }}>*</Text>
                                    </Text>
                                    <TextField.Root
                                        type="date"
                                        value={formValues.date || ''}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        required
                                    />
                                </Box>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Due Date
                                    </Text>
                                    <TextField.Root
                                        type="date"
                                        value={formValues.dueDate || ''}
                                        onChange={(e) => handleChange('dueDate', e.target.value)}
                                    />
                                </Box>
                            </Box>

                            {/* Prevent Overdue Reminders Checkbox */}
                            <Box>
                                <Flex align="center" gap="2">
                                    <Checkbox
                                        checked={formValues.preventOverdueReminders || false}
                                        onCheckedChange={(checked) => handleChange('preventOverdueReminders', checked)}
                                    />
                                    <Text size="2">Prevent sending overdue reminders for this invoice</Text>
                                </Flex>
                            </Box>

                            {/* Trip Starting Date */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Trip Starting Date
                                </Text>
                                <TextField.Root
                                    type="date"
                                    value={formValues.tripStartingDate || ''}
                                    onChange={(e) => handleChange('tripStartingDate', e.target.value)}
                                />
                            </Box>

                            {/* Location */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Location
                                </Text>
                                <TextField.Root
                                    value={formValues.location || ''}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="e.g., Manali Trip"
                                />
                            </Box>

                            {/* B2B Deal */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    B2B Deal
                                </Text>
                                <TextField.Root
                                    value={formValues.b2bDeal || ''}
                                    onChange={(e) => handleChange('b2bDeal', e.target.value)}
                                    placeholder="B2B Deal name"
                                />
                            </Box>

                            {/* GST */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    GST Number
                                </Text>
                                <TextField.Root
                                    value={formValues.gst || ''}
                                    onChange={(e) => handleChange('gst', e.target.value)}
                                    placeholder="e.g., 23AANCP1460D1ZQ"
                                />
                            </Box>
                        </Box>

                        {/* Right Column */}
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Tags */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Tags
                                </Text>
                                <TextField.Root
                                    value={formValues.tags || ''}
                                    onChange={(e) => handleChange('tags', e.target.value)}
                                    placeholder="Comma-separated, e.g., urgent, new-client"
                                />
                            </Box>

                            {/* Currency and Sale Agent in one row */}
                            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Currency
                                    </Text>
                                    <Select.Root
                                        value={formValues.currency || 'INR'}
                                        onValueChange={(value) => handleChange('currency', value)}
                                    >
                                        <Select.Trigger style={{ width: '100%' }} />
                                        <Select.Content>
                                            <Select.Item value="INR">INR</Select.Item>
                                            <Select.Item value="USD">USD</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                                <Box>
                                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                        Sale Agent
                                    </Text>
                                    <Select.Root
                                        value={formValues.saleAgent || ''}
                                        onValueChange={(value) => handleChange('saleAgent', value)}
                                    >
                                        <Select.Trigger style={{ width: '100%' }} placeholder="Select sale agent" />
                                        <Select.Content>
                                            {saleAgentOptions.map((option) => (
                                                <Select.Item key={option.value} value={option.value}>
                                                    {option.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                            </Box>

                            {/* Discount Type */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Discount Type
                                </Text>
                                <Select.Root
                                    value={formValues.discountType || 'No'}
                                    onValueChange={(value) => {
                                        handleChange('discountType', value)
                                    }}
                                >
                                    <Select.Trigger style={{ width: '100%' }} />
                                    <Select.Content>
                                        <Select.Item value="No">No Discount</Select.Item>
                                        <Select.Item value="Before-tax">Before Tax</Select.Item>
                                        <Select.Item value="After-tax">After Tax</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Box>

                            {/* Admin Note */}
                            <Box>
                                <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                                    Admin Note
                                </Text>
                                <TextArea
                                    value={formValues.adminNote || ''}
                                    onChange={(e) => handleChange('adminNote', e.target.value)}
                                    placeholder="Internal notes, not visible to client"
                                    style={{ minHeight: '120px' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Invoice Items Section */}
                <FormSectionHeader title="Invoice Items" />
                <Box style={{ marginBottom: '24px' }}>
                    <LineItems
                        value={formValues.lineItems || []}
                        onChange={(items) => handleChange('lineItems', items)}
                        quantityAs={formValues.quantityAs || 'Qty'}
                        onQuantityAsChange={(value) => handleChange('quantityAs', value)}
                    />
                </Box>

                {/* Client Note */}
                <Box style={{ marginBottom: '24px' }}>
                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                        Client Note
                    </Text>
                    <TextArea
                        value={formValues.clientNote || ''}
                        onChange={(e) => handleChange('clientNote', e.target.value)}
                        placeholder="Visible to the client on the invoice"
                        style={{ minHeight: '100px' }}
                    />
                </Box>

                {/* Terms & Conditions */}
                <Box style={{ marginBottom: '24px' }}>
                    <Text size="2" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
                        Terms & Conditions
                    </Text>
                    <TextArea
                        value={formValues.termsAndConditions || ''}
                        onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                        placeholder="Your company terms and conditions"
                        style={{ minHeight: '120px' }}
                    />
                </Box>

                {/* Submit Button */}
                <Flex justify="end" gap="3" style={{ marginTop: '24px' }}>
                    <Button
                        type="button"
                        variant="soft"
                        onClick={() => navigate('/dashboard/invoice')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Invoice' : 'Save Invoice')}
                    </Button>
                </Flex>
            </form>

            {dialogConfig && (
                <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
                        <AlertDialog.Description size="2">{dialogConfig.description}</AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Action>
                                <Button variant="solid" color={dialogConfig.title === 'Error' ? 'red' : 'green'} onClick={dialogConfig.onConfirm} disabled={loading}>
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