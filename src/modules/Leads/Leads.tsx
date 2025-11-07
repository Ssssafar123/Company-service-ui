import React, { useState } from 'react'
import { Box, Flex, Text, TextField, Badge, Checkbox } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const Leads: React.FC = () => {
    // Dummy data for statistics
    const totalLeads = 10
    const todayLeads = 2
    const convertedLeads = 1

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Dummy leads data
    const leadsData = [
        {
            id: 1,
            name: "Priyanshu",
            badgeType: "instalink",
            leadId: "2142599",
            time: "Today at 7:15 PM",
            phone: "6367710137",
            destination: "Manali & Kasol | Group",
            packageCode: "#MKP02",
            remarks: "interested",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 2,
            name: "Aarav Kumar",
            badgeType: "itinerary",
            leadId: "2142600",
            time: "Today at 6:30 PM",
            phone: "9876543210",
            destination: "Goa Beach | Solo",
            packageCode: "#GB01",
            remarks: "wants discount",
            status: "Warm",
            contacted: "Not Contacted",
            assignedTo: "Shivam"
        },
        // ... rest of your leads data
    ];

    // Calculate pagination values
    const totalItems = leadsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLeads = leadsData.slice(startIndex, endIndex);

    // Reset to page 1 when items per page changes
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const WhatsAppIcon = () => (
        <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                display: "inline-block", 
                verticalAlign: "middle",
                marginLeft: "4px"
            }}
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
            <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.298c-1.778 0-3.524-.477-5.042-1.377l-.362-.214-3.754.982.999-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.002 5.45-4.436 9.884-9.864 9.884z" fill="#25D366"/>
        </svg>  
    );

    const PhoneIcon = () => (
        <svg 
            width="14"
            height="14"
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                display: "inline-block", 
                verticalAlign: "middle",
                marginLeft: "4px"
            }}
        >
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const AddIcon = () => (
        <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                display: "inline-block", 
                verticalAlign: "middle",
                marginRight: "6px"
            }}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path 
            d="M12 8V16M8 12H16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            />
        </svg>
    );

    const MessageIcon = () => (
        <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                display: "inline-block", 
                verticalAlign: "middle",
                marginLeft: "4px"
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
    );

    return (
        <Box style={{
            width: '100%',
            maxWidth: '100%',
            backgroundColor: 'white',
            padding: '20px',
            boxSizing: 'border-box',
            // Make it responsive to sidebar
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
      
            {/* Title */}
            <Text size="8" weight="regular" style={{ color: '#1f2937', marginBottom: '24px', display: 'block' }}>
                All Leads
            </Text>
      
            {/* Statistics Cards */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                {/* Overall Leads Captured */}
                <div style={{
                    border: "2px solid #e5e7eb",
                    flex: '1',
                    minWidth: '200px', // Reduced minWidth for better responsiveness
                    height: '100px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Text size="2" style={{ color: 'gray', display: 'block', marginBottom: '8px' }}>
                            Overall Leads Captured
                        </Text>
                        <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold', display: 'block' }}>
                            {totalLeads.toLocaleString()}
                        </Text>
                    </div>
                </div>
      
                {/* Today's Leads */}
                <div style={{
                    border: "2px solid #e5e7eb",
                    flex: '1',
                    minWidth: '200px', // Reduced minWidth for better responsiveness
                    height: '100px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Text size="2" style={{ color: 'gray', display: 'block', marginBottom: '8px' }}>
                            Today Leads Captured
                        </Text>
                        <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold', display: 'block' }}>
                            {todayLeads.toLocaleString()}
                        </Text>
                    </div>
                </div>
      
                {/* Overall Leads Converted */}
                <div style={{
                    border: "2px solid #e5e7eb",
                    flex: '1',
                    minWidth: '200px', // Reduced minWidth for better responsiveness
                    height: '100px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Text size="2" style={{ color: 'gray', display: 'block', marginBottom: '8px' }}>
                            Overall Leads Converted
                        </Text>
                        <Text size="6" style={{ fontSize: '20px', fontWeight: 'bold', display: 'block' }}>
                            {convertedLeads.toLocaleString()}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Search and Actions */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ flex: '1', minWidth: '250px' }}> {/* Reduced minWidth */}
                    <TextField.Root placeholder='Search...' style={{ width: '100%' }}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" />
                        </TextField.Slot>
                    </TextField.Root>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        minWidth: '80px' // Reduced minWidth
                    }}>
                        Actions
                    </div>
                    <div style={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        minWidth: '80px' // Reduced minWidth
                    }}>
                        Refresh
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px', // Reduced gap
                marginBottom: '16px',
                alignItems: 'center'
            }}>
                {['All', 'Hot', 'Warm', 'Cold', 'Remainder', 'InstaLink', 'Archive'].map((tab) => (
                    <div 
                        key={tab}
                        style={{
                            border: "2px solid #e5e7eb",
                            borderRadius: "5px",
                            padding: "6px 10px", // Reduced padding
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: '13px', // Smaller font
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </div>
                ))}
                
                <div style={{
                    marginLeft: 'auto',
                    fontSize: '13px', // Smaller font
                    whiteSpace: 'nowrap'
                }}>
                    Showing <span style={{fontWeight: "bold"}}>{startIndex + 1}</span> to <span style={{fontWeight: "bold"}}>{Math.min(endIndex, totalItems)}</span> of <span style={{fontWeight: "bold"}}>{totalItems}</span> lead(s)
                </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div style={{
                border: "2px solid #e5e7eb",
                borderRadius: "5px",
                overflowX: 'auto',
                marginBottom: '20px',
                width: '100%'
            }}>
                {/* Table with minimum width to maintain structure on small screens */}
                <div style={{ minWidth: '900px' }}> {/* Reduced minWidth */}
                    {/* Table Header */}
                    <div style={{
                        display: 'flex',
                        padding: '12px 16px',
                        borderBottom: "2px solid #e5e7eb",
                        backgroundColor: '#f9fafb',
                        fontSize: '13px', // Smaller font
                        fontWeight: '500'
                    }}>
                        <div style={{ width: '70px', display: 'flex', alignItems: 'center' }}> {/* Reduced width */}
                            <Checkbox style={{ marginRight: '8px' }}/>
                            S.No.
                        </div>
                        <div style={{ width: '180px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Lead Details
                        </div>
                        <div style={{ width: '220px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Enquiry Details
                        </div>
                        <div style={{ width: '180px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Remarks & Reminders
                        </div>
                        <div style={{ width: '130px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Quick Actions
                        </div>
                        <div style={{ width: '130px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Assigned To
                        </div>
                        <div style={{ width: '100px', paddingLeft: '16px' }}> {/* Reduced width */}
                            Actions
                        </div>
                    </div>

                    {/* Table Body */}
                    {currentLeads.map((lead, index) => (
                        <div key={lead.id} style={{
                            display: 'flex',
                            padding: '12px', // Reduced padding
                            borderBottom: index < currentLeads.length - 1 ? "1px solid #e5e7eb" : "none",
                            alignItems: 'flex-start',
                            minHeight: '110px' // Slightly reduced height
                        }}>
                            {/* S.No Column */}
                            <div style={{
                                width: '70px', // Reduced width
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px', // Reduced gap
                                fontSize: '13px', // Smaller font
                                paddingTop: '6px' // Reduced padding
                            }}>
                                <Checkbox style={{ marginTop: '2px', cursor: 'pointer' }} />
                                {startIndex + index + 1}
                            </div>

                            {/* Lead Details Column */}
                            <div style={{
                                width: '180px', // Reduced width
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px', // Reduced gap
                                fontSize: '13px', // Smaller font
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                    {lead.name}
                                </div>
                                <div>ID: {lead.leadId}</div>
                                <div style={{
                                    width: 'fit-content',
                                    padding: '3px 6px', // Reduced padding
                                    borderRadius: '12px',
                                    backgroundColor: lead.badgeType === "instalink" ? "#f678a7" : "#5588ff",
                                    color: lead.badgeType === "instalink" ? "black" : "white",
                                    fontSize: '11px' // Smaller font
                                }}>
                                    {lead.badgeType === "instalink" ? "Instalink" : "Itinerary"}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}> {/* Smaller font */}
                                    {lead.time}
                                </div>
                            </div>

                            {/* Enquiry Details Column */}
                            <div style={{
                                width: '220px', // Reduced width
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px', // Reduced gap
                                fontSize: '13px', // Smaller font
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <div>
                                    {lead.phone} <WhatsAppIcon /> <PhoneIcon />
                                </div>
                                <div>{lead.destination}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MessageIcon />
                                    {lead.packageCode}
                                </div>
                            </div>

                            {/* Remarks Column */}
                            <div style={{
                                width: '180px', // Reduced width
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px', // Reduced gap
                                fontSize: '13px', // Smaller font
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <div>Remarks</div>
                                <div>{lead.remarks}</div>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    cursor: 'pointer',
                                    color: '#3b82f6',
                                    textDecoration: 'underline',
                                    fontSize: '12px' // Smaller font
                                }}>
                                    <AddIcon />
                                    Add Remark
                                </div>
                            </div>

                            {/* Quick Actions Column */}
                            <div style={{
                                width: '130px', // Reduced width
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px', // Reduced gap
                                fontSize: '13px', // Smaller font
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <select 
                                    defaultValue={lead.status}
                                    style={{
                                        width: '100%',
                                        height: '32px', // Reduced height
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "5px",
                                        padding: '0 6px', // Reduced padding
                                        fontSize: '12px' // Smaller font
                                    }}
                                >
                                    <option value="Hot">Hot</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Cold">Cold</option>
                                </select>
                                <select 
                                    defaultValue={lead.contacted}
                                    style={{
                                        width: '100%',
                                        height: '32px', // Reduced height
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "5px",
                                        padding: '0 6px', // Reduced padding
                                        fontSize: '12px' // Smaller font
                                    }}
                                >
                                    <option value="Contacted">Contacted</option>
                                    <option value="Not Contacted">Not Contacted</option>
                                </select>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '11px', // Smaller font
                                    cursor: 'pointer',
                                    color: '#3b82f6'
                                }}>
                                    More
                                </div>
                            </div>

                            {/* Assigned To Column */}
                            <div style={{
                                width: '130px', // Reduced width
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <select 
                                    defaultValue={lead.assignedTo}
                                    style={{
                                        width: '100%',
                                        height: '32px', // Reduced height
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "5px",
                                        padding: '0 6px', // Reduced padding
                                        fontSize: '12px' // Smaller font
                                    }}
                                >
                                    <option value="Rohit">Rohit</option>
                                    <option value="Shivam">Shivam</option>
                                    <option value="Sonia">Sonia</option>
                                </select>
                            </div>

                            {/* Actions Column */}
                            <div style={{
                                width: '100px', // Reduced width
                                paddingTop: '6px', // Reduced padding
                                paddingLeft: '16px' // Reduced padding
                            }}>
                                <div style={{
                                    backgroundColor: "black",
                                    width: '90px', // Reduced width
                                    height: '32px', // Reduced height
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "5px",
                                    color: "white",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    fontSize: '12px' // Smaller font
                                }}>
                                    Actions
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px', // Reduced gap
                padding: '12px 0', // Reduced padding
                borderTop: "2px solid #e5e7eb"
            }}>
                {/* Items per page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}> {/* Reduced gap */}
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Rows per page:</div>
                    <select 
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        style={{
                            width: '70px', // Reduced width
                            height: '32px', // Reduced height
                            border: "2px solid #e5e7eb",
                            borderRadius: "5px",
                            padding: '0 6px', // Reduced padding
                            cursor: 'pointer',
                            fontSize: '13px' // Smaller font
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>

                {/* Page info */}
                <div style={{ fontSize: '13px', color: '#6b7280' }}> {/* Smaller font */}
                    Page <span style={{ fontWeight: 'bold', color: '#000' }}>{currentPage}</span> of <span style={{ fontWeight: 'bold', color: '#000' }}>{totalPages}</span>
                </div>

                {/* Navigation buttons */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}> {/* Reduced gap */}
                    {/* Previous button */}
                    <div 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        style={{
                            width: '32px', // Reduced width
                            height: '32px', // Reduced height
                            border: "2px solid #e5e7eb",
                            borderRadius: "5px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <ChevronLeftIcon width="16" height="16" /> {/* Smaller icon */}
                    </div>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                            <div
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                    width: '32px', // Reduced width
                                    height: '32px', // Reduced height
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "5px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: currentPage === pageNum ? '#000' : '#fff',
                                    color: currentPage === pageNum ? '#fff' : '#000',
                                    fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                                    fontSize: '13px' // Smaller font
                                }}
                            >
                                {pageNum}
                            </div>
                        );
                    })}

                    {/* Next button */}
                    <div 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        style={{
                            width: '32px', // Reduced width
                            height: '32px', // Reduced height
                            border: "2px solid #e5e7eb",
                            borderRadius: "5px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            backgroundColor: 'white'
                        }}
                    >
                        <ChevronRightIcon width="16" height="16" /> {/* Smaller icon */}
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default Leads