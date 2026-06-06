<template>
  <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-gray-50 tw:px-4 tw:py-12">
    <div class="tw:w-full tw:max-w-md">

      <!-- STEP 0: Profile Type Selection -->
      <div v-if="!selectedProfileType" class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <h1 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-2" style="color: var(--primary-color)">
          Create Account
        </h1>
        <p class="tw:text-gray-500 tw:text-center tw:mb-8">Choose your profile type to get started</p>

        <div class="tw:grid tw:grid-cols-2 tw:gap-4">
          <button v-for="pType in profileTypes" :key="pType.value" @click="selectedProfileType = pType.value"
            class="no-hover tw:flex tw:flex-col tw:items-center tw:gap-2 tw:p-5 tw:rounded-xl tw:border-2 tw:border-gray-200 tw:transition-all tw:duration-200 hover:tw:border-[var(--primary-color)] hover:tw:bg-blue-50">
            <span class="tw:text-3xl">{{ pType.icon }}</span>
            <span class="tw:font-semibold tw:text-gray-700">{{ pType.label }}</span>
          </button>
        </div>

        <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
          Already have an account?
          <router-link to="/login" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
            Sign In
          </router-link>
        </p>
      </div>

      <!-- STEP 1: Registration Form -->
      <div v-else-if="currentStep === 1" class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <button @click="selectedProfileType = ''"
          class="no-hover tw:text-sm tw:text-gray-500 tw:mb-4 tw:flex tw:items-center tw:gap-1 hover:tw:text-gray-700">
          ← Back
        </button>

        <h1 class="tw:text-2xl tw:font-bold tw:mb-1" style="color: var(--primary-color)">
          Register as {{ selectedProfileLabel }}
        </h1>
        <p class="tw:text-gray-500 tw:text-sm tw:mb-6">Fill in your details to create an account</p>

        <div
          v-if="invitationBanner"
          class="tw:mb-4 tw:rounded-lg tw:border tw:border-blue-200 tw:bg-blue-50 tw:px-4 tw:py-3 tw:text-sm tw:text-blue-900"
        >
          {{ invitationBanner }}
        </div>

        <!-- Server Error Banner -->
        <div v-if="authStore.error"
          class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleRegisterStep" class="tw:space-y-4">
          <!-- Name -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Name</label>
            <input
              ref="el_name"
              v-model="form.name"
              type="text"
              placeholder="Your full name"
              @input="clearFieldError('name')"
              :class="inputClass(formErrors.name)"
            />
            <p v-if="formErrors.name" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ formErrors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Email</label>
            <input
              ref="el_email"
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              @input="clearFieldError('email')"
              :class="inputClass(formErrors.email)"
            />
            <p v-if="formErrors.email" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ formErrors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Password</label>
            <div class="tw:relative">
              <input
                ref="el_password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 8 characters"
                @input="clearFieldError('password')"
                :class="[...inputClass(formErrors.password), 'tw:pr-12']"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:text-gray-400 hover:tw:text-gray-600 tw:transition"
                aria-label="Toggle password visibility"
              >
                <component :is="showPassword ? EyeOff : Eye" class="tw:w-5 tw:h-5" />
              </button>
            </div>
            <p v-if="formErrors.password" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ formErrors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Confirm Password</label>
            <div class="tw:relative">
              <input
                ref="el_password_confirmation"
                v-model="form.password_confirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                placeholder="Repeat your password"
                @input="clearFieldError('password_confirmation')"
                :class="[...inputClass(formErrors.password_confirmation), 'tw:pr-12']"
              />
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:text-gray-400 hover:tw:text-gray-600 tw:transition"
                aria-label="Toggle confirm password visibility"
              >
                <component :is="showPasswordConfirmation ? EyeOff : Eye" class="tw:w-5 tw:h-5" />
              </button>
            </div>
            <p v-if="formErrors.password_confirmation" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ formErrors.password_confirmation }}</p>
          </div>

          <!-- Plan Selection -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-3">Select Plan</label>
            <div class="tw:grid tw:grid-cols-2 tw:gap-3">
              <button type="button" @click="form.plan = 'free'; clearFieldError('plan')"
                :class="planCardClass(form.plan === 'free')">
                <div class="tw:flex tw:items-center tw:justify-between tw:w-full">
                  <span class="tw:text-lg">🆓</span>
                  <div :class="radioCircleClass(form.plan === 'free')">
                    <div v-if="form.plan === 'free'" class="tw:w-2 tw:h-2 tw:rounded-full" style="background: var(--primary-color)"></div>
                  </div>
                </div>
                <span class="tw:font-semibold tw:text-gray-800 tw:text-sm">Free</span>
                <span class="tw:text-xs tw:text-gray-500">Basic access</span>
              </button>

              <button type="button" @click="form.plan = 'premium'; clearFieldError('plan')"
                :class="planCardClass(form.plan === 'premium')">
                <div class="tw:flex tw:items-center tw:justify-between tw:w-full">
                  <span class="tw:text-lg">⭐</span>
                  <div :class="radioCircleClass(form.plan === 'premium')">
                    <div v-if="form.plan === 'premium'" class="tw:w-2 tw:h-2 tw:rounded-full" style="background: var(--primary-color)"></div>
                  </div>
                </div>
                <span class="tw:font-semibold tw:text-gray-800 tw:text-sm">Premium</span>
                <span class="tw:text-xs tw:text-gray-500">Full access</span>
              </button>
            </div>
            <p v-if="formErrors.plan" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ formErrors.plan }}</p>
          </div>

          <button type="submit" :disabled="authStore.loading"
            class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
            :style="{ backgroundColor: authStore.loading ? '#93b4f5' : 'var(--primary-color)' }">
            <span v-if="authStore.loading">Please wait...</span>
            <span v-else-if="form.plan === 'premium'">Continue →</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <p class="tw:text-center tw:text-sm tw:text-gray-500 tw:mt-6">
          Already have an account?
          <router-link to="/login" class="no-hover tw:font-semibold hover:tw:underline" style="color: var(--primary-color)">
            Sign In
          </router-link>
        </p>
      </div>

      <!-- STEP 2: Billing Type Selection -->
      <div v-else-if="currentStep === 2" class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <StepIndicator :current="2" />

        <button @click="currentStep = 1"
          class="no-hover tw:text-sm tw:text-gray-500 tw:mb-4 tw:flex tw:items-center tw:gap-1 hover:tw:text-gray-700">
          ← Back
        </button>

        <h1 class="tw:text-2xl tw:font-bold tw:mb-1" style="color: var(--primary-color)">Billing Type</h1>
        <p class="tw:text-gray-500 tw:text-sm tw:mb-6">How would you like to be billed?</p>

        <div class="tw:space-y-3 tw:mb-2">
          <button type="button" @click="billing.type = 'private'; clearBillingError('type')"
            :class="billingTypeCardClass(billing.type === 'private')">
            <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-100 tw:flex tw:items-center tw:justify-center tw:text-xl tw:flex-shrink-0">👤</div>
            <div class="tw:flex-1">
              <div class="tw:font-semibold tw:text-gray-800">Private Individual</div>
              <div class="tw:text-xs tw:text-gray-500 tw:mt-0.5">Personal billing, no VAT required</div>
            </div>
            <div :class="radioCircleClass(billing.type === 'private', 'lg')">
              <div v-if="billing.type === 'private'" class="tw:w-2.5 tw:h-2.5 tw:rounded-full" style="background: var(--primary-color)"></div>
            </div>
          </button>

          <button type="button" @click="billing.type = 'business'; clearBillingError('type')"
            :class="billingTypeCardClass(billing.type === 'business')">
            <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-purple-100 tw:flex tw:items-center tw:justify-center tw:text-xl tw:flex-shrink-0">🏢</div>
            <div class="tw:flex-1">
              <div class="tw:font-semibold tw:text-gray-800">Business</div>
              <div class="tw:text-xs tw:text-gray-500 tw:mt-0.5">Company billing with VAT number</div>
            </div>
            <div :class="radioCircleClass(billing.type === 'business', 'lg')">
              <div v-if="billing.type === 'business'" class="tw:w-2.5 tw:h-2.5 tw:rounded-full" style="background: var(--primary-color)"></div>
            </div>
          </button>
        </div>

        <p v-if="billingErrors.type" class="tw:text-red-500 tw:text-xs tw:mb-4">{{ billingErrors.type }}</p>

        <button type="button" @click="handleBillingTypeNext"
          class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:mt-2"
          :style="{ backgroundColor: 'var(--primary-color)' }">
          Continue →
        </button>
      </div>

      <!-- STEP 3: Billing Details -->
      <div v-else-if="currentStep === 3" class="tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-6 md:tw:p-8 animate-fade-in">
        <StepIndicator :current="3" />

        <button @click="currentStep = 2"
          class="no-hover tw:text-sm tw:text-gray-500 tw:mb-4 tw:flex tw:items-center tw:gap-1 hover:tw:text-gray-700">
          ← Back
        </button>

        <div class="tw:flex tw:items-center tw:gap-2 tw:mb-1">
          <h1 class="tw:text-2xl tw:font-bold" style="color: var(--primary-color)">Billing Details</h1>
          <span class="tw:text-xs tw:px-2 tw:py-1 tw:rounded-full tw:font-medium"
            :class="billing.type === 'business' ? 'tw:bg-purple-100 tw:text-purple-700' : 'tw:bg-blue-100 tw:text-blue-700'">
            {{ billing.type === 'business' ? '🏢 Business' : '👤 Private' }}
          </span>
        </div>
        <p class="tw:text-gray-500 tw:text-sm tw:mb-6">Enter your billing information</p>

        <!-- Server Error Banner -->
        <div v-if="authStore.error"
          class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleBillingSubmit" class="tw:space-y-4">

          <!-- Business: Company Name -->
          <div v-if="billing.type === 'business'">
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Company Name <span class="tw:text-red-400">*</span></label>
            <input
              ref="el_companyName"
              v-model="billing.companyName"
              type="text"
              placeholder="Acme Corp"
              @input="clearBillingError('companyName')"
              :class="inputClass(billingErrors.companyName)"
            />
            <p v-if="billingErrors.companyName" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.companyName }}</p>
          </div>

          <!-- Business: VAT Number -->
          <div v-if="billing.type === 'business'">
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">VAT Number <span class="tw:text-red-400">*</span></label>
            <div class="tw:relative">
              <input
                ref="el_vatNumber"
                v-model="billing.vatNumber"
                type="text"
                placeholder="e.g. DE123456789"
                @input="onVatInput"
                @blur="validateVat"
                :class="[
                  'tw:w-full tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition tw:pr-10',
                  billingErrors.vatNumber
                    ? 'tw:border-red-400 tw:bg-red-50 focus:tw:border-red-400'
                    : vatValidationState === 'valid'
                      ? 'tw:border-green-400 tw:bg-green-50 focus:tw:border-green-400'
                      : 'tw:border-gray-300 focus:tw:border-[var(--secondary-color)]'
                ]"
              />
              <div class="tw:absolute tw:right-3 tw:top-1/2 -tw:translate-y-1/2 tw:text-sm">
                <span v-if="vatValidating" class="tw:text-gray-400">⏳</span>
                <span v-else-if="vatValidationState === 'valid'" class="tw:text-green-500 tw:font-bold">✓</span>
              </div>
            </div>
            <p v-if="billingErrors.vatNumber" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.vatNumber }}</p>
            <p v-else-if="vatValidationState === 'valid'" class="tw:text-green-600 tw:text-xs tw:mt-1">✓ Valid EU VAT number</p>
          </div>

          <!-- Private: Full Name -->
          <div v-if="billing.type === 'private'">
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Full Name <span class="tw:text-red-400">*</span></label>
            <input
              ref="el_fullName"
              v-model="billing.fullName"
              type="text"
              placeholder="Your legal full name"
              @input="clearBillingError('fullName')"
              :class="inputClass(billingErrors.fullName)"
            />
            <p v-if="billingErrors.fullName" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.fullName }}</p>
          </div>

          <!-- Country -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Country <span class="tw:text-red-400">*</span></label>
            <input
              ref="el_country"
              v-model="billing.country"
              type="text"
              placeholder="e.g. Germany"
              @input="clearBillingError('country')"
              :class="inputClass(billingErrors.country)"
            />
            <p v-if="billingErrors.country" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.country }}</p>
          </div>

          <!-- Address -->
          <div>
            <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Address <span class="tw:text-red-400">*</span></label>
            <input
              ref="el_address"
              v-model="billing.address"
              type="text"
              placeholder="Street address"
              @input="clearBillingError('address')"
              :class="inputClass(billingErrors.address)"
            />
            <p v-if="billingErrors.address" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.address }}</p>
          </div>

          <!-- Postal Code + City -->
          <div class="tw:grid tw:grid-cols-2 tw:gap-3">
            <div>
              <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Postal Code <span class="tw:text-red-400">*</span></label>
              <input
                ref="el_postalCode"
                v-model="billing.postalCode"
                type="text"
                placeholder="12345"
                @input="clearBillingError('postalCode')"
                :class="inputClass(billingErrors.postalCode)"
              />
              <p v-if="billingErrors.postalCode" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.postalCode }}</p>
            </div>
            <div>
              <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">City <span class="tw:text-red-400">*</span></label>
              <input
                ref="el_city"
                v-model="billing.city"
                type="text"
                placeholder="City"
                @input="clearBillingError('city')"
                :class="inputClass(billingErrors.city)"
              />
              <p v-if="billingErrors.city" class="tw:text-red-500 tw:text-xs tw:mt-1">{{ billingErrors.city }}</p>
            </div>
          </div>

          <button type="submit" :disabled="authStore.loading"
            class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2"
            :style="{ backgroundColor: authStore.loading ? '#93b4f5' : 'var(--primary-color)' }">
            <svg v-if="authStore.loading" class="tw:animate-spin tw:w-4 tw:h-4" fill="none" viewBox="0 0 24 24">
              <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="tw:opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>{{ authStore.loading ? 'Redirecting to payment...' : 'Continue to Payment →' }}</span>
          </button>
        </form>
      </div>

    </div>

    <PaymentLoadingOverlay :visible="redirectingToStripe" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { fetchGuestInvitationByToken } from '@/api/guestInvitations'
