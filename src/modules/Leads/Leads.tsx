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

				<Flex height="130px">
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
						height : "36px"
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
						height : "36px"
					}}>
					Refresh
					</Box>

						</Flex>
				</Flex>

		</Box>
	  )
}

export default Leads