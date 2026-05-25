import { v4 as uuidv4 } from 'uuid'
import { RequestLog } from '../types'
import { requestLogger } from './requestLogger'

let isInitialized = false
let originalFetchRef: typeof window.fetch | null = null

function headersToRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) return Object.fromEntries(headers.entries())
  if (Array.isArray(headers)) return Object.fromEntries(headers)
  return { ...headers }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  try {
    return await response.text()
  } catch {
    return null
  }
}

export function initializeHttpInterceptor(): void {
  if (isInitialized || !import.meta.env.DEV) return
  isInitialized = true

  if (!originalFetchRef) {
    originalFetchRef = window.fetch.bind(window)
  }

  const originalFetch = originalFetchRef

  window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
    const [input, init = {}] = args
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method =
      (init.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
    const startTime = Date.now()

    const requestHeaders =
      'headers' in init && init.headers !== undefined
        ? headersToRecord(init.headers)
        : input instanceof Request
          ? headersToRecord(input.headers)
          : {}

    let requestBody: unknown
    if (init.body) {
      try {
        requestBody = JSON.parse(init.body as string)
      } catch {
        requestBody = init.body
      }
    }

    const log: RequestLog = {
      id: uuidv4(),
      timestamp: startTime,
      method,
      url,
      requestHeaders,
      requestBody,
    }

    try {
      const response = await originalFetch(...args)
      const endTime = Date.now()

      const clonedResponse = response.clone()
      const responseBody = await parseResponseBody(clonedResponse)

      log.responseStatus = response.status
      log.responseHeaders = Object.fromEntries(response.headers.entries())
      log.responseBody = responseBody
      log.duration = endTime - startTime

      requestLogger.addLog(log)
      return response
    } catch (err) {
      const endTime = Date.now()
      log.error = err instanceof Error ? err : new Error(String(err))
      log.duration = endTime - startTime
      requestLogger.addLog(log)
      throw err
    }
  }

  console.log('[DevTools] HTTP Interceptor initialized')
}

export function resetHttpInterceptorForTests(): void {
  if (originalFetchRef) {
    window.fetch = originalFetchRef
  }
  originalFetchRef = null
  isInitialized = false
}