import { useAuthStore } from '@/stores/auth'
import PaymentLoadingOverlay from '@/components/ui/PaymentLoadingOverlay.vue'

// ── Inline step indicator ─────────────────────────────────
const StepIndicator = {
  props: { current: Number },
  template: `
    <div class="tw:flex tw:items-center tw:gap-2 tw:mb-6">
      <div class="tw:flex tw:items-center tw:gap-1.5">
        <div class="tw:w-7 tw:h-7 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:text-white" style="background: var(--primary-color)">&#10003;</div>
        <span class="tw:text-xs tw:text-gray-400">Account</span>
      </div>
      <div class="tw:flex-1 tw:h-px tw:bg-gray-200"></div>
      <div class="tw:flex tw:items-center tw:gap-1.5">
        <div class="tw:w-7 tw:h-7 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold"
          :class="current >= 2 ? 'tw:text-white' : 'tw:text-gray-500 tw:bg-gray-200'"
          :style="current >= 2 ? 'background: var(--primary-color)' : ''">{{ current > 2 ? '&#10003;' : '2' }}</div>
        <span class="tw:text-xs" :class="current === 2 ? 'tw:font-medium' : 'tw:text-gray-400'" :style="current === 2 ? 'color: var(--primary-color)' : ''">Billing</span>
      </div>
      <div class="tw:flex-1 tw:h-px tw:bg-gray-200"></div>
      <div class="tw:flex tw:items-center tw:gap-1.5">
        <div class="tw:w-7 tw:h-7 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold"
          :class="current >= 3 ? 'tw:text-white' : 'tw:text-gray-500 tw:bg-gray-200'"
          :style="current >= 3 ? 'background: var(--primary-color)' : ''">3</div>
        <span class="tw:text-xs" :class="current === 3 ? 'tw:font-medium' : 'tw:text-gray-400'" :style="current === 3 ? 'color: var(--primary-color)' : ''">Payment</span>
      </div>
    </div>
  `
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const invitationToken = ref('')
const invitationBanner = ref('')

function mapInvitationRoleToProfileType(role: string): string {
  const r = String(role ?? '').toLowerCase()
  if (r === 'organiser' || r === 'organizer') return 'organizer'
  if (r === 'venue') return 'venue'
  if (r === 'talent') return 'talent'
  return 'event'
}

onMounted(async () => {
  const token = typeof route.query.invitation_token === 'string' ? route.query.invitation_token : ''
  if (!token) return

  invitationToken.value = token
  try {
    const res = await fetchGuestInvitationByToken(token)
    if (res.success && res.data?.valid) {
      form.value.email = res.data.email ?? form.value.email
      if (res.data.name) form.value.name = res.data.name
      selectedProfileType.value = mapInvitationRoleToProfileType(res.data.receiver_type ?? '')
      invitationBanner.value = res.data.event_title
        ? `You are invited to join "${res.data.event_title}" on EventsMap.`
        : 'You have been invited to join an event on EventsMap.'
      currentStep.value = 1
    }
  } catch {
    invitationBanner.value = 'This invitation link is invalid or has expired.'
  }
})

// ── Profile types ─────────────────────────────────────────
const profileTypes = [
  { value: 'event',     label: 'Event',     icon: '\uD83C\uDFAA' },
  { value: 'talent',    label: 'Talent',    icon: '\uD83C\uDFA4' },
  { value: 'organizer', label: 'Organizer', icon: '\uD83D\uDCCB' },
  { value: 'venue',     label: 'Venue',     icon: '\uD83C\uDFDB\uFE0F' },
]

const selectedProfileType = ref('')
const currentStep = ref(1)
const redirectingToStripe = ref(false)

const selectedProfileLabel = computed(() =>
  profileTypes.find(p => p.value === selectedProfileType.value)?.label || ''
)

// ── Step 1 ────────────────────────────────────────────────
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  plan: '' as 'free' | 'premium' | '',
})

