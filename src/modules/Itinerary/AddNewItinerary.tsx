import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createItinerary, updateItineraryById } from '../../features/ItinerarySlice'
import { Box, Text, Separator, Flex, Button, AlertDialog } from '@radix-ui/themes'
import DynamicForm from '../../components/dynamicComponents/Form'
import type {AppDispatch , RootState} from '../../store'
import {useSelector }from 'react-redux'
import {fetchCategories, updateCategoryById, fetchCategoryById} from '../../features/CategorySlice'
import {fetchLocations, updateLocationById, fetchLocationById} from '../../features/LocationSlice'

// Dummy data removed - using Redux state instead

const AddNewItinerary: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const [initialValues, setInitialValues] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
	const dispatch = useDispatch<AppDispatch>()
	const locations = useSelector((state : RootState) => state.location.locations)
	const categories = useSelector((state : RootState) => state.category.categories)
    // Add dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogConfig, setDialogConfig] = useState<{
        title: string
        description: string
        actionText: string
        color?: 'red' | 'blue' | 'green' | 'gray'
        onConfirm: () => void 
    } | null>(null)

    // Helper function to find location ID by city name from Redux state
    const findLocationIdByCity = (cityName: string): string => {
        const location = locations.find(
            loc => loc.name.toLowerCase() === cityName.toLowerCase()
        )
        return location?.id || ''
    }

	useEffect(() => {
		dispatch(fetchCategories())
		dispatch(fetchLocations())
	}, [dispatch])

    // Check if we're in edit mode based on location state
    useEffect(() => {
        const itineraryData = location.state?.itineraryData
        if (itineraryData) {
            try {
                setIsEditMode(true)
                setEditingId(itineraryData.id || null)
                
                // Safely map itinerary data to form initial values with proper null checks
                // Map categories - handle both populated objects and IDs, ensure they're strings
                const mappedCategories = Array.isArray(itineraryData.categories) 
                    ? itineraryData.categories.map((cat: any) => {
                        if (typeof cat === 'object' && cat !== null) {
                            return String(cat._id || cat.id || '');
                        }
                        return String(cat || '');
                      }).filter((id: string) => id && id !== '')
                    : []
                
                const mappedValues: any = {
                    iti_name: itineraryData.name || '',
                    travel_location: findLocationIdByCity(itineraryData.city || '') || '',
                    categories: mappedCategories,
                    iti_desc: itineraryData.description || '',
                    iti_short_desc: (itineraryData as any).shortDescription || (itineraryData as any).short_description || '',
                    iti_duration: itineraryData.duration || '',
                    price: typeof itineraryData.price === 'number' ? itineraryData.price : 0,
                    start_date: (() => {
                        const date = itineraryData.startDate || (itineraryData as any).start_date;
                        if (!date) return '';
                        if (typeof date === 'string') {
                            // Handle ISO format: "2024-01-15T00:00:00.000Z" or "2024-01-15"
                            if (date.includes('T')) {
                                return date.split('T')[0];
                            }
                            // Handle date string: "2024-01-15 00:00:00"
                            if (date.includes(' ')) {
                                return date.split(' ')[0];
                            }
                            // Already in YYYY-MM-DD format
                            return date;
                        }
                        return '';
                    })(),
                    end_date: (() => {
                        const date = itineraryData.endDate || (itineraryData as any).end_date;
                        if (!date) return '';
                        if (typeof date === 'string') {
                            // Handle ISO format: "2024-01-15T00:00:00.000Z" or "2024-01-15"
                            if (date.includes('T')) {
                                return date.split('T')[0];
                            }
                            // Handle date string: "2024-01-15 00:00:00"
                            if (date.includes(' ')) {
                                return date.split(' ')[0];
                            }
                            // Already in YYYY-MM-DD format
                            return date;
                        }
                        return '';
                    })(),
                    max_travelers: typeof itineraryData.maxTravelers === 'number' ? itineraryData.maxTravelers : 0,
                    available_seats: typeof itineraryData.availableSeats === 'number' ? itineraryData.availableSeats : 0,
                    iti_inclusion: Array.isArray(itineraryData.inclusions) 
                        ? itineraryData.inclusions.join('\n') 
                        : (typeof itineraryData.inclusions === 'string' ? itineraryData.inclusions : ''),
                    iti_exclusion: Array.isArray(itineraryData.exclusions) 
                        ? itineraryData.exclusions.join('\n') 
                        : (typeof itineraryData.exclusions === 'string' ? itineraryData.exclusions : ''),
                    iti_notes: (itineraryData as any).notes || '',
                    status: (itineraryData.status === 'active' || itineraryData.status === 'Active') ? 'Active' : 'Inactive',
                    iti_img: (() => {
                        // ImageUpload expects an array, so ensure we always return an array
                        if (Array.isArray((itineraryData as any).images) && (itineraryData as any).images.length > 0) {
                            return (itineraryData as any).images;
                        }
                        const singleImage = (itineraryData as any).brochureBanner 
                            || (itineraryData as any).brochure_banner 
                            || itineraryData.imageUrl 
                            || '';
                        return singleImage ? [singleImage] : [''];
                    })(),
                    iti_altitude: (itineraryData as any).altitude || '',
                    iti_scenary: (itineraryData as any).scenary || '',
                    iti_cultural_site: (itineraryData as any).culturalSite || (itineraryData as any).cultural_site || '',
                    iti_brochure_banner: (itineraryData as any).brochureBanner || (itineraryData as any).brochure_banner || '',
                    iti_is_customize: (itineraryData as any).isCustomize || (itineraryData as any).is_customize || 'not_specified',
                    trending: itineraryData.trending || 'No',
                    // Map complex fields - safely handle undefined
                    day_details: (() => {
                        const daywiseData = (itineraryData as any).daywiseActivities 
                            || (itineraryData as any).daywise_activities 
                            || [];
                        
                        if (!Array.isArray(daywiseData)) return [];
                        
                        return daywiseData.map((activity: any, index: number) => ({
                            id: activity.id || activity._id || `day-${index}`,
                            day: activity.day || index + 1,
                            title: activity.title || '',
                            description: activity.description || '',
                            images: Array.isArray(activity.images) ? activity.images : (activity.images ? [activity.images] : ['']),
                            meals: Array.isArray(activity.meals) 
                                ? activity.meals.map((meal: any) => ({
                                    name: typeof meal === 'string' ? meal : (meal.name || ''),
                                    images: Array.isArray(meal?.images) ? meal.images : (meal?.images ? [meal.images] : ['']),
                                }))
                                : [],
                            stays: Array.isArray(activity.stays) 
                                ? activity.stays.map((stay: any) => ({
                                    name: typeof stay === 'string' ? stay : (stay.name || ''),
                                    images: Array.isArray(stay?.images) ? stay.images : (stay?.images ? [stay.images] : ['']),
                                }))
                                : (activity.accommodation ? [{
                                    name: activity.accommodation,
                                    images: [''],
                                }] : []),
                            activities: activity.activities || [],
                        }));
                    })(),
                    hotels: (() => {
                        const hotelData = (itineraryData as any).hotelDetails 
                            || (itineraryData as any).hotel_details 
                            || [];
                        
                        if (!Array.isArray(hotelData)) return [];
                        
                        return hotelData.map((hotel: any, index: number) => ({
                            id: hotel.id || hotel._id || `hotel-${index}`,
                            name: hotel.hotelName || hotel.name || '',
                            stars: hotel.stars ? String(hotel.stars) : '',
                            reference: hotel.reference || '',
                            images: Array.isArray(hotel.images) ? hotel.images : (hotel.images ? [hotel.images] : ['']),
                        }));
                    })(),
                    package_details: (() => {
                        const pkgData = (itineraryData as any).packages 
                            || (itineraryData as any).package_details 
                            || {};
                        
                        return {
                            base_packages: Array.isArray(pkgData.basePackages) 
                                ? pkgData.basePackages.map((pkg: any) => ({
                                    type: pkg.name || pkg.packageType || '',
                                    original_price: pkg.original_price || pkg.originalPrice || 0,
                                    discounted_price: pkg.price || pkg.discounted_price || 0,
                                }))
                                : (Array.isArray(pkgData.base_packages) 
                                    ? pkgData.base_packages 
                                    : []),
                            pickup_point: Array.isArray(pkgData.pickupPoint) 
                                ? pkgData.pickupPoint.map((point: any) => ({
                                    name: point.name || '',
                                    price: point.price || 0,
                                }))
                                : (Array.isArray(pkgData.pickup_point) 
                                    ? pkgData.pickup_point 
                                    : []),
                            drop_point: Array.isArray(pkgData.dropPoint) 
                                ? pkgData.dropPoint.map((point: any) => ({
                                    name: point.name || '',
                                    price: point.price || 0,
                                }))
                                : (Array.isArray(pkgData.drop_point) 
                                    ? pkgData.drop_point 
                                    : []),
                        };
                    })(),
                    batches: (() => {
                        const batchData = (itineraryData as any).batches || [];
                        if (!Array.isArray(batchData)) return [];
                        
                        return batchData.map((batch: any, index: number) => {
                            // Handle both backend format (startDate/endDate) and form format (start_date/end_date)
                            const startDate = batch.startDate || batch.start_date || '';
                            const endDate = batch.endDate || batch.end_date || '';
                            
                            // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
                            const formatDateTime = (dateStr: string): string => {
                                if (!dateStr) return '';
                                // If it's already in datetime-local format, return as is
                                if (dateStr.includes('T') && dateStr.length > 10) {
                                    return dateStr.substring(0, 16); // YYYY-MM-DDTHH:mm
                                }
                                // If it's just a date, add default time
                                if (dateStr.includes('T')) {
                                    return dateStr.substring(0, 16);
                                }
                                // If it's a date string, convert to datetime-local
                                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                    return `${dateStr}T00:00`;
                                }
                                // Try to parse ISO date
                                try {
                                    const date = new Date(dateStr);
                                    if (!isNaN(date.getTime())) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const hours = String(date.getHours()).padStart(2, '0');
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                                    }
                                } catch (e) {
                                    // Ignore parsing errors
                                }
                                return '';
                            };
                            
                            return {
                                id: batch.id || batch._id || `batch-${index}`,
                                start_date: formatDateTime(startDate),
                                end_date: formatDateTime(endDate),
                                extra_amount: typeof batch.price === 'number' ? batch.price : (typeof batch.extra_amount === 'number' ? batch.extra_amount : 0),
                                extra_amount_reason: batch.extra_reason || batch.extra_amount_reason || '',
                                sold_out: batch.is_sold || batch.sold_out || false,
                            };
                        });
                    })(),
                    seo_fields: (itineraryData as any).seoFields 
                        || (itineraryData as any).seo_fields 
                        || {},
                }
                
                console.log('Mapped Initial Values:', mappedValues) // Debug log
                console.log('Categories:', mappedCategories) // Debug categories
                console.log('Start Date:', mappedValues.start_date, 'End Date:', mappedValues.end_date) // Debug dates
                console.log('Batches:', mappedValues.batches) // Debug batches
                setInitialValues(mappedValues)
            } catch (error) {
                console.error('Error mapping itinerary data:', error)
                // If mapping fails, still set edit mode but with empty values
                setIsEditMode(true)
                setEditingId(itineraryData.id || null)
                setInitialValues({
                    iti_name: itineraryData.name || '',
                    travel_location: findLocationIdByCity(itineraryData.city || '') || '',
                })
            }
			
        } else {
            setIsEditMode(false)
            setEditingId(null)
            setInitialValues({})
        }
    }, [location.state, locations])

    const handleSubmit = async (values: Record<string, any>) => {
		try {
			// Get location name from Redux state
			const selectedLocation = locations.find(loc => loc.id === values.travel_location)
			const cityName = selectedLocation?.name || ''
			
			// Process inclusions and exclusions - handle both string and array
			let processedInclusions: string[] = []
			if (Array.isArray(values.iti_inclusion)) {
				processedInclusions = values.iti_inclusion
			} else if (typeof values.iti_inclusion === 'string') {
				processedInclusions = values.iti_inclusion
					.split('.')
					.map((s: string) => s.trim())
					.filter((s: string) => s.length > 0)
			}
			
			let processedExclusions: string[] = []
			if (Array.isArray(values.iti_exclusion)) {
				processedExclusions = values.iti_exclusion
			} else if (typeof values.iti_exclusion === 'string') {
				processedExclusions = values.iti_exclusion
					.split('.')
					.map((s: string) => s.trim())
					.filter((s: string) => s.length > 0)
			}
			
			// Extract File objects from images - DON'T filter them out!
			let imageFiles: File[] = []
			if (Array.isArray(values.iti_img)) {
				// Filter to get only File objects
				imageFiles = values.iti_img.filter((img: any) => img instanceof File) as File[]
			} else if (values.iti_img instanceof File) {
				imageFiles = [values.iti_img]
			}
			
			// Extract brochure banner File object
			let brochureBannerFile: File | undefined = undefined
			if (values.iti_brochure_banner instanceof File) {
				brochureBannerFile = values.iti_brochure_banner
			}

			// Extract hotel images for FormData
const hotelImageFiles: { hotelIndex: number, imageIndex: number, file: File }[] = []
if (Array.isArray(values.hotels)) {
	values.hotels.forEach((hotel: any, hotelIndex: number) => {
		if (Array.isArray(hotel.images)) {
			hotel.images.forEach((img: any, imageIndex: number) => {
				if (img instanceof File) {
					hotelImageFiles.push({ hotelIndex, imageIndex, file: img })
				}
			})
		}
	})
}

// Extract daywise activity images for FormData
const dayImageFiles: { dayIndex: number, imageIndex: number, file: File }[] = []
const mealImageFiles: { dayIndex: number, mealName: string, imageIndex: number, file: File }[] = []
const stayImageFiles: { dayIndex: number, stayName: string, imageIndex: number, file: File }[] = []

if (Array.isArray(values.day_details)) {
	values.day_details.forEach((activity: any, dayIndex: number) => {
		// Day images
		if (Array.isArray(activity.images)) {
			activity.images.forEach((img: any, imageIndex: number) => {
				if (img instanceof File) {
					dayImageFiles.push({ dayIndex, imageIndex, file: img })
				}
			})
		}
		
		// Meal images
		if (Array.isArray(activity.meals)) {
			activity.meals.forEach((meal: any) => {
				if (Array.isArray(meal.images)) {
					meal.images.forEach((img: any, imageIndex: number) => {
						if (img instanceof File) {
							mealImageFiles.push({ dayIndex, mealName: meal.name, imageIndex, file: img })
						}
					})
				}
			})
		}
		
		// Stay images
		if (Array.isArray(activity.stays)) {
			activity.stays.forEach((stay: any) => {
				if (Array.isArray(stay.images)) {
					stay.images.forEach((img: any, imageIndex: number) => {
						if (img instanceof File) {
							stayImageFiles.push({ dayIndex, stayName: stay.name, imageIndex, file: img })
						}
					})
				}
			})
		}
	})
}
			// Process categories - ensure it's an array of IDs
			let processedCategories: string[] = []
			if (Array.isArray(values.categories)) {
				processedCategories = values.categories.filter((cat: any) => cat && cat !== '')
			} else if (values.categories) {
				processedCategories = [values.categories]
			}
			
			// Process packages structure to match backend schema
			const processedPackages = values.package_details ? {
				basePackages: Array.isArray(values.package_details.base_packages) 
					? values.package_details.base_packages.map((pkg: any) => {
						const { id, ...pkgData } = pkg // Remove temporary id
						return {
							packageType: 'base', // REQUIRED by backend
							name: pkgData.type || '', // Map type to name
							price: pkgData.discounted_price || 0,
							original_price: pkgData.original_price || 0,
							inclusions: [],
							exclusions: [],
						}
					})
					: [],
				pickupPoint: Array.isArray(values.package_details.pickup_point) 
					? values.package_details.pickup_point.map((point: any) => {
						const { id, ...pointData } = point // Remove temporary id
						return {
							packageType: 'pickup', // REQUIRED by backend
							name: pointData.name || '',
							price: pointData.price || 0,
						}
					})
					: [],
				dropPoint: Array.isArray(values.package_details.drop_point) 
					? values.package_details.drop_point.map((point: any) => {
						const { id, ...pointData } = point // Remove temporary id
						return {
							packageType: 'drop', // REQUIRED by backend
							name: pointData.name || '',
							price: pointData.price || 0,
						}
					})
					: [],
			} : {
				basePackages: [],
				pickupPoint: [],
				dropPoint: [],
			}
			
			// Map form values to match backend schema
			const payload: any = {
				name: values.iti_name || '',
				city: cityName,
				description: values.iti_desc || '',
				shortDescription: values.iti_short_desc || '',
				duration: values.iti_duration || '',
				price: Number(values.price) || 0,
				status: (values.status === 'Active' || values.status === 'active' || !values.status ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
				trending: values.trending === 'Yes' ? 'Yes' : 'No',
				// Only include travelLocation if it's a valid ObjectId string, not null or empty
				...(values.travel_location && values.travel_location !== 'null' && values.travel_location !== '' && { travelLocation: values.travel_location }),
				categories: processedCategories,
				// Don't include images or brochureBanner in payload - they'll be sent as files
				altitude: values.iti_altitude || '',
				scenary: values.iti_scenary || '',
				culturalSite: values.iti_cultural_site || '',
				isCustomize: values.iti_is_customize || 'not_specified',
				notes: values.iti_notes || '',
				daywiseActivities: Array.isArray(values.day_details) 
	            ? values.day_details.map((activity: any) => {
		        const { id, ...activityData } = activity // Remove temporary id
		
		        const meals = Array.isArray(activityData.meals)
		        	? activityData.meals
				.filter((meal: any) => meal && meal.name)
				.map((meal: any) => meal.name)
			    : []
		
		         const activities = Array.isArray(activityData.activities)
			    ? activityData.activities.filter((act: any) => typeof act === 'string' && act.trim() !== '')
			    : []
		
		        const accommodation = activityData.accommodation || 
		     	(Array.isArray(activityData.stays) && activityData.stays.length > 0 
				? activityData.stays[0].name 
				: '')
		
		       return {
	           day: activityData.day || 0,
			   title: activityData.title || '',
			   description: activityData.description || '',
			   activities: activities,
			   meals: meals,
			   accommodation: accommodation,
		    }
	         })
	         : [],
			 hotelDetails: Array.isArray(values.hotels) 
			 ? values.hotels.map((hotel: any) => {
				 const { id, ...hotelData } = hotel 
				 return {
					 hotelName: hotelData.name || '',
					 stars: hotelData.stars || '',
					 reference: hotelData.reference || '',
					 checkIn: '',
					 checkOut: '',
					 nights: 0,
				 }
			 })
			 : [],
				packages: processedPackages,
				batches: Array.isArray(values.batches) 
	         ? values.batches.map((batch: any) => {
	      	const { id, ...batchData } = batch // Remove temporary id
		    return {
			batchName: '',
			startDate: batchData.start_date || null,
			endDate: batchData.end_date || null,
			price: batchData.extra_amount || 0,
			availableSeats: 0,
			bookedSeats: 0,
	    }
	       })
	      : [],
				seoFields: values.seo_fields || {},
				inclusions: processedInclusions,
				exclusions: processedExclusions,
				termsAndConditions: values.termsAndConditions || '',
				cancellationPolicy: values.cancellationPolicy || '',
				startDate: values.start_date || new Date().toISOString(),
				endDate: values.end_date || new Date().toISOString(),
			}
	
			if (isEditMode && editingId) {
	        // Update existing itinerary - pass files separately
	        await dispatch(updateItineraryById({ 
		    id: editingId, 
		    data: payload,
		    imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
		    brochureBannerFile: brochureBannerFile,
		    hotelImageFiles: hotelImageFiles.length > 0 ? hotelImageFiles : undefined,
		    dayImageFiles: dayImageFiles.length > 0 ? dayImageFiles : undefined,
		    mealImageFiles: mealImageFiles.length > 0 ? mealImageFiles : undefined,
		    stayImageFiles: stayImageFiles.length > 0 ? stayImageFiles : undefined
				})).unwrap()
				
				// Get old itinerary data to check for changes
				const oldItineraryData = location.state?.itineraryData;
				const oldCategories = oldItineraryData?.categories || [];
				const oldLocationId = oldItineraryData?.travelLocation || null;
				
				// Update categories - remove from old ones, add to new ones
				const oldCategoryIds = Array.isArray(oldCategories) 
					? oldCategories.map((cat: any) => typeof cat === 'object' && cat !== null ? (cat._id || cat.id) : cat).filter(Boolean)
					: [];
				const newCategoryIds = processedCategories;
				
				// Remove itinerary from categories that are no longer selected
				const removedCategories = oldCategoryIds.filter((id: string) => !newCategoryIds.includes(id));
				for (const categoryId of removedCategories) {
					try {
						const category = await dispatch(fetchCategoryById(categoryId)).unwrap();
						const updatedItineraries = (category.itineraries || []).filter((id: string) => id !== editingId);
						await dispatch(updateCategoryById({
							id: categoryId,
							data: { itineraries: updatedItineraries }
						})).unwrap();
					} catch (error) {
						console.error(`Error updating category ${categoryId}:`, error);
					}
				}
				
				// Add itinerary to new categories
				const addedCategories = newCategoryIds.filter((id: string) => !oldCategoryIds.includes(id));
				for (const categoryId of addedCategories) {
					try {
						const category = await dispatch(fetchCategoryById(categoryId)).unwrap();
						const currentItineraries = category.itineraries || [];
						if (!currentItineraries.includes(editingId)) {
							await dispatch(updateCategoryById({
								id: categoryId,
								data: { itineraries: [...currentItineraries, editingId] }
							})).unwrap();
						}
					} catch (error) {
						console.error(`Error updating category ${categoryId}:`, error);
					}
				}
				
				// Update location if it changed
				const newLocationId = values.travel_location && values.travel_location !== 'null' && values.travel_location !== '' 
					? values.travel_location 
					: null;
				
				if (oldLocationId !== newLocationId) {
					// Remove from old location
					if (oldLocationId) {
						try {
							const oldLocation = await dispatch(fetchLocationById(oldLocationId)).unwrap();
							const updatedItineraries = (oldLocation.itineraries || []).filter((id: string) => id !== editingId);
							await dispatch(updateLocationById({
								id: oldLocationId,
								data: { itineraries: updatedItineraries }
							})).unwrap();
						} catch (error) {
							console.error(`Error updating old location ${oldLocationId}:`, error);
						}
					}
					
					// Add to new location
					if (newLocationId) {
						try {
							const newLocation = await dispatch(fetchLocationById(newLocationId)).unwrap();
							const currentItineraries = newLocation.itineraries || [];
							if (!currentItineraries.includes(editingId)) {
								await dispatch(updateLocationById({
									id: newLocationId,
									data: { itineraries: [...currentItineraries, editingId] }
								})).unwrap();
							}
						} catch (error) {
							console.error(`Error updating new location ${newLocationId}:`, error);
						}
					}
				}
				
				// Refresh categories and locations to show updated trip counts
				dispatch(fetchCategories());
				dispatch(fetchLocations());
				
				setDialogConfig({
					title: 'Success',
					description: 'Itinerary updated successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => {
						setDialogOpen(false)
						navigate('/dashboard/itinerary')
					},
				})
				setDialogOpen(true)
				
			} else {
	// Create new itinerary - pass files separately
	const newItinerary = await dispatch(createItinerary({ 
		payload: payload,
		imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
		brochureBannerFile: brochureBannerFile,
		hotelImageFiles: hotelImageFiles.length > 0 ? hotelImageFiles : undefined,
		dayImageFiles: dayImageFiles.length > 0 ? dayImageFiles : undefined,
		mealImageFiles: mealImageFiles.length > 0 ? mealImageFiles : undefined,
		stayImageFiles: stayImageFiles.length > 0 ? stayImageFiles : undefined
				})).unwrap()
				
				const newItineraryId = newItinerary.id;
				
				// Update categories - add itinerary ID to each selected category
				for (const categoryId of processedCategories) {
					try {
						const category = await dispatch(fetchCategoryById(categoryId)).unwrap();
						const currentItineraries = category.itineraries || [];
						if (!currentItineraries.includes(newItineraryId)) {
							await dispatch(updateCategoryById({
								id: categoryId,
								data: { itineraries: [...currentItineraries, newItineraryId] }
							})).unwrap();
						}
					} catch (error) {
						console.error(`Error updating category ${categoryId}:`, error);
					}
				}
				
				// Update location - add itinerary ID to selected location
				if (values.travel_location && values.travel_location !== 'null' && values.travel_location !== '') {
					try {
						const location = await dispatch(fetchLocationById(values.travel_location)).unwrap();
						const currentItineraries = location.itineraries || [];
						if (!currentItineraries.includes(newItineraryId)) {
							await dispatch(updateLocationById({
								id: values.travel_location,
								data: { itineraries: [...currentItineraries, newItineraryId] }
							})).unwrap();
						}
					} catch (error) {
						console.error(`Error updating location ${values.travel_location}:`, error);
					}
				}
				
				// Refresh categories and locations to show updated trip counts
				dispatch(fetchCategories());
				dispatch(fetchLocations());
				
				setDialogConfig({
					title: 'Success',
					description: 'Itinerary created successfully!',
					actionText: 'OK',
					color: 'green',
					onConfirm: () => {
						setDialogOpen(false)
						navigate('/dashboard/itinerary')
					},
				})
				setDialogOpen(true)
			}
		} catch (error: any) {
			console.error('Error submitting itinerary:', error)
			setDialogConfig({
				title: 'Error',
				description: error.message || 'Failed to save itinerary. Please try again.',
				actionText: 'OK',
				color: 'red',
				onConfirm: () => {
					setDialogOpen(false)
				},
			})
			setDialogOpen(true)
		}
	}

    const formFields = useMemo(() => [
		// Section 1: Basic Information - Add heading separator
		{
			name: '_section_1_header',
			label: 'Basic Information',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginBottom: '8px', marginTop: '16px' }}>
					<Text size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
						Basic Information
					</Text>
					<Separator size="4" style={{ marginTop: '8px' }} />
				</Box>
			),
			fullWidth: true,
		},
		{
			name: 'iti_name',
			label: 'Itinerary Name',
			type: 'text' as const,
			placeholder: 'Enter name of Itinerary',
		},
		{
			name: 'travel_location',
			label: 'Travel Location',
			type: 'select' as const,
			placeholder: 'Select Travel Location',
			options: locations.map(loc => ({value: loc.id, label: loc.name})),
		},
		{
			name: 'categories',
			label: 'Choose Categories',
			type: 'multiselect' as const,
			placeholder: 'Select Categories',
			options: categories.map(cat => ({value: String(cat.id), label: cat.name})),
		},

		// Section 2: Images (Full Width)
		{
			name: 'iti_img',
			label: 'View Images',
			type: 'file' as const,
			fullWidth: true,
		},

		// Section 3: Descriptions (Full Width)
		{
			name: 'iti_short_desc',
			label: 'Short Description',
			type: 'richtext' as const,
			placeholder: 'Enter short description about the itinerary',
			fullWidth: true,
		},
		{
			name: 'iti_desc',
			label: 'Description',
			type: 'richtext' as const,
			placeholder: 'Add detailed description about the itinerary',
			fullWidth: true,
		},

		// Section 4: Additional Details
		{
			name: 'iti_is_customize',
			label: 'Is Customizable?',
			type: 'select' as const,
			placeholder: 'Select option',
			options: [
				{ value: 'not_specified', label: 'Not specified' },
				{ value: 'true', label: 'Yes' },
				{ value: 'false', label: 'No' },
			],
		},
		{
			name: 'iti_duration',
			label: 'Duration (In Days)',
			type: 'number' as const,
			placeholder: 'Add Duration',
		},
		{
			name: 'iti_altitude',
			label: 'Altitude',
			type: 'text' as const,
			placeholder: 'Enter your Altitude',
		},
		{
			name: 'iti_scenary',
			label: 'Scenary',
			type: 'text' as const,
			placeholder: 'Enter your View',
		},
		{
			name: 'iti_cultural_site',
			label: 'Cultural Site',
			type: 'text' as const,
			placeholder: 'Add Cultural Site',
		},
		{
			name: 'start_date',
			label: 'Start Date',
			type: 'date' as const,
			placeholder: 'Select start date',
		},
		{
			name: 'end_date',
			label: 'End Date',
			type: 'date' as const,
			placeholder: 'Select end date',
		},
		{
			name: 'price',
			label: 'Price',
			type: 'number' as const,
			placeholder: 'Enter price',
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select' as const,
			placeholder: 'Select status',
			options: [
				{ value: 'Active', label: 'Active' },
				{ value: 'Inactive', label: 'Inactive' },
			],
		},
		{
			name: 'trending',
			label: 'Trending',
			type: 'select' as const,
			placeholder: 'Select trending',
			options: [
				{ value: 'Yes', label: 'Yes' },
				{ value: 'No', label: 'No' },
			],
		},

		// Section 5: Brochure
		{
			name: 'iti_brochure_banner',
			label: 'Brochure Banner',
			type: 'text' as const,
			placeholder: 'Paste the Drive link to Brochure',
			fullWidth: true,
		},

		{
			name: '_separator_daywise',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 8: Daywise Activities (Full Width)
		{
			name: 'day_details',
			label: 'Daywise Activities',
			type: 'daywise' as const,
			fullWidth: true,
		},

		{
			name: '_separator_hotels',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 9: Hotel Details (Full Width)
		{
			name: 'hotels',
			label: 'Hotel Details',
			type: 'hotels' as const,
			fullWidth: true,
		},

		{
			name: '_separator_inclusions',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 6: Inclusions & Exclusions (Full Width)
		{
			name: 'iti_inclusion',
			label: 'Inclusions',
			type: 'richtext' as const,
			placeholder: 'Enter inclusions separated by full stops (.)',
			fullWidth: true,
		},
		{
			name: 'iti_exclusion',
			label: 'Exclusions',
			type: 'richtext' as const,
			placeholder: 'Enter exclusions separated by full stops (.)',
			fullWidth: true,
		},

		// Section 7: Notes (Full Width)
		{
			name: 'iti_notes',
			label: 'Notes',
			type: 'richtext' as const,
			placeholder: 'Enter notes separated by full stops (.)',
			fullWidth: true,
		},

		{
			name: '_separator_packages',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},

		// Section 10: Package Details (Full Width)
		{
			name: 'package_details',
			label: 'Package Details',
			type: 'packages' as const,
			fullWidth: true,
		},

		{
			name: '_separator_batches',
			label: '',
			type: 'custom' as const,
			customRender: () => (
				<Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
					<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
				</Box>
			),
			fullWidth: true,
		},
		// Section 11: Batch Management (Full Width)
		{
			name: 'batches',
			label: 'Batch Management',
			type: 'batches' as const,
			fullWidth: true,
		},

		{
			name: '_separator_seo',
			label: '',
			type: 'custom' as const,
			customRender: () => (
			  <Box style={{ gridColumn: '1 / -1', marginTop: '24px', marginBottom: '16px' }}>
				<Separator size="4" style={{ borderColor: 'var(--accent-9)', borderWidth: '2px' }} />
			  </Box>
			),
			fullWidth: true,
		  },
		  // Section 12: SEO Fields (Full Width)
		  {
			name: 'seo_fields',
			label: 'SEO Settings',
			type: 'seo' as const,
			fullWidth: true,
		  },
	], [locations, categories]) // Make formFields reactive to locations and categories changes

	return (
		<Box style={{ padding: '24px' }}>
			<Flex justify="between" align="center" style={{ marginBottom: '24px' }}>
				<Text
					size="7"
					weight="bold"
					style={{
						color: 'var(--accent-12)',
						display: 'block',
					}}
				>
					{isEditMode ? 'Update Itinerary' : 'Add New Itinerary'}
				</Text>
				
				{isEditMode && (
					<Button
						variant="soft"
						size="2"
						onClick={() => navigate('/dashboard/itinerary')}
						style={{
							color: 'white',
							backgroundColor: 'var(--accent-9)',
						}}
					>
						Back to List
					</Button>
				)}
			</Flex>

			{/* Show loading or error state if needed */}
			{isEditMode && !location.state?.itineraryData && (
				<Box style={{ padding: '24px', textAlign: 'center' }}>
					<Text size="3" color="red">No itinerary data found. Please go back and try again.</Text>
					<Button 
						variant="soft" 
						size="2" 
						onClick={() => navigate('/dashboard/itinerary')}
						style={{ marginTop: '16px' }}
					>
						Back to List
					</Button>
				</Box>
			)}

			<DynamicForm
				key={isEditMode ? `edit-${editingId || 'unknown'}` : 'new'} // Add key to force re-render
				fields={formFields}
				buttonText={isEditMode ? 'Update Itinerary' : 'Create New Itinerary'}
				onSubmit={handleSubmit}
				initialValues={initialValues}
			/>
			
			{/* Controlled AlertDialog */}
			{dialogConfig && (
				<AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
					<AlertDialog.Content maxWidth="450px">
						<AlertDialog.Title>{dialogConfig.title}</AlertDialog.Title>
						<AlertDialog.Description size="2">
							{dialogConfig.description}
						</AlertDialog.Description>
						<Flex gap="3" mt="4" justify="end">
							<AlertDialog.Action>
								<Button 
									variant="solid" 
									color={dialogConfig.color || 'green'} 
									onClick={dialogConfig.onConfirm}
								>
									{dialogConfig.actionText}
								</Button>
							</AlertDialog.Action>
						</Flex>
					</AlertDialog.Content>
				</AlertDialog.Root>
			)}
		</Box>
	)
}

export default AddNewItinerary