import { ReactNode } from 'react'
import Header from '../organisms/Header'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="flex flex-column h-full"
      style={{ backgroundColor: 'var(--pos-bg-primary)' }}
    >
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