const formErrors = ref<Record<string, string>>({})

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const el_name                 = ref<HTMLInputElement | null>(null)
const el_email                = ref<HTMLInputElement | null>(null)
const el_password             = ref<HTMLInputElement | null>(null)
const el_password_confirmation = ref<HTMLInputElement | null>(null)

function clearFieldError(field: string) {
  delete formErrors.value[field]
  if (authStore.validationErrors[field]) authStore.validationErrors[field] = []
}

function validateStep1(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.name.trim())
    e.name = 'Name is required.'
  if (!form.value.email.trim())
    e.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    e.email = 'Please enter a valid email address.'
  if (!form.value.password)
    e.password = 'Password is required.'
  else if (form.value.password.length < 8)
    e.password = 'Password must be at least 8 characters.'
  if (!form.value.password_confirmation)
    e.password_confirmation = 'Please confirm your password.'
  else if (form.value.password !== form.value.password_confirmation)
    e.password_confirmation = 'Passwords do not match.'
  if (!form.value.plan)
    e.plan = 'Please select a plan to continue.'

  formErrors.value = e

  if (Object.keys(e).length > 0) {
    nextTick(() => {
      const map: Record<string, typeof el_name> = {
        name: el_name,
        email: el_email,
        password: el_password,
        password_confirmation: el_password_confirmation,
      }
      const first = Object.keys(e)[0] as string
      map[first]?.value?.focus()
    })
    return false
  }
  return true
}

