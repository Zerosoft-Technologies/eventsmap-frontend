/**
 * Frontend chat message validation.
 * Replaces backend validate-message API with local validation.
 */

const MAX_LENGTH = 1000
const MIN_SEND_INTERVAL_MS = 1000
const MAX_CONSECUTIVE_SAME = 3

/** Restricted words - extend as needed */
const BLOCKED_WORDS = new Set([
  'fuck', 'fucking', 'fucked', 'shit', 'shitty', 'ass', 'asshole',
  'bitch', 'bastard', 'damn', 'idiot', 'stupid', 'dumb', 'retard',
  'nigger', 'nigga', 'fag', 'faggot', 'whore', 'slut', 'cunt',
  'kill', 'death', 'die', 'hate', 'hateful', 'racist', 'nazi',
].map(w => w.toLowerCase()))

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface SpamState {
  lastSendTime: number
  lastMessage: string
  consecutiveSame: number
}

/** Create initial spam state */
export function createSpamState(): SpamState {
  return {
    lastSendTime: 0,
    lastMessage: '',
    consecutiveSame: 0,
  }
}

/** Check if text contains blocked words */
function hasBlockedWords(text: string): boolean {
  const lower = text.toLowerCase()
  const words = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean)
  return words.some(w => BLOCKED_WORDS.has(w))
}

/** Check for excessive special characters (e.g. !!!!!!!!!) */
function hasExcessiveSpecialChars(text: string): boolean {
  const match = text.match(/(.)\1{4,}/)
  return !!match
}

/** Check for repeated abusive phrases (e.g. "idiot idiot idiot") - only for blocked words */
function hasRepeatedInsults(text: string): boolean {
  const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean)
  const counts = new Map<string, number>()
  for (const w of words) {
    if (BLOCKED_WORDS.has(w)) {
      counts.set(w, (counts.get(w) ?? 0) + 1)
      if ((counts.get(w) ?? 0) >= 3) return true
    }
  }
  return false
}

/**
 * Validate message before sending. Does NOT call backend API.
 */
export function validateMessage(
  text: string,
  currentUserId: number,
  receiverId: number,
  spamState: SpamState
): ValidationResult {
  const trimmed = text.trim()

  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty.' }
  }

  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, error: `Message must be under ${MAX_LENGTH} characters.` }
  }

  if (!currentUserId || currentUserId <= 0) {
    return { valid: false, error: 'You must be logged in to send messages.' }
  }

  if (currentUserId === receiverId) {
    return { valid: false, error: 'You cannot message yourself.' }
  }

  if (hasBlockedWords(trimmed)) {
    return { valid: false, error: 'Your message contains inappropriate language.' }
  }

  if (hasExcessiveSpecialChars(trimmed)) {
    return { valid: false, error: 'Your message contains inappropriate language.' }
  }

  if (hasRepeatedInsults(trimmed)) {
    return { valid: false, error: 'Your message contains inappropriate language.' }
  }

  const now = Date.now()
  if (now - spamState.lastSendTime < MIN_SEND_INTERVAL_MS) {
    return { valid: false, error: 'Please wait a moment before sending another message.' }
  }

  if (trimmed === spamState.lastMessage) {
    const next = spamState.consecutiveSame + 1
    if (next > MAX_CONSECUTIVE_SAME) {
      return { valid: false, error: 'Please avoid sending spam messages.' }
    }
  }

  return { valid: true }
}

/** Update spam state after a message was sent */
export function updateSpamState(
  state: SpamState,
  message: string
): SpamState {
  const trimmed = message.trim()
  const isSame = trimmed === state.lastMessage
  return {
    lastSendTime: Date.now(),
    lastMessage: trimmed,
    consecutiveSame: isSame ? state.consecutiveSame + 1 : 1,
  }
}
