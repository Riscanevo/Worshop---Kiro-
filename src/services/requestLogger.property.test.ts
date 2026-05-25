import { beforeEach, describe, expect, it } from 'vitest'
import { RequestLog } from '../types'
import { requestLogger } from './requestLogger'

function createLog(index: number, method = 'GET', url = `/api/test/${index}`): RequestLog {
  return {
    id: `log-${index}`,
    timestamp: Date.now() + index,
    method,
    url,
    requestHeaders: { 'content-type': 'application/json' },
    responseStatus: 200,
    duration: index,
  }
}

beforeEach(() => {
  requestLogger.clearLogs()
})

describe('Propiedad requestLogger: captura de requests', () => {
  it('addLog incrementa logs en 1 hasta maximo 100', () => {
    for (let i = 0; i < 100; i += 1) {
      requestLogger.addLog(createLog(i))
      expect(requestLogger.getLogs()).toHaveLength(i + 1)
    }

    requestLogger.addLog(createLog(101))
    const logs = requestLogger.getLogs()

    expect(logs).toHaveLength(100)
    expect(logs[0].id).toBe('log-101')
    expect(logs[99].id).toBe('log-1')
  })

  it('clearLogs vacia el array', () => {
    requestLogger.addLog(createLog(1))
    requestLogger.addLog(createLog(2))

    requestLogger.clearLogs()

    expect(requestLogger.getLogs()).toEqual([])
  })

  it('getFilteredLogs filtra por metodo y URL', () => {
    requestLogger.addLog(createLog(1, 'GET', '/api/products'))
    requestLogger.addLog(createLog(2, 'POST', '/api/auth/login'))
    requestLogger.addLog(createLog(3, 'GET', '/api/products/123'))

    const methodFiltered = requestLogger.getFilteredLogs({ method: 'GET' })
    expect(methodFiltered).toHaveLength(2)

    const searchFiltered = requestLogger.getFilteredLogs({ search: '/auth' })
    expect(searchFiltered).toHaveLength(1)
    expect(searchFiltered[0].url).toBe('/api/auth/login')
  })
})
