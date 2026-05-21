import api from '@/services/api'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | string

/** `GET /api/subscription` → `data.account` */
export interface SubscriptionAccount {
  account_type: 'free' | 'premium' | string
  status: string
  is_premium: boolean
  is_premium_active: boolean
  requires_payment: boolean
}

/** `GET /api/subscription` → `data.billing` */
export interface SubscriptionBilling {
  billing_type?: string | null
  full_name?: string | null
  company_name?: string | null
  vat_number?: string | null
  vat_validated?: boolean | null
  address?: string | null
  postal_code?: string | null
  city?: string | null
  country?: string | null
}

/** Latest / active Stripe subscription row (`null` for free users). */
export interface StripeSubscriptionRow {
  status: SubscriptionStatus
  plan_name?: string | null
  product_name?: string | null
  name?: string | null
  amount?: number | null
  unit_amount?: number | null
  currency?: string | null
  interval?: string | null
  plan_interval?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  period_end?: string | null
  renews_at?: string | null
  cancel_at_period_end?: boolean
  canceled_at?: string | null
  trial_end?: string | null
}

/** `GET /api/subscription` → `data.payment_method` */
export interface SubscriptionPaymentMethod {
  brand?: string | null
  last4?: string | null
  card_brand?: string | null
  card_last4?: string | null
}

/** `GET /api/subscription` → `data.actions` */
export interface SubscriptionActions {
  can_upgrade: boolean
  can_retry_payment: boolean
  can_view_invoices: boolean
}

/** `GET /api/subscription` → `data.stripe` */
export interface SubscriptionStripeIds {
  customer_id?: string | null
  subscription_id?: string | null
}

/** Full payload from `GET /api/subscription`. */
export interface SubscriptionOverview {
  account: SubscriptionAccount
  billing: SubscriptionBilling
  subscription: StripeSubscriptionRow | null
  payment_method: SubscriptionPaymentMethod | null
  actions: SubscriptionActions
  stripe: SubscriptionStripeIds
}

interface ApiSuccessResponse<T> {
  success?: boolean
  data?: T
  message?: string
}

export class SubscriptionApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubscriptionApiError'
  }
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

function assertSuccess<T>(payload: ApiSuccessResponse<T> | T, fallback: string): T {
  if (isPlainRecord(payload) && 'success' in payload) {
    const wrapped = payload as ApiSuccessResponse<T>
    if (wrapped.success === false) {
      throw new SubscriptionApiError(wrapped.message || fallback)
    }
    if (wrapped.data !== undefined) return wrapped.data
  }
  return payload as T
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function num(v: unknown): number | null {
  return typeof v === 'number' ? v : null
}

function parseAccount(raw: Record<string, unknown> | undefined): SubscriptionAccount {
  const r = raw ?? {}
  return {
    account_type: str(r.account_type, 'free'),
    status: str(r.status, 'active'),
    is_premium: bool(r.is_premium),
    is_premium_active: bool(r.is_premium_active),
    requires_payment: bool(r.requires_payment),
  }
}

function parseBilling(raw: Record<string, unknown> | undefined): SubscriptionBilling {
  const r = raw ?? {}
  return {
    billing_type: (r.billing_type as string | null | undefined) ?? null,
    full_name: (r.full_name as string | null | undefined) ?? null,
    company_name: (r.company_name as string | null | undefined) ?? null,
    vat_number: (r.vat_number as string | null | undefined) ?? null,
    vat_validated:
      typeof r.vat_validated === 'boolean' ? r.vat_validated : null,
    address: (r.address as string | null | undefined) ?? null,
    postal_code: (r.postal_code as string | null | undefined) ?? null,
    city: (r.city as string | null | undefined) ?? null,
    country: (r.country as string | null | undefined) ?? null,
  }
}

function parseStripeRow(raw: Record<string, unknown>): StripeSubscriptionRow {
  return {
    status: str(raw.status, 'active') as SubscriptionStatus,
    plan_name: (raw.plan_name as string | null | undefined) ?? null,
    product_name: (raw.product_name as string | null | undefined) ?? null,
    name: (raw.name as string | null | undefined) ?? null,
    amount: num(raw.amount),
    unit_amount: num(raw.unit_amount),
    currency: (raw.currency as string | null | undefined) ?? null,
    interval: (raw.interval as string | null | undefined) ?? null,
    plan_interval: (raw.plan_interval as string | null | undefined) ?? null,
    current_period_start:
      (raw.current_period_start as string | null | undefined) ?? null,
    current_period_end:
      (raw.current_period_end as string | null | undefined) ??
      (raw.period_end as string | null | undefined) ??
      (raw.renews_at as string | null | undefined) ??
      null,
    period_end: (raw.period_end as string | null | undefined) ?? null,
    renews_at: (raw.renews_at as string | null | undefined) ?? null,
    cancel_at_period_end: bool(raw.cancel_at_period_end),
    canceled_at: (raw.canceled_at as string | null | undefined) ?? null,
    trial_end: (raw.trial_end as string | null | undefined) ?? null,
  }
}

function parsePaymentMethod(
  raw: Record<string, unknown> | null | undefined
): SubscriptionPaymentMethod | null {
  if (!raw) return null
  const brand = str(raw.brand) || str(raw.card_brand) || null
  const last4 = str(raw.last4) || str(raw.card_last4) || null
  if (!brand && !last4) return null
  return {
    brand: brand || null,
    last4: last4 || null,
    card_brand: brand || null,
    card_last4: last4 || null,
  }
}

function parseActions(raw: Record<string, unknown> | undefined): SubscriptionActions {
  const r = raw ?? {}
  return {
    can_upgrade: bool(r.can_upgrade),
    can_retry_payment: bool(r.can_retry_payment),
    can_view_invoices: bool(r.can_view_invoices),
  }
}

function parseStripeIds(raw: Record<string, unknown> | undefined): SubscriptionStripeIds {
  const r = raw ?? {}
  return {
    customer_id: (r.customer_id as string | null | undefined) ?? null,
    subscription_id: (r.subscription_id as string | null | undefined) ?? null,
  }
}

function parseSubscriptionOverview(body: Record<string, unknown>): SubscriptionOverview {
  const inner = isPlainRecord(body.data) ? body.data : body

  if (!isPlainRecord(inner)) {
    throw new SubscriptionApiError('Invalid subscription response')
  }

  const subRaw = inner.subscription
  let subscription: StripeSubscriptionRow | null = null
  if (subRaw != null && isPlainRecord(subRaw)) {
    subscription = parseStripeRow(subRaw)
  }

  const pmRaw = inner.payment_method
  const payment_method = isPlainRecord(pmRaw)
    ? parsePaymentMethod(pmRaw)
    : null

  return {
    account: parseAccount(
      isPlainRecord(inner.account) ? inner.account : undefined
    ),
    billing: parseBilling(
      isPlainRecord(inner.billing) ? inner.billing : undefined
    ),
    subscription,
    payment_method,
    actions: parseActions(
      isPlainRecord(inner.actions) ? inner.actions : undefined
    ),
    stripe: parseStripeIds(
      isPlainRecord(inner.stripe) ? inner.stripe : undefined
    ),
  }
}

function extractPortalUrl(body: Record<string, unknown>): string {
  const candidates = [
    body.url,
    body.portal_url,
    body.billing_portal_url,
    isPlainRecord(body.data) ? body.data.url : undefined,
    isPlainRecord(body.data) ? body.data.portal_url : undefined,
  ]
  const url = candidates.find((v): v is string => typeof v === 'string' && v.length > 0)
  if (!url) throw new SubscriptionApiError('No billing portal URL received.')
  return url
}

/** Billing + subscription overview for the authenticated user. */
export async function fetchSubscription(): Promise<SubscriptionOverview> {
  const response = await api.get<ApiSuccessResponse<unknown>>('/subscription')
  const body = assertSuccess(response.data, 'Failed to load subscription')
  return parseSubscriptionOverview(body as unknown as Record<string, unknown>)
}

/**
 * Create a Stripe Customer Portal session (self-service billing).
 * Backend should use Billing Portal — no payment_method_types on the server.
 */
export async function createBillingPortalSession(returnUrl?: string): Promise<string> {
  const response = await api.post<ApiSuccessResponse<unknown>>('/subscription/billing-portal', {
    return_url: returnUrl ?? window.location.href,
  })
  const body = assertSuccess(response.data, 'Failed to open billing portal')
  return extractPortalUrl(body as unknown as Record<string, unknown>)
}

export function subscriptionPlanName(row: StripeSubscriptionRow | null): string {
  if (!row) return 'Premium'
  return row.plan_name || row.product_name || row.name || 'Premium'
}

export function subscriptionAmount(row: StripeSubscriptionRow | null): number {
  if (!row) return 0
  return row.amount ?? row.unit_amount ?? 0
}

export function subscriptionCurrency(row: StripeSubscriptionRow | null): string {
  return (row?.currency ?? 'eur').toLowerCase()
}

export function subscriptionInterval(row: StripeSubscriptionRow | null): string {
  return row?.interval ?? row?.plan_interval ?? 'month'
}

export function subscriptionPeriodEnd(row: StripeSubscriptionRow | null): string | null {
  if (!row) return null
  return row.current_period_end ?? row.period_end ?? row.renews_at ?? null
}

export function paymentMethodBrand(pm: SubscriptionPaymentMethod | null): string | null {
  if (!pm) return null
  return pm.brand || pm.card_brand || null
}

export function paymentMethodLast4(pm: SubscriptionPaymentMethod | null): string | null {
  if (!pm) return null
  return pm.last4 || pm.card_last4 || null
}

export function formatBillingType(type: string | null | undefined): string {
  const t = (type || '').toLowerCase()
  if (t === 'business') return 'Business'
  if (t === 'private' || t === 'individual') return 'Private'
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : ''
}

export function formatBillingAddress(b: SubscriptionBilling): string | null {
  const parts = [b.address, b.postal_code, b.city, b.country].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

export function formatBillingName(b: SubscriptionBilling): string | null {
  return b.company_name || b.full_name || null
}

export function formatSubscriptionAmount(amount: number, currency: string): string {
  const value = amount / 100
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`
  }
}

export function formatSubscriptionDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function subscriptionStatusLabel(status: string): string {
  const s = (status || '').toLowerCase().replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function subscriptionIntervalLabel(interval: string): string {
  const i = (interval || 'month').toLowerCase()
  if (i === 'month') return 'Monthly'
  if (i === 'year') return 'Yearly'
  return i.charAt(0).toUpperCase() + i.slice(1)
}

export function accountStatusLabel(account: SubscriptionAccount): string {
  if (account.requires_payment) return 'Payment required'
  if (account.is_premium_active) return 'Active'
  if (account.is_premium && !account.is_premium_active) return 'Inactive'
  return subscriptionStatusLabel(account.status)
}
