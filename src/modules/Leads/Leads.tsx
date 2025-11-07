import React, { useState } from 'react'
import { Box, Flex, Text, TextField , Badge , Checkbox } from '@radix-ui/themes';
import {MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import Table from '../../components/dynamicComponents/Table';

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
        {
            id: 3,
            name: "Sneha Patel",
            badgeType: "itinerary",
            leadId: "2142601",
            time: "Today at 5:45 PM",
            phone: "8765432109",
            destination: "Kerala Backwaters | Family",
            packageCode: "#KB03",
            remarks: "budget friendly",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Sonia"
        },
        {
            id: 4,
            name: "Rahul Singh",
            leadId: "2142602",
            badgeType: "itinerary",
            time: "Today at 4:20 PM",
            phone: "7654321098",
            destination: "Ladakh Adventure | Group",
            packageCode: "#LA05",
            remarks: "needs info",
            status: "Cold",
            contacted: "Not Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 5,
            name: "Priya Sharma",
            badgeType: "itinerary",
            leadId: "2142603",
            time: "Today at 3:10 PM",
            phone: "6543210987",
            destination: "Rajasthan Heritage | Couple",
            packageCode: "#RH07",
            remarks: "ready to book",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Shivam"
        },
        {
            id: 6,
            name: "Vikram Reddy",
            badgeType: "itinerary",
            leadId: "2142604",
            time: "Today at 2:05 PM",
            phone: "5432109876",
            destination: "Shimla Manali | Family",
            packageCode: "#SM09",
            remarks: "comparing prices",
            status: "Warm",
            contacted: "Not Contacted",
            assignedTo: "Sonia"
        },
        {
            id: 7,
            name: "Ananya Verma",
            badgeType: "itinerary",
            leadId: "2142605",
            time: "Today at 1:30 PM",
            phone: "4321098765",
            destination: "Andaman Islands | Honeymoon",
            packageCode: "#AI11",
            remarks: "interested in luxury",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 8,
            name: "Karan Mehta",
            leadId: "2142606",
            badgeType: "instalink",
            time: "Today at 12:15 PM",
            phone: "3210987654",
            destination: "Darjeeling Tea Gardens | Solo",
            packageCode: "#DT13",
            remarks: "price too high",
            status: "Cold",
            contacted: "Not Contacted",
            assignedTo: "Shivam"
        },
        {
            id: 9,
            name: "Divya Nair",
            badgeType: "instalink",
            leadId: "2142607",
            time: "Today at 11:00 AM",
            phone: "2109876543",
            destination: "Udaipur Palace Tour | Couple",
            packageCode: "#UP15",
            remarks: "wants customization",
            status: "Warm",
            contacted: "Contacted",
            assignedTo: "Sonia"
        },
        {
            id: 11,
            name: "Arjun Gupta",
            badgeType: "itinerary",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 12,
            name: "Arjun Gupta",
            badgeType: "itinerary",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 13,
            name: "Arjun Gupta",
            badgeType: "itinerary",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 14,
            name: "Arjun Gupta",
            badgeType: "itinerary",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 15,
            name: "Arjun Gupta",
            badgeType: "itinerary",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        },
        {
            id: 16,
            name: "Arjun Gupta",
            badgeType: "instalink",
            leadId: "2142608",
            time: "Today at 10:00 AM",
            phone: "1098765432",
            destination: "Rishikesh Rafting | Group",
            packageCode: "#RR17",
            remarks: "confirm availability",
            status: "Hot",
            contacted: "Contacted",
            assignedTo: "Rohit"
        }
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
        <Box className="w-full max-w-[1110px] bg-white p-8 rounded-2xl">
      
          {/* Title */}
          <Text size="8" weight="regular" className="text-gray-900 mb-6">
            All Leads
          </Text>
      
          {/* Statistics Cards */}
          <Flex gap="4" mb="4" style={{
            marginTop: "20px",
          }}>
      
            {/* Overall Leads Captured */}
            <Box style={{
                border: "1px solid #e5e7eb",
                width: "330px",
                height: "90px",
                borderRadius : "10px",
                display : "flex",
                textAlign : "center",
              }}
            >
              <Flex direction="column" justify="center" >
                <Text size="2" style={ {
                    marginLeft : "10px",
                    color : "gray"
                }} >
                  Overall Leads Captured
                </Text>

                <Text size="6" style={{
                    marginRight : "115px",
                    fontSize : "20px",
                }}>
                  {totalLeads.toLocaleString()}
                </Text>
              </Flex>
            </Box>
      
            {/* Today's Leads */}
            <Box style={{
                border: "1px solid #e5e7eb",
                width: "330px",
                height: "90px",
                borderRadius : "10px",
                display : "flex",
                textAlign : "center",
              }}
            >
              <Flex direction="column" justify="center" >
                <Text size="2" style={ {
                    marginLeft : "10px",
                    color : "gray"
                }} >
                  Today Leads Captured
                </Text>

                <Text size="6" style={{
                    marginRight : "115px",
                    fontSize : "20px"
                }}>
                  {todayLeads.toLocaleString()}
                </Text>
              </Flex>
            </Box>
      
            {/* Overall Leads Converted */}
            <Box style={{
                border: "1px solid #e5e7eb",
                width: "330px",
                height: "90px",
                borderRadius : "10px",
                display : "flex",
                textAlign : "center",
              }}
            >
              <Flex direction="column" justify="center" >
                <Text size="2" style={ {
                    marginLeft : "10px",
                    color : "gray"
                }} >
                  Overall Leads Converted
                </Text>

                <Text size="6" style={{
                    marginRight : "115px",
                    fontSize : "20px"
                }}>
                  {convertedLeads.toLocaleString()}
                </Text>
              </Flex>
            </Box>
      
          </Flex>

          <Flex >
              <TextField.Root placeholder='Search...'  style={{
                  width : "600px"
              }} >
                  <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>
              </TextField.Root>

              <Flex style={{
                  marginLeft : "auto"
              }}>
                <Box style={{
                    border: "1px solid #e5e7eb",
                    borderRadius : "5px",
                    paddingLeft : "10px",
                    paddingRight : "10px",
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center",
                    marginLeft : "15px",
                    width : "120px",
                    height : "33px",
                    cursor : "pointer"
                }}>
                Actions
                </Box>
                <Box style={{
                    border: "1px solid #e5e7eb",
                    borderRadius : "5px",
                    paddingLeft : "10px",
                    paddingRight : "10px",
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center",
                    marginLeft : "15px",
                    width : "120px",
                    height : "33px",
                    cursor : "pointer"
                }}>
                Refresh
                </Box>
              </Flex>
          </Flex>

          <Flex style={{
              marginTop : "15px",
              gap : "20px"
          }}>
              <Box style={{
                  border : "1px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "60px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "5px",
                  paddingBottom : "5px",
                  cursor : "pointer",
                  height : "35px"
              }}>All</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "60px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>Hot</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "80px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>Warm</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "80px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>Cold</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "120px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>Remainder</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "120px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>InstaLink</Box>

              <Box style={{
                  border : "2px solid #e5e7eb",
                  borderRadius : "5px",
                  width : "120px",
                  display : "flex",
                  justifyContent : 'center',
                  alignItems : "center",
                  paddingTop : "10px",
                  paddingBottom : "10px",
                  cursor : "pointer",
                  height : "35px"
              }}>Archive</Box>

              <Flex style={{
                  display : "flex",
                  justifyContent : "end",
                  alignItems : "end",
                  marginLeft : "auto",
                  marginRight : "5px"
              }}>
                  <Text style={{
                      fontSize : "14px"
                  }}>
                      Showing <span style={{fontWeight : "bold"}}>{startIndex + 1}</span> to <span style={{fontWeight : "bold"}}>{Math.min(endIndex, totalItems)}</span> of <span style={{fontWeight : "bold"}}>{totalItems}</span> lead(s)
                  </Text>
              </Flex>
          </Flex>

          <Flex style={{
              display : "flex",
              flexDirection : "column",
              marginTop : "20px",
              height : "100%",
              width : "100%",
              border :"2px solid #e5e7eb",
              paddingTop : "10px",
              borderRadius : "5px"
          }}>
              {/* Table Header */}
              <Flex style={{
                  display : "flex",
                  paddingBottom: "10px",
                  borderBottom: "2px solid #e5e7eb",
                  paddingLeft: "10px"
              }}>
                  {/* S.No Header - 80px */}
                  <Box style={{ width: "80px", display: "flex", alignItems: "center" }}>
                    <Checkbox style={{ marginRight: "10px" }}/>
                    <Text style={{fontSize : "14px"}}>S.No.</Text>
                  </Box>

                  {/* Lead Details Header - 200px */}
                  <Box style={{ width: "200px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Lead Details</Text>
                  </Box>

                  {/* Enquiry Details Header - 250px */}
                  <Box style={{ width: "250px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Enquiry Details</Text>
                  </Box>

                  {/* Remarks Header - 200px */}
                  <Box style={{ width: "200px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Remarks & Reminders</Text>
                  </Box>

                  {/* Quick Actions Header - 150px */}
                  <Box style={{ width: "150px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Quick Actions</Text>
                  </Box>

                  {/* Assigned To Header - 150px */}
                  <Box style={{ width: "150px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Assigned To</Text>
                  </Box>

                  {/* Actions Header - 120px */}
                  <Box style={{ width: "120px", paddingLeft: "20px" }}>
                    <Text style={{fontSize : "14px"}}>Actions</Text>
                  </Box>
              </Flex>

              {/* Table Body - Loop through CURRENT PAGE leads data */}
              {currentLeads.map((lead, index) => (
                <Flex key={lead.id} style={{
                    marginTop : "10px",
                    borderBottom: index < currentLeads.length - 1 ? "1px solid #e5e7eb" : "none",
                    paddingBottom: "10px"
                }}>
                    <Box style={{ 
                        width : "100%",
                        display : "flex",
                        flexDirection : "row",
                        paddingLeft: "10px",
                        minHeight: "120px"
                    }}>
                        {/* S.No Column - Show actual position */}
                        <Box style={{
                            width: "80px",
                            display : "flex",
                            flexDirection : "row",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px"
                        }}>
                            <Checkbox style={{
                                marginTop : "3px",
                                cursor : "pointer"
                            }} size="2"/>
                            <Text style={{
                                paddingLeft : "2px"
                            }}>{startIndex + index + 1}</Text>
                        </Box>

                        {/* Lead Details Column - 200px */}
                        <Box style={{
                            width: "200px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <Text style={{ fontWeight :"bold" , textDecoration : "underline"}}>
                                {lead.name}
                            </Text>
                            <Text>
                                ID : {lead.leadId}
                            </Text>

                            {lead.badgeType === "instalink" ? (
                                 <Box style={{
                                width : "60px",
                                height : "30px",
                                borderRadius : "12px",
                                backgroundColor : "#f678a7",
                                display : "flex",
                                justifyContent : "center",
                                alignItems : "center",
                                color : "black",
                                fontSize : "13px"
                            }}>
                            Instalink
                            </Box>
                            ) : (
                                 <Box style={{
                                width : "60px",
                                height : "30px",
                                borderRadius : "12px",
                                backgroundColor : "	#5588ff",
                                display : "flex",
                                justifyContent : "center",
                                alignItems : "center",
                                color : "white",
                                fontSize : "13px"
                            }}>
                            Itinerary
                            </Box>
                            )}

                           

                           

                            <Text>
                                {lead.time}
                            </Text>
                        </Box>

                        {/* Enquiry Details Column - 250px */}
                        <Box style={{
                            width: "250px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <Text>
                                {lead.phone} | <span><WhatsAppIcon/></span> <span> <PhoneIcon/> </span>
                            </Text>
                            <Text>
                                {lead.destination}
                            </Text>
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <MessageIcon/>
                                <Text style={{
                                    marginLeft : "6px"
                                }}>
                                    {lead.packageCode}
                                </Text>
                            </span>
                        </Box>

                        {/* Remarks Column - 200px */}
                        <Box style={{
                            width: "200px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <Text>
                                Remarks
                            </Text>
                            <Text>
                                {lead.remarks}
                            </Text>
                            <span style={{cursor : "pointer", display: "flex", alignItems: "center"}}> 
                                <AddIcon/> 
                                <Text style={{ 
                                    textDecoration : "underline" , 
                                    fontSize : "13px"
                                }}>
                                    Add Remark
                                </Text> 
                            </span>
                        </Box>

                        {/* Quick Actions Column - 150px */}
                        <Box style={{
                            width: "150px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <select id={`status-${lead.id}`} style={{
                                width : "120px",
                                height : "35px",
                                border : "2px solid #e5e7eb",
                                borderRadius : "5px",
                            }}>
                                <option value="Hot" selected={lead.status === "Hot"}>Hot</option>
                                <option value="Warm" selected={lead.status === "Warm"}>Warm</option>
                                <option value="Cold" selected={lead.status === "Cold"}>Cold</option>
                            </select>
                            <select id={`contact-${lead.id}`} style={{
                                width : "120px",
                                height : "35px",
                                border : "2px solid #e5e7eb",
                                borderRadius : "5px",
                            }}>
                                <option value="Contacted" selected={lead.contacted === "Contacted"}>Contacted</option>
                                <option value="Not Contacted" selected={lead.contacted === "Not Contacted"}>Not Contacted</option>
                            </select>
                            <Text style={{
                                fontWeight : "bold",
                                fontSize : "12px",
                                cursor : "pointer"
                            }}>More</Text>
                        </Box>

                        {/* Assigned To Column - 150px */}
                        <Box style={{
                            width: "150px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <select id={`assign-${lead.id}`} style={{
                                width : "120px",
                                height : "35px",
                                border : "2px solid #e5e7eb",
                                borderRadius : "5px",
                            }}>
                                <option value="Rohit" selected={lead.assignedTo === "Rohit"}>Rohit</option>
                                <option value="Shivam" selected={lead.assignedTo === "Shivam"}>Shivam</option>
                                <option value="Sonia" selected={lead.assignedTo === "Sonia"}>Sonia</option>
                            </select>
                        </Box>

                        {/* Actions Column - 120px */}
                        <Box style={{
                            width: "120px",
                            display : "flex",
                            flexDirection : "column",
                            justifyContent : "flex-start",
                            alignItems : "flex-start",
                            gap : "5px",
                            fontSize : "15px",
                            paddingTop :"10px",
                            paddingLeft: "20px"
                        }}>
                            <Box style={{
                                backgroundColor : "black",
                                width : "100px",
                                height : "35px",
                                border : "2px solid #e5e7eb",
                                borderRadius : "5px",
                                color :"white",
                                display : "flex",
                                justifyContent : "center",
                                alignItems :"center",
                                cursor: "pointer"
                            }}> 
                                <Text style={{
                                    color : "white",
                                    textAlign : "center",
                                }}>Actions</Text> 
                            </Box>
                        </Box>
                    </Box>
                </Flex>
              ))}
          </Flex>

          {/* Pagination */}
          <Flex style={{
              marginTop: "20px",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderTop: "2px solid #e5e7eb"
          }}>
              {/* Left side - Items per page */}
              <Flex style={{ alignItems: "center", gap: "10px" }}>
                  <Text style={{ fontSize: "14px", color: "#6b7280" }}>Rows per page:</Text>
                  <select 
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      style={{
                          width: "80px",
                          height: "35px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "5px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "14px"
                      }}
                  >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                  </select>
              </Flex>

              {/* Center - Page info */}
              <Text style={{ fontSize: "14px", color: "#6b7280" }}>
                  Page <span style={{ fontWeight: "bold", color: "#000" }}>{currentPage}</span> of <span style={{ fontWeight: "bold", color: "#000" }}>{totalPages}</span>
              </Text>

              {/* Right side - Navigation buttons */}
              <Flex style={{ gap: "8px", alignItems: "center" }}>
                  {/* Previous button */}
                  <Box 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      style={{
                          width: "35px",
                          height: "35px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          opacity: currentPage === 1 ? 0.5 : 1,
                          backgroundColor: "white",
                          transition: "all 0.2s"
                      }}
                  >
                      <ChevronLeftIcon width="18" height="18" />
                  </Box>

                  {/* Dynamic page numbers - show max 5 pages */}
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
                          <Box
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              style={{
                                  width: "35px",
                                  height: "35px",
                                  border: "2px solid #e5e7eb",
                                  borderRadius: "5px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  backgroundColor: currentPage === pageNum ? "#000" : "#fff",
                                  color: currentPage === pageNum ? "#fff" : "#000",
                                  fontWeight: currentPage === pageNum ? "bold" : "normal",
                                  fontSize: "14px",
                                  transition: "all 0.2s"
                              }}
                          >
                              {pageNum}
                          </Box>
                      );
                  })}

                  {/* Next button */}
                  <Box 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      style={{
                          width: "35px",
                          height: "35px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                          opacity: currentPage === totalPages ? 0.5 : 1,
                          backgroundColor: "white",
                          transition: "all 0.2s"
                      }}
                  >
                      <ChevronRightIcon width="18" height="18" />
                  </Box>
              </Flex>
          </Flex>

        </Box>
      )
}

export default Leads