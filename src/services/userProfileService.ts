import api from '@/services/api'

/** Max image size for account profile photo (client-side guard). */
export const USER_PROFILE_AVATAR_MAX_BYTES = 3 * 1024 * 1024

export interface PutUserProfileFields {
  name: string
  password?: string
  password_confirmation?: string
  billing_type?: string
  address?: string
  country?: string
  company_name?: string
  vat_number?: string
  avatarFile?: File | null
}

export function buildUserProfileFormData(fields: PutUserProfileFields): FormData {
  const fd = new FormData()
  fd.append('name', fields.name)
  if (fields.password) {
    fd.append('password', fields.password)
    fd.append('password_confirmation', fields.password_confirmation ?? fields.password)
  }
  if (fields.billing_type) fd.append('billing_type', fields.billing_type)
  if (fields.address != null) fd.append('address', String(fields.address))
  if (fields.country != null) fd.append('country', String(fields.country))
  if (fields.company_name != null) fd.append('company_name', String(fields.company_name))
  if (fields.vat_number != null) fd.append('vat_number', String(fields.vat_number))
  if (fields.avatarFile) {
    fd.append('profile_image', fields.avatarFile)
  }
  return fd
}

export async function putUserProfileJson(payload: Record<string, unknown>) {
  const { data } = await api.put('user/profile', payload)
  return data
}

export async function putUserProfileMultipart(formData: FormData) {
  const { data } = await api.put('user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/** True when value looks like an API user object (id present). */
function isUserLikeRecord(o: unknown): o is Record<string, unknown> {
  if (!o || typeof o !== 'object') return false
  const id = (o as Record<string, unknown>).id
  return typeof id === 'number' || typeof id === 'string'
}

/**
 * Unwrap Laravel-style profile PUT responses so we get the inner user object.
 * Handles shapes like `{ data: { user } }`, `{ data: user }`, `{ user }`, etc.
 */
export function extractUserFromProfileUpdateResponse(data: unknown): Record<string, unknown> | null {
  if (data == null) return null
  if (isUserLikeRecord(data)) return data

  if (typeof data !== 'object') return null
  const root = data as Record<string, unknown>

  const fromNested = (node: unknown): Record<string, unknown> | null => {
    if (isUserLikeRecord(node)) return node
    if (!node || typeof node !== 'object') return null
    const o = node as Record<string, unknown>
    const cand = [o.user, o.data, o.resource]
    for (const c of cand) {
      const u = fromNested(c)
      if (u) return u
    }
    return null
  }

  return fromNested(root.data) ?? fromNested(root.user) ?? fromNested(root)
}