async function handleRegisterStep() {
  if (!validateStep1()) return

  if (form.value.plan === 'free') {
    const result = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      profile_type: selectedProfileType.value,
      account_type: 'free',
      status: 'active',
      ...(invitationToken.value ? { invitation_token: invitationToken.value } : {}),
    } as any)
    if (result.success) router.push({ name: 'Login', query: { verified: 'pending' } })
  } else {
    currentStep.value = 2
  }
}

// ── Step 2 & 3: Billing ───────────────────────────────────
const billing = ref({
  type: '' as 'private' | 'business' | '',
  fullName: '',
  companyName: '',
  vatNumber: '',
  country: '',
  address: '',
  postalCode: '',
  city: '',
  vatValidated: false,
})

const billingErrors   = ref<Record<string, string>>({})
const vatValidating   = ref(false)
const vatValidationState = ref<'idle' | 'valid' | 'invalid'>('idle')

const el_fullName    = ref<HTMLInputElement | null>(null)
const el_companyName = ref<HTMLInputElement | null>(null)
const el_vatNumber   = ref<HTMLInputElement | null>(null)
const el_country     = ref<HTMLInputElement | null>(null)
const el_address     = ref<HTMLInputElement | null>(null)
const el_postalCode  = ref<HTMLInputElement | null>(null)
const el_city        = ref<HTMLInputElement | null>(null)

