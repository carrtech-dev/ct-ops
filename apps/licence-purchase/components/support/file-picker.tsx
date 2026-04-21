'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ATTACHMENT_ALLOWED_MIME_TYPES } from '@/lib/db/schema'

export type PendingAttachment = {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
}

type UploadState =
  | { kind: 'idle' }
  | { kind: 'uploading'; filename: string }
  | { kind: 'error'; message: string }

const ACCEPT = ATTACHMENT_ALLOWED_MIME_TYPES.join(',')
const MAX_FILES = 5

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function pasteFilename(mimeType: string): string {
  const ext =
    mimeType === 'image/png'
      ? 'png'
      : mimeType === 'image/gif'
        ? 'gif'
        : mimeType === 'image/webp'
          ? 'webp'
          : 'jpg'
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `screenshot-${ts}.${ext}`
}

export function FilePicker({
  ticketId,
  attachments,
  onChange,
}: {
  ticketId?: string
  attachments: PendingAttachment[]
  onChange: (attachments: PendingAttachment[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ kind: 'idle' })

  // Refs so the paste handler always sees the latest props without being re-registered.
  const attachmentsRef = useRef(attachments)
  const onChangeRef = useRef(onChange)
  useEffect(() => { attachmentsRef.current = attachments }, [attachments])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  async function uploadFile(file: File) {
    if (attachmentsRef.current.length >= MAX_FILES) {
      setUploadState({ kind: 'error', message: `Maximum ${MAX_FILES} files per message` })
      return
    }
    setUploadState({ kind: 'uploading', filename: file.name })
    const fd = new FormData()
    fd.append('file', file)
    if (ticketId) fd.append('ticketId', ticketId)
    try {
      const res = await fetch('/api/support/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const msg = (body as { error?: string }).error ?? `Upload failed (${res.status})`
        setUploadState({ kind: 'error', message: msg })
        return
      }
      const uploaded = (await res.json()) as PendingAttachment
      onChangeRef.current([...attachmentsRef.current, uploaded])
      setUploadState({ kind: 'idle' })
    } catch {
      setUploadState({ kind: 'error', message: 'Upload failed — please try again' })
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const remaining = MAX_FILES - attachments.length
    if (remaining <= 0) {
      setUploadState({ kind: 'error', message: `Maximum ${MAX_FILES} files per message` })
      return
    }
    const toUpload = Array.from(files).slice(0, remaining)
    for (const file of toUpload) {
      await uploadFile(file)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  // Global paste listener — captures Ctrl/Cmd+V anywhere on the page when the
  // clipboard contains image data (e.g. a screenshot copied from another app).
  useEffect(() => {
    async function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'))
      if (!imageItem) return
      const blob = imageItem.getAsFile()
      if (!blob) return
      const filename = pasteFilename(imageItem.type)
      await uploadFile(new File([blob], filename, { type: imageItem.type }))
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  // ticketId is stable per form instance; no other deps needed thanks to refs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  function removeAttachment(id: string) {
    onChange(attachments.filter((a) => a.id !== id))
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        {attachments.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-xs"
          >
            <span className="max-w-[160px] truncate text-foreground" title={a.filename}>
              {a.filename}
            </span>
            <span className="text-muted-foreground">({formatBytes(a.sizeBytes)})</span>
            <button
              type="button"
              onClick={() => removeAttachment(a.id)}
              className="ml-0.5 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${a.filename}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {uploadState.kind === 'uploading' ? (
        <p className="text-xs text-muted-foreground">Uploading {uploadState.filename}…</p>
      ) : uploadState.kind === 'error' ? (
        <p className="text-xs text-destructive">{uploadState.message}</p>
      ) : null}

      {attachments.length < MAX_FILES ? (
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadState.kind === 'uploading'}
              onClick={() => inputRef.current?.click()}
            >
              Attach files
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">
              Images, PDFs, text files — max 10 MB each · or paste a screenshot
            </span>
          </div>
        </>
      ) : null}
    </div>
  )
}
