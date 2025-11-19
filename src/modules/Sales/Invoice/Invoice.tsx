import React, { useState } from 'react'
import { Box, Flex, Text, Button, Card, TextField } from '@radix-ui/themes'
import { Search, ChevronDown, Plus, CreditCard, RefreshCw, List, Filter, ChevronLeft } from 'lucide-react'

export default function InvoiceDashboard() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')

  const invoices = [
    { id: 'INVOICE002514/11/2025', amount: 16800.0, tax: 800.0, date: '19/11/2025', customer: 'Praharsh Parihar', project: '', tags: ['Manali - Kasol', '25 nov'], dueDate: '25/11/2025', status: 'Partially Paid', tripDate: '25/11/2025', location: 'Manali - Kasol', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },

    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },
    { id: 'INVOICE002513/11/2025', amount: 13650.0, tax: 650.0, date: '19/11/2025', customer: 'Ruchi Londhe', project: '', tags: ['Udaipur Weekend', '22 Nov'], dueDate: '22/11/2025', status: 'Partially Paid', tripDate: '22/11/2025', location: 'Udaipur weekend', b2b: '23%', gst: '1231221444121' },

  ]

  const stats = {
    outstanding: '₹4,310,097.81',
    pastDue: '₹18,000.00',
    paid: '₹15,599,794.44'
  }

  return (
    <Box style={{ padding: '24px', minHeight: '100vh', background: 'var(--color-panel)' }}>
      <Flex justify="between" align="center" mb="4">
        <Flex align="center" gap="3">
          <Button variant="soft" onClick={() => {}} size="3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text size="2">{selectedYear}</Text>
            <ChevronDown size={16} />
          </Button>
        </Flex>

        <Flex align="center" gap="2">
          <Button variant="outline" size="2" onClick={() => {}}>
            <RefreshCw size={16} />
          </Button>
          <Button variant="ghost" size="2">
            <List size={16} />
          </Button>
          <Button variant="ghost" size="2">
            <Filter size={16} />
          </Button>
          <TextField.Root size="2">
            <TextField.Slot>
              <Search size={14} />
            </TextField.Slot>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              style={{ border: 'none', outline: 'none', padding: '6px 8px', width: 220 }}
            />
          </TextField.Root>
        </Flex>
      </Flex>

      <Flex gap="4" mb="4">
        <Card style={{ padding: 20, flex: 1 }}>
          <Text size="2" style={{ color: 'var(--accent-11)' }}>Outstanding Invoices</Text>
          <Text size="6" weight="bold">{stats.outstanding}</Text>
        </Card>
        <Card style={{ padding: 20, flex: 1 }}>
          <Text size="2" style={{ color: 'var(--accent-9)' }}>Past Due Invoices</Text>
          <Text size="6" weight="bold">{stats.pastDue}</Text>
        </Card>
        <Card style={{ padding: 20, flex: 1 }}>
          <Text size="2" style={{ color: 'var(--accent-9)' }}>Paid Invoices</Text>
          <Text size="6" weight="bold">{stats.paid}</Text>
        </Card>
      </Flex>

      <Flex align="center" gap="2" mb="4">
        <Button variant="solid" size="3">
          <Plus size={14} />
          Create New Invoice
        </Button>
        <Button variant="solid" size="3">
          <CreditCard size={14} />
          Batch Payments
        </Button>
        <Button variant="outline" size="3">
          <RefreshCw size={14} />
          Recurring Invoices
        </Button>
      </Flex>

      <Card>
        <Box style={{ padding: 12, borderBottom: '1px solid var(--accent-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Flex align="center" gap="2">
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ padding: 8, borderRadius: 6 }}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <Button variant="ghost" size="2">Export</Button>
          </Flex>

          <Flex align="center" gap="2">
            <Button variant="ghost" size="2"><ChevronLeft size={16} /></Button>
            <Button variant="ghost" size="2"><List size={16} /></Button>
            <Button variant="ghost" size="2"><Filter size={16} /></Button>
          </Flex>
        </Box>

        <Box style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel-background)', borderBottom: '1px solid var(--accent-6)' }}>
                {['Invoice #','Amount','Total Tax','Date','Customer','Project','Tags','Due Date','Status','Trip Start','Location','B2B','GST'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--accent-11)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--accent-6)' }}>
                  <td style={{ padding: 16, color: 'var(--accent-11)', fontWeight: 600 }}>{invoice.id}</td>
                  <td style={{ padding: 16 }}>₹{invoice.amount.toLocaleString()}</td>
                  <td style={{ padding: 16 }}>₹{invoice.tax.toFixed(2)}</td>
                  <td style={{ padding: 16 }}>{invoice.date}</td>
                  <td style={{ padding: 16, color: 'var(--accent-11)', fontWeight: 600 }}>{invoice.customer}</td>
                  <td style={{ padding: 16 }}>{invoice.project}</td>
                  <td style={{ padding: 16 }}>
                    <Flex wrap="wrap" gap="2">
                      {invoice.tags?.map((t, i) => <Box key={i} style={{ background: 'var(--accent-4)', padding: '4px 8px', borderRadius: 6 }}>{t}</Box>)}
                    </Flex>
                  </td>
                  <td style={{ padding: 16 }}>{invoice.dueDate}</td>
                  <td style={{ padding: 16 }}><Box style={{ background: 'var(--accent-4)', padding: '4px 12px', borderRadius: 999 }}>{invoice.status}</Box></td>
                  <td style={{ padding: 16 }}>{invoice.tripDate}</td>
                  <td style={{ padding: 16 }}>{invoice.location}</td>
                  <td style={{ padding: 16 }}>{invoice.b2b}</td>
                  <td style={{ padding: 16 }}>{invoice.gst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  )
}