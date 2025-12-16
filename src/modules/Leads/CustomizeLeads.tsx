import React, { useState } from 'react'
import { Box, Flex, Text, TextField, Checkbox, Button, Dialog, TextArea } from '@radix-ui/themes'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon } from '@radix-ui/react-icons'

// Define Lead type
interface Lead {
    id: number
    name: string
    badgeType: string
    leadId: string
    time: string
    phone: string
    destination: string
    packageCode: string
    remarks: string
    status: string
    contacted: string
    assignedTo: string
    savedRemarks?: string[]
    reminder?: string | null // NEW: store reminder as datetime-local string (e.g. "2025-11-16T13:30")
}

const Leads: React.FC = () => {
    // Dummy data for statistics
    const totalLeads = 10
    const todayLeads = 2
    const convertedLeads = 1

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    
    // Checkbox state
    const [selectedLeads, setSelectedLeads] = useState<number[]>([])
    const [selectAll, setSelectAll] = useState(false)

    // Active filter state
    const [activeFilter, setActiveFilter] = useState<string>("All")

    // Remark modal state
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false)
    const [selectedLeadForRemark, setSelectedLeadForRemark] = useState<number | null>(null)
    const [remarkText, setRemarkText] = useState("")
    // NEW: Reminder states for modal
    const [isReminderEnabled, setIsReminderEnabled] = useState(false)
    const [reminderDateTime, setReminderDateTime] = useState("")

    // Search state
    const [searchQuery, setSearchQuery] = useState("")

    // Add state for Lead Stages modal
    const [isStagesModalOpen, setIsStagesModalOpen] = useState(false)

    // Add state for Add Enquiry modal
    const [isAddEnquiryModalOpen, setIsAddEnquiryModalOpen] = useState(false)
    const [newEnquiry, setNewEnquiry] = useState({
        name: '',
        badgeType: 'instalink',
        leadId: '',
        phone: '',
        destination: '',
        packageCode: '',
        remarks: '',
        status: 'Hot',
        contacted: 'New Enquiry',
        assignedTo: '',
    })

    // Lead stages data
    const leadStages = [
        { label: 'New Enquiry', description: 'A new enquiry has been logged into the Instalink' },
        { label: 'Call Not Picked', description: "You've tried contacting but they've been unresponsive." },
        { label: 'Contacted', description: "You've contacted the lead but yet to lock all the requirements." },
        { label: 'Qualified', description: 'You were able to have a meaningful discovery call with the lead and have locked the requirement.' },
        { label: 'Plan & Quote Sent', description: "You've shared the plan details and the quote with cost break up." },
        { label: 'In Pipeline', description: "The lead is still pondering and hasn't started negotiating yet." },
        { label: 'Negotiating', description: 'The lead is now hot and can be converted.' },
        { label: 'Awaiting Payment', description: "You've closed negotiations and sent the booking link. Payment is awaited." },
        { label: 'Booked', description: 'Lead is now your guest, Congratulations!' },
        { label: 'Lost & Closed', description: 'Standard archive bucket.' },
        { label: 'Future Prospect', description: "You've tried contacting but they're looking for some future dates." },
    ]

    // Initial leads data
    const initialLeadsData: Lead[] = [
        {
            id: 1,
            name: 'Priyanshu',
            badgeType: 'instalink',
            leadId: '2142599',
            time: 'Today at 7:15 PM',
            phone: '6367710137',
            destination: 'Manali & Kasol | Group',
            packageCode: '#MKP02',
            remarks: 'interested',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 2,
            name: 'Aarav Kumar',
            badgeType: 'itinerary',
            leadId: '2142600',
            time: 'Today at 6:30 PM',
            phone: '9876543210',
            destination: 'Goa Beach | Solo',
            packageCode: '#GB01',
            remarks: 'wants discount',
            status: 'Warm',
            contacted: 'Not Contacted',
            assignedTo: 'Shivam',
        },
        {
            id: 3,
            name: 'Sneha Patel',
            badgeType: 'itinerary',
            leadId: '2142601',
            time: 'Today at 5:45 PM',
            phone: '8765432109',
            destination: 'Kerala Backwaters | Family',
            packageCode: '#KB03',
            remarks: 'budget friendly',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Sonia',
        },
        {
            id: 4,
            name: 'Rahul Singh',
            leadId: '2142602',
            badgeType: 'itinerary',
            time: 'Today at 4:20 PM',
            phone: '7654321098',
            destination: 'Ladakh Adventure | Group',
            packageCode: '#LA05',
            remarks: 'needs info',
            status: 'Cold',
            contacted: 'Not Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 5,
            name: 'Priya Sharma',
            badgeType: 'itinerary',
            leadId: '2142603',
            time: 'Today at 3:10 PM',
            phone: '6543210987',
            destination: 'Rajasthan Heritage | Couple',
            packageCode: '#RH07',
            remarks: 'ready to book',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Shivam',
        },
        {
            id: 6,
            name: 'Vikram Reddy',
            badgeType: 'itinerary',
            leadId: '2142604',
            time: 'Today at 2:05 PM',
            phone: '5432109876',
            destination: 'Shimla Manali | Family',
            packageCode: '#SM09',
            remarks: 'comparing prices',
            status: 'Warm',
            contacted: 'Not Contacted',
            assignedTo: 'Sonia',
        },
        {
            id: 7,
            name: 'Ananya Verma',
            badgeType: 'itinerary',
            leadId: '2142605',
            time: 'Today at 1:30 PM',
            phone: '4321098765',
            destination: 'Andaman Islands | Honeymoon',
            packageCode: '#AI11',
            remarks: 'interested in luxury',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 8,
            name: 'Karan Mehta',
            leadId: '2142606',
            badgeType: 'instalink',
            time: 'Today at 12:15 PM',
            phone: '3210987654',
            destination: 'Darjeeling Tea Gardens | Solo',
            packageCode: '#DT13',
            remarks: 'price too high',
            status: 'Cold',
            contacted: 'Not Contacted',
            assignedTo: 'Shivam',
        },
        {
            id: 9,
            name: 'Divya Nair',
            badgeType: 'instalink',
            leadId: '2142607',
            time: 'Today at 11:00 AM',
            phone: '2109876543',
            destination: 'Udaipur Palace Tour | Couple',
            packageCode: '#UP15',
            remarks: 'wants customization',
            status: 'Warm',
            contacted: 'Contacted',
            assignedTo: 'Sonia',
        },
        {
            id: 11,
            name: 'Arjun Gupta',
            badgeType: 'itinerary',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 12,
            name: 'Arjun Gupta',
            badgeType: 'itinerary',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 13,
            name: 'Arjun Gupta',
            badgeType: 'itinerary',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 14,
            name: 'Arjun Gupta',
            badgeType: 'itinerary',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 15,
            name: 'Arjun Gupta',
            badgeType: 'itinerary',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
        {
            id: 16,
            name: 'Arjun Gupta',
            badgeType: 'instalink',
            leadId: '2142608',
            time: 'Today at 10:00 AM',
            phone: '1098765432',
            destination: 'Rishikesh Rafting | Group',
            packageCode: '#RR17',
            remarks: 'confirm availability',
            status: 'Hot',
            contacted: 'Contacted',
            assignedTo: 'Rohit',
        },
    ]

    // Leads data state with localStorage support (including reminders)
    const [leadsData, setLeadsData] = useState<Lead[]>(() => {
        const savedRemarks = localStorage.getItem('leadRemarks')
        const savedReminders = localStorage.getItem('leadReminders')
        const remarksMap = savedRemarks ? JSON.parse(savedRemarks as string) : {}
        const remindersMap = savedReminders ? JSON.parse(savedReminders as string) : {}
        return initialLeadsData.map(lead => ({
            ...lead,
            savedRemarks: remarksMap[lead.id] || [],
            reminder: remindersMap[lead.id] || null,
        }))
    })

    // Filter leads based on search query
    const filteredLeads = leadsData.filter((lead) => {
        if (!searchQuery) return true // If no search query, show all leads
        
        const query = searchQuery.toLowerCase()
        return (
            lead.name.toLowerCase().includes(query) ||
            lead.leadId.toLowerCase().includes(query) ||
            lead.phone.toLowerCase().includes(query) ||
            lead.destination.toLowerCase().includes(query) ||
            lead.packageCode.toLowerCase().includes(query) ||
            lead.remarks.toLowerCase().includes(query) ||
            lead.status.toLowerCase().includes(query) ||
            lead.assignedTo.toLowerCase().includes(query)
        )
    })

    // Calculate pagination values
    const totalItems = filteredLeads.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentLeads = filteredLeads.slice(startIndex, endIndex)

    // Reset to page 1 when items per page changes
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1)
    }

    // Handle refresh button
    const handleRefresh = () => {
        window.location.reload()
    }

    // Handle select all checkbox
    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked)
        if (checked) {
            const currentPageIds = currentLeads.map(lead => lead.id)
            setSelectedLeads(currentPageIds)
        } else {
            setSelectedLeads([])
        }
    }

    // Handle individual checkbox
    const handleSelectLead = (leadId: number, checked: boolean) => {
        if (checked) {
            setSelectedLeads(prev => [...prev, leadId])
        } else {
            setSelectedLeads(prev => prev.filter(id => id !== leadId))
            setSelectAll(false)
        }
    }

    // Check if all current page leads are selected
    React.useEffect(() => {
        const currentPageIds = currentLeads.map(lead => lead.id)
        const allSelected = currentPageIds.every(id => selectedLeads.includes(id))
        setSelectAll(allSelected && currentPageIds.length > 0)
    }, [selectedLeads, currentLeads])

    // Handle filter change
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter)
        setCurrentPage(1) // Reset to first page when filter changes
    }

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1) // Reset to first page when search query changes
    }

    // Handle open remark modal
    const handleOpenRemarkModal = (leadId: number) => {
        setSelectedLeadForRemark(leadId)
        setRemarkText("")
        // initialize reminder modal values if already set on lead
        const lead = leadsData.find(l => l.id === leadId)
        setIsReminderEnabled(Boolean(lead?.reminder))
        setReminderDateTime(lead?.reminder ?? "")
        setIsRemarkModalOpen(true)
    }

    const handleAssignedToChange = (leadId: number, newAssignee: string) => {
        const updatedLeads = leadsData.map(lead => (lead.id === leadId ? { ...lead, assignedTo: newAssignee } : lead))
        setLeadsData(updatedLeads)
    }

    // NEW: Remove reminder
    const handleRemoveReminder = (leadId: number) => {
        const updatedLeads = leadsData.map(lead => (lead.id === leadId ? { ...lead, reminder: undefined } : lead))
        setLeadsData(updatedLeads)
        // persist reminders map
        const remindersMap: Record<number, string> = {}
        updatedLeads.forEach(lead => {
            if (lead.reminder) remindersMap[lead.id] = lead.reminder
        })
        localStorage.setItem('leadReminders', JSON.stringify(remindersMap))
    }

    // Handle save remark (allow saving reminder even if remark is empty)
    const handleSaveRemark = () => {
        if (!selectedLeadForRemark) return
        // If both remark and reminder are empty, do nothing
        if (!remarkText.trim() && !(isReminderEnabled && reminderDateTime)) return

        // Get current timestamp
        const timestamp = new Date().toLocaleString()
        const newRemark = remarkText.trim() ? `${timestamp}: ${remarkText}` : undefined

        // Update leads data
        const updatedLeads = leadsData.map(lead => {
            if (lead.id === selectedLeadForRemark) {
                const updatedSavedRemarks = newRemark ? [...(lead.savedRemarks || []), newRemark] : (lead.savedRemarks || [])
                return {
                    ...lead,
                    savedRemarks: updatedSavedRemarks,
                    reminder: isReminderEnabled && reminderDateTime ? reminderDateTime : undefined,
                }
            }
            return lead
        })

        setLeadsData(updatedLeads)

        // Save saved remarks to localStorage (as before)
        const remarksMap: Record<number, string[]> = {}
        updatedLeads.forEach(lead => {
            if (lead.savedRemarks && lead.savedRemarks.length > 0) {
                remarksMap[lead.id] = lead.savedRemarks
            }
        })
        localStorage.setItem('leadRemarks', JSON.stringify(remarksMap))

        // Save reminders to localStorage
        const remindersMap: Record<number, string> = {}
        updatedLeads.forEach(lead => {
            if (lead.reminder) {
                remindersMap[lead.id] = lead.reminder
            }
        })
        localStorage.setItem('leadReminders', JSON.stringify(remindersMap))

        // Close modal and reset
        setIsRemarkModalOpen(false)
        setSelectedLeadForRemark(null)
        setRemarkText("")
        setIsReminderEnabled(false)
        setReminderDateTime("")
    }

    // Handle save new enquiry
    const handleSaveEnquiry = () => {
        if (!newEnquiry.name || !newEnquiry.phone || !newEnquiry.destination) {
            alert('Please fill in all required fields')
            return
        }

        const timestamp = new Date().toLocaleString()
        const newLead: Lead = {
            id: leadsData.length + 1,
            name: newEnquiry.name,
            badgeType: newEnquiry.badgeType,
            leadId: newEnquiry.leadId || `${Math.floor(Math.random() * 9000000) + 1000000}`,
            time: timestamp,
            phone: newEnquiry.phone,
            destination: newEnquiry.destination,
            packageCode: newEnquiry.packageCode,
            remarks: newEnquiry.remarks,
            status: newEnquiry.status,
            contacted: newEnquiry.contacted,
            assignedTo: newEnquiry.assignedTo,
            savedRemarks: [],
            reminder: undefined,
        }

        setLeadsData([newLead, ...leadsData])
        setIsAddEnquiryModalOpen(false)
        setNewEnquiry({
            name: '',
            badgeType: 'instalink',
            leadId: '',
            phone: '',
            destination: '',
            packageCode: '',
            remarks: '',
            status: 'Hot',
            contacted: 'New Enquiry',
            assignedTo: '',
        })
    }

    const WhatsAppIcon = () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: '4px',
            }}
        >
            <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                fill="#25D366"
            />
            <path
                d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.298c-1.778 0-3.524-.477-5.042-1.377l-.362-.214-3.754.982.999-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.002 5.45-4.436 9.884-9.864 9.884z"
                fill="#25D366"
            />
        </svg>
    )

    const PhoneIcon = () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: '4px',
            }}
        >
            <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    const AddIcon = () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '6px',
            }}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )

    const MessageIcon = () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: '4px',
            }}
        >
            <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    const UserIcon = () => (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '4px',
            }}
        >
            <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    // Contacted dropdown options - UPDATED
    const contactedOptions = [
        'New Enquiry',
        'Call Not Pick',
        'Contacted',
        'Qualified',
        'Plan and Quote Send',
        'In Pipeline',
        'Negotiating',
        'Awaiting Payment',
        'Booked',
        'Lost & Closed',
        'Future Prospect',
    ]

    // Handle contacted change
    const handleContactedChange = (leadId: number, newContacted: string) => {
        const updatedLeads = leadsData.map(lead => 
            lead.id === leadId ? { ...lead, contacted: newContacted } : lead
        )
        setLeadsData(updatedLeads)
    }

    return (
        <Box
            style={{
                width: '100%',
                maxWidth: '100%',
                padding: '24px',
                boxSizing: 'border-box',
                overflowX: 'hidden',
                overflowY: 'visible',
            }}
        >
            {/* Title */}
            <Text size="8" weight="regular" style={{ color: 'var(--accent-12)', marginBottom: '24px', display: 'block' }}>
                Customize Leads
            </Text>

            {/* Statistics Cards - Responsive Grid */}
            <Flex
                gap="4"
                mb="4"
                wrap="wrap"
                style={{
                    marginTop: '20px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Overall Leads Captured */}
                <Box
                    style={{
                        border: '1px solid #e5e7eb',
                        flex: '1 1 300px',
                        minWidth: '250px',
                        maxWidth: '100%',
                        height: '90px',
                        borderRadius: '10px',
                        display: 'flex',
                        textAlign: 'center',
                        padding: '16px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Flex direction="column" justify="center" style={{ width: '100%' }}>
                        <Text
                            size="2"
                            style={{
                                marginBottom: '8px',
                                color: 'gray',
                            }}
                        >
                            Overall Leads Captured
                        </Text>
                        <Text
                            size="6"
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                        >
                            {totalLeads.toLocaleString()}
                        </Text>
                    </Flex>
                </Box>

                {/* Today's Leads */}
                <Box
                    style={{
                        border: '1px solid #e5e7eb',
                        flex: '1 1 300px',
                        minWidth: '250px',
                        maxWidth: '100%',
                        height: '90px',
                        borderRadius: '10px',
                        display: 'flex',
                        textAlign: 'center',
                        padding: '16px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Flex direction="column" justify="center" style={{ width: '100%' }}>
                        <Text
                            size="2"
                            style={{
                                marginBottom: '8px',
                                color: 'gray',
                            }}
                        >
                            Today Leads Captured
                        </Text>
                        <Text
                            size="6"
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                        >
                            {todayLeads.toLocaleString()}
                        </Text>
                    </Flex>
                </Box>

                {/* Overall Leads Converted */}
                <Box
                    style={{
                        border: '1px solid #e5e7eb',
                        flex: '1 1 300px',
                        minWidth: '250px',
                        maxWidth: '100%',
                        height: '90px',
                        borderRadius: '10px',
                        display: 'flex',
                        textAlign: 'center',
                        padding: '16px',
                        boxSizing: 'border-box',
                    }}
                >
                    <Flex direction="column" justify="center" style={{ width: '100%' }}>
                        <Text
                            size="2"
                            style={{
                                marginBottom: '8px',
                                color: 'gray',
                            }}
                        >
                            Overall Leads Converted
                        </Text>
                        <Text
                            size="6"
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                        >
                            {convertedLeads.toLocaleString()}
                        </Text>
                    </Flex>
                </Box>
            </Flex>

            {/* Search and Actions Bar - Responsive */}
            <Flex
                gap="3"
                wrap="wrap"
                align="center"
                style={{
                    marginTop: '20px',
                    marginBottom: '15px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <TextField.Root
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    style={{
                        flex: '1 1 300px',
                        minWidth: '200px',
                        maxWidth: '100%',
                    }}
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
            </TextField.Root>

            <Flex gap="2" wrap="wrap">
                <Box
                    onClick={() => setIsAddEnquiryModalOpen(true)}
                    style={{
                        border: '1px solid #000',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '5px',
                        padding: '8px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Text size="2" weight="bold">Add Enquiry</Text>
                </Box>
                <Box
                    onClick={handleRefresh}
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <ReloadIcon width="14" height="14" />
                    <Text size="2">Refresh</Text>
                </Box>
                  
            </Flex>
        </Flex>			{/* Filter Buttons - Responsive */}
			<Flex
				wrap="wrap"
				gap="2"
				style={{
					marginTop: '15px',
					marginBottom: '15px',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
			{['All', 'Hot', 'Warm', 'Cold', 'Remainder', 'InstaLink', 'Archive'].map((filter) => (
				<Box
					key={filter}
					onClick={() => handleFilterChange(filter)}
					style={{
						border: '1px solid #e5e7eb',
						borderRadius: '5px',
						padding: '8px 16px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						cursor: 'pointer',
						whiteSpace: 'nowrap',
						minWidth: '60px',
						backgroundColor: activeFilter === filter ? '#000' : '#fff',
						color: activeFilter === filter ? '#fff' : '#000',
					}}
				>
					<Text size="2">{filter}</Text>
				</Box>
			))}				<Flex
					style={{
						marginLeft: 'auto',
						alignItems: 'center',
					}}
				>
					<Text size="2" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
						Showing <span style={{ fontWeight: 'bold' }}>{startIndex + 1}</span> to{' '}
						<span style={{ fontWeight: 'bold' }}>{Math.min(endIndex, totalItems)}</span> of{' '}
						<span style={{ fontWeight: 'bold' }}>{totalItems}</span> lead(s)
					</Text>
				</Flex>
			</Flex>

						{/* Table Container - No Scroll, Fits Width */}
                        <Box
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '20px',
					width: '100%',
					maxWidth: '100%',
					border: '1px solid #e5e7eb',
					paddingTop: '10px',
					borderRadius: '5px',
					overflowX: 'hidden', // Changed from 'auto' to 'hidden'
					overflowY: 'visible',
					boxSizing: 'border-box',
				}}
			>
				{/* Table Header */}
				<Flex
					style={{
						display: 'flex',
						paddingBottom: '10px',
						borderBottom: '1px solid #e5e7eb',
						paddingLeft: '10px',
						paddingRight: '10px',
						width: '100%', // Changed from minWidth
						boxSizing: 'border-box',
					}}
				>
				{/* S.No Header */}
				<Box style={{ width: '6%', minWidth: '50px', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
					<Checkbox 
						style={{ marginRight: '6px' }} 
						checked={selectAll}
						onCheckedChange={handleSelectAll}
					/>
					<Text style={{ fontSize: '12px' }}>S.No.</Text>
				</Box>					{/* Lead Details Header */}
					<Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Lead Details</Text>
					</Box>

					{/* Enquiry Details Header */}
					<Box style={{ width: '20%', minWidth: '160px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Enquiry Details</Text>
					</Box>

					{/* Remarks Header */}
					<Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Remarks & Reminders</Text>
					</Box>

					{/* Quick Actions Header */}
					<Box style={{ width: '14%', minWidth: '120px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Quick Actions</Text>
					</Box>

					{/* Assigned To Header */}
					<Box style={{ width: '12%', minWidth: '100px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Assigned To</Text>
					</Box>

					{/* Actions Header */}
					<Box style={{ width: '10%', minWidth: '80px', paddingLeft: '8px', paddingRight: '8px' }}>
						<Text style={{ fontSize: '12px' }}>Actions</Text>
					</Box>
				</Flex>

				{/* Table Body */}
				{currentLeads.map((lead, index) => (
					<Flex
						key={lead.id}
						style={{
							marginTop: '10px',
							borderBottom: index < currentLeads.length - 1 ? '1px solid #e5e7eb' : 'none',
							paddingBottom: '10px',
							paddingLeft: '10px',
							paddingRight: '10px',
							width: '100%', // Changed from minWidth
							boxSizing: 'border-box',
						}}
					>
						<Box
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								minHeight: '100px', // Reduced from 120px
							}}
						>
							{/* S.No Column */}
							<Box
								style={{
									width: '6%',
									minWidth: '50px',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingRight: '8px',
								}}
							>
								<Checkbox
									style={{
										marginTop: '2px',
										cursor: 'pointer',
									}}
									size="2"
									checked={selectedLeads.includes(lead.id)}
									onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
								/>
								<Text
									style={{
										paddingLeft: '2px',
										fontSize: '13px',
									}}
								>
									{startIndex + index + 1}
								</Text>
							</Box>

							{/* Lead Details Column */}
							<Box
								style={{
									width: '16%',
									minWidth: '140px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Text
									style={{
										fontWeight: 'bold',
										textDecoration: 'underline',
										fontSize: '13px',
									}}
								>
									{lead.name}
								</Text>
								<Text style={{ fontSize: '12px' }}>ID : {lead.leadId}</Text>

								{lead.badgeType === 'instalink' ? (
									<Box
										style={{
											width: '55px', // Reduced from 60px
											height: '26px', // Reduced from 30px
											borderRadius: '10px',
											backgroundColor: '#f678a7',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											color: 'black',
											fontSize: '11px', // Reduced from 13px
										}}
									>
										Instalink
									</Box>
								) : (
									<Box
										style={{
											width: '55px', // Reduced from 60px
											height: '26px', // Reduced from 30px
											borderRadius: '10px',
											backgroundColor: '#5588ff',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											color: 'white',
											fontSize: '11px', // Reduced from 13px
										}}
									>
										Itinerary
									</Box>
								)}

								<Text style={{ fontSize: '12px' }}>{lead.time}</Text>
							</Box>

						{/* Enquiry Details Column */}
						<Box
							style={{
								width: '20%',
								minWidth: '160px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								gap: '4px',
								fontSize: '13px', // Reduced from 15px
								paddingTop: '8px',
								paddingLeft: '8px',
								paddingRight: '8px',
								maxHeight: '120px',
								overflowY: 'auto',
							}}
						>
							<Text style={{ fontSize: '12px' }}>
								{lead.phone} | 
								<span 
									onClick={() => window.open(`https://wa.me/${lead.phone}`, '_blank')}
									style={{ cursor: 'pointer' }}
								>
									<WhatsAppIcon />
								</span>
								<span 
									onClick={() => window.location.href = `tel:${lead.phone}`}
									style={{ cursor: 'pointer' }}
								>
									<PhoneIcon />
								</span>
							</Text>
							<Text style={{ fontSize: '12px' }}>{lead.destination}</Text>
							<Text style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
								<UserIcon /> Pax
							</Text>
							<span
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<MessageIcon />
								<Text
									style={{
										marginLeft: '4px',
										fontSize: '12px',
									}}
								>
									{lead.packageCode}
								</Text>
							</span>
						</Box>							{/* Remarks Column */}
							<Box
								style={{
									width: '16%',
									minWidth: '140px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
						>
							<Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Remarks</Text>
							<Text style={{ fontSize: '12px' }}>{lead.remarks}</Text>
							
							{/* Display saved remarks */}
							{lead.savedRemarks && lead.savedRemarks.length > 0 && (
								<Box style={{ marginTop: '4px', width: '100%' }}>
									{lead.savedRemarks.map((remark, idx) => (
										<Text 
											key={idx} 
											style={{ 
												fontSize: '11px', 
												color: '#666',
												marginBottom: '2px',
												display: 'block',
												borderLeft: '2px solid #5588ff',
												paddingLeft: '4px',
											}}
										>
											{remark}
										</Text>
									))}
								</Box>
							)}

							{/* NEW: Display reminder below saved remarks */}
							{lead.reminder && (
                                <Box style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '11px', color: '#b91c1c' }}>
                                        Reminder: {(() => {
                                            try { return new Date(lead.reminder!).toLocaleString() } catch (err) { return lead.reminder }
                                        })()}
                                    </Text>
                                    <Text style={{ fontSize: '11px', cursor: 'pointer', color: '#3b82f6' }} onClick={() => handleRemoveReminder(lead.id)}>
                                        Remove
                                    </Text>
                                </Box>
                            )}
                            
                            <span
                                onClick={() => handleOpenRemarkModal(lead.id)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <AddIcon />
                                <Text
                                    style={{
                                        textDecoration: 'underline',
                                        fontSize: '11px', // Reduced from 13px
                                    }}
                                >
                                    Add Remark
                                </Text>
                            </span>
                        </Box>							{/* Quick Actions Column */}
							<Box
								style={{
									width: '14%',
									minWidth: '120px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<select
									id={`status-${lead.id}`}
									defaultValue=""
									style={{
										width: '100%',
										maxWidth: '110px',
										height: '32px',
										border: '2px solid #e5e7eb',
										borderRadius: '5px',
										fontSize: '12px',
										padding: '4px 8px',
									}}
								>
									<option value="" disabled>
										Lead Status
									</option>
									<option value="Hot">
										Hot
									</option>
									<option value="Warm">
										Warm
									</option>
									<option value="Cold">
										Cold
									</option>
								</select>
								<select
									id={`contact-${lead.id}`}
									value={lead.contacted}
									onChange={(e) => handleContactedChange(lead.id, e.target.value)}
									style={{
										width: '100%',
										maxWidth: '110px',
										height: '32px',
										border: '2px solid #e5e7eb',
										borderRadius: '5px',
										fontSize: '12px',
										padding: '4px 8px',
									}}
								>
									{contactedOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
								<Text
									onClick={() => setIsStagesModalOpen(true)}
									style={{
										fontWeight: 'bold',
										fontSize: '11px',
										cursor: 'pointer',
										textDecoration: 'underline',
									}}
								>
									More
								</Text>
							</Box>

							{/* Assigned To Column */}
							<Box
								style={{
									width: '12%',
									minWidth: '100px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
                                <select
                                    id={`assign-${lead.id}`}
                                    value={lead.assignedTo}
                                    onChange={(e) => handleAssignedToChange(lead.id, e.target.value)}
                                    style={{
                                        width: '100%',
                                        maxWidth: '110px', // Reduced from 120px
                                        height: '32px', // Reduced from 35px
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '5px',
                                        fontSize: '12px',
                                        padding: '4px 8px',
                                    }}
                                >
                                    <option value="Rohit">Rohit</option>
                                    <option value="Shivam">Shivam</option>
                                    <option value="Sonia">Sonia</option>
                                </select>
							</Box>

							{/* Actions Column */}
							<Box
								style={{
									width: '10%',
									minWidth: '80px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									gap: '4px',
									fontSize: '13px', // Reduced from 15px
									paddingTop: '8px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<Box
									style={{
										backgroundColor: 'black',
									 width: '100%',
									 maxWidth: '90px', // Reduced from 100px
									 height: '32px', // Reduced from 35px
									 border: '1px solid #e5e7eb',
									 borderRadius: '5px',
									 color: 'white',
									 display: 'flex',
									 justifyContent: 'center',
									 alignItems: 'center',
									 cursor: 'pointer',
									}}
								>
									<Text
										style={{
											color: 'white',
											textAlign: 'center',
											fontSize: '12px',
										}}
									>
										Actions
									</Text>
								</Box>
							</Box>
						</Box>
					</Flex>
				))}
			</Box>

			{/* Pagination - Responsive */}
			<Flex
				wrap="wrap"
				gap="3"
				style={{
					marginTop: '20px',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '15px 0',
					borderTop: '1px solid #e5e7eb',
					width: '100%',
					boxSizing: 'border-box',
				}}
			>
				{/* Left side - Items per page */}
				<Flex
					style={{
						alignItems: 'center',
						gap: '10px',
						flex: '1 1 auto',
						minWidth: '200px',
					}}
				>
					<Text
						style={{
							fontSize: '14px',
							color: '#6b7280',
							whiteSpace: 'nowrap',
						}}
					>
						Rows per page:
					</Text>
					<select
						value={itemsPerPage}
						onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
						style={{
							width: '80px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							padding: '5px 10px',
							cursor: 'pointer',
							fontSize: '14px',
						}}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
					</select>
				</Flex>

				{/* Center - Page info */}
				<Text
					style={{
						fontSize: '14px',
						color: '#6b7280',
						whiteSpace: 'nowrap',
						margin: '0 16px',
					}}
				>
					Page <span style={{ fontWeight: 'bold', color: '#000' }}>{currentPage}</span> of{' '}
					<span style={{ fontWeight: 'bold', color: '#000' }}>{totalPages}</span>
				</Text>

				{/* Right side - Navigation buttons */}
				<Flex
					style={{
						gap: '8px',
						alignItems: 'center',
						flex: '1 1 auto',
						justifyContent: 'flex-end',
						minWidth: '200px',
					}}
				>
					{/* Previous button */}
					<Box
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						style={{
							width: '35px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
							opacity: currentPage === 1 ? 0.5 : 1,
							backgroundColor: 'white',
							transition: 'all 0.2s',
						}}
					>
						<ChevronLeftIcon width="18" height="18" />
					</Box>

					{/* Dynamic page numbers */}
					{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
						let pageNum
						if (totalPages <= 5) {
							pageNum = i + 1
						} else if (currentPage <= 3) {
							pageNum = i + 1
						} else if (currentPage >= totalPages - 2) {
							pageNum = totalPages - 4 + i
						} else {
							pageNum = currentPage - 2 + i
						}

						return (
							<Box
								key={pageNum}
								onClick={() => setCurrentPage(pageNum)}
								style={{
									width: '35px',
									height: '35px',
									border: '1px solid #e5e7eb',
									borderRadius: '5px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									backgroundColor: currentPage === pageNum ? '#000' : '#fff',
									color: currentPage === pageNum ? '#fff' : '#000',
									fontWeight: currentPage === pageNum ? 'bold' : 'normal',
									fontSize: '14px',
									transition: 'all 0.2s',
								}}
							>
								{pageNum}
							</Box>
						)
					})}

					{/* Next button */}
					<Box
						onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
						style={{
							width: '35px',
							height: '35px',
							border: '1px solid #e5e7eb',
							borderRadius: '5px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
							opacity: currentPage === totalPages ? 0.5 : 1,
							backgroundColor: 'white',
							transition: 'all 0.2s',
						}}
					>
						<ChevronRightIcon width="18" height="18" />
					</Box>
				</Flex>
			</Flex>

            {/* Add Remark Modal */}
            <Dialog.Root open={isRemarkModalOpen} onOpenChange={setIsRemarkModalOpen}>
                <Dialog.Content style={{ maxWidth: 600 }}>
                    <Dialog.Title>Add Remark</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Add a remark for Lead ID: {selectedLeadForRemark}
                    </Dialog.Description>
                    <TextArea
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        placeholder="Enter your remark here..."
                        style={{ minHeight: '150px' }}
                    />

                    {/* NEW: Set Reminder control */}
                    <Flex gap="3" align="center" mt="3" style={{ marginTop: '12px' }}>
                        <Checkbox checked={isReminderEnabled} onCheckedChange={(checked) => setIsReminderEnabled(Boolean(checked))} />
                        <Text size="2">Set Reminder</Text>
                        {isReminderEnabled && (
                            <input
                                type="datetime-local"
                                value={reminderDateTime}
                                onChange={(e) => setReminderDateTime(e.target.value)}
                                style={{
                                    marginLeft: '8px',
                                    padding: '6px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #e5e7eb',
                                }}
                            />
                        )}
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Button variant="soft" color="gray" onClick={() => setIsRemarkModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRemark}>
                            Save Remark
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            {/* Lead Stages Modal */}
            <Dialog.Root open={isStagesModalOpen} onOpenChange={setIsStagesModalOpen}>
    <Dialog.Content style={{ maxWidth: 700 }}>
        <Dialog.Title>Lead Stages</Dialog.Title>
        <Dialog.Description size="2" mb="4">
            Understanding what each stage signals
        </Dialog.Description>
        
        <Box style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>
                            Stage Label
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>
                            What this signals?
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {leadStages.map((stage, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px', fontSize: '13px', fontWeight: '500' }}>
                                {stage.label}
                            </td>
                            <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                                {stage.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>

        <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={() => setIsStagesModalOpen(false)}>
                Close
            </Button>
        </Flex>
    </Dialog.Content>
</Dialog.Root>

{/* Add Enquiry Modal */}
<Dialog.Root open={isAddEnquiryModalOpen} onOpenChange={setIsAddEnquiryModalOpen}>
    <Dialog.Content style={{ maxWidth: 750 }}>
        <Dialog.Title>Add New Enquiry</Dialog.Title>
        <Dialog.Description size="2" mb="4">
            Fill in the details to add a new lead enquiry
        </Dialog.Description>

        <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Name */}
            <Box style={{marginRight : '25px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Name *
                </Text>
                <input
                    type="text"
                    value={newEnquiry.name}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                    placeholder="Enter name"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                />
            </Box>

            {/* Phone */}
            <Box style={{marginRight : '15px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' ,   }}>
                    Phone *
                </Text>
                <input
                    type="tel"
                    value={newEnquiry.phone}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                    placeholder="Enter phone number"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                />
            </Box>

            {/* Destination */}
            <Box  style={{marginRight : '25px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Destination *
                </Text>
                <input
                    type="text"
                    value={newEnquiry.destination}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, destination: e.target.value })}
                    placeholder="Enter destination"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                />
            </Box>

            {/* Package Code */}
            <Box style={{marginRight : '15px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Package Code
                </Text>
                <input
                    type="text"
                    value={newEnquiry.packageCode}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, packageCode: e.target.value })}
                    placeholder="e.g., #RR17"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                />
            </Box>

            {/* Badge Type */}
            <Box>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Badge Type
                </Text>
                <select
                    value={newEnquiry.badgeType}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, badgeType: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                >
                    <option value="instalink">Instalink</option>
                    <option value="facebook">Facebook</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                </select>
            </Box>

            {/* Status */}
            <Box style={{marginRight : '15px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Status
                </Text>
                <select
                    value={newEnquiry.status}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, status: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                </select>
            </Box>

            {/* Contacted */}
            <Box>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Contact Status
                </Text>
                <select
                    value={newEnquiry.contacted}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, contacted: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                >
                    {contactedOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </Box>

            {/* Assigned To */}
            <Box style={{marginRight : '15px'}}>
                <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                    Assigned To
                </Text>
                <input
                    type="text"
                    value={newEnquiry.assignedTo}
                    onChange={(e) => setNewEnquiry({ ...newEnquiry, assignedTo: e.target.value })}
                    placeholder="Enter assignee name"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                    }}
                />
            </Box>
        </Box>

        {/* Remarks */}
        <Box mt="3">
            <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Remarks
            </Text>
            <TextArea
                value={newEnquiry.remarks}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, remarks: e.target.value })}
                placeholder="Enter any remarks or notes"
                style={{ minHeight: '80px' }}
            />
        </Box>

        <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsAddEnquiryModalOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSaveEnquiry}>
                Add Enquiry
            </Button>
        </Flex>

    </Dialog.Content>
</Dialog.Root>
		</Box>
	)
}

export default Leads