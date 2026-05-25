import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { requestLogger } from '../../services/requestLogger'
import { RequestLog } from '../../types'

const METHOD_COLORS: Record<string, string> = {
  GET: '#3b82f6',
  POST: '#22c55e',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#8b5cf6',
}

const PANEL_STORAGE_KEY = 'pos_devtools_open'

function getStatusColor(status?: number): string {
  if (!status) return '#6b7280'
  if (status >= 200 && status < 300) return '#22c55e'
  if (status >= 400 && status < 500) return '#f59e0b'
  if (status >= 500) return '#ef4444'
  return '#6b7280'
}

const badgeStyle = (color: string): CSSProperties => ({
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: color,
  color: 'white',
  fontSize: '0.7rem',
  fontWeight: 'bold',
})

function safeStringify(data: unknown): string {
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function headersTemplate(headers?: Record<string, string>): string {
  if (!headers || Object.keys(headers).length === 0) return 'Sin headers'
  return safeStringify(headers)
}

export default function DevToolsPanel() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(PANEL_STORAGE_KEY) === 'true'
  })
  const [logs, setLogs] = useState<RequestLog[]>(() => requestLogger.getLogs())
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null)
  const [methodFilter, setMethodFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('')

  useEffect(() => {
    const unsubscribe = requestLogger.subscribe((newLogs) => setLogs(newLogs))
    return unsubscribe
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PANEL_STORAGE_KEY, String(visible))
    }
  }, [visible])

  const filteredLogs = requestLogger.getFilteredLogs({
    method: methodFilter || undefined,
    status: statusFilter ? Number(statusFilter) : undefined,
    search: searchFilter || undefined,
  })

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(logs.map((log) => log.responseStatus).filter(Boolean)))
      .map((status) => Number(status))
      .sort((a, b) => a - b)

    return [
      { label: 'Todos los status', value: '' },
      ...statuses.map((status) => ({ label: String(status), value: String(status) })),
    ]
  }, [logs])

  if (!import.meta.env.DEV) return null

  const methodTemplate = (row: RequestLog) => (
    <span style={badgeStyle(METHOD_COLORS[row.method] ?? '#6b7280')}>{row.method}</span>
  )

  const statusTemplate = (row: RequestLog) => (
    <span style={badgeStyle(getStatusColor(row.responseStatus))}>{row.responseStatus ?? '-'}</span>
  )

  const durationTemplate = (row: RequestLog) =>
    row.duration !== undefined ? `${row.duration}ms` : '-'

  const urlTemplate = (row: RequestLog) => (
    <span
      style={{
        color: 'var(--pos-text-primary)',
        fontSize: '0.8rem',
        wordBreak: 'break-all',
        maxWidth: '300px',
        display: 'block',
      }}
    >
      {row.url}
    </span>
  )

  const copyToClipboard = async (data: unknown) => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(safeStringify(data))
  }

  return (
    <>
      <Button
        data-testid="devtools-toggle"
        icon="pi pi-code"
        className="p-button-rounded p-button-warning"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '52px',
          height: '52px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
        onClick={() => setVisible(true)}
        tooltip="Developer Tools"
        tooltipOptions={{ position: 'left' }}
      />

      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        position="right"
        style={{ width: '820px', backgroundColor: 'var(--pos-bg-secondary)' }}
        header={
          <div className="flex align-items-center justify-content-between w-full">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-code" style={{ color: 'var(--pos-accent)' }}></i>
              <span className="font-bold text-lg" style={{ color: 'var(--pos-text-primary)' }}>
                Developer Tools
              </span>
              <span
                style={{
                  ...badgeStyle('#6b7280'),
                  marginLeft: '0.5rem',
                }}
              >
                {logs.length} requests
              </span>
            </div>
            <Button
              data-testid="devtools-clear"
              icon="pi pi-trash"
              className="p-button-sm p-button-danger p-button-text"
              onClick={() => {
                requestLogger.clearLogs()
                setSelectedLog(null)
              }}
              tooltip="Limpiar logs"
            />
          </div>
        }
      >
        <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          <Dropdown
            value={methodFilter}
            options={[
              { label: 'Todos los metodos', value: '' },
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' },
              { label: 'PATCH', value: 'PATCH' },
            ]}
            onChange={(e) => setMethodFilter(e.value as string)}
            placeholder="Metodo"
            style={{ flex: 1, minWidth: '180px' }}
          />
          <Dropdown
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.value as string)}
            placeholder="Status"
            style={{ flex: 1, minWidth: '180px' }}
          />
          <InputText
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por URL..."
            style={{ flex: 2, minWidth: '260px' }}
          />
        </div>

        <DataTable
          value={filteredLogs}
          selectionMode="single"
          selection={selectedLog ?? undefined}
          onSelectionChange={(e) => setSelectedLog(e.value as RequestLog)}
          scrollable
          scrollHeight="350px"
          emptyMessage="Sin requests capturados"
          style={{ marginBottom: '1rem', fontSize: '0.85rem' }}
        >
          <Column header="Metodo" body={methodTemplate} style={{ width: '90px' }} />
          <Column header="URL" body={urlTemplate} />
          <Column header="Status" body={statusTemplate} style={{ width: '80px' }} />
          <Column header="Tiempo" body={durationTemplate} style={{ width: '80px' }} />
        </DataTable>

        {selectedLog && (
          <div
            style={{
              backgroundColor: 'var(--pos-bg-tertiary)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid var(--pos-border)',
            }}
          >
            <div className="flex align-items-center justify-content-between mb-3">
              <h4 className="m-0" style={{ color: 'var(--pos-text-primary)' }}>
                Detalles del Request
              </h4>
              <Button
                icon="pi pi-copy"
                label="Copiar"
                className="p-button-sm p-button-text"
                style={{ color: 'var(--pos-text-secondary)' }}
                onClick={() => {
                  void copyToClipboard(selectedLog)
                }}
              />
            </div>

            <div className="mb-3">
              <strong style={{ color: 'var(--pos-text-secondary)', fontSize: '0.8rem' }}>URL:</strong>
              <p
                style={{
                  color: 'var(--pos-text-primary)',
                  wordBreak: 'break-all',
                  margin: '0.25rem 0 0',
                  fontSize: '0.85rem',
                }}
              >
                {selectedLog.url}
              </p>
            </div>

            <div className="mb-3">
              <strong style={{ color: 'var(--pos-text-secondary)', fontSize: '0.8rem' }}>
                Request Headers:
              </strong>
              <pre
                style={{
                  backgroundColor: 'var(--pos-bg-primary)',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  color: 'var(--pos-text-primary)',
                  fontSize: '0.8rem',
                  margin: '0.25rem 0 0',
                  maxHeight: '120px',
                }}
              >
                {headersTemplate(selectedLog.requestHeaders)}
              </pre>
            </div>

            {selectedLog.requestBody !== undefined && (
              <div className="mb-3">
                <strong style={{ color: 'var(--pos-text-secondary)', fontSize: '0.8rem' }}>
                  Request Body:
                </strong>
                <pre
                  style={{
                    backgroundColor: 'var(--pos-bg-primary)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    color: 'var(--pos-text-primary)',
                    fontSize: '0.8rem',
                    margin: '0.25rem 0 0',
                    maxHeight: '150px',
                  }}
                >
                  {safeStringify(selectedLog.requestBody)}
                </pre>
              </div>
            )}

            <div className="mb-3">
              <strong style={{ color: 'var(--pos-text-secondary)', fontSize: '0.8rem' }}>
                Response Headers:
              </strong>
              <pre
                style={{
                  backgroundColor: 'var(--pos-bg-primary)',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  color: 'var(--pos-text-primary)',
                  fontSize: '0.8rem',
                  margin: '0.25rem 0 0',
                  maxHeight: '120px',
                }}
              >
                {headersTemplate(selectedLog.responseHeaders)}
              </pre>
            </div>

            {selectedLog.responseBody !== undefined && (
              <div className="mb-3">
                <strong style={{ color: 'var(--pos-text-secondary)', fontSize: '0.8rem' }}>
                  Response Body:
                </strong>
                <pre
                  style={{
                    backgroundColor: 'var(--pos-bg-primary)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    color: 'var(--pos-text-primary)',
                    fontSize: '0.8rem',
                    margin: '0.25rem 0 0',
                    maxHeight: '150px',
                  }}
                >
                  {safeStringify(selectedLog.responseBody)}
                </pre>
              </div>
            )}

            {selectedLog.error && (
              <div>
                <strong style={{ color: 'var(--pos-danger)', fontSize: '0.8rem' }}>Error:</strong>
                <p style={{ color: 'var(--pos-danger)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                  {selectedLog.error.message}
                </p>
                {selectedLog.error.stack && (
                  <pre
                    style={{
                      backgroundColor: 'var(--pos-bg-primary)',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      overflow: 'auto',
                      color: 'var(--pos-danger)',
                      fontSize: '0.75rem',
                      margin: '0.25rem 0 0',
                      maxHeight: '150px',
                    }}
                  >
                    {selectedLog.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </Sidebar>
    </>
  )
}
