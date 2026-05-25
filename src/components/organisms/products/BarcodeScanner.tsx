import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import type { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser'

interface BarcodeScannerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (barcode: string) => void
  onCameraError?: (message: string) => void
}

type BrowserWindow = Window & {
  BarcodeDetector?: new (options?: { formats: string[] }) => {
    detect: (input: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>
  }
}

export default function BarcodeScanner({
  value,
  onChange,
  onSubmit,
  onCameraError,
}: BarcodeScannerProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scannerControlsRef = useRef<IScannerControls | null>(null)
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const hasScannedRef = useRef(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim())
    }
  }

  const stopCamera = () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current)
      frameIdRef.current = null
    }
    scannerControlsRef.current?.stop()
    scannerControlsRef.current = null
    zxingReaderRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    hasScannedRef.current = false
    setIsCameraOpen(false)
    setIsCameraLoading(false)
  }

  const getVideoElement = async (): Promise<HTMLVideoElement | null> => {
    for (let attempt = 0; attempt < 15; attempt += 1) {
      if (videoRef.current) return videoRef.current
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    return null
  }

  const startCamera = async () => {
    if (isCameraOpen || isCameraLoading) return
    const browserWindow = window as BrowserWindow
    const BarcodeDetectorCtor = browserWindow.BarcodeDetector

    if (!navigator.mediaDevices?.getUserMedia) {
      onCameraError?.('Este navegador no permite acceder a la camara.')
      return
    }

    try {
      setIsCameraOpen(true)
      setIsCameraLoading(true)
      hasScannedRef.current = false

      const videoElement = await getVideoElement()
      if (!videoElement) {
        onCameraError?.('No se pudo inicializar el visor de camara. Intenta de nuevo.')
        stopCamera()
        return
      }

      if (!BarcodeDetectorCtor) {
        const { BarcodeFormat, BrowserMultiFormatReader: ZXingReader } =
          await import('@zxing/browser')
        const reader = new ZXingReader(undefined, {
          delayBetweenScanAttempts: 150,
          delayBetweenScanSuccess: 350,
        })
        reader.possibleFormats = [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
        ]
        zxingReaderRef.current = reader
        const controls = await reader.decodeFromVideoDevice(undefined, videoElement, (result) => {
          if (hasScannedRef.current) return
          const rawValue = result?.getText().trim()
          if (!rawValue) return
          hasScannedRef.current = true
          onSubmit(rawValue)
          stopCamera()
        })
        scannerControlsRef.current = controls
        setIsCameraLoading(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      videoElement.srcObject = stream
      await videoElement.play()
      setIsCameraLoading(false)

      const detector = new BarcodeDetectorCtor({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
      })

      const scanFrame = () => {
        if (!videoRef.current || hasScannedRef.current) return
        void (async () => {
          try {
            const barcodes = await detector.detect(videoRef.current!)
            const rawValue = barcodes[0]?.rawValue?.trim()
            if (rawValue) {
              hasScannedRef.current = true
              onSubmit(rawValue)
              stopCamera()
              return
            }
          } catch {
            onCameraError?.('No se pudo analizar la imagen de la camara.')
            stopCamera()
            return
          }
          frameIdRef.current = requestAnimationFrame(scanFrame)
        })()
      }
      frameIdRef.current = requestAnimationFrame(scanFrame)
    } catch {
      onCameraError?.('No fue posible abrir la camara. Revisa permisos del navegador.')
      stopCamera()
    }
  }

  useEffect(() => {
    return () => { stopCamera() }
  }, [])

  return (
    <>
      <div className="flex align-items-center gap-2">
        <span className="p-input-icon-left pos-barcode-input">
          <InputText
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escanear codigo de barras..."
            aria-label="Escanear o escribir codigo de barras"
            style={{
              paddingLeft: '1.1rem',
              backgroundColor: 'var(--pos-bg-tertiary)',
              border: '1px solid var(--pos-border)',
              borderRadius: '12px',
              height: '48px',
            }}
            className="w-full"
          />
        </span>
        <Button
          icon="pi pi-qrcode"
          className="p-button-outlined"
          tooltip="Escanear con camara"
          tooltipOptions={{ position: 'bottom' }}
          onClick={() => { void startCamera() }}
          style={{
            height: '48px',
            width: '48px',
            borderRadius: '12px',
            borderColor: 'var(--pos-border)',
            color: 'var(--pos-text-primary)',
          }}
        />
      </div>

      <Dialog
        header="Escaner de codigo"
        visible={isCameraOpen}
        onHide={stopCamera}
        style={{ width: '520px', maxWidth: '95vw' }}
        draggable={false}
        resizable={false}
      >
        <div className="flex flex-column gap-3">
          <p className="m-0 text-sm" style={{ color: 'var(--pos-text-secondary)' }}>
            Apunta la camara al codigo de barras para agregar el producto automaticamente.
          </p>
          <div
            className="border-round-lg overflow-hidden"
            style={{ border: '1px solid var(--pos-border)', backgroundColor: 'var(--pos-bg-tertiary)' }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              style={{ width: '100%', display: 'block', minHeight: '240px' }}
            />
          </div>
          {isCameraLoading && (
            <small style={{ color: 'var(--pos-text-secondary)' }}>Inicializando camara...</small>
          )}
          <div className="flex justify-content-end">
            <Button label="Cerrar" icon="pi pi-times" text onClick={stopCamera} />
          </div>
        </div>
      </Dialog>
    </>
  )
}