function clearBillingError(field: string) {
  delete billingErrors.value[field]
}

function onVatInput() {
  clearBillingError('vatNumber')
  vatValidationState.value = 'idle'
  billing.value.vatValidated = false
}

function isValidVatFormat(vat: string): boolean {
  return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(vat.toUpperCase().replace(/\s/g, ''))
}

async function validateVat() {
  if (!billing.value.vatNumber) return
  vatValidating.value = true
  // Replace with real API call to your backend for EU VIES validation
  await new Promise(r => setTimeout(r, 500))
  const valid = isValidVatFormat(billing.value.vatNumber)
  vatValidationState.value = valid ? 'valid' : 'invalid'
  billing.value.vatValidated = valid
  vatValidating.value = false
  if (!valid) billingErrors.value.vatNumber = 'Invalid VAT number. Please check and try again.'
}

function handleBillingTypeNext() {
  if (!billing.value.type) {
    billingErrors.value.type = 'Please select a billing type to continue.'
    return
  }
  currentStep.value = 3
}

function validateBillingDetails(): boolean {
  const e: Record<string, string> = {}
  const b = billing.value

  // Alphabetic validation regex (allows letters, spaces, hyphens, apostrophes)
  const alphabeticRegex = /^[A-Za-z\s\-']+$/
  // Numeric validation regex
  const numericRegex = /^[0-9]+$/

  if (b.type === 'private') {
    if (!b.fullName.trim()) e.fullName = 'Full name is required.'
    else if (!alphabeticRegex.test(b.fullName.trim())) e.fullName = 'Full name must contain only alphabetic characters.'
  } else {
    if (!b.companyName.trim()) e.companyName = 'Company name is required.'
    else if (!alphabeticRegex.test(b.companyName.trim())) e.companyName = 'Company name must contain only alphabetic characters.'
    if (!b.vatNumber.trim())   e.vatNumber   = 'VAT number is required.'
    else if (vatValidationState.value !== 'valid') e.vatNumber = 'Please enter a valid VAT number.'
  }

  if (!b.country.trim())    e.country    = 'Country is required.'
  else if (!alphabeticRegex.test(b.country.trim())) e.country = 'Country must contain only alphabetic characters.'
  if (!b.address.trim())    e.address    = 'Address is required.'
  if (!b.postalCode.trim()) e.postalCode = 'Postal code is required.'
  else if (!numericRegex.test(b.postalCode.trim())) e.postalCode = 'Postal code must contain only numbers.'
  if (!b.city.trim())       e.city       = 'City is required.'
  else if (!alphabeticRegex.test(b.city.trim())) e.city = 'City must contain only alphabetic characters.'

  billingErrors.value = e

  if (Object.keys(e).length > 0) {
    nextTick(() => {
      const map: Record<string, typeof el_fullName> = {
        fullName:    el_fullName,
        companyName: el_companyName,
        vatNumber:   el_vatNumber,
        country:     el_country,
        address:     el_address,
        postalCode:  el_postalCode,
        city:        el_city,
      }
      const first = Object.keys(e)[0] as string
      map[first]?.value?.focus()
    })
    return false
  }
  return true
}

async function handleBillingSubmit() {
  // Trigger VAT validation if not yet done
  if (billing.value.type === 'business' && billing.value.vatNumber && vatValidationState.value === 'idle') {
    await validateVat()
  }
  if (!validateBillingDetails()) return

  redirectingToStripe.value = true

  const payload: Record<string, any> = {
    name: form.value.name,
    email: form.value.email,
    password: form.value.password,
    password_confirmation: form.value.password_confirmation,
    profile_type: selectedProfileType.value,
    account_type: 'premium',
    status: 'pending_payment',
    billing_type: billing.value.type,
    country: billing.value.country,
    address: billing.value.address,
    postal_code: billing.value.postalCode,
    city: billing.value.city,
  }

  if (billing.value.type === 'private') {
    payload.full_name    = billing.value.fullName
    payload.company_name = null
    payload.vat_number   = null
  } else {
    payload.company_name  = billing.value.companyName
    payload.vat_number    = billing.value.vatNumber
    payload.vat_validated = billing.value.vatValidated
  }

  if (invitationToken.value) {
    payload.invitation_token = invitationToken.value
  }

  const result = await authStore.register(payload as any)
  if (result.success && result.checkout_url) {
    window.location.href = result.checkout_url
  } else {
    redirectingToStripe.value = false
  }
}

// ── Style helpers ─────────────────────────────────────────
function inputClass(hasError?: string): string[] {
  return [
    'tw:w-full tw:border tw:rounded-lg tw:px-4 tw:py-2.5 tw:outline-none tw:transition',
    hasError
      ? 'tw:border-red-400 tw:bg-red-50 focus:tw:border-red-400'
      : 'tw:border-gray-300 focus:tw:border-[var(--secondary-color)]',
  ]
}

function planCardClass(active: boolean): string[] {
  return [
    'no-hover tw:relative tw:flex tw:flex-col tw:items-start tw:gap-1 tw:p-4 tw:rounded-xl tw:border-2 tw:transition-all tw:duration-200 tw:text-left',
    active ? 'tw:border-[var(--primary-color)] tw:bg-blue-50' : 'tw:border-gray-200 hover:tw:border-gray-300',
  ]
}

function billingTypeCardClass(active: boolean): string[] {
  return [
    'no-hover tw:w-full tw:flex tw:items-center tw:gap-4 tw:p-4 tw:rounded-xl tw:border-2 tw:transition-all tw:duration-200 tw:text-left',
    active ? 'tw:border-[var(--primary-color)] tw:bg-blue-50' : 'tw:border-gray-200 hover:tw:border-gray-300',
  ]
}

function radioCircleClass(active: boolean, size: 'sm' | 'lg' = 'sm'): string[] {
  return [
    size === 'lg' ? 'tw:w-5 tw:h-5 tw:flex-shrink-0' : 'tw:w-4 tw:h-4',
    'tw:rounded-full tw:border-2 tw:flex tw:items-center tw:justify-center tw:transition-all',
    active ? 'tw:border-[var(--primary-color)]' : 'tw:border-gray-300',
  ]
}
</script>