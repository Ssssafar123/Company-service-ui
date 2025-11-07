import React from 'react'
import { Box, Text } from '@radix-ui/themes'

const LocalSupport: React.FC = () => {
	return (
		<Box style={{ padding: '24px' }}>
			<Text
				size="7"
				weight="bold"
				style={{
					color: 'var(--accent-12)',
					marginBottom: '24px',
					display: 'block',
				}}
			>
				Local Support
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
					Local Support management content goes here...
				</Text>
			</Box>
		</Box>
	)
}

export default LocalSupport