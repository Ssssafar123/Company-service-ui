import React, { useState } from 'react'
import { Box, Flex, Text, TextField , Badge , Checkbox } from '@radix-ui/themes';
import {MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Table from '../../components/dynamicComponents/Table';
const Leads: React.FC = () => {
	// Dummy data for statistics
	const totalLeads = 10
	const todayLeads = 2
	const convertedLeads = 1

	
	
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
    }}  // ← FIXED: Removed extra closing brace
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
    <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.4zm-8.475 18.298c-1.778 0-3.524-.477-5.042-1.377l-.362-.214-3.754.982.999-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.993c-.002 5.45-4.436 9.884-9.864 9.884z" fill="#25D366"/>
  </svg>  
);



const PhoneIcon = () => (
  <svg 
    width="14"    // ← Reduced from 20
    height="14"   // ← Reduced from 20
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
        display: "inline-block", 
        verticalAlign: "middle",
        marginLeft: "4px"  // ← Add spacing from text
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
			Leads
		  </Text>
	  
		  {/* Statistics Cards */}
		  <Flex gap="4" mb="4" style={{
			marginTop: "20px",
			
		  }}>
	  
			{/* Overall Leads Captured */}
			<Box
			  
			  style={{
				border: "2px solid #e5e7eb",
				width: "390px",
				height: "100px",
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
				<Box
			  
			  style={{
				border: "2px solid #e5e7eb",
				width: "390px",
				height: "100px",
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
				<Box
			  
			  style={{
				border: "2px solid #e5e7eb",
				width: "390px",
				height: "100px",
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
					fontSize : "20px"
				}}>
				  {convertedLeads.toLocaleString()}
				</Text>

			  </Flex>
			</Box>
	  
		  </Flex>

				<Flex >
					<TextField.Root placeholder='Search...'  style={{
						width : "800px"
					}} >
						<TextField.Slot>
							<MagnifyingGlassIcon height="16" width="16" />
						</TextField.Slot>
					</TextField.Root>

					<Flex style={{
						marginLeft : "auto"
					}}>

					<Box style={{
						border: "2px solid #e5e7eb",
						borderRadius : "5px",
						paddingLeft : "10px",
						paddingRight : "10px",
						display : "flex",
						alignItems : "center",
						justifyContent : "center",
						marginLeft : "15px",
						width : "140px",
						height : "36px",
						cursor : "pointer"
					}}>
					Actions
					</Box>
					<Box style={{
						border: "2px solid #e5e7eb",
						borderRadius : "5px",
						paddingLeft : "10px",
						paddingRight : "10px",
						display : "flex",
						alignItems : "center",
						justifyContent : "center",
						marginLeft : "15px",
						width : "140px",
						height : "36px",
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
							border : "2px solid #e5e7eb",
							borderRadius : "5px",
							width : "60px",
							display : "flex",
							justifyContent : 'center',
							alignItems : "center",
							paddingTop : "5px",
							paddingBottom : "5px",
							cursor : "pointer",
							height : "35px"
						}}
						
						>All</Box>


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
						}}
						
						>Hot</Box>
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
						}}
						
						>Warm</Box>
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
						}}
						
						>Cold</Box>
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
						}}
						
						>Remainder</Box>
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
						}}
						
						>InstaLink</Box>

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
								Showing  <span style={{fontWeight : "bold"}}>10</span>  lead(s) out of <span style={{fontWeight : "bold"}}>100</span>
							</Text>
						</Flex>
					</Flex>


					<Flex style={ {
						display : "flex",
						flexDirection : "column",
						marginTop : "20px",
						height : "100%",
						width : "100%",
						border :"2px solid #e5e7eb",
						paddingTop : "10px",
						borderRadius : "5px"
					}}>
						<Flex style={ {
							display : "flex",
							gap : "100px"
						}}>

						<Text style={{fontSize : "14px" , paddingLeft : "10px"}}>S.No.</Text>
						<Text style={{fontSize : "14px"}}>Lead Details</Text>
						<Text style={{fontSize : "14px"}}>Enquiry Details</Text>
						<Text style={{fontSize : "14px"}}>Remarks & Reminders</Text>
						<Text style={{fontSize : "14px"}}>Quick Actions</Text>
						<Text style={{fontSize : "14px"}}>Assigned To</Text>
						<Text style={{fontSize : "14px"}}>Actions</Text>
						</Flex>
					<Flex style={{
						marginTop : "10px"
					}} >

						<Box style={{ width : "100%",
							border : "2px solid #e5e7eb",
							height : "150px",
							display : "flex",
							flexDirection : "row"

						}}>
							<Box  style={{
								display : "flex",
								flexDirection : "row",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"10px"
							}}>

								<Checkbox  style={{
									marginTop : "3px",
									cursor : "pointer"
								}} size="2"/>
								<Text style={{
									paddingLeft : "2px"
								}} >1</Text>
							</Box>

							<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"80px"
							}}>
								<Text style={{ fontWeight :"bold" , textDecoration : "underline"}}>
								Priyanshu
								</Text>
								<Text>
								ID : 2142599
								</Text>
								<Text>
								Today at 7:15 PM
								</Text>
							</Box>


									<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"80px"
							}}>
								<Text >
								6367710137 | <span><WhatsAppIcon/></span> <span> <PhoneIcon/> </span>
								</Text>
								<Text>
								Manali & Kasol | Group
								</Text>
								<span>
									<MessageIcon/>
								<Text style={{
									marginLeft : "6px"
								}}>
								#MKP02
								</Text>
								</span>
							</Box>

									<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"80px"
							}}>
								<Text >
								Remarks
								</Text>
								<Text>
								interested
								</Text>
								<span style={{cursor : "pointer"}}> <AddIcon/> <Text style={{ textDecoration : "underline" , 
									fontSize : "13px"
								 }}>
								Add Remark
								</Text> </span>
								
							</Box>


								<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"80px"
							}}>
								<select  id="1" style={{
									width : "100px",
									height : "35px",
									border : "2px solid e5e7eb",
									borderRadius : "5px",
								}}>
									<option value="A">Hot</option>
									<option value="B">Warm</option>
									<option value="C">Cold</option>
								</select>
								<select  id="2" style={{
									width : "100px",
									height : "35px",
									border : "2px solid e5e7eb",
									borderRadius : "5px",
								}}>
									<option value="A">Contacted</option>
									<option value="B">Not Contacted</option>
								</select>

									<Text style={{
										fontWeight : "bold",
										fontSize : "12px",
										cursor : "pointer",
										marginLeft : "auto"
									}}>More</Text>
							</Box >

							<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"80px"
							}}>
								<select  id="1" style={{
									width : "100px",
									height : "35px",
									border : "2px solid e5e7eb",
									borderRadius : "5px",
								}}>
									<option value="A">Rohit</option>
									<option value="B">Shivam</option>
									<option value="C">Sonia</option>
								</select>
							</Box>


							<Box style={{
								display : "flex",
								flexDirection : "column",
								justifyContent : "start",
								alignItems : "start",
								gap : "5px",
								fontSize : "15px",
								paddingTop :"30px",
								paddingLeft :"65px",
							}}>
								<Box style={{
									backgroundColor : "black",
									width : "100px",
									height : "35px",
									border : "2px solid e5e7eb",
									borderRadius : "5px",
									color :"white",
									display : "flex",
									justifyContent : "center",
									alignItems :"Center",
								}}> <Text style={
									{
										color : "white",
										textAlign : "center",
									}
								}>Actions</Text> </Box>

							</Box>

						</Box>
					</Flex>
					</Flex>


		</Box>
	  )
}
export default Leads