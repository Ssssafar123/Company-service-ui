import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../store'
import { fetchInvoiceById, type Invoice } from '../../../features/InvoiceSlice'
import { fetchPayments } from '../../../features/PaymentSlice'
import { Box, Flex, Text, Button, Separator, Badge } from '@radix-ui/themes'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const invoiceRef = useRef<HTMLDivElement>(null)

  const [invoice, setInvoice] = useState<Invoice | null>(location.state?.invoiceData || null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      if (location.state?.invoiceData) {
        setInvoice(location.state.invoiceData)
        // Fetch payments for this invoice
        fetchInvoicePayments(location.state.invoiceData.id)
      } else {
        loadInvoice(id)
      }
    }
  }, [id, location.state])

  const loadInvoice = async (invoiceId: string) => {
    try {
      setLoading(true)
      const invoiceData = await dispatch(fetchInvoiceById(invoiceId)).unwrap()
      setInvoice(invoiceData)
      fetchInvoicePayments(invoiceId)
    } catch (error) {
      console.error('Failed to load invoice:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoicePayments = async (invoiceId: string) => {
    try {
      const allPayments = await dispatch(fetchPayments()).unwrap()
      const invoicePayments = allPayments.filter(
        (payment: any) => payment.invoiceId === invoiceId
      )
      setPayments(invoicePayments)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: 'yellow' | 'green' | 'red' | 'blue' | 'gray' }> = {
      paid: { label: 'PAID', color: 'green' },
      partially_paid: { label: 'PARTIALLY PAID - PAY INVOICE', color: 'yellow' },
      unpaid: { label: 'UNPAID', color: 'red' },
      overdue: { label: 'OVERDUE', color: 'red' },
      draft: { label: 'DRAFT', color: 'gray' },
      cancelled: { label: 'CANCELLED', color: 'gray' },
    }
    const config = statusConfig[status] || { label: status.toUpperCase(), color: 'gray' }
    return (
      <Badge size="2" variant="solid" color={config.color}>
        {config.label}
      </Badge>
    )
  }

  const numberToWords = (num: number): string => {
    // Simple number to words converter (can be enhanced)
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    
    if (num === 0) return 'Zero'
    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '')
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '')
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '')
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '')
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '')
  }

  const getAmountInWords = (amount: number): string => {
    const rupees = Math.floor(amount)
    const paise = Math.round((amount - rupees) * 100)
    const rupeesWords = numberToWords(rupees)
    const paiseWords = paise > 0 ? numberToWords(paise) : 'Zero'
    return `${rupeesWords} ${paiseWords} Paise Only`
  }

  const calculateSubtotal = () => {
    if (!invoice?.lineItems) return 0
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  }

  const calculateDiscount = () => {
    if (!invoice) return 0
    const subtotal = calculateSubtotal()
    if (invoice.discountType === 'percentage') {
      return (subtotal * (invoice.discountValue || 0)) / 100
    }
    return invoice.discountValue || 0
  }

  const calculateTotal = () => {
    if (!invoice) return 0
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const tax = invoice.totalTax || 0
    const adjustment = invoice.adjustment || 0
    return subtotal - discount + tax + adjustment
  }

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoice) return

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `INVOICE${invoice.invoiceNumber.replace(/[^0-9]/g, '')}-${formatDate(invoice.date).replace(/\//g, '-')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && !invoice) {
    return (
      <Box style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Loading invoice...</Text>
      </Box>
    )
  }

  if (!invoice) {
    return (
      <Box style={{ padding: '24px', textAlign: 'center' }}>
        <Text color="red">Invoice not found</Text>
        <Button onClick={() => navigate('/dashboard/invoice')} style={{ marginTop: '16px' }}>
          Back to Invoices
        </Button>
      </Box>
    )
  }

  const subtotal = calculateSubtotal()
  const discount = calculateDiscount()
  const total = calculateTotal()
  const paidAmount = invoice.paidAmount || payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const remainingAmount = total - paidAmount

  return (
    <Box style={{ padding: '24px', backgroundColor: 'var(--gray-2)', minHeight: '100vh' }}>
      {/* Action Buttons */}
      <Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
        <Button
          variant="soft"
          onClick={() => navigate('/dashboard/invoice')}
          style={{ cursor: 'pointer' }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Invoices
        </Button>
        <Flex gap="2">
          
          <Button variant="solid" color="blue" onClick={handleDownloadPDF} style={{ cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '8px' }} />
            Download PDF
          </Button>
        </Flex>
      </Flex>

      {/* Invoice Content - Printable/PDF */}
      <Box
        ref={invoiceRef}
        style={{
          backgroundColor: 'white',
          padding: '40px',
          maxWidth: '210mm',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <Flex justify="between" align="start" style={{ marginBottom: '32px' }}>
          <Box>
            <Text size="8" weight="bold" style={{ display: 'block', marginBottom: '8px' }}>
              INVOICE
            </Text>
            <Text size="8" weight="bold" style={{ display: 'block', marginBottom: '16px' }}>
              {invoice.invoiceNumber}
            </Text>
            <Box style={{ marginTop: '8px' }}>
              {getStatusBadge(invoice.status)}
            </Box>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Text size="5" weight="bold" style={{ display: 'block', marginBottom: '12px' }}>
              Pirgrimage Travels Private Limited
            </Text>
            <Text size="2" style={{ display: 'block', color: 'var(--gray-11)' }}>
              PU4, Behind C21 Mall, scheme no 54, Vijay Nagar, 452010.
            </Text>
            <Text size="2" style={{ display: 'block', color: 'var(--gray-11)' }}>
              Indore Madhya pradesh
            </Text>
            <Text size="2" style={{ display: 'block', color: 'var(--gray-11)', marginTop: '8px' }}>
              +91 7999131020
            </Text>
          </Box>
        </Flex>

        <Separator size="4" style={{ marginBottom: '24px' }} />

        {/* Bill To Section */}
        <Box style={{ marginBottom: '24px' }}>
          <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '12px' }}>
            Bill To:
          </Text>
          <Text size="3" weight="medium" style={{ display: 'block' }}>
            {invoice.customer}
          </Text>
          {invoice.customerPhone && (
            <Text size="2" style={{ display: 'block', color: 'var(--gray-11)', marginTop: '4px' }}>
              {invoice.customerPhone}
            </Text>
          )}
          {invoice.billTo && (
            <Text size="2" style={{ display: 'block', color: 'var(--gray-11)', marginTop: '8px', whiteSpace: 'pre-line' }}>
              {invoice.billTo}
            </Text>
          )}
        </Box>

        {/* Invoice Details */}
        <Flex wrap="wrap" gap="4" style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--gray-2)', borderRadius: '8px' }}>
          <Box style={{ flex: '1 1 200px' }}>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>Invoice Date:</Text>
            <Text size="3" weight="medium" style={{ display: 'block' }}>{formatDate(invoice.date)}</Text>
          </Box>
          <Box style={{ flex: '1 1 200px' }}>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>Due Date:</Text>
            <Text size="3" weight="medium" style={{ display: 'block' }}>{formatDate(invoice.dueDate)}</Text>
          </Box>
          {invoice.tripStartingDate && (
            <Box style={{ flex: '1 1 200px' }}>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Trip Starting Date:</Text>
              <Text size="3" weight="medium" style={{ display: 'block' }}>{formatDate(invoice.tripStartingDate)}</Text>
            </Box>
          )}
          {invoice.location && (
            <Box style={{ flex: '1 1 200px' }}>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>Location:</Text>
              <Text size="3" weight="medium" style={{ display: 'block' }}>{invoice.location}</Text>
            </Box>
          )}
          {invoice.gst && (
            <Box style={{ flex: '1 1 200px' }}>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>GST:</Text>
              <Text size="3" weight="medium" style={{ display: 'block' }}>{invoice.gst}</Text>
            </Box>
          )}
        </Flex>

        {/* Line Items Table */}
        <Box style={{ marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-6)', backgroundColor: 'var(--gray-2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Item</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Rate</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Tax</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems && invoice.lineItems.length > 0 ? (
                invoice.lineItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ borderBottom: '1px solid var(--gray-6)' }}>
                      <td style={{ padding: '12px', fontSize: '14px' }}>{index + 1}</td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        <Text weight="medium" style={{ display: 'block' }}>{item.description}</Text>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>{formatCurrency(item.rate)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>
                        {item.tax ? `GST ${item.tax.toFixed(2)}%` : '-'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-11)' }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <Box style={{ marginTop: '24px', marginLeft: 'auto', width: '400px' }}>
            <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
              <Text size="3">Sub Total</Text>
              <Text size="3" weight="medium">{formatCurrency(subtotal)}</Text>
            </Flex>
            {invoice.totalTax > 0 && (
              <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
                <Text size="3">
                  GST{invoice.lineItems?.[0]?.tax && invoice.lineItems[0].tax > 0 ? ` (${invoice.lineItems[0].tax.toFixed(2)}%)` : ''}
                </Text>
                <Text size="3" weight="medium">{formatCurrency(invoice.totalTax)}</Text>
              </Flex>
            )}
            {discount > 0 && (
              <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
                <Text size="3">Discount</Text>
                <Text size="3" weight="medium">-{formatCurrency(discount)}</Text>
              </Flex>
            )}
            {invoice.adjustment && invoice.adjustment !== 0 && (
              <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
                <Text size="3">Adjustment</Text>
                <Text size="3" weight="medium">{formatCurrency(invoice.adjustment)}</Text>
              </Flex>
            )}
            <Separator size="4" style={{ margin: '12px 0' }} />
            <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
              <Text size="4" weight="bold">Total</Text>
              <Text size="4" weight="bold">{formatCurrency(total)}</Text>
            </Flex>
            <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
              <Text size="3">Total Paid</Text>
              <Text size="3" weight="medium" color="green">-{formatCurrency(paidAmount)}</Text>
            </Flex>
            {remainingAmount > 0 && (
              <Flex justify="between" style={{ marginBottom: '8px', padding: '8px 0' }}>
                <Text size="3" weight="bold">Amount Due</Text>
                <Text size="3" weight="bold" color="red">{formatCurrency(remainingAmount)}</Text>
              </Flex>
            )}
          </Box>
        </Box>

        {/* Amount in Words */}
        <Box style={{ marginBottom: '24px', padding: '12px', backgroundColor: 'var(--gray-2)', borderRadius: '4px' }}>
          <Text size="2" style={{ color: 'var(--gray-11)' }}>
            With words: <strong>{getAmountInWords(total)}</strong>
          </Text>
        </Box>

        {/* Transactions/Payments */}
        {payments.length > 0 && (
          <Box style={{ marginBottom: '24px' }}>
            <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '12px' }}>
              Transactions:
            </Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-6)', backgroundColor: 'var(--gray-2)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Payment #</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Payment Mode</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id || index} style={{ borderBottom: '1px solid var(--gray-6)' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{payment.paymentId || payment.transactionId}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{payment.paymentMode}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{formatDate(payment.date)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }}>
                      {formatCurrency(payment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}

        {/* Notes */}
        {invoice.clientNote && (
          <Box style={{ marginBottom: '24px' }}>
            <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '8px' }}>
              Note:
            </Text>
            <Text size="3" style={{ whiteSpace: 'pre-line' }}>{invoice.clientNote}</Text>
          </Box>
        )}

        {/* Terms & Conditions */}
        {invoice.termsAndConditions && (
          <Box style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid var(--gray-6)' }}>
            <Text size="4" weight="bold" style={{ display: 'block', marginBottom: '12px' }}>
              Terms & Conditions:
            </Text>
            <Text size="2" style={{ whiteSpace: 'pre-line', color: 'var(--gray-11)' }}>
              {invoice.termsAndConditions}
            </Text>
          </Box>
        )}
      </Box>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  )
}

export default ViewInvoice