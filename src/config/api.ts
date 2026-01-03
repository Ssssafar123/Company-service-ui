// API Configuration
// This file centralizes all API base URLs and provides helper functions

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8000';

/**
 * Helper function to construct full API URLs
 * @param endpoint - API endpoint (e.g., 'activity', 'user-management', 'location/123')
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Helper function to construct image URLs
 * @param path - Image path (e.g., '/api/location/123/image' or 'api/location/123/image')
 * @returns Full image URL
 */
export const getImageUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${cleanPath}`;
};


