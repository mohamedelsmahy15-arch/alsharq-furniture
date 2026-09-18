'use client'

import type { ReactNode } from 'react'
import { useWhatsAppModal } from '@/components/whatsapp-modal'

export function WhatsAppTriggerButton({
  fallbackMessage,
  className,
  children,
  ariaLabel,
  disabled = false,
}: {
  fallbackMessage?: string
  className?: string
  children: ReactNode
  ariaLabel?: string
  disabled?: boolean
}) {
  const { open } = useWhatsAppModal()

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => { if (!disabled) open(fallbackMessage) }}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  )
}
