import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { saveHeroSlides, fetchHeroSlides, deleteHeroSlideById, createHeroSlide, updateHeroSlideById } from '../../features/HeroSlice'
import { Box, Flex, Text, Button, Card, IconButton } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'

type Props = {
  contentId?: string
  onClose: () => void
}

type Slide = {
  id?: string
  heroType: string
  title: string
  description: string
  bgPreview: string | File  // Can be URL string or File object
  bgImageFile?: File  // New file to upload
  cards: (string | File)[]  // Can be URL strings or File objects
  cardImageFiles?: File[]  // New files to upload
}

const emptySlide: Slide = {
  heroType: '',
  title: '',
  description: '',
  bgPreview: '',
  cards: ['', '', ''],
}

const EditHeroImage: React.FC<Props> = ({ contentId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()

  const existingHeroSlides = useSelector((state: RootState) => state.hero.slides || [])
  const loading = useSelector((state: RootState) => state.hero.ui.loading)
  const error = useSelector((state: RootState) => state.hero.ui.error)

  const [slides, setSlides] = useState<Slide[]>([emptySlide])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    dispatch(fetchHeroSlides())
  }, [dispatch])

  useEffect(() => {
    if (existingHeroSlides.length > 0) {
      const mappedSlides = existingHeroSlides.map((s) => ({
        id: s.id, // Ensure id is always set
        heroType: s.heroType || '',
        title: s.title || '',
        description: s.description || '',
        bgPreview: s.bgImage || '', // Cloudinary URL string
        cards: s.cards?.length ? s.cards : ['', '', ''], // Array of URL strings
        // Don't initialize cardImageFiles or bgImageFile - these are only for new uploads
      }))
      
      setSlides(prevSlides => {
        // Check if we need to update
        if (prevSlides.length !== mappedSlides.length) {
          return mappedSlides
        }
        
        // Check if any slide changed significantly
        const needsUpdate = prevSlides.some((prev, idx) => {
          const mapped = mappedSlides[idx]
          return !mapped || 
                 prev.id !== mapped.id || 
                 prev.bgPreview !== mapped.bgPreview ||
                 JSON.stringify(prev.cards) !== JSON.stringify(mapped.cards)
        })
        
        if (needsUpdate) {
          // Preserve any File objects that might have been selected
          return mappedSlides.map((mapped, idx) => {
            const prev = prevSlides[idx]
            if (prev && prev.id === mapped.id) {
              // Preserve any new file uploads
              return {
                ...mapped,
                bgImageFile: prev.bgImageFile,
                cardImageFiles: prev.cardImageFiles,
              }
            }
            return mapped
          })
        }
        
        return prevSlides
      })
    }
  }, [existingHeroSlides])

  const updateSlide = (index: number, key: keyof Slide, value: any) => {
    setSlides((prev) => {
      const updated = [...prev]
      ;(updated[index] as any)[key] = value
      return updated
    })
  }

  // Handle background image file selection
  const handleBgChange = (slideIndex: number, file?: File) => {
    if (!file) return
    
    // Store the File object separately and create preview URL
    const previewUrl = URL.createObjectURL(file)
    
    setSlides((prev) => {
      const updated = [...prev]
      updated[slideIndex] = {
        ...updated[slideIndex], 
        bgPreview: previewUrl,
        bgImageFile: file, 
      }
      return updated
    })
  }

  // Handle card image file selection
  const handleCardChange = (
    slideIndex: number,
    cardIndex: number,
    file?: File
  ) => {
    if (!file) return
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    
    setSlides((prev) => {
      const updated = [...prev]
      const newCards = [...updated[slideIndex].cards]
      newCards[cardIndex] = previewUrl // Preview URL for display
      
      // Store File objects separately
      if (!updated[slideIndex].cardImageFiles) {
        updated[slideIndex].cardImageFiles = []
      }
      const cardFiles = [...(updated[slideIndex].cardImageFiles || [])]
      cardFiles[cardIndex] = file // File object for upload
      
      updated[slideIndex] = {
        ...updated[slideIndex],
        cards: newCards,
        cardImageFiles: cardFiles,
      }
      return updated
    })
  }

  // Get preview URL for display (handles both File objects and URL strings)
  const getPreviewUrl = (value: string | File): string => {
    if (!value) return ''
    if (value instanceof File) {
      return URL.createObjectURL(value)
    }
    return value
  }

  const addSlide = () => {
    setSlides((prev) => [...prev, { ...emptySlide }])
  }

  const deleteSlide = async (index: number) => {
    const slide = slides[index]

    if (slide.id) {
      try {
        await dispatch(deleteHeroSlideById(slide.id)).unwrap()
      } catch (err: any) {
        setSaveError(err.message || 'Failed to delete slide')
        return
      }
    }

    setSlides((prev) => prev.filter((_, i) => i !== index))
  }

  const saveSlide = async (slide: Slide, index: number) => {
    try {
      setSaveError(null)

      if (!slide.title.trim()) {
        setSaveError('Hero title is required')
        return
      }

      // Check if background image exists (either existing URL or new file)
      if (!slide.bgPreview && !slide.bgImageFile) {
        setSaveError('Background image is required')
        return
      }

      // Prepare File objects for upload
      const bgImageFile = slide.bgImageFile || undefined
      const cardImageFiles = slide.cardImageFiles || []

    
      if (slide.id) {
        const cardValidation = slide.cards.every((card, idx) => {
          const hasExistingUrl = typeof card === 'string' && card.trim() !== '' && !card.startsWith('blob:')
          const hasNewFile = cardImageFiles[idx] instanceof File
          return hasExistingUrl || hasNewFile
        })

        if (!cardValidation) {
          setSaveError('All 3 card images are required. Please ensure each card has an image (existing or new).')
          return
        }

        // Prepare data payload for update
        const dataPayload = {
          heroType: slide.heroType || 'banner',
          title: slide.title,
          description: slide.description || '',
        }

        await dispatch(
          updateHeroSlideById({ 
            id: slide.id, 
            data: dataPayload,
            bgImageFile: bgImageFile,
            cardImageFiles: cardImageFiles.length > 0 ? cardImageFiles : undefined,
          })
        ).unwrap()
      }
      // ✅ CREATE NEW
      else {
        // For create, bgImageFile is required
        if (!bgImageFile) {
          setSaveError('Background image file is required for new slides')
          return
        }

        // All card files are required for create (must be File objects)
        if (cardImageFiles.length !== 3 || cardImageFiles.some(f => !f || !(f instanceof File))) {
          setSaveError('All 3 card image files are required for new slides')
          return
        }

        const created = await dispatch(
          createHeroSlide({
            heroType: slide.heroType || 'banner',
            title: slide.title,
            description: slide.description || '',
            bgImageFile: bgImageFile,
            cardImageFiles: cardImageFiles,
          })
        ).unwrap()

        // Attach id back to UI slide
        setSlides((prev) => {
          const copy = [...prev]
          copy[index] = { ...copy[index], id: created.id }
          return copy
        })
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveError(null), 1500)
      
      
      dispatch(fetchHeroSlides())
    } catch (err: any) {
      setSaveError(err.message || 'Save failed')
    }
  }

  return (
    <Card style={{ padding: 20 }}>
      <Flex justify="between" align="center" mb="4">
        <Text size="5" weight="bold">
          Edit Hero Images
        </Text>
        <IconButton variant="ghost" onClick={onClose}>
          <Cross2Icon />
        </IconButton>
      </Flex>

      {loading && <Text color="blue" mb="3">Loading hero slides...</Text>}
      {error && <Text color="red" mb="3">Error: {error}</Text>}
      {saveError && <Text color="red" mb="3">Save Error: {saveError}</Text>}
      {saveSuccess && <Text color="green" mb="3">✓ Slide saved successfully!</Text>}

      <Text weight="bold" mb="3">Add New Slide</Text>
      {slides.map((slide, slideIndex) => (
        <Card
          key={slideIndex}
          style={{
            padding: 16,
            marginBottom: 24,
            background: '#fff',
            border: '1px solid #e0e0e0',
          }}
        >
          <Text weight="medium" mb="3">Slide {slideIndex + 1}</Text>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Hero Title *</label>
            <input
              value={slide.title}
              placeholder="Enter slide title"
              onChange={(e) => updateSlide(slideIndex, 'title', e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
              required
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Hero Type</label>
            <input
              value={slide.heroType}
              placeholder="e.g., banner, featured"
              onChange={(e) => updateSlide(slideIndex, 'heroType', e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>Hero Description</label>
            <textarea
              value={slide.description}
              placeholder="Enter slide description"
              onChange={(e) =>
                updateSlide(slideIndex, 'description', e.target.value)
              }
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </div>

          <Flex gap="5" align="start" style={{ marginBottom: 12 }}>
            <Box flexGrow="2">
              <Text weight="medium" mb="1">
                Background Image * {slide.bgPreview && typeof slide.bgPreview === 'string' && slide.bgPreview.startsWith('http') ? '(Cloudinary URL)' : slide.bgImageFile ? '(New file selected)' : ''}
              </Text>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleBgChange(slideIndex, e.target.files[0])
                }
              />
                {slide.bgPreview && (
                <img
                  src={getPreviewUrl(slide.bgPreview)}
                  alt="Background preview"
                  style={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    borderRadius: 10,
                    marginTop: 8,
                  }}
                  onError={(e) => {
                    console.error('Failed to load background image:', slide.bgPreview)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </Box>
          </Flex>

          <Text weight="medium" mb="2">Card Images (All Required) *</Text>
          <Flex gap="4" wrap="wrap" mb="4">
            {[0, 1, 2].map((cardIndex) => (
              <Box key={cardIndex}>
                <Text size="2" mb="1">Card {cardIndex + 1} *</Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    handleCardChange(slideIndex, cardIndex, e.target.files[0])
                  }
                />
                {slide.cards[cardIndex] && (
                  <img
                    src={getPreviewUrl(slide.cards[cardIndex])}
                    alt={`Card ${cardIndex + 1} preview`}
                    style={{
                      width: 120,
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginTop: 6,
                    }}
                    onError={(e) => {
                      console.error('Failed to load card image:', slide.cards[cardIndex])
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </Box>
            ))}
          </Flex>

          <Flex gap="3" mt="4">
            <Button
              style={{ flex: 1, background: '#28a745', color: '#fff' }}
              onClick={() => saveSlide(slide, slideIndex)}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              style={{ flex: 1, background: '#dc3545', color: '#fff' }}
              onClick={() => deleteSlide(slideIndex)}
              disabled={loading}
            >
              Delete
            </Button>
          </Flex>
        </Card>
      ))}

      <Button
        style={{
          width: '100%',
          background: '#ff7a00',
          color: '#fff',
          padding: '10px',
          marginTop: '16px',
        }}
        onClick={addSlide}
      >
        + Add Slide
      </Button>
    </Card>
  )
}

export default EditHeroImage