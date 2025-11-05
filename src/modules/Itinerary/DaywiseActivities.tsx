import React from 'react'
import { Box, Flex, Text, TextField, Button } from '@radix-ui/themes'
import RichTextEditor from '../../components/dynamicComponents/RichTextEditor'
import ImageUpload from '../../components/dynamicComponents/ImageUpload'

export type DayActivity = {
	id: string
	day: number
	title: string
	description: string
	images: (File | string)[]
	meals: {
		name: string
		images: (File | string)[]
	}[]
	stays: {
		name: string
		images: (File | string)[]
	}[]
}

type DaywiseActivitiesProps = {
	activities: DayActivity[]
	onChange: (activities: DayActivity[]) => void
	label?: string
	error?: string
}

// Dummy options for meals and stays
const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'High Tea']
const stayOptions = ['Hotel', 'Resort', 'Camping', 'Homestay', 'Guest House']

const DaywiseActivities: React.FC<DaywiseActivitiesProps> = ({
	activities,
	onChange,
	label,
	error,
}) => {
	const addActivity = () => {
		const newActivity: DayActivity = {
			id: Date.now().toString(),
			day: activities.length + 1,
			title: '',
			description: '',
			images: [''],
			meals: [],
			stays: [],
		}
		onChange([...activities, newActivity])
	}

	const removeActivity = (id: string) => {
		const updated = activities.filter((activity) => activity.id !== id)
		const reordered = updated.map((activity, index) => ({
			...activity,
			day: index + 1,
		}))
		onChange(reordered)
	}

	const updateActivity = (id: string, field: keyof DayActivity, value: any) => {
		const updated = activities.map((activity) =>
			activity.id === id ? { ...activity, [field]: value } : activity
		)
		onChange(updated)
	}

	const toggleMeal = (id: string, mealName: string) => {
		const activity = activities.find((a) => a.id === id)
		if (!activity) return

		const mealIndex = activity.meals.findIndex((m) => m.name === mealName)
		if (mealIndex >= 0) {
			// Remove meal
			const updatedMeals = activity.meals.filter((m) => m.name !== mealName)
			updateActivity(id, 'meals', updatedMeals)
		} else {
			// Add meal with empty images
			const updatedMeals = [...activity.meals, { name: mealName, images: [''] }]
			updateActivity(id, 'meals', updatedMeals)
		}
	}

	const updateMealImages = (id: string, mealName: string, images: (File | string)[]) => {
		const activity = activities.find((a) => a.id === id)
		if (!activity) return

		const updatedMeals = activity.meals.map((meal) =>
			meal.name === mealName ? { ...meal, images } : meal
		)
		updateActivity(id, 'meals', updatedMeals)
	}

	const toggleStay = (id: string, stayName: string) => {
		const activity = activities.find((a) => a.id === id)
		if (!activity) return

		const stayIndex = activity.stays.findIndex((s) => s.name === stayName)
		if (stayIndex >= 0) {
			// Remove stay
			const updatedStays = activity.stays.filter((s) => s.name !== stayName)
			updateActivity(id, 'stays', updatedStays)
		} else {
			// Add stay with empty images
			const updatedStays = [...activity.stays, { name: stayName, images: [''] }]
			updateActivity(id, 'stays', updatedStays)
		}
	}

	const updateStayImages = (id: string, stayName: string, images: (File | string)[]) => {
		const activity = activities.find((a) => a.id === id)
		if (!activity) return

		const updatedStays = activity.stays.map((stay) =>
			stay.name === stayName ? { ...stay, images } : stay
		)
		updateActivity(id, 'stays', updatedStays)
	}

	const moveUp = (index: number) => {
		if (index === 0) return
		const updated = [...activities]
		;[updated[index], updated[index - 1]] = [updated[index - 1], updated[index]]
		const reordered = updated.map((activity, idx) => ({
			...activity,
			day: idx + 1,
		}))
		onChange(reordered)
	}

	const moveDown = (index: number) => {
		if (index === activities.length - 1) return
		const updated = [...activities]
		;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
		const reordered = updated.map((activity, idx) => ({
			...activity,
			day: idx + 1,
		}))
		onChange(reordered)
	}

	return (
		<Box>
			{label && (
				<Flex justify="between" align="center" style={{ marginBottom: '16px' }}>
					<Text size="3" weight="medium" style={{ color: 'var(--accent-12)' }}>
						{label}
					</Text>
					<Button type="button" variant="soft" size="2" onClick={addActivity}>
						+ Add Day
					</Button>
				</Flex>
			)}
			<Flex direction="column" gap="4">
				{activities.length === 0 ? (
					<Box
						style={{
							padding: '24px',
							border: '1px dashed var(--accent-6)',
							borderRadius: '6px',
							textAlign: 'center',
						}}
					>
						<Text size="2" style={{ color: 'var(--accent-11)' }}>
							No activities added yet. Click "Add Day" to start.
						</Text>
					</Box>
				) : (
					activities.map((activity, index) => (
						<Box
							key={activity.id}
							style={{
								border: '1px solid var(--accent-6)',
								borderRadius: '8px',
								padding: '16px',
								backgroundColor: 'var(--color-panel)',
							}}
						>
							<Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
								<Text size="4" weight="bold" style={{ color: 'var(--accent-12)' }}>
									Day {activity.day}
								</Text>
								<Flex gap="2">
									<Button
										type="button"
										variant="ghost"
										size="1"
										disabled={index === 0}
										onClick={() => moveUp(index)}
									>
										↑
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="1"
										disabled={index === activities.length - 1}
										onClick={() => moveDown(index)}
									>
										↓
									</Button>
									<Button
										type="button"
										variant="soft"
										color="red"
										size="1"
										onClick={() => removeActivity(activity.id)}
									>
										Remove
									</Button>
								</Flex>
							</Flex>
							<Flex direction="column" gap="3">
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
									>
										Title
									</Text>
									<TextField.Root
										placeholder="Enter day title"
										value={activity.title}
										onChange={(e) =>
											updateActivity(activity.id, 'title', e.target.value)
										}
									/>
								</Box>
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '4px', display: 'block' }}
									>
										Description
									</Text>
									<RichTextEditor
										value={activity.description || ''}
										onChange={(value) => updateActivity(activity.id, 'description', value)}
										placeholder="Enter day description"
										height="150px"
									/>
								</Box>

								{/* Day Images */}
								<Box>
									<ImageUpload
										images={activity.images || ['']}
										onChange={(images) => updateActivity(activity.id, 'images', images)}
										label="Day Images"
									/>
								</Box>

								{/* Meals Section */}
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
									>
										Meals
									</Text>
									<Flex direction="column" gap="3">
										<Flex gap="2" wrap="wrap">
											{mealOptions.map((meal) => {
												const isSelected = activity.meals.some((m) => m.name === meal)
												return (
													<Button
														key={meal}
														type="button"
														variant={isSelected ? 'solid' : 'soft'}
														size="2"
														onClick={() => toggleMeal(activity.id, meal)}
														style={{
															backgroundColor: isSelected
																? 'var(--accent-9)'
																: 'transparent',
															color: isSelected ? 'white' : 'var(--accent-11)',
														}}
													>
														{meal}
													</Button>
												)
											})}
										</Flex>
										{activity.meals.map((meal) => (
											<Box
												key={meal.name}
												style={{
													border: '1px solid var(--accent-5)',
													borderRadius: '6px',
													padding: '12px',
													backgroundColor: 'var(--accent-2)',
												}}
											>
												<Text
													size="2"
													weight="medium"
													style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
												>
													{meal.name} Images
												</Text>
												<ImageUpload
													images={meal.images || ['']}
													onChange={(images) =>
														updateMealImages(activity.id, meal.name, images)
													}
												/>
											</Box>
										))}
									</Flex>
								</Box>

								{/* Stays Section */}
								<Box>
									<Text
										size="2"
										weight="medium"
										style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
									>
										Stays
									</Text>
									<Flex direction="column" gap="3">
										<Flex gap="2" wrap="wrap">
											{stayOptions.map((stay) => {
												const isSelected = activity.stays.some((s) => s.name === stay)
												return (
													<Button
														key={stay}
														type="button"
														variant={isSelected ? 'solid' : 'soft'}
														size="2"
														onClick={() => toggleStay(activity.id, stay)}
														style={{
															backgroundColor: isSelected
																? 'var(--accent-9)'
																: 'transparent',
															color: isSelected ? 'white' : 'var(--accent-11)',
														}}
													>
														{stay}
													</Button>
												)
											})}
										</Flex>
										{activity.stays.map((stay) => (
											<Box
												key={stay.name}
												style={{
													border: '1px solid var(--accent-5)',
													borderRadius: '6px',
													padding: '12px',
													backgroundColor: 'var(--accent-2)',
												}}
											>
												<Text
													size="2"
													weight="medium"
													style={{ color: 'var(--accent-12)', marginBottom: '8px', display: 'block' }}
												>
													{stay.name} Images
												</Text>
												<ImageUpload
													images={stay.images || ['']}
													onChange={(images) =>
														updateStayImages(activity.id, stay.name, images)
													}
												/>
											</Box>
										))}
									</Flex>
								</Box>
							</Flex>
						</Box>
					))
				)}
			</Flex>
			{activities.length > 0 && (
				<Button
					type="button"
					variant="outline"
					size="2"
					style={{ marginTop: '16px' }}
					onClick={addActivity}
				>
					+ Add Another Day
				</Button>
			)}
			{error && (
				<Text size="1" style={{ color: 'var(--red-9)', marginTop: '8px', display: 'block' }}>
					{error}
				</Text>
			)}
		</Box>
	)
}

export default DaywiseActivities