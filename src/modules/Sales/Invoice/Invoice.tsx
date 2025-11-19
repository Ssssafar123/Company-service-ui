'use client'
import React, { useState } from 'react';
import { Search, ChevronDown, Plus, CreditCard, RefreshCw, Download, List, Filter, ChevronLeft } from 'lucide-react';

export default function InvoiceDashboard() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  const invoices = [
    {
      id: 'INVOICE002514/11/2025',
      amount: 16800.00,
      tax: 800.00,
      date: '19/11/2025',
      customer: 'Praharsh Parihar',
      project: '',
      tags: ['Manali - Kasol', '25 nov'],
      dueDate: '25/11/2025',
      status: 'Partially Paid',
      tripDate: '25/11/2025',
      location: 'Manali - Kasol',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    },
    {
      id: 'INVOICE002513/11/2025',
      amount: 13650.00,
      tax: 650.00,
      date: '19/11/2025',
      customer: 'Ruchi Londhe',
      project: '',
      tags: ['Udaipur Weekend', '22 Nov', 'Repeat client', 'Pachmarhi ad'],
      dueDate: '22/11/2025',
      status: 'Partially Paid',
      tripDate: '22/11/2025',
      location: 'Udaipur weekend',
      b2b: '23%',
      gst : "1231221444121"
    }

  ];

  const stats = {
    outstanding: '₹4,310,097.81',
    pastDue: '₹18,000.00',
    paid: '₹15,599,794.44',
    unpaid: { count: 4, total: 2145, percent: 0.19 },
    paidCount: { count: 1803, total: 2145, percent: 84.06 },
    partiallyPaid: { count: 172, total: 2145, percent: 8.02 },
    overdue: { count: 5, total: 2145, percent: 0.23 },
    draft: { count: 0, total: 2145, percent: 0.00 }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <button style={{
          backgroundColor: '#f3f4f6',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {selectedYear}
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Outstanding Invoices</div>
          <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: '700' }}>{stats.outstanding}</div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Past Due Invoices</div>
          <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: '700' }}>{stats.pastDue}</div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Paid Invoices</div>
          <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: '700' }}>{stats.paid}</div>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Unpaid</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '600' }}>{stats.unpaid.count} / {stats.unpaid.total}</span>
            <a href="#" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View</a>
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>{stats.unpaid.percent}%</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Paid</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '600' }}>{stats.paidCount.count} / {stats.paidCount.total}</span>
            <a href="#" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View</a>
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>{stats.paidCount.percent}%</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Partially Paid</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '600' }}>{stats.partiallyPaid.count} / {stats.partiallyPaid.total}</span>
            <a href="#" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View</a>
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>{stats.partiallyPaid.percent}%</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Overdue</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '600' }}>{stats.overdue.count} / {stats.overdue.total}</span>
            <a href="#" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View</a>
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>{stats.overdue.percent}%</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Draft</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: '600' }}>{stats.draft.count} / {stats.draft.total}</span>
            <a href="#" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>View</a>
            <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>{stats.draft.percent}%</span>
          </div>
        </div>
      </div>


      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Plus size={16} />
          Create New Invoice
        </button>

        <button style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CreditCard size={16} />
          Batch Payments
        </button>

        <button style={{
          backgroundColor: 'white',
          color: '#374151',
          border: '1px solid #d1d5db',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <RefreshCw size={16} />
          Recurring Invoices
        </button>
      </div>

    
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <button style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Export
            </button>

            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <RefreshCw size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ChevronLeft size={16} />
            </button>

            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <List size={16} />
            </button>

            <button style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Filter size={16} />
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Invoice #</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Total Tax</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Customer</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Project</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Tags</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Due Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Trip Staring Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Location</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>B2B DEAL</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>GST</th>

              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#2563eb', fontWeight: '500' }}>{invoice.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>₹{invoice.amount.toLocaleString()}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>₹{invoice.tax.toFixed(2)}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.date}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#2563eb', fontWeight: '500' }}>{invoice.customer}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.project}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {invoice.tags.map((tag, i) => (
                        <span key={i} style={{
                          backgroundColor: '#f3f4f6',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#374151'
                        }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.dueDate}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>{invoice.status}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.tripDate}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.location}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.b2b}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#111827' }}>{invoice.gst}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}