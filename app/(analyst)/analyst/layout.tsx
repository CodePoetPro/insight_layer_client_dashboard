'use client'

import { AnalystShell } from '@/components/layout/analyst-shell'

export default function AnalystLayout({ children }: { children: React.ReactNode }) {
  return <AnalystShell>{children}</AnalystShell>
}

