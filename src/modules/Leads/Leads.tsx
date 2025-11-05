import React from 'react'
import { Box, Flex, Text } from '@radix-ui/themes';

const Leads: React.FC = () => {
	// Dummy data for statistics
	const totalLeads = 10
	const todayLeads = 2
	const convertedLeads = 1

	return (
		<Box className="w-full max-w-[1110px] bg-white p-8 rounded-2xl">
	  
		  {/* Title */}
		  <Text size="8" weight="medium" className="text-gray-900 mb-6">
			Leads
		  </Text>
	  
		  {/* Statistics Cards */}
		  <Flex gap="4" mb="4" className="h-[120px]">
	  
			{/* Overall Leads Captured */}
			<Box
			  className="bg-white rounded-xl shadow-sm p-6 flex items-center"
			  style={{
				border: "1px solid #e5e7eb",
				width: "330px",
				height: "100px"
			  }}
			>
			  <Flex direction="column" justify="center">
				<Text size="2" className="text-gray-500 mb-1">
				  Overall Leads Captured
				</Text>
				<Text size="6" className="text-gray-800 font-semibold">
				  {totalLeads.toLocaleString()}
				</Text>
			  </Flex>
			</Box>
	  
			{/* Today's Leads */}
			<Box
			  className="bg-white rounded-xl shadow-sm p-6 flex items-center"
			  style={{
				border: "1px solid #e5e7eb",
				width: "330px",
				height: "100px"
			  }}
			>
			  <Flex direction="column" justify="center">
				<Text size="2" className="text-gray-500 mb-1">
				  Today's Leads
				</Text>
				<Text size="6" className="text-gray-800 font-semibold">
				  {todayLeads}
				</Text>
			  </Flex>
			</Box>
	  
			{/* Overall Leads Converted */}
			<Box
			  className="bg-white rounded-xl shadow-sm p-6 flex items-center"
			  style={{
				border: "1px solid #e5e7eb",
				width: "330px",
				height: "100px"
			  }}
			>
			  <Flex direction="column" justify="center">
				<Text size="2" className="text-gray-500 mb-1">
				  Overall Leads Converted
				</Text>
				<Text size="6" className="text-gray-800 font-semibold">
				  {convertedLeads}
				</Text>
			  </Flex>
			</Box>
	  
		  </Flex>
		</Box>
	  )
}

export default Leads