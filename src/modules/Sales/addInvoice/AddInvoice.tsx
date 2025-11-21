import React, { useState } from 'react'
import { Box, Card, Heading, Flex, Button } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import DynamicForm from '../../../components/dynamicComponents/Form'

type InvoiceData = {
    id: string
    invoiceNumber: string
    amount: number
    totalTax: number
    date: string
    customer: string
    project: string
    tags: string[]
    dueDate: string
    status: 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'draft' | 'cancelled'
    tripStartingDate: string
    location: string
    b2bDeal: string
    gst: string
}

// The form will manage a new invoice object.
// We'll handle `tags` as a comma-separated string in the UI for simplicity.
type NewInvoiceState = Omit<InvoiceData, 'id' | 'tags'> & { tags: string }

const AddInvoice = () => {
    const navigate = useNavigate()
    const [newInvoice, setNewInvoice] = useState<NewInvoiceState>({
        invoiceNumber: '',
        amount: 0,
        totalTax: 0,
        date: new Date().toISOString().split('T')[0], // Default to today
        customer: '',
        project: '',
        tags: '',
        dueDate: '',
        status: 'draft',
        tripStartingDate: '',
        location: '',
        b2bDeal: '',
        gst: '',
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setNewInvoice((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Convert tags string to array and create final invoice object
        const finalInvoiceData: Omit<InvoiceData, 'id'> = {
            ...newInvoice,
            tags: newInvoice.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            id: `INV-${Date.now()}`, // Generate a temporary unique ID
        }
        console.log('New Invoice Submitted:', finalInvoiceData)
        alert('Invoice created! Check the console for the data.')
        // Here you would typically send the data to your backend API
        // e.g., api.invoices.create(finalInvoiceData);
        navigate('/invoice') // Navigate back to the invoice list
    }

    // Define the structure for your DynamicForm component
    const formFields = [
        { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'e.g., INV-2025-001', required: true },
        { name: 'customer', label: 'Customer Name', type: 'text', placeholder: 'Enter customer name', required: true },
        { name: 'project', label: 'Project Name', type: 'text', placeholder: 'Optional project name' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Manali Trip' },
        { name: 'date', label: 'Invoice Date', type: 'date', required: true },
        { name: 'dueDate', label: 'Due Date', type: 'date' },
        { name: 'tripStartingDate', label: 'Trip Starting Date', type: 'date' },
        { name: 'amount', label: 'Amount (INR)', type: 'number', placeholder: 'e.g., 15000', required: true },
        { name: 'totalTax', label: 'Total Tax (INR)', type: 'number', placeholder: 'e.g., 800' },
        { name: 'gst', label: 'GST Number', type: 'text', placeholder: 'Customer or company GSTIN' },
        { name: 'b2bDeal', label: 'B2B Deal', type: 'text', placeholder: 'Reference if B2B' },
        { name: 'tags', label: 'Tags', type: 'text', placeholder: 'Comma-separated, e.g., urgent, new-client' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled'],
            required: true,
        },
    ]

    return (
        <Box style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <Card>
                <Heading as="h1" size="6" mb="5">
                    Create New Invoice
                </Heading>
                <DynamicForm
                    fields={formFields}
                    formData={newInvoice}
                    onFormChange={handleFormChange}
                    onFormSubmit={handleSubmit}
                    submitButtonText="Save Invoice"
                    cancelButtonText="Cancel"
                    onCancel={() => navigate('/invoice')}
                />
            </Card>
        </Box>
    )
}

export default AddInvoice