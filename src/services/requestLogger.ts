import { RequestLog, LogFilters } from '../types'

class RequestLoggerService {
  private logs: RequestLog[] = []
  private readonly maxLogs = 100
  private subscribers: Set<(logs: RequestLog[]) => void> = new Set()

  addLog(log: RequestLog): void {
    this.logs = [log, ...this.logs].slice(0, this.maxLogs)
    this.notifySubscribers()
  }

  clearLogs(): void {
    this.logs = []
    this.notifySubscribers()
  }

  getLogs(): RequestLog[] {
    return [...this.logs]
  }

  getFilteredLogs(filters: LogFilters): RequestLog[] {
    return this.logs.filter((log) => {
      if (filters.method && log.method !== filters.method) return false
      if (filters.status && log.responseStatus !== filters.status) return false
      if (filters.search && !log.url.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      return true
    })
  }

  subscribe(callback: (logs: RequestLog[]) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers(): void {
    const snapshot = this.getLogs()
    this.subscribers.forEach((callback) => callback(snapshot))
  }
}

export const requestLogger = new RequestLoggerService()
