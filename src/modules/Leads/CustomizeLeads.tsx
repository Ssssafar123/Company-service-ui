import React from 'react'
import { Box, Flex, Text } from '@radix-ui/themes'

const CustomizeLeads: React.FC = () => {
	return (
		<Box style={{ padding: '24px' }}>
			<Text size="8" weight="regular" className="text-gray-900 mb-6">
				Customize Leads
			</Text>
			
			<Box
				style={{
					padding: '24px',
					border: '1px solid var(--accent-6)',
					borderRadius: '8px',
					backgroundColor: 'var(--color-panel)',
				}}
			>
				<Text size="3" style={{ color: 'var(--accent-11)' }}>
					Customize Leads page content goes here...
				</Text>
			</Box>
		</Box>
	)
}

export default CustomizeLeads