import api from '@/services/api'
import { API_BASE_URL } from '@/api/config'

export interface Invoice {
  id: number
  invoice_number: string
  order_id: string
  total_amount: number
  currency: string
  payment_status: string
  product_description: string
  plan_interval?: string | null
  pdf_url?: string | null
  paid_at?: string | null
}

export interface InvoicePagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

interface ApiSuccessResponse<T> {
  success: boolean
  data: T
  pagination?: InvoicePagination
  message?: string
}

export class InvoiceApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvoiceApiError'
  }
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

function asInvoiceArray(value: unknown): Invoice[] | null {
  if (!Array.isArray(value)) return null
  const rows = value.filter(
    (row): row is Invoice =>
      isPlainRecord(row) &&
      typeof row.id === 'number' &&
      typeof row.invoice_number === 'string'
  )
  return rows
}

/** Normalize list payloads: array, Laravel paginator, or `{ invoices: [] }`. */
function parseInvoiceListBody(body: Record<string, unknown>): {
  items: Invoice[]
  pagination?: InvoicePagination
} {
  const inner = isPlainRecord(body.data) ? body.data : null

  if (Array.isArray(body.data)) {
    return {
      items: asInvoiceArray(body.data) ?? [],
      pagination: extractPagination(body, null),
    }
  }

  if (inner) {
    const fromNested =
      asInvoiceArray(inner.data) ??
      asInvoiceArray(inner.invoices) ??
      asInvoiceArray(inner.items)
    if (fromNested?.length) {
      return { items: fromNested, pagination: extractPagination(body, inner) }
    }

    for (const [key, value] of Object.entries(inner)) {
      if (key === 'pagination' || key === 'meta' || key === 'links') continue
      const rows = asInvoiceArray(value)
      if (rows?.length) {
        return { items: rows, pagination: extractPagination(body, inner) }
      }
    }

    const paginatedRows = asInvoiceArray(inner)
    if (paginatedRows?.length) {
      return { items: paginatedRows, pagination: extractPagination(body, inner) }
    }
  }

  const topLevel =
    asInvoiceArray(body.invoices) ?? asInvoiceArray(body.items) ?? asInvoiceArray(body.data)
  return {
    items: topLevel ?? [],
    pagination: extractPagination(body, inner),
  }
}

function extractPagination(
  body: Record<string, unknown>,
  inner: Record<string, unknown> | null
): InvoicePagination | undefined {
  const pag =
    (inner && isPlainRecord(inner.pagination) ? inner.pagination : null) ??
    (isPlainRecord(body.pagination) ? body.pagination : null)

  if (pag && typeof pag.current_page === 'number') {
    return {
      current_page: pag.current_page,
      last_page: typeof pag.last_page === 'number' ? pag.last_page : 1,
      per_page: typeof pag.per_page === 'number' ? pag.per_page : 15,
      total: typeof pag.total === 'number' ? pag.total : 0,
      from: typeof pag.from === 'number' ? pag.from : undefined,
      to: typeof pag.to === 'number' ? pag.to : undefined,
    }
  }

  if (inner && typeof inner.current_page === 'number') {
    return {
      current_page: inner.current_page,
      last_page: typeof inner.last_page === 'number' ? inner.last_page : 1,
      per_page: typeof inner.per_page === 'number' ? inner.per_page : 15,
      total: typeof inner.total === 'number' ? inner.total : 0,
      from: typeof inner.from === 'number' ? inner.from : undefined,
      to: typeof inner.to === 'number' ? inner.to : undefined,
    }
  }

  return undefined
}

function assertSuccess<T>(body: ApiSuccessResponse<T> | undefined, fallbackMessage: string): ApiSuccessResponse<T> {
  if (!body?.success) {
    throw new InvoiceApiError(body?.message || fallbackMessage)
  }
  return body
}

/** Format cents to display currency string */
export function formatInvoiceAmount(totalAmountCents: number, currency: string): string {
  const amount = totalAmountCents / 100
  const code = (currency || 'EUR').toUpperCase()
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${code}`
  }
}

export function formatInvoiceDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function parseFilenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback
  const utf8 = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1])
    } catch {
      /* ignore */
    }
  }
  const plain = header.match(/filename="?([^";\n]+)"?/i)
  return plain?.[1]?.trim() || fallback
}

export async function fetchInvoices(
  page = 1,
  perPage = 15
): Promise<{ items: Invoice[]; pagination?: InvoicePagination }> {
  const response = await api.get<ApiSuccessResponse<unknown>>('/invoices', {
    params: { page, per_page: perPage },
  })
  const body = assertSuccess(response.data, 'Failed to load invoices')
  const parsed = parseInvoiceListBody(body as unknown as Record<string, unknown>)
  return {
    items: parsed.items,
    pagination: parsed.pagination ?? body.pagination,
  }
}

export async function fetchInvoiceById(id: number): Promise<Invoice> {
  const response = await api.get<ApiSuccessResponse<Invoice | Record<string, unknown>>>(`/invoices/${id}`)
  const body = assertSuccess(response.data, 'Failed to load invoice')
  const raw = body.data
  if (isPlainRecord(raw) && typeof raw.id === 'number') {
    return raw as unknown as Invoice
  }
  throw new InvoiceApiError('Invalid invoice response')
}

/**
 * Stream PDF via authenticated download endpoint (preferred).
 */
export async function downloadInvoicePdf(
  id: number,
  invoiceNumber?: string
): Promise<void> {
  const token = localStorage.getItem('token')
  const url = `${API_BASE_URL}/api/invoices/${id}/download`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    throw new InvoiceApiError('Failed to download invoice')
  }

  const blob = await response.blob()
  const filename = parseFilenameFromDisposition(
    response.headers.get('Content-Disposition'),
    `${invoiceNumber || `invoice-${id}`}.pdf`
  )

  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}

/** Open public storage PDF when download endpoint is unavailable */
export function openInvoicePdfUrl(pdfUrl: string): void {
  window.open(pdfUrl, '_blank', 'noopener,noreferrer')
}
