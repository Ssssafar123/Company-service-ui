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
  id?: string              // ✅ IMPORTANT (for update)
  heroType: string
  title: string
  description: string
  bgPreview: string
  cards: string[]
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
  if (existingHeroSlides.length > 0 && slides.every(s => !s.id)) {
    setSlides(
      existingHeroSlides.map((s) => ({
        id: s.id,
        heroType: s.heroType || '',
        title: s.title || '',
        description: s.description || '',
        bgPreview: s.bgImage || '',
        cards: s.cards?.length ? s.cards : ['', '', ''],
      }))
    )
  }
}, [existingHeroSlides])


  /* ✅ IMPROVED: Convert File to Base64 with compression */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        
        // ✅ Compress image by re-encoding through canvas
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxWidth = 800
          const maxHeight = 600
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            // ✅ Compress to 0.7 quality (70%)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
            resolve(compressedBase64)
          } else {
            resolve(base64String)
          }
        }
        img.onerror = () => resolve(base64String)
        img.src = base64String
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const updateSlide = (index: number, key: keyof Slide, value: any) => {
    setSlides((prev) => {
      const updated = [...prev]
      ;(updated[index] as any)[key] = value
      return updated
    })
  }

  const handleBgChange = async (slideIndex: number, file?: File) => {
    if (!file) return
    try {
      const base64 = await fileToBase64(file)
      updateSlide(slideIndex, 'bgPreview', base64)
    } catch (err) {
      setSaveError('Failed to process background image')
    }
  }

  const handleCardChange = async (
    slideIndex: number,
    cardIndex: number,
    file?: File
  ) => {
    if (!file) return
    try {
      const base64 = await fileToBase64(file)
      setSlides((prev) => {
        const updated = [...prev]
        updated[slideIndex].cards = [...updated[slideIndex].cards]
        updated[slideIndex].cards[cardIndex] = base64
        return updated
      })
    } catch (err) {
      setSaveError('Failed to process card image')
    }
  }

  const addSlide = () => {
    setSlides((prev) => [...prev, { ...emptySlide }])
  }

  const deleteSlide = async (index: number) => {
  const slide = slides[index]

  if (slide.id) {
    await dispatch(deleteHeroSlideById(slide.id)).unwrap()
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

    if (!slide.bgPreview) {
      setSaveError('Background image is required')
      return
    }

    if (slide.cards.some((c) => !c)) {
      setSaveError('All 3 card images are required')
      return
    }

    const payload = {
      heroType: slide.heroType || 'banner',
      title: slide.title,
      description: slide.description,
      bgImage: slide.bgPreview,
      cards: slide.cards,
    }

    // ✅ UPDATE EXISTING
    if (slide.id) {
      await dispatch(
        updateHeroSlideById({ id: slide.id, data: payload })
      ).unwrap()
    }
    // ✅ CREATE NEW
    else {
      const created = await dispatch(
        createHeroSlide(payload)
      ).unwrap()

      // attach id back to UI slide
      setSlides((prev) => {
        const copy = [...prev]
        copy[index] = { ...copy[index], id: created.id }
        return copy
      })
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 1500)
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
                Background Image * (Will be compressed)
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
                  src={slide.bgPreview}
                  alt="Background preview"
                  style={{
                    width: '100%',
                    height: 220,
                    objectFit: 'cover',
                    borderRadius: 10,
                    marginTop: 8,
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
                    src={slide.cards[cardIndex]}
                    alt={`Card ${cardIndex + 1} preview`}
                    style={{
                      width: 120,
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginTop: 6,
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