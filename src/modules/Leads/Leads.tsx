import React from 'react'
import { Box, Flex, Text, TextField  } from '@radix-ui/themes';
import {MagnifyingGlassIcon} from '@radix-ui/react-icons'
const Leads: React.FC = () => {
	// Dummy data for statistics
	const totalLeads = 10
	const todayLeads = 2
	const convertedLeads = 1

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

		</Box>
	  )
}

export default Leads