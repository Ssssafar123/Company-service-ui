import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, TextField, Checkbox, Button, Dialog, TextArea, DropdownMenu, AlertDialog, Select } from '@radix-ui/themes'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon, Cross2Icon } from '@radix-ui/react-icons'
import type { RootState } from '../../store'
import { fetchLeadsByPage, fetchLeads, createLead, updateLeadById, deleteLeadById } from '../../features/LeadSlice'
import { createCustomer } from '../../features/CustomerSlice'
import { fetchUsers } from '../../features/UserSlice'
import { fetchItineraries, fetchItineraryById } from '../../features/ItinerarySlice'
import type { Batch } from '../../features/BatchSlice'
import { useThemeToggle } from '../../ThemeProvider'
import type { Lead } from '../../features/LeadSlice'

const Leads: React.FC = () => {
  const dispatch = useDispatch()
  const { leads, pagination, ui } = useSelector((state: RootState) => state.lead)
  const { isDark } = useThemeToggle()
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Checkbox state
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Active filter state
  const [activeFilter, setActiveFilter] = useState<string>("All")

  // Contacted/Stage filter state
  const [selectedContactedFilter, setSelectedContactedFilter] = useState<string>("All")
  const filterBarScrollRef = useRef<HTMLDivElement>(null)
  // Remark modal state
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false)
  const [selectedLeadForRemark, setSelectedLeadForRemark] = useState<string | null>(null)
  const [remarkText, setRemarkText] = useState("")
  const [isReminderEnabled, setIsReminderEnabled] = useState(false)
  const [reminderDateTime, setReminderDateTime] = useState("")

  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  const users = useSelector((state: RootState) => state.user.users)
  const usersLoading = useSelector((state: RootState) => state.user.ui.loading)
  const itineraries = useSelector((state: RootState) => state.itinerary.itineraries)
  
  // State for selected itinerary data (with batches)
  const [selectedItineraryData, setSelectedItineraryData] = useState<any>(null)
  const [loadingBatches, setLoadingBatches] = useState(false)

  // State to store all leads for filtering/searching
  const [allLeads, setAllLeads] = useState<Lead[]>([])

  // Add state for Lead Stages modal
  const [isStagesModalOpen, setIsStagesModalOpen] = useState(false)

  // Add state for Add Enquiry modal
  const [isAddEnquiryModalOpen, setIsAddEnquiryModalOpen] = useState(false)
  const [newEnquiry, setNewEnquiry] = useState({
    name: '',
    badgeType: 'instalink' as 'instalink' | 'website' | 'phone' | 'walkin' | 'referral',
    leadId: '',
    phone: '',
    destination: '',
    packageCode: '',
    remarks: '',
    status: 'Hot' as 'Hot' | 'Warm' | 'Cold' | 'Lost',
    contacted: 'New Enquiry' as Lead['contacted'],
    assignedTo: '',
  })

  // Add state for Convert to Customer modal
  const [isConvertToCustomerModalOpen, setIsConvertToCustomerModalOpen] = useState(false)
  const [selectedLeadForConversion, setSelectedLeadForConversion] = useState<Lead | null>(null)
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    age: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '',
  })
  const [customerCreated, setCustomerCreated] = useState(false)
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(null)

  // Add state for Edit Enquiry modal
  const [isEditEnquiryModalOpen, setIsEditEnquiryModalOpen] = useState(false)
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null)
  const [editEnquiryForm, setEditEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    preferredTravelDate: '',
    numberOfTravelers: '',
    duration: '',
    itineraryId: '',
    batchId: '',
    contacted: 'New Enquiry' as Lead['contacted'],
    source: '',
    assignedTo: '',
    notes: '',
  })

  // Dialog state for messages
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<{
    title: string
    description: string
    actionText: string
    cancelText?: string
    onConfirm: () => void
    color?: 'red' | 'blue' | 'green' | 'gray'
  } | null>(null)

  // Add state for View Details side panel
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null)
  const [activeDetailsTab, setActiveDetailsTab] = useState<'Details' | 'Timeline' | 'Remarks'>('Details')

  // Check if we need to fetch all leads (when filter or search is active)
  const needsAllLeads = activeFilter !== "All" || searchQuery.trim() !== "" || selectedContactedFilter !== "All"

  // Fetch leads based on whether we need all leads or paginated
  useEffect(() => {
    if (needsAllLeads) {
      // Fetch all leads when filter or search is active
      dispatch(fetchLeads() as any)
    } else {
      // Use paginated fetch when no filter/search
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }
  }, [dispatch, currentPage, itemsPerPage, needsAllLeads])

    // Update allLeads when leads change (from fetchLeads)
    useEffect(() => {
      if (needsAllLeads) {
        if (leads.length > 0) {
          setAllLeads(leads)
        }
      } else {
        setAllLeads([])
      }
    }, [leads, needsAllLeads])

  useEffect(() => {
    dispatch(fetchUsers() as any)
    dispatch(fetchItineraries() as any)
  }, [dispatch])

  // Helper function to transform itinerary batches to Batch interface format
  const getBatchesFromItinerary = (itinerary: any): Batch[] => {
    if (!itinerary || !itinerary.batches || !Array.isArray(itinerary.batches)) {
      return []
    }

    return itinerary.batches.map((batch: any) => ({
      id: batch._id || batch.id || '',
      start_date: batch.startDate || batch.start_date || '',
      end_date: batch.endDate || batch.end_date || '',
      is_sold: batch.sold_out || batch.is_sold || false,
      extra_amount: batch.price || batch.extra_amount || 0,
      extra_reason: batch.extra_amount_reason || batch.extra_reason || '',
      itineraryId: itinerary.id || itinerary._id || '',
      createdAt: batch.createdAt || '',
      updatedAt: batch.updatedAt || '',
    }))
  }

  // Filter batches from selected itinerary
  const filteredBatches = selectedItineraryData
    ? getBatchesFromItinerary(selectedItineraryData).filter((batch) => {
        if (!batch.end_date) return false
        
        const endDate = new Date(batch.end_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Include batch if end_date is today or in the future
        return endDate >= today
      })
    : []

  // Fetch full itinerary data when itinerary is selected
  useEffect(() => {
    if (editEnquiryForm.itineraryId) {
      setLoadingBatches(true)
      setSelectedItineraryData(null)
      
      dispatch(fetchItineraryById(editEnquiryForm.itineraryId) as any)
        .then((result: any) => {
          if (fetchItineraryById.fulfilled.match(result)) {
            setSelectedItineraryData(result.payload)
          }
          setLoadingBatches(false)
        })
        .catch((err: any) => {
          console.error('Failed to fetch itinerary:', err)
          setSelectedItineraryData(null)
          setLoadingBatches(false)
        })
    } else {
      setSelectedItineraryData(null)
      setLoadingBatches(false)
    }
  }, [editEnquiryForm.itineraryId, dispatch])

  // Get the leads to work with (all leads when filtering/searching, otherwise current page leads)
  const leadsToFilter = needsAllLeads ? allLeads : leads

  // Calculate statistics from all leads (for accurate counts)
  const totalLeadsForStats = needsAllLeads ? allLeads.length : (pagination.totalRecords || 0)
  const todayLeads = leadsToFilter.filter(lead => {
    const leadDate = new Date(lead.time)
    const today = new Date()
    return leadDate.toDateString() === today.toDateString()
  }).length
  const convertedLeads = leadsToFilter.filter(lead => lead.contacted === 'Booked').length

   // Filter leads based on search query AND active filter
   const filteredLeads = leadsToFilter.filter((lead) => {
    // First apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = (
        lead.name.toLowerCase().includes(query) ||
        lead.leadId.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        (lead.destination && lead.destination.toLowerCase().includes(query)) ||
        (lead.packageCode && lead.packageCode.toLowerCase().includes(query)) ||
        (lead.remarks && lead.remarks.toLowerCase().includes(query)) ||
        lead.status.toLowerCase().includes(query) ||
        (lead.assignedTo && lead.assignedTo.toLowerCase().includes(query))
      )
      if (!matchesSearch) return false
    }

    // Apply contacted/stage filter
    if (selectedContactedFilter !== "All") {
      if (lead.contacted !== selectedContactedFilter) {
        return false
      }
    }

    // Then apply active filter
    if (activeFilter === "All") {
      return true
    } else if (activeFilter === "Hot") {
      return lead.status === "Hot"
    } else if (activeFilter === "Warm") {
      return lead.status === "Warm"
    } else if (activeFilter === "Cold") {
      return lead.status === "Cold"
    } else if (activeFilter === "Remainder") {
      return Boolean(lead.reminder)
    } else if (activeFilter === "InstaLink") {
      return lead.badgeType === "instalink"
    } else if (activeFilter === "UnAssigned") {
      return !lead.assignedTo || lead.assignedTo.trim() === "" || lead.assignedTo === "UnAssigned"
    } else if (activeFilter === "Archive") {
      return true
    }
    
    return true
  })

  // Client-side pagination for filtered leads
  const totalItems = filteredLeads.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLeads = filteredLeads.slice(startIndex, endIndex)

  // Reset to page 1 when filter, search, contacted filter, or items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery, selectedContactedFilter, itemsPerPage])

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Handle refresh button
  const handleRefresh = () => {
    if (needsAllLeads) {
      dispatch(fetchLeads() as any)
    } else {
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }
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
  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId])
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId))
      setSelectAll(false)
    }
  }

  // Check if all current page leads are selected
  useEffect(() => {
    const currentPageIds = currentLeads.map(lead => lead.id)
    const allSelected = currentPageIds.every(id => selectedLeads.includes(id))
    setSelectAll(allSelected && currentPageIds.length > 0)
  }, [selectedLeads, currentLeads])

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
    // Clear allLeads when switching filters to ensure fresh data
    if (filter === "All" && searchQuery.trim() === "" && selectedContactedFilter === "All") {
      setAllLeads([])
    }
  }

  // Handle contacted/stage filter change
  const handleContactedFilterChange = (contacted: string) => {
    setSelectedContactedFilter(contacted)
    setCurrentPage(1)
  }

  // Handle scroll left
  const handleScrollLeft = () => {
    if (filterBarScrollRef.current) {
      filterBarScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  // Handle scroll right
  const handleScrollRight = () => {
    if (filterBarScrollRef.current) {
      filterBarScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Handle open remark modal
  const handleOpenRemarkModal = (leadId: string) => {
    setSelectedLeadForRemark(leadId)
    setRemarkText("")
    const lead = leadsToFilter.find(l => l.id === leadId)
    setIsReminderEnabled(Boolean(lead?.reminder))
    setReminderDateTime(lead?.reminder ?? "")
    setIsRemarkModalOpen(true)
  }

  const handleAssignedToChange = async (leadId: string, newAssignee: string) => {
    const lead = leadsToFilter.find(l => l.id === leadId)
    if (lead) {
      // Convert "__UNASSIGNED__" back to empty string for unassigned leads
      const assigneeValue = newAssignee === "__UNASSIGNED__" ? "" : newAssignee
      await dispatch(updateLeadById({ id: leadId, data: { assignedTo: assigneeValue } }) as any)
      // Refresh data
      if (needsAllLeads) {
        dispatch(fetchLeads() as any)
      } else {
        dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
      }
    }
  }

    // Remove reminder
    const handleRemoveReminder = async (leadId: string) => {
      try {
        
        const result = await dispatch(updateLeadById({ id: leadId, data: { reminder: null as any } }) as any)
        await result
        await new Promise(resolve => setTimeout(resolve, 200))
        
        if (needsAllLeads) {
          dispatch(fetchLeads() as any)
        } else {
          dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
        }
      } catch (error) {
        console.error('Error removing reminder:', error)
        if (needsAllLeads) {
          dispatch(fetchLeads() as any)
        } else {
          dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
        }
      }
    }

  // Handle save remark
  const handleSaveRemark = async () => {
    if (!selectedLeadForRemark) return
    if (!remarkText.trim() && !(isReminderEnabled && reminderDateTime)) return

    const lead = leadsToFilter.find(l => l.id === selectedLeadForRemark)
    if (!lead) return

    const timestamp = new Date().toLocaleString()
    const newRemark = remarkText.trim() ? `${timestamp}: ${remarkText}` : undefined
    const updatedSavedRemarks = newRemark 
      ? [...(lead.savedRemarks || []), newRemark] 
      : (lead.savedRemarks || [])

    await dispatch(updateLeadById({ 
      id: selectedLeadForRemark, 
      data: { 
        savedRemarks: updatedSavedRemarks,
        reminder: isReminderEnabled && reminderDateTime ? reminderDateTime : undefined,
      } 
    }) as any)

    // Refresh data
    if (needsAllLeads) {
      dispatch(fetchLeads() as any)
    } else {
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }

    // Close modal and reset
    setIsRemarkModalOpen(false)
    setSelectedLeadForRemark(null)
    setRemarkText("")
    setIsReminderEnabled(false)
    setReminderDateTime("")
  }

  // Handle save new enquiry
  const handleSaveEnquiry = async () => {
    if (!newEnquiry.name || !newEnquiry.phone || !newEnquiry.destination) {
      alert('Please fill in all required fields')
      return
    }

    const newLead: Omit<Lead, 'id'> = {
      name: newEnquiry.name,
      badgeType: newEnquiry.badgeType,
      leadId: newEnquiry.leadId || `${Math.floor(Math.random() * 9000000) + 1000000}`,
      time: new Date().toISOString(),
      phone: newEnquiry.phone,
      destination: newEnquiry.destination,
      packageCode: newEnquiry.packageCode,
      remarks: newEnquiry.remarks,
      status: newEnquiry.status,
      contacted: newEnquiry.contacted,
      assignedTo: newEnquiry.assignedTo,
      savedRemarks: [],
    }

    await dispatch(createLead(newLead) as any)
    // Refresh data
    if (needsAllLeads) {
      dispatch(fetchLeads() as any)
    } else {
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }

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

  
  // Handle contacted change
  const handleContactedChange = async (leadId: string, newContacted: string) => {
    await dispatch(updateLeadById({ 
      id: leadId, 
      data: { contacted: newContacted as Lead['contacted'] } 
    }) as any)
    // Refresh data
    if (needsAllLeads) {
      dispatch(fetchLeads() as any)
    } else {
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }
  }

  // Handle status change
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await dispatch(updateLeadById({ 
      id: leadId, 
      data: { status: newStatus as Lead['status'] } 
    }) as any)
    if (needsAllLeads) {
      dispatch(fetchLeads() as any)
    } else {
      dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
    }
  }
  // Handle Actions menu items
  const handleConvertToCustomer = (leadId: string) => {
    const lead = leadsToFilter.find(l => l.id === leadId)
    if (lead) {
      setSelectedLeadForConversion(lead)
      // Pre-fill form with lead data
      setCustomerForm({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        city: lead.destination || '',
        age: '',
        gender: 'MALE',
        dateOfBirth: '',
      })
      setCustomerCreated(false)
      setCreatedCustomerId(null)
      setIsConvertToCustomerModalOpen(true)
    }
  }

  // Handle Create Customer
  const handleCreateCustomer = async () => {
    if (!selectedLeadForConversion) return

    // Validate required fields
    if (!customerForm.name || !customerForm.phone || !customerForm.email || !customerForm.city || !customerForm.age || !customerForm.gender) {
      setDialogConfig({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
      return
    }

    try {
      // Prepare customer data
      const customerData: any = {
        name: customerForm.name,
        phone: Number(customerForm.phone),
        email: customerForm.email,
        base_city: customerForm.city,
        age: Number(customerForm.age),
        gender: customerForm.gender,
        starting_point: selectedLeadForConversion.destination || '',
        drop_point: selectedLeadForConversion.destination || '',
      }
      
      // Add package_id if available (backend accepts it but TypeScript interface doesn't include it)
      if (selectedLeadForConversion.itineraryId) {
        customerData.package_id = selectedLeadForConversion.itineraryId
      }

      const result = await dispatch(createCustomer(customerData) as any)
      
      if (createCustomer.fulfilled.match(result)) {
        // Get customer ID - handle both id and _id formats
        const payload = result.payload as any
        const customerId = payload?.id || payload?._id || payload?.data?.id || payload?.data?._id
        if (customerId) {
          setCreatedCustomerId(customerId)
          setCustomerCreated(true)
          setDialogConfig({
            title: 'Success',
            description: 'Customer created successfully!',
            actionText: 'OK',
            color: 'green',
            onConfirm: () => setDialogOpen(false),
          })
          setDialogOpen(true)
        } else {
          console.error('Customer created but ID not found:', result.payload)
          setCustomerCreated(true)
          setDialogConfig({
            title: 'Success',
            description: 'Customer created successfully!',
            actionText: 'OK',
            color: 'green',
            onConfirm: () => setDialogOpen(false),
          })
          setDialogOpen(true)
        }
      } else {
        setDialogConfig({
          title: 'Error',
          description: 'Failed to create customer: ' + (result.payload as string || 'Unknown error'),
          actionText: 'OK',
          color: 'red',
          onConfirm: () => setDialogOpen(false),
        })
        setDialogOpen(true)
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      setDialogConfig({
        title: 'Error',
        description: 'Error creating customer. Please try again.',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
    }
  }

  // Handle Create Invoice (placeholder)
  const handleCreateInvoice = (customerId: string) => {
    // TODO: Implement create invoice functionality
    console.log('Create Invoice for customer:', customerId)
    alert('Create Invoice functionality will be implemented')
  }

  const handleEditEnquiry = async (leadId: string) => {
    const lead = leadsToFilter.find(l => l.id === leadId)
    if (lead) {
      setSelectedLeadForEdit(lead)
      // Pre-fill form with lead data
      setEditEnquiryForm({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        destination: lead.destination || '',
        preferredTravelDate: lead.preferredTravelDate ? new Date(lead.preferredTravelDate).toISOString().split('T')[0] : '',
        numberOfTravelers: lead.numberOfTravelers?.toString() || '',
        duration: '',
        itineraryId: lead.itineraryId || '',
        batchId: '',
        contacted: lead.contacted || 'New Enquiry',
        source: lead.source || '',
        assignedTo: lead.assignedTo || '',
        notes: lead.notes || lead.remarks || '',
      })
      
      // If itineraryId exists, fetch the itinerary data to populate batches
      if (lead.itineraryId) {
        try {
          setLoadingBatches(true)
          const result = await dispatch(fetchItineraryById(lead.itineraryId) as any)
          if (fetchItineraryById.fulfilled.match(result)) {
            setSelectedItineraryData(result.payload)
          }
          setLoadingBatches(false)
        } catch (err) {
          console.error('Failed to fetch itinerary for edit:', err)
          setLoadingBatches(false)
        }
      }
      
      setIsEditEnquiryModalOpen(true)
    }
  }

  // Handle Update Enquiry
  const handleUpdateEnquiry = async () => {
    if (!selectedLeadForEdit) return

    // Validate required fields
    if (!editEnquiryForm.name || !editEnquiryForm.phone) {
      setDialogConfig({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Name and Phone)',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
      return
    }

    try {
      // Prepare update data
      const updateData: any = {
        name: editEnquiryForm.name,
        phone: editEnquiryForm.phone,
        email: editEnquiryForm.email || undefined,
        destination: editEnquiryForm.destination || undefined,
        preferredTravelDate: editEnquiryForm.preferredTravelDate || undefined,
        numberOfTravelers: editEnquiryForm.numberOfTravelers ? Number(editEnquiryForm.numberOfTravelers) : undefined,
        contacted: editEnquiryForm.contacted,
        source: editEnquiryForm.source || undefined,
        assignedTo: editEnquiryForm.assignedTo || '',
        notes: editEnquiryForm.notes || undefined,
      }
      
      // Add itineraryId if selected
      if (editEnquiryForm.itineraryId) {
        updateData.itineraryId = editEnquiryForm.itineraryId
      }
      
      // Add batchId if selected (backend might need this field)
      if (editEnquiryForm.batchId) {
        updateData.batchId = editEnquiryForm.batchId
      }

      const result = await dispatch(updateLeadById({ id: selectedLeadForEdit.id, data: updateData }) as any)
      
      if (updateLeadById.fulfilled.match(result)) {
        setDialogConfig({
          title: 'Success',
          description: 'Enquiry updated successfully!',
          actionText: 'OK',
          color: 'green',
          onConfirm: () => {
            setDialogOpen(false)
            setIsEditEnquiryModalOpen(false)
            setSelectedLeadForEdit(null)
            // Refresh data
            if (needsAllLeads) {
              dispatch(fetchLeads() as any)
            } else {
              dispatch(fetchLeadsByPage({ page: currentPage, limit: itemsPerPage }) as any)
            }
          },
        })
        setDialogOpen(true)
      } else {
        setDialogConfig({
          title: 'Error',
          description: 'Failed to update enquiry: ' + (result.payload as string || 'Unknown error'),
          actionText: 'OK',
          color: 'red',
          onConfirm: () => setDialogOpen(false),
        })
        setDialogOpen(true)
      }
    } catch (error) {
      console.error('Error updating enquiry:', error)
      setDialogConfig({
        title: 'Error',
        description: 'Error updating enquiry. Please try again.',
        actionText: 'OK',
        color: 'red',
        onConfirm: () => setDialogOpen(false),
      })
      setDialogOpen(true)
    }
  }

  const handleViewTimeline = (leadId: string) => {
    // TODO: Implement view timeline functionality
    console.log('View Timeline:', leadId)
    alert('View Timeline functionality will be implemented')
  }

  const handleViewDetails = (leadId: string) => {
    const lead = leadsToFilter.find(l => l.id === leadId)
    if (lead) {
      setSelectedLeadForDetails(lead)
      setActiveDetailsTab('Details')
      setIsViewDetailsOpen(true)
    }
  }

  const handledeleteLeadById = (leadId: string) => {
    // TODO: Implement view details functionality
    console.log('View Details:', leadId)
    alert('View Details functionality will be implemented')
  }
    // Format time display
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return `${diffMins} minutes ago`
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`
      } else if (diffDays === 0) {
        return 'Today at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      } else if (diffDays === 1) {
        return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      } else {
        return date.toLocaleString()
      }
    } catch {
      return timeString
    }
  }

  // Extract remark text (remove timestamp prefix)
  const extractRemarkText = (remark: string): string => {
    // Format: "timestamp: remark text"
    // Extract only the text part after the colon
    const colonIndex = remark.indexOf(': ')
    if (colonIndex !== -1) {
      return remark.substring(colonIndex + 2).trim()
    }
    // If no colon found, return as is (for backward compatibility)
    return remark
  }

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const day = days[date.getDay()]
      const dayNum = date.getDate()
      const month = months[date.getMonth()]
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')
      return `${day}, ${dayNum}${getOrdinalSuffix(dayNum)} ${month} ${displayHours}:${displayMinutes} ${ampm}`
    } catch {
      return dateString
    }
  }

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  // Get assigned user name
  const getAssignedUserName = (assignedTo: string) => {
    if (!assignedTo || assignedTo.trim() === '') return null
    const user = users.find(u => u.username === assignedTo)
    return user ? user.username : assignedTo
  }

  // Get tag color based on status
  const getTagColor = (status: string) => {
    switch (status) {
      case 'Hot':
        return { bg: '#ef4444', text: '#fff' } // Red
      case 'Warm':
        return { bg: '#f97316', text: '#fff' } // Orange
      case 'Cold':
        return { bg: '#3b82f6', text: '#fff' } // Blue
      default:
        return { bg: '#9ca3af', text: '#fff' } // Gray
    }
  }

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

  // Contacted dropdown options - Fixed to match Lead interface
  const contactedOptions: Lead['contacted'][] = [
    'New Enquiry',
    'Call Not Picked',
    'Contacted',
    'Qualified',
    'Plan & Quote Sent',
    'In Pipeline',
    'Negotiating',
    'Awaiting Payment',
    'Booked',
    'Lost & Closed',
    'Future Prospect',
  ]

  // Color mapping for lead stages (matching the image)
  const getStageColor = (stage: string): { bg: string; text: string; border: string } => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'New Enquiry': { bg: '#3b82f6', text: '#fff', border: '#3b82f6' }, // Blue
      'Call Not Picked': { bg: '#9ca3af', text: '#fff', border: '#9ca3af' }, // Gray
      'Contacted': { bg: '#a855f7', text: '#fff', border: '#a855f7' }, // Purple
      'Qualified': { bg: '#ec4899', text: '#fff', border: '#ec4899' }, // Pink
      'Plan & Quote Sent': { bg: '#f97316', text: '#fff', border: '#f97316' }, // Orange
      'In Pipeline': { bg: '#06b6d4', text: '#fff', border: '#06b6d4' }, // Light Blue
      'Negotiating': { bg: '#f97316', text: '#fff', border: '#f97316' }, // Orange
      'Awaiting Payment': { bg: '#eab308', text: '#000', border: '#eab308' }, // Yellow
      'Booked': { bg: '#22c55e', text: '#fff', border: '#22c55e' }, // Green
      'Lost & Closed': { bg: '#ef4444', text: '#fff', border: '#ef4444' }, // Red
      'Future Prospect': { bg: '#6366f1', text: '#fff', border: '#6366f1' }, // Indigo
    }
    return colors[stage] || { bg: '#e5e7eb', text: '#000', border: '#e5e7eb' }
  }

  // Icon components (keep existing icon components)
  const WhatsAppIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.298c-1.778 0-3.524-.477-5.042-1.377l-.362-.214-3.754.982.999-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.002 5.45-4.436 9.884-9.864 9.884z" fill="#25D366" />
    </svg>
  )

  const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const AddIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  const MessageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <Box style={{ width: '100%', maxWidth: '100%', padding: '24px', boxSizing: 'border-box', overflowX: 'hidden', overflowY: 'visible' }}>
      {/* Title */}
      <Text size="8" weight="regular" style={{ color: 'var(--accent-12)', marginBottom: '24px', display: 'block' }}>
        All Leads
      </Text>

      {/* Loading State */}
      {ui.loading && (
        <Box style={{ padding: '20px', textAlign: 'center' }}>
          <Text>Loading leads...</Text>
        </Box>
      )}

      {/* Error State */}
      {ui.error && (
        <Box style={{ padding: '20px', backgroundColor: '#fee', borderRadius: '5px', marginBottom: '20px' }}>
          <Text style={{ color: '#c00' }}>Error: {ui.error}</Text>
        </Box>
      )}

     {/* Statistics Cards */}
     <Flex gap="4" mb="4" wrap="wrap" style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
        <Box style={{ border: '1px solid #e5e7eb', flex: '1 1 300px', minWidth: '250px', maxWidth: '100%', height: '90px', borderRadius: '10px', display: 'flex', textAlign: 'center', padding: '16px', boxSizing: 'border-box' }}>
          <Flex direction="column" justify="center" style={{ width: '100%' }}>
            <Text size="2" style={{ marginBottom: '8px', color: 'gray' }}>Overall Leads Captured</Text>
            <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalLeadsForStats.toLocaleString()}</Text>
          </Flex>
        </Box>
        <Box style={{ border: '1px solid #e5e7eb', flex: '1 1 300px', minWidth: '250px', maxWidth: '100%', height: '90px', borderRadius: '10px', display: 'flex', textAlign: 'center', padding: '16px', boxSizing: 'border-box' }}>
          <Flex direction="column" justify="center" style={{ width: '100%' }}>
            <Text size="2" style={{ marginBottom: '8px', color: 'gray' }}>Today Leads Captured</Text>
            <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold' }}>{todayLeads.toLocaleString()}</Text>
          </Flex>
        </Box>
        <Box style={{ border: '1px solid #e5e7eb', flex: '1 1 300px', minWidth: '250px', maxWidth: '100%', height: '90px', borderRadius: '10px', display: 'flex', textAlign: 'center', padding: '16px', boxSizing: 'border-box' }}>
          <Flex direction="column" justify="center" style={{ width: '100%' }}>
            <Text size="2" style={{ marginBottom: '8px', color: 'gray' }}>Overall Leads Converted</Text>
            <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold' }}>{convertedLeads.toLocaleString()}</Text>
          </Flex>
        </Box>
      </Flex>

      {/* Search and Actions Bar */}
      <Flex gap="3" wrap="wrap" align="center" style={{ marginTop: '20px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}>
        <TextField.Root placeholder="Search..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} style={{ flex: '1 1 300px', minWidth: '200px', maxWidth: '100%' }}>
          <TextField.Slot><MagnifyingGlassIcon height="16" width="16" /></TextField.Slot>
        </TextField.Root>
        <Flex gap="2" wrap="wrap">
          <Box onClick={() => setIsAddEnquiryModalOpen(true)} style={{ border: '1px solid #000', backgroundColor: '#000', color: '#fff', borderRadius: '5px', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Text size="2" weight="bold">Add Enquiry</Text>
          </Box>
          <Box onClick={handleRefresh} style={{ border: '1px solid #e5e7eb', borderRadius: '5px', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <ReloadIcon width="14" height="14" />
            <Text size="2">Refresh</Text>
          </Box>
        </Flex>
      </Flex>

              {/* Lead Stage Filter Bar */}
      <Box style={{ marginTop: '15px', marginBottom: '15px', width: '100%', overflowX: 'auto', boxSizing: 'border-box' }}>
        <Flex gap="0" align="center" style={{ width: '100%', position: 'relative' }}>
                    {/* Left scroll indicator */}
                    <Box 
            onClick={handleScrollLeft}
            style={{ 
              position: 'sticky', 
              left: 0, 
              zIndex: 10, 
              backgroundColor: isDark ? 'var(--color-panel)' : '#fff', 
              paddingRight: '8px', 
              cursor: 'pointer' 
            }}
          >
            <ChevronLeftIcon width="20" height="20" style={{ color: '#9ca3af' }} />
          </Box>
          
          {/* Stage filter buttons */}
          <Flex 
            ref={filterBarScrollRef}
            gap="0" 
            style={{ 
              flex: 1, 
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {contactedOptions.map((stage, index) => {
              const colors = getStageColor(stage)
              const isSelected = selectedContactedFilter === stage
              const isFirst = index === 0
              const isLast = index === contactedOptions.length - 1
              
              return (
                <Box
                  key={stage}
                  onClick={() => handleContactedFilterChange(stage)}
                  style={{
                    padding: '7px 20px 7px 16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: 'none',
                    borderTopLeftRadius: isFirst ? '5px' : '0',
                    borderBottomLeftRadius: isFirst ? '5px' : '0',
                    borderTopRightRadius: isLast ? '5px' : '0',
                    borderBottomRightRadius: isLast ? '5px' : '0',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    position: 'relative',
                    height: '32px',
                    marginRight: isLast ? '0' : '-14px',
                    paddingRight: isLast ? '16px' : '28px',
                    clipPath: isLast 
                      ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)',
                    zIndex: contactedOptions.length - index
                  }}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#fff" />
                    </svg>
                  )}
                  <Text size="2" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{stage}</Text>
                </Box>
              )
            })}
          </Flex>
          
                    {/* Right scroll indicator */}
                    <Box 
            onClick={handleScrollRight}
            style={{ 
              position: 'sticky', 
              right: 0, 
              zIndex: 10, 
              backgroundColor: isDark ? 'var(--color-panel)' : '#fff', 
              paddingLeft: '8px', 
              cursor: 'pointer' 
            }}
          >
            <ChevronRightIcon width="20" height="20" style={{ color: '#9ca3af' }} />
          </Box>
        </Flex>
      </Box>

        {/* Filter Buttons */}
        <Flex wrap="wrap" gap="2" style={{ marginTop: '15px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}>
        {['All', 'Hot', 'Warm', 'Cold', 'Remainder', 'InstaLink', 'UnAssigned', 'Archive'].map((filter) => (
          <Box key={filter} onClick={() => handleFilterChange(filter)} style={{ border: '1px solid #e5e7eb', borderRadius: '5px', padding: '8px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '60px', backgroundColor: activeFilter === filter ? '#000' : '#fff', color: activeFilter === filter ? '#fff' : '#000' }}>
            <Text size="2">{filter}</Text>
          </Box>
        ))}
        <Flex style={{ marginLeft: 'auto', alignItems: 'center' }}>
          <Text size="2" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
            Showing <span style={{ fontWeight: 'bold' }}>{startIndex + 1}</span> to{' '}
            <span style={{ fontWeight: 'bold' }}>{Math.min(endIndex, totalItems)}</span> of{' '}
            <span style={{ fontWeight: 'bold' }}>{totalItems}</span> lead(s)
          </Text>
        </Flex>
      </Flex>

      {/* Table Container */}
      <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', width: '100%', maxWidth: '100%', border: '1px solid #e5e7eb', paddingTop: '10px', borderRadius: '5px', overflowX: 'hidden', overflowY: 'visible', boxSizing: 'border-box' }}>
        {/* Table Header */}
        <Flex style={{ display: 'flex', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingLeft: '10px', paddingRight: '10px', width: '100%', boxSizing: 'border-box' }}>
          <Box style={{ width: '6%', minWidth: '50px', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
            <Checkbox style={{ marginRight: '6px' }} checked={selectAll} onCheckedChange={handleSelectAll} />
            <Text style={{ fontSize: '12px' }}>S.No.</Text>
          </Box>
          <Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Lead Details</Text>
          </Box>
          <Box style={{ width: '20%', minWidth: '160px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Enquiry Details</Text>
          </Box>
          <Box style={{ width: '16%', minWidth: '140px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Remarks & Reminders</Text>
          </Box>
          <Box style={{ width: '14%', minWidth: '120px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Quick Actions</Text>
          </Box>
          <Box style={{ width: '12%', minWidth: '100px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Assigned To</Text>
          </Box>
          <Box style={{ width: '10%', minWidth: '80px', paddingLeft: '8px', paddingRight: '8px' }}>
            <Text style={{ fontSize: '12px' }}>Actions</Text>
          </Box>
        </Flex>

        {/* Table Body */}
        {currentLeads.length === 0 && !ui.loading ? (
          <Box style={{ padding: '40px', textAlign: 'center' }}>
            <Text>No leads found</Text>
          </Box>
        ) : (
          currentLeads.map((lead, index) => (
            <Flex key={lead.id} style={{ marginTop: '10px', borderBottom: index < currentLeads.length - 1 ? '1px solid #e5e7eb' : 'none', paddingBottom: '10px', paddingLeft: '10px', paddingRight: '10px', width: '100%', boxSizing: 'border-box' }}>
              <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', minHeight: '100px' }}>
                {/* S.No Column */}
                <Box style={{ width: '6%', minWidth: '50px', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingRight: '8px' }}>
                  <Checkbox style={{ marginTop: '2px', cursor: 'pointer' }} size="2" checked={selectedLeads.includes(lead.id)} onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)} />
                  <Text style={{ paddingLeft: '2px', fontSize: '13px' }}>{startIndex + index + 1}</Text>
                </Box>

                {/* Lead Details Column */}
                <Box style={{ width: '16%', minWidth: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <Text style={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '13px' }}>{lead.name}</Text>
                  <Text style={{ fontSize: '12px' }}>ID : {lead.leadId}</Text>
                  {lead.badgeType === 'instalink' ? (
                    <Box style={{ width: '55px', height: '26px', borderRadius: '10px', backgroundColor: '#f678a7', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '11px' }}>Instalink</Box>
                  ) : (
                    <Box style={{ width: '55px', height: '26px', borderRadius: '10px', backgroundColor: '#5588ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '11px' }}>Itinerary</Box>
                  )}
                  <Text style={{ fontSize: '12px' }}>{formatTime(lead.time)}</Text>
                </Box>

                {/* Enquiry Details Column */}
                <Box style={{ width: '20%', minWidth: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                  <Text style={{ fontSize: '12px' }}>
                    {lead.phone} | 
                    <span onClick={() => window.open(`https://wa.me/${lead.phone}`, '_blank')} style={{ cursor: 'pointer' }}><WhatsAppIcon /></span>
                    <span onClick={() => window.location.href = `tel:${lead.phone}`} style={{ cursor: 'pointer' }}><PhoneIcon /></span>
                  </Text>
                  {lead.destination && <Text style={{ fontSize: '12px' }}>{lead.destination}</Text>}
                  <Text style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><UserIcon /> Pax</Text>
                  {lead.packageCode && (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <MessageIcon />
                      <Text style={{ marginLeft: '4px', fontSize: '12px' }}>{lead.packageCode}</Text>
                    </span>
                  )}
                </Box>

                {/* Remarks Column */}
                <Box style={{ width: '16%', minWidth: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Remarks</Text>
                  {lead.remarks && <Text style={{ fontSize: '12px' }}>{lead.remarks}</Text>}
                  {lead.savedRemarks && lead.savedRemarks.length > 0 && (
                    <Box style={{ marginTop: '4px', width: '100%' }}>
                      {lead.savedRemarks.map((remark, idx) => (
                        <Text key={idx} style={{ fontSize: '11px', color: '#666', marginBottom: '2px', display: 'block', borderLeft: '2px solid #5588ff', paddingLeft: '4px' }}>{extractRemarkText(remark)}</Text>
                      ))}
                    </Box>
                  )}
                  {lead.reminder && (
                    <Box style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Text style={{ fontSize: '11px', color: '#b91c1c' }}>Reminder: {(() => { try { return new Date(lead.reminder!).toLocaleString() } catch (err) { return lead.reminder } })()}</Text>
                      <Text style={{ fontSize: '11px', cursor: 'pointer', color: '#3b82f6' }} onClick={() => handleRemoveReminder(lead.id)}>Remove</Text>
                    </Box>
                  )}
                  <span onClick={() => handleOpenRemarkModal(lead.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <AddIcon />
                    <Text style={{ textDecoration: 'underline', fontSize: '11px' }}>Add Remark</Text>
                  </span>
                </Box>

                {/* Quick Actions Column */}
                <Box style={{ width: '14%', minWidth: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <Select.Root
                    value={lead.status}
                    onValueChange={(value) => handleStatusChange(lead.id, value)}
                  >
                    <Select.Trigger 
                      placeholder="Select Status"
                      style={{ width: '100%', maxWidth: '110px', height: '32px', fontSize: '12px' }}
                    />
                    <Select.Content>
                      <Select.Item value="Hot">Hot</Select.Item>
                      <Select.Item value="Warm">Warm</Select.Item>
                      <Select.Item value="Cold">Cold</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Select.Root
                    value={lead.contacted}
                    onValueChange={(value) => handleContactedChange(lead.id, value)}
                  >
                    <Select.Trigger 
                      placeholder="Select Stage"
                      style={{ width: '100%', maxWidth: '110px', height: '32px', fontSize: '12px' }}
                    />
                    <Select.Content>
                      {contactedOptions.map((option) => (
                        <Select.Item key={option} value={option}>{option}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text onClick={() => setIsStagesModalOpen(true)} style={{ fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}>More</Text>
                </Box>

                  {/* Assigned To Column */}
                  <Box style={{ width: '12%', minWidth: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <Select.Root
                    value={lead.assignedTo || "__UNASSIGNED__"}
                    onValueChange={(value) => handleAssignedToChange(lead.id, value)}
                  >
                    <Select.Trigger 
                      placeholder="UnAssigned"
                      style={{ width: '100%', maxWidth: '110px', height: '32px', fontSize: '12px' }}
                    />
                    <Select.Content>
                      <Select.Item value="__UNASSIGNED__">UnAssigned</Select.Item>
                      {users.map((user) => (
                        <Select.Item key={user.id} value={user.username}>
                          {user.username}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Box>

                                {/* Actions Column */}
                                <Box style={{ width: '10%', minWidth: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', fontSize: '13px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Box style={{ backgroundColor: 'black', width: '100%', maxWidth: '90px', height: '32px', border: '1px solid #e5e7eb', borderRadius: '5px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: '12px' }}>Actions</Text>
                      </Box>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content style={{ minWidth: '180px' }}>
                      <DropdownMenu.Item onClick={() => handleConvertToCustomer(lead.id)}>
                        Convert to Customer
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handleEditEnquiry(lead.id)}>
                        Edit Enquiry
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handleViewTimeline(lead.id)}>
                        View Timeline
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handleViewDetails(lead.id)}>
                        View Details
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => handledeleteLeadById(lead.id)}>
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Box>
              </Box>
            </Flex>
          ))
        )}
      </Box>

      {/* Pagination */}
      <Flex wrap="wrap" gap="3" style={{ marginTop: '20px', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box' }}>
        <Flex style={{ alignItems: 'center', gap: '10px', flex: '1 1 auto', minWidth: '200px' }}>
          <Text style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>Rows per page:</Text>
          <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} style={{ width: '80px', height: '35px', border: '1px solid #e5e7eb', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '14px' }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </Flex>
        <Text style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap', margin: '0 16px' }}>
          Page <span style={{ fontWeight: 'bold', color: '#000' }}>{currentPage}</span> of{' '}
          <span style={{ fontWeight: 'bold', color: '#000' }}>{totalPages}</span>
        </Text>
        <Flex style={{ gap: '8px', alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end', minWidth: '200px' }}>
          <Box onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
            }
          }} style={{ width: '35px', height: '35px', border: '1px solid #e5e7eb', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, backgroundColor: 'white', transition: 'all 0.2s' }}>
            <ChevronLeftIcon width="18" height="18" />
          </Box>
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
              <Box key={pageNum} onClick={() => {
            if (pageNum !== currentPage) {
              setCurrentPage(pageNum)
            }
          }} style={{ width: '35px', height: '35px', border: '1px solid #e5e7eb', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: currentPage === pageNum ? '#000' : '#fff', color: currentPage === pageNum ? '#fff' : '#000', fontWeight: currentPage === pageNum ? 'bold' : 'normal', fontSize: '14px', transition: 'all 0.2s' }}>
                {pageNum}
              </Box>
            )
          })}
          <Box onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1)
            }
          }} style={{ width: '35px', height: '35px', border: '1px solid #e5e7eb', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, backgroundColor: 'white', transition: 'all 0.2s' }}>
            <ChevronRightIcon width="18" height="18" />
          </Box>
        </Flex>
      </Flex>

      {/* Modals */}
      {/* Add Remark Modal */}
      <Dialog.Root open={isRemarkModalOpen} onOpenChange={setIsRemarkModalOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Add Remark</Dialog.Title>
          <Dialog.Description size="2" mb="4">Add a remark for Lead ID: {selectedLeadForRemark}</Dialog.Description>
          <TextArea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} placeholder="Enter your remark here..." style={{ minHeight: '150px' }} />
          <Flex gap="3" align="center" mt="3" style={{ marginTop: '12px' }}>
            <Checkbox checked={isReminderEnabled} onCheckedChange={(checked) => setIsReminderEnabled(Boolean(checked))} />
            <Text size="2">Set Reminder</Text>
            {isReminderEnabled && (
              <input type="datetime-local" value={reminderDateTime} onChange={(e) => setReminderDateTime(e.target.value)} style={{ marginLeft: '8px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
            )}
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsRemarkModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRemark}>Save Remark</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Lead Stages Modal */}
      <Dialog.Root open={isStagesModalOpen} onOpenChange={setIsStagesModalOpen}>
        <Dialog.Content style={{ maxWidth: 700 }}>
          <Dialog.Title>Lead Stages</Dialog.Title>
          <Dialog.Description size="2" mb="4">Understanding what each stage signals</Dialog.Description>
          <Box style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>Stage Label</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>What this signals?</th>
                </tr>
              </thead>
              <tbody>
                {leadStages.map((stage, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '500' }}>{stage.label}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{stage.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={() => setIsStagesModalOpen(false)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Enquiry Modal */}
      <Dialog.Root open={isAddEnquiryModalOpen} onOpenChange={setIsAddEnquiryModalOpen}>
        <Dialog.Content style={{ maxWidth: 750 }}>
          <Dialog.Title>Add New Enquiry</Dialog.Title>
          <Dialog.Description size="2" mb="4">Fill in the details to add a new lead enquiry</Dialog.Description>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Name *</Text>
              <input type="text" value={newEnquiry.name} onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })} placeholder="Enter name" style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Phone *</Text>
              <input type="tel" value={newEnquiry.phone} onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })} placeholder="Enter phone number" style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
            </Box>
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Destination *</Text>
              <input type="text" value={newEnquiry.destination} onChange={(e) => setNewEnquiry({ ...newEnquiry, destination: e.target.value })} placeholder="Enter destination" style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Package Code</Text>
              <input type="text" value={newEnquiry.packageCode} onChange={(e) => setNewEnquiry({ ...newEnquiry, packageCode: e.target.value })} placeholder="e.g., #RR17" style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} />
            </Box>
            <Box>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Badge Type</Text>
              <select value={newEnquiry.badgeType} onChange={(e) => setNewEnquiry({ ...newEnquiry, badgeType: e.target.value as any })} style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
                <option value="instalink">Instalink</option>
                <option value="website">Website</option>
                <option value="phone">Phone</option>
                <option value="walkin">Walk-in</option>
                <option value="referral">Referral</option>
              </select>
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Status</Text>
              <select value={newEnquiry.status} onChange={(e) => setNewEnquiry({ ...newEnquiry, status: e.target.value as any })} style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </Box>
            <Box>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Contact Status</Text>
              <select value={newEnquiry.contacted} onChange={(e) => setNewEnquiry({ ...newEnquiry, contacted: e.target.value as any })} style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}>
                {contactedOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Assigned To</Text>
              <select 
                value={newEnquiry.assignedTo} 
                onChange={(e) => setNewEnquiry({ ...newEnquiry, assignedTo: e.target.value })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}
              >
                <option value="">UnAssigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          <Box mt="3">
            <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>Remarks</Text>
            <TextArea value={newEnquiry.remarks} onChange={(e) => setNewEnquiry({ ...newEnquiry, remarks: e.target.value })} placeholder="Enter any remarks or notes" style={{ minHeight: '80px' }} />
          </Box>
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setIsAddEnquiryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEnquiry}>Add Enquiry</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Convert to Customer Modal */}
      <Dialog.Root open={isConvertToCustomerModalOpen} onOpenChange={setIsConvertToCustomerModalOpen}>
        <Dialog.Content style={{ maxWidth: 750 }}>
          <Flex justify="between" align="center" style={{ marginBottom: '8px' }}>
            <Dialog.Title>Convert to Customer</Dialog.Title>
            <Dialog.Close>
              <Box
                style={{
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: isDark ? 'var(--gray-11)' : 'var(--gray-11)',
                }}
                onClick={() => {
                  setIsConvertToCustomerModalOpen(false)
                  setCustomerCreated(false)
                  setCreatedCustomerId(null)
                }}
              >
                <Cross2Icon width="20" height="20" />
              </Box>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            Fill in the details to convert this lead to a customer
            {selectedLeadForConversion && (
              <Text size="1" style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                Lead: {selectedLeadForConversion.name} | {selectedLeadForConversion.phone}
                {selectedLeadForConversion.destination && ` | ${selectedLeadForConversion.destination}`}
              </Text>
            )}
          </Dialog.Description>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Name <span style={{ color: 'red' }}>*</span>
              </Text>
              <input 
                type="text" 
                value={customerForm.name} 
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} 
                placeholder="Enter name" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Mobile Number <span style={{ color: 'red' }}>*</span>
              </Text>
              <input 
                type="tel" 
                value={customerForm.phone} 
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} 
                placeholder="Enter mobile number" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Email <span style={{ color: 'red' }}>*</span>
              </Text>
              <input 
                type="email" 
                value={customerForm.email} 
                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} 
                placeholder="Enter email" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                City <span style={{ color: 'red' }}>*</span>
              </Text>
              <input 
                type="text" 
                value={customerForm.city} 
                onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} 
                placeholder="Enter city" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Age <span style={{ color: 'red' }}>*</span>
              </Text>
              <input 
                type="number" 
                value={customerForm.age} 
                onChange={(e) => setCustomerForm({ ...customerForm, age: e.target.value })} 
                placeholder="Enter age" 
                required
                min="1"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Gender <span style={{ color: 'red' }}>*</span>
              </Text>
              <select 
                value={customerForm.gender} 
                onChange={(e) => setCustomerForm({ ...customerForm, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' })} 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </Box>
            <Box>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Date of Birth (Optional)
              </Text>
              <input 
                type="date" 
                value={customerForm.dateOfBirth} 
                onChange={(e) => setCustomerForm({ ...customerForm, dateOfBirth: e.target.value })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
          </Box>
          
          {/* Itinerary Details Display (Read-only) */}
          {selectedLeadForConversion && (selectedLeadForConversion.destination || selectedLeadForConversion.itineraryId) && (
            <Box mt="3" style={{ 
              padding: '12px', 
              backgroundColor: isDark ? 'var(--color-panel)' : '#f9fafb', 
              borderRadius: '5px', 
              border: isDark ? '1px solid var(--gray-6)' : '1px solid #e5e7eb' 
            }}>
              <Text as="label" size="2" weight="bold" style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: isDark ? 'var(--gray-12)' : 'inherit'
              }}>Itinerary Details (from Lead)</Text>
              <Flex direction="column" gap="2">
                {selectedLeadForConversion.destination && (
                  <Text size="2" style={{ color: isDark ? 'var(--gray-12)' : 'inherit' }}>
                    Destination: {selectedLeadForConversion.destination}
                  </Text>
                )}
                {selectedLeadForConversion.packageCode && (
                  <Text size="2" style={{ color: isDark ? 'var(--gray-12)' : 'inherit' }}>
                    Package Code: {selectedLeadForConversion.packageCode}
                  </Text>
                )}
                {selectedLeadForConversion.itineraryId && (
                  <Text size="2" style={{ color: isDark ? 'var(--gray-12)' : 'inherit' }}>
                    Itinerary ID: {selectedLeadForConversion.itineraryId}
                  </Text>
                )}
              </Flex>
            </Box>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => {
              setIsConvertToCustomerModalOpen(false)
              setCustomerCreated(false)
              setCreatedCustomerId(null)
            }}>
              {customerCreated ? 'Close' : 'Cancel'}
            </Button>
            {!customerCreated ? (
              <Button onClick={handleCreateCustomer}>Create Customer</Button>
            ) : (
              <>
                <Button onClick={handleCreateCustomer} variant="soft" disabled>Create Customer</Button>
                <Button 
                  onClick={() => handleCreateInvoice(createdCustomerId || '')}
                  disabled={!createdCustomerId}
                >
                  Create Invoice
                </Button>
              </>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Edit Enquiry Modal */}
      <Dialog.Root open={isEditEnquiryModalOpen} onOpenChange={setIsEditEnquiryModalOpen}>
        <Dialog.Content style={{ maxWidth: 750 }}>
          <Flex justify="between" align="center" style={{ marginBottom: '8px' }}>
            <Dialog.Title>Edit Enquiry</Dialog.Title>
            <Dialog.Close>
              <Box
                style={{
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: isDark ? 'var(--gray-11)' : 'var(--gray-11)',
                }}
                onClick={() => {
                  setIsEditEnquiryModalOpen(false)
                  setSelectedLeadForEdit(null)
                }}
              >
                <Cross2Icon width="20" height="20" />
              </Box>
            </Dialog.Close>
          </Flex>
          <Dialog.Description size="2" mb="4">
            Update the enquiry details
          </Dialog.Description>
          
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Enquiry Name */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Enquiry Name
              </Text>
              <input 
                type="text" 
                value={editEnquiryForm.name} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, name: e.target.value })} 
                placeholder="Enter enquiry name" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Enquiry Number */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Enquiry Number
              </Text>
              <input 
                type="tel" 
                value={editEnquiryForm.phone} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, phone: e.target.value })} 
                placeholder="Enter phone number" 
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Enquiry Email */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Enquiry Email
              </Text>
              <input 
                type="email" 
                value={editEnquiryForm.email} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, email: e.target.value })} 
                placeholder="Enter Lead Email" 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Event */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Event
              </Text>
              <Select.Root
                value={editEnquiryForm.itineraryId || undefined}
                onValueChange={(value) => {
                  setEditEnquiryForm({ 
                    ...editEnquiryForm, 
                    itineraryId: value,
                    batchId: '' // Clear batch when itinerary changes
                  })
                }}
              >
                <Select.Trigger 
                  placeholder="Select Event"
                  style={{ width: '100%' }}
                />
                <Select.Content>
                  {itineraries.map((itinerary) => (
                    <Select.Item key={itinerary.id} value={itinerary.id}>
                      {itinerary.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
            
            {/* Batch */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Batch
              </Text>
              <Select.Root
                value={editEnquiryForm.batchId || undefined}
                onValueChange={(value) => setEditEnquiryForm({ ...editEnquiryForm, batchId: value })}
                disabled={!editEnquiryForm.itineraryId}
              >
                <Select.Trigger
                  placeholder={
                    !editEnquiryForm.itineraryId
                      ? 'Please select itinerary first'
                      : loadingBatches
                      ? 'Loading batches...'
                      : filteredBatches.length === 0
                      ? 'No batches available'
                      : 'Select Batch'
                  }
                  style={{ width: '100%' }}
                />
                <Select.Content>
                  {filteredBatches.map((batch) => {
                    const startDate = new Date(batch.start_date).toLocaleDateString()
                    const endDate = new Date(batch.end_date).toLocaleDateString()
                    return (
                      <Select.Item key={batch.id} value={batch.id}>
                        {startDate} - {endDate} {batch.is_sold ? '(Sold)' : ''}
                        {batch.extra_amount > 0 && ` (₹${batch.extra_amount})`}
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select.Root>
            </Box>
            
            {/* Preferred Date */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Preferred Date
              </Text>
              <input 
                type="date" 
                value={editEnquiryForm.preferredTravelDate} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, preferredTravelDate: e.target.value })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Duration */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Duration
              </Text>
              <input 
                type="text" 
                value={editEnquiryForm.duration} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, duration: e.target.value })} 
                placeholder="Duration" 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* No of Guests */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                No of Guests
              </Text>
              <input 
                type="number" 
                value={editEnquiryForm.numberOfTravelers} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, numberOfTravelers: e.target.value })} 
                placeholder="Number of guests" 
                min="1"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Location */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Location
              </Text>
              <input 
                type="text" 
                value={editEnquiryForm.destination} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, destination: e.target.value })} 
                placeholder="Enter location" 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }} 
              />
            </Box>
            
            {/* Stage */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Stage
              </Text>
              <select 
                value={editEnquiryForm.contacted} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, contacted: e.target.value as Lead['contacted'] })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}
              >
                {contactedOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Box>
            
            {/* Source */}
            <Box style={{ marginRight: '25px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Source
              </Text>
              <select 
                value={editEnquiryForm.source} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, source: e.target.value })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}
              >
                <option value="">Select Source</option>
                <option value="instalink">Instalink</option>
                <option value="website">Website</option>
                <option value="phone">Phone</option>
                <option value="walkin">Walk-in</option>
                <option value="referral">Referral</option>
              </select>
            </Box>
            
            {/* Assigned to */}
            <Box style={{ marginRight: '15px' }}>
              <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
                Assigned to
              </Text>
              <select 
                value={editEnquiryForm.assignedTo} 
                onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, assignedTo: e.target.value })} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '14px' }}
              >
                <option value="">UnAssigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </Box>
          </Box>
          
          {/* Customer Message */}
          <Box mt="3">
            <Text as="label" size="2" weight="bold" style={{ display: 'block', marginBottom: '4px' }}>
              Customer Message
            </Text>
            <TextArea 
              value={editEnquiryForm.notes} 
              onChange={(e) => setEditEnquiryForm({ ...editEnquiryForm, notes: e.target.value })} 
              placeholder="Enter customer message" 
              style={{ minHeight: '80px' }} 
            />
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => {
              setIsEditEnquiryModalOpen(false)
              setSelectedLeadForEdit(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEnquiry}>Update</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Alert Dialog for Messages */}
      {dialogConfig && (
        <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
            <AlertDialog.Description size="2">
              {dialogConfig.description}
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              {dialogConfig.cancelText && (
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    {dialogConfig.cancelText}
                  </Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action>
                <Button
                  variant="solid"
                  color={dialogConfig.color || 'red'}
                  onClick={dialogConfig.onConfirm}
                >
                  {dialogConfig.actionText}
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}

      {/* View Details Side Panel */}
      {isViewDetailsOpen && selectedLeadForDetails && (
        <>
          {/* Overlay */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              transition: 'opacity 0.3s ease',
            }}
            onClick={() => {
              setIsViewDetailsOpen(false)
              setSelectedLeadForDetails(null)
            }}
          />

          {/* Slide-in Details Panel */}
          <Box
            style={{
              position: 'fixed',
              top: '70px',
              right: 0,
              width: '600px',
              height: 'calc(100vh - 70px)',
              backgroundColor: 'var(--color-panel)',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideIn 0.3s ease',
            }}
          >
            {/* Header with Tabs */}
            <Box
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--accent-6)',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--color-panel)',
                zIndex: 10,
              }}
            >
              <Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
                <Text size="6" weight="bold" style={{ color: 'var(--accent-12)' }}>
                  Lead Details
                </Text>
                <Box
                  onClick={() => {
                    setIsViewDetailsOpen(false)
                    setSelectedLeadForDetails(null)
                  }}
                  style={{
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    color: 'var(--gray-11)',
                  }}
                >
                  <Cross2Icon width="20" height="20" />
                </Box>
              </Flex>

              {/* Tabs */}
              <Flex gap="2" style={{ borderBottom: '1px solid var(--accent-6)' }}>
                {['Details', 'Timeline', 'Remarks'].map((tab) => (
                  <Box
                    key={tab}
                    onClick={() => setActiveDetailsTab(tab as 'Details' | 'Timeline' | 'Remarks')}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      borderBottom: activeDetailsTab === tab ? '2px solid #000' : '2px solid transparent',
                      backgroundColor: activeDetailsTab === tab ? (isDark ? 'var(--gray-3)' : '#f9fafb') : 'transparent',
                      color: activeDetailsTab === tab ? 'var(--accent-12)' : 'var(--accent-11)',
                      fontWeight: activeDetailsTab === tab ? 'bold' : 'normal',
                      marginBottom: '-1px',
                    }}
                  >
                    <Text size="2">{tab}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Content */}
            <Box style={{ padding: '24px', flex: 1 }}>
              {activeDetailsTab === 'Details' && (
                <Flex direction="column" gap="4">
                  {/* Customer Profile Section */}
                  <Flex gap="3" align="center" style={{ marginBottom: '16px' }}>
                    {/* Avatar */}
                    <Box
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? 'var(--gray-6)' : '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'var(--accent-12)',
                        flexShrink: 0,
                      }}
                    >
                      {selectedLeadForDetails.name.charAt(0).toUpperCase()}
                    </Box>
                    <Flex direction="column" style={{ flex: 1 }}>
                      <Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.name}
                      </Text>
                      <Flex gap="2" align="center" style={{ marginTop: '4px' }}>
                        <Text size="2" style={{ color: 'var(--accent-11)' }}>
                          {selectedLeadForDetails.phone}
                        </Text>
                        <Box
                          onClick={() => window.open(`https://wa.me/${selectedLeadForDetails.phone}`, '_blank')}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <WhatsAppIcon />
                        </Box>
                        <Box
                          onClick={() => window.location.href = `tel:${selectedLeadForDetails.phone}`}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <PhoneIcon />
                        </Box>
                      </Flex>
                    </Flex>
                    <Box
                      style={{
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Box>
                  </Flex>

                  {/* Activity Timestamps */}
                  <Flex direction="column" gap="2" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--accent-6)' }}>
                    <Flex gap="2" align="center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-11)' }}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <Text size="2" style={{ color: 'var(--accent-11)' }}>
                        {formatDateForDisplay(selectedLeadForDetails.time)}
                      </Text>
                    </Flex>
                    {selectedLeadForDetails.reminder && (
                      <Flex gap="2" align="center">
                        <Box
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            flexShrink: 0,
                          }}
                        />
                        <Text size="2" style={{ color: 'var(--accent-11)' }}>
                          Last Activity: {formatDateForDisplay(selectedLeadForDetails.reminder)}
                        </Text>
                      </Flex>
                    )}
                  </Flex>

                  {/* Details Grid */}
                  <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Pax */}
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Pax
                      </Text>
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.numberOfTravelers ? selectedLeadForDetails.numberOfTravelers : '--'}
                      </Text>
                    </Flex>

                    {/* Category */}
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Category
                      </Text>
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.badgeType ? selectedLeadForDetails.badgeType.charAt(0).toUpperCase() + selectedLeadForDetails.badgeType.slice(1) : '--'}
                      </Text>
                    </Flex>

                    {/* Customer Message */}
                    <Flex direction="column" gap="1" style={{ gridColumn: 'span 1' }}>
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Customer Message
                      </Text>
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.notes || selectedLeadForDetails.remarks || '--'}
                      </Text>
                    </Flex>

                    {/* Tags */}
                    <Flex direction="column" gap="1" style={{ gridColumn: 'span 1' }}>
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Tags
                      </Text>
                      {selectedLeadForDetails.status && (
                        <Box
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            backgroundColor: getTagColor(selectedLeadForDetails.status).bg,
                            color: getTagColor(selectedLeadForDetails.status).text,
                            fontSize: '12px',
                            fontWeight: '500',
                            width: 'fit-content',
                          }}
                        >
                          {selectedLeadForDetails.status}
                        </Box>
                      )}
                    </Flex>

                    {/* Stage */}
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Stage
                      </Text>
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.contacted || '--'}
                      </Text>
                    </Flex>

                    {/* Assigned to */}
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Assigned to
                      </Text>
                      {getAssignedUserName(selectedLeadForDetails.assignedTo) ? (
                        <Flex gap="2" align="center">
                          <Box
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isDark ? 'var(--gray-6)' : '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: 'var(--accent-12)',
                            }}
                          >
                            {getAssignedUserName(selectedLeadForDetails.assignedTo)?.charAt(0).toUpperCase()}
                          </Box>
                          <Text size="2" style={{ color: 'var(--accent-12)' }}>
                            {getAssignedUserName(selectedLeadForDetails.assignedTo)}
                          </Text>
                        </Flex>
                      ) : (
                        <Text size="2" style={{ color: 'var(--accent-12)' }}>
                          --
                        </Text>
                      )}
                    </Flex>

                    {/* Username */}
                    <Flex direction="column" gap="1" style={{ gridColumn: 'span 2' }}>
                      <Text size="2" weight="bold" style={{ color: 'var(--accent-11)' }}>
                        Username
                      </Text>
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.email || '--'}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )}

              {activeDetailsTab === 'Timeline' && (
                <Box>
                  <Text size="3" weight="bold" style={{ marginBottom: '16px', color: 'var(--accent-12)' }}>
                    Timeline
                  </Text>
                  <Text size="2" style={{ color: 'var(--accent-11)' }}>
                    Timeline functionality will be implemented here.
                  </Text>
                </Box>
              )}

              {activeDetailsTab === 'Remarks' && (
                <Flex direction="column" gap="3">
                  <Text size="3" weight="bold" style={{ color: 'var(--accent-12)' }}>
                    Remarks
                  </Text>
                  {selectedLeadForDetails.remarks && (
                    <Box
                      style={{
                        padding: '12px',
                        backgroundColor: isDark ? 'var(--gray-3)' : '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid var(--accent-6)',
                      }}
                    >
                      <Text size="2" style={{ color: 'var(--accent-12)' }}>
                        {selectedLeadForDetails.remarks}
                      </Text>
                    </Box>
                  )}
                  {selectedLeadForDetails.savedRemarks && selectedLeadForDetails.savedRemarks.length > 0 && (
                    <Flex direction="column" gap="2">
                      {selectedLeadForDetails.savedRemarks.map((remark, idx) => (
                        <Box
                          key={idx}
                          style={{
                            padding: '12px',
                            backgroundColor: isDark ? 'var(--gray-3)' : '#f9fafb',
                            borderRadius: '6px',
                            border: '1px solid var(--accent-6)',
                            borderLeft: '3px solid #5588ff',
                          }}
                        >
                          <Text size="2" style={{ color: 'var(--accent-12)' }}>
                            {extractRemarkText(remark)}
                          </Text>
                        </Box>
                      ))}
                    </Flex>
                  )}
                  {(!selectedLeadForDetails.remarks && (!selectedLeadForDetails.savedRemarks || selectedLeadForDetails.savedRemarks.length === 0)) && (
                    <Text size="2" style={{ color: 'var(--accent-11)' }}>
                      No remarks available.
                    </Text>
                  )}
                </Flex>
              )}
            </Box>
          </Box>

          {/* CSS Animation */}
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
        </>
      )}
    </Box>
  )
}

export default Leads