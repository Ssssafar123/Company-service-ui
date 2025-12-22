# Frontend Image Upload Updates

## Overview
Updated the frontend to work with the new binary image storage backend for Categories and Locations. Images are now stored as binary data in MongoDB and retrieved via dedicated endpoints.

---

## 🎯 What Changed

### 1. **CategorySlice.ts** - Binary Image Upload Support
- **`createCategory`**: Now sends `FormData` instead of JSON
  - Accepts `imageFile` and `featureImageFiles` (File objects)
  - Appends files to FormData for multipart upload
  - Handles SEO fields and itineraries as JSON strings in FormData
  
- **`updateCategoryById`**: Now sends `FormData` instead of JSON
  - Same multipart approach as create
  - Only includes changed fields in FormData

### 2. **LocationSlice.ts** - Binary Image Upload Support
- **`createLocation`**: Now sends `FormData` instead of JSON
  - Accepts `imageFile` and `featureImageFiles` (File objects)
  - Appends files to FormData for multipart upload
  - Handles SEO fields as JSON strings in FormData
  
- **`updateLocationById`**: Now sends `FormData` instead of JSON
  - Same multipart approach as create
  - Only includes changed fields in FormData

### 3. **AddCategory.tsx** - File Handling
- Updated `handleSubmit` to extract File objects from form values
- Passes File objects to Redux slice actions:
  - `imageFile`: First uploaded image (main category image)
  - `featureImageFiles`: Array of all uploaded images
- Removed string-based image handling
- Removed unused `formData` state variable

### 4. **AddLocation.tsx** - File Handling
- Updated `handleSubmit` to extract File objects from form values
- Passes File objects to Redux slice actions:
  - `imageFile`: First uploaded image (main location image)
  - `featureImageFiles`: Array of all uploaded images
- Removed string-based image handling

### 5. **Category.tsx** - Display Binary Images
- Changed image source from `category.image` (string URL) to:
  ```tsx
  src={`http://localhost:8000/api/category/${category.id}/image`}
  ```
- Images now fetched from binary endpoint

### 6. **Location.tsx** - Display Binary Images
- Changed image source from `location.image` (string URL) to:
  ```tsx
  src={`http://localhost:8000/api/location/${location.id}/image`}
  ```
- Images now fetched from binary endpoint

---

## 📋 API Endpoints Used

### Category Endpoints
- **Create/Update**: `POST/PUT /api/category` (with FormData)
- **Main Image**: `GET /api/category/:id/image`
- **Feature Images**: `GET /api/category/:id/feature-image/:index`

### Location Endpoints
- **Create/Update**: `POST/PUT /api/location` (with FormData)
- **Main Image**: `GET /api/location/:id/image`
- **Feature Images**: `GET /api/location/:id/feature-image/:index`

---

## 🔄 Data Flow

### **Creating a Category/Location**
1. User uploads images via ImageUpload component
2. Form returns File objects in `values.feature_images` array
3. `handleSubmit` extracts File objects
4. Redux action receives File objects as `imageFile` and `featureImageFiles`
5. Slice creates FormData and appends files
6. Backend receives multipart/form-data
7. Backend stores images as binary (Buffer) in MongoDB
8. Backend returns document with metadata
9. Frontend fetches images via binary endpoints when displaying

### **Displaying Images**
1. Component renders with category/location ID
2. Image `src` points to binary endpoint: `/api/category/:id/image`
3. Backend retrieves binary data from MongoDB
4. Backend sets Content-Type header and sends binary data
5. Browser displays image

---

## ✅ Key Benefits

1. **No File System Dependencies**: All images stored in database
2. **Simplified Deployment**: No need to manage file storage or volumes
3. **Atomic Operations**: Images saved with document in single transaction
4. **Consistent API**: Same pattern for Category and Location
5. **Type Safety**: TypeScript types updated to support File objects

---

## 🧪 Testing Checklist

- [ ] Upload image when creating new category
- [ ] Upload multiple feature images for category
- [ ] Update category with new images
- [ ] Verify images display correctly on category list
- [ ] Upload image when creating new location
- [ ] Upload multiple feature images for location
- [ ] Update location with new images
- [ ] Verify images display correctly on location list
- [ ] Test image fallback when no image exists
- [ ] Test image error handling (onError)

---

## 🐛 Troubleshooting

### Images not displaying?
1. Check browser network tab for 404 errors
2. Verify category/location ID is correct
3. Ensure backend is running on `http://localhost:8000`
4. Check backend console for multer errors

### Upload failing?
1. Verify file is actually a File object (use console.log)
2. Check file size limits in backend multer config
3. Inspect FormData in browser network tab
4. Check backend for validation errors

### CORS issues?
1. Ensure credentials: 'include' is set in fetch calls
2. Check backend CORS configuration
3. Verify cookie settings if using authentication

---

## 📝 Notes

- The `image` field in the database now stores binary data (Buffer), not strings
- The `feature_images` field stores an array of binary data
- Image URLs are no longer stored in the database
- The frontend generates image URLs dynamically based on document ID
- SEO fields and itineraries are JSON-stringified when sent in FormData
- File validation should be done on the backend (multer configuration)

---

## 🔗 Related Files

### Modified Files
- `src/features/CategorySlice.ts`
- `src/features/LocationSlice.ts`
- `src/modules/Category/AddCategory.tsx`
- `src/modules/Location/AddLocation.tsx`
- `src/modules/Category/Category.tsx`
- `src/modules/Location/Location.tsx`

### Backend Files (Reference)
- `models/Category.js` - Image fields use Buffer
- `models/Location.js` - Image fields use Buffer
- `controllers/CategoryController.js` - Multer handling
- `controllers/LocationController.js` - Multer handling
- `routes/CategoryRoutes.js` - Image retrieval routes
- `routes/LocationRoutes.js` - Image retrieval routes
