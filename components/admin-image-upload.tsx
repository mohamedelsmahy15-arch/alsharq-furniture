'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Check, Image as ImageIcon, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export async function uploadFile(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body,
    credentials: 'include',
  })

  if (!response.ok) {
    let message = 'فشل رفع الملف'
    try {
      const err = await response.json()
      if (err.error) message = err.error
    } catch {
      message = `خطأ في الخادم (${response.status})`
    }
    throw new Error(message)
  }

  const data = await response.json()
  return data.url as string
}

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  accept?: string
  isVideo?: boolean
}

export function AdminImageUpload({
  value,
  onChange,
  label,
  placeholder = 'رابط الملف أو ارفع من جهازك...',
  accept = 'image/*',
  isVideo = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // Create instant preview for images
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file)
      setLocalPreview(objectUrl)
    }

    setUploading(true)
    const toastId = toast.loading('جاري رفع الملف من جهازك...')

    try {
      const url = await uploadFile(file)
      onChange(url)
      setLocalPreview(null)
      toast.success('تم رفع الملف وحفظه بنجاح!', { id: toastId })
    } catch (err: any) {
      setLocalPreview(null)
      toast.error(err?.message || 'فشل رفع الملف من جهازك', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const displayUrl = localPreview || value

  return (
    <div className="grid gap-2">
      {label && <span className="text-xs font-semibold text-foreground/80">{label}</span>}

      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs md:text-sm font-mono"
          dir="ltr"
        />

        {/* Explicit button that triggers the file input ref */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={triggerPicker}
          className="shrink-0 font-bold"
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جاري الرفع...</span>
            </>
          ) : (
            <>
              {isVideo ? <Film className="size-4 text-primary" /> : <Upload className="size-4 text-primary" />}
              <span>رفع من جهازك</span>
            </>
          )}
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => {
              onChange('')
              setLocalPreview(null)
            }}
            title="مسح الرابط"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Drag and drop / Preview zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        onClick={() => !displayUrl && triggerPicker()}
        className={`relative overflow-hidden rounded-xl border transition-all ${
          isDragging
            ? 'border-primary bg-primary/10 ring-2 ring-primary'
            : displayUrl
            ? 'bg-muted/30 border-border'
            : 'border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/20 cursor-pointer p-3'
        }`}
      >
        {displayUrl && !isVideo && (
          <div className="relative aspect-[16/9] max-h-40 w-full max-w-sm overflow-hidden rounded-lg bg-black/5">
            <img
              src={displayUrl}
              alt="معاينة"
              className="size-full object-contain"
              onError={(e) => {
                ;(e.currentTarget as HTMLElement).style.display = 'none'
              }}
            />
            {localPreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-white">
                <Loader2 className="mr-1 size-4 animate-spin" /> جاري حفظ الصورة في الموقع...
              </div>
            )}
            {value.startsWith('/uploads/') && (
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                ✓ مرفوعة محلياً
              </span>
            )}
          </div>
        )}

        {displayUrl && isVideo && (
          <div className="relative aspect-video max-h-40 w-full max-w-sm overflow-hidden rounded-lg bg-black">
            <video src={displayUrl} controls className="size-full object-contain" />
          </div>
        )}

        {!displayUrl && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="size-4 text-muted-foreground/60" />
            <span>يمكنك أيضاً سحب وإفلات الصورة أو الفيديو هنا مباشرة</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminGalleryUpload({
  values,
  onChange,
  label = 'معرض الصور الإضافية',
}: {
  values: string[]
  onChange: (urls: string[]) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    setUploading(true)
    const toastId = toast.loading(`جاري رفع ${fileArray.length} صور من جهازك...`)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < fileArray.length; i++) {
        setProgressText(`رفع ${i + 1} من ${fileArray.length}...`)
        const url = await uploadFile(fileArray[i])
        uploadedUrls.push(url)
      }
      onChange([...values, ...uploadedUrls])
      toast.success(`تم رفع ${uploadedUrls.length} صور بنجاح!`, { id: toastId })
    } catch (err: any) {
      if (uploadedUrls.length > 0) {
        onChange([...values, ...uploadedUrls])
      }
      toast.error(err?.message || 'حدث خطأ أثناء رفع بعض الصور', { id: toastId })
    } finally {
      setUploading(false)
      setProgressText('')
      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }
    }
  }

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const triggerPicker = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
      }}
      onDrop={handleDrop}
      className={`grid gap-3 rounded-xl border p-4 transition-colors ${
        isDragging ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'bg-card'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          {label} ({values.length} صور)
        </span>

        {/* Explicit Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={triggerPicker}
          className="font-bold"
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>{progressText || 'جاري الرفع...'}</span>
            </>
          ) : (
            <>
              <Upload className="size-4 text-primary" />
              <span>إضافة صور من الجهاز</span>
            </>
          )}
        </Button>

        {/* Hidden input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files)
            }
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {values.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img src={url} alt={`معرض ${i + 1}`} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
              title="حذف الصورة"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <div
            onClick={triggerPicker}
            className="col-span-full py-6 text-center text-xs text-muted-foreground border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
          >
            لا توجد صور في المعرض حالياً. اضغط هنا أو اسحب الصور لإضافتها من جهازك.
          </div>
        )}
      </div>
    </div>
  )
}

