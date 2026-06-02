const raw = import.meta.env.VITE_API_BASE_URL
const configuredApiBaseUrl = raw && raw.trim() !== '' ? raw : 'http://localhost:8080'

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, '')

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
