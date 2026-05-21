<template>
  <div>
    <!-- ── Loading Skeleton ─────────────────────────────────── -->
    <div v-if="loadingUser" class="tw:animate-pulse">
      <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-12 tw:gap-6 tw:mb-8">
        <div class="tw:col-span-1 tw:md:col-span-7">
          <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-32 tw:mb-4"></div>
          <div class="tw:bg-gray-100 tw:rounded-xl tw:p-6 tw:min-h-[200px]">
            <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-20 tw:mb-3"></div>
            <div class="tw:h-7 tw:bg-gray-200 tw:rounded tw:w-16 tw:mb-2"></div>
            <div class="tw:h-4 tw:bg-gray-200 tw:rounded tw:w-48"></div>
          </div>
        </div>
        <div class="tw:col-span-1 tw:md:col-span-5">
          <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-40 tw:mb-4"></div>
          <div class="tw:bg-gray-100 tw:rounded-xl tw:p-6 tw:min-h-[200px] tw:flex tw:items-center tw:justify-center">
            <div class="tw:h-9 tw:bg-gray-200 tw:rounded-lg tw:w-32"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Premium: tabbed billing (no long scroll) ─────────── -->
    <div v-else-if="isPremium" class="plan-fade-in">
      <nav class="plan-subnav" aria-label="Premium billing sections">
        <button
          v-for="tab in premiumBillingTabs"
          :key="tab.id"
          type="button"
          :class="['no-hover plan-subnav__tab', premiumBillingTab === tab.id && 'plan-subnav__tab--active']"
          @click="premiumBillingTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Overview -->
      <div v-show="premiumBillingTab === 'overview'" class="overview-panel">
        <section class="overview-hero">
          <div class="overview-hero__glow" aria-hidden="true" />
          <div class="overview-hero__inner">
            <div class="overview-hero__main">
              <div class="overview-hero__meta">
                <span class="overview-hero__badge">
                  <Sparkles class="tw:w-3.5 tw:h-3.5" />
                  Premium
                </span>
                <span v-if="authStore.user?.created_at" class="overview-hero__since">
                  Since {{ formatDate(authStore.user.created_at) }}
                </span>
              </div>
              <h2 class="overview-hero__title">Premium plan</h2>
              <p class="overview-hero__subtitle">
                Everything you need to grow your events profile — analytics, visibility, and priority support.
              </p>

              <dl v-if="overviewSnapshot" class="overview-hero__stats">
                <div class="overview-stat">
                  <dt>Plan</dt>
                  <dd>{{ overviewPlanLabel }}</dd>
                </div>
                <div v-if="overviewPriceLabel" class="overview-stat">
                  <dt>Price</dt>
                  <dd>{{ overviewPriceLabel }}</dd>
                </div>
                <div class="overview-stat">
                  <dt>Status</dt>
                  <dd>
                    <span class="overview-stat__pill overview-stat__pill--active">Active</span>
                  </dd>
                </div>
              </dl>
              <div v-else-if="overviewSnapshotLoading" class="overview-hero__stats-skeleton">
                <span v-for="i in 3" :key="i" />
              </div>
            </div>

            <div class="overview-hero__emblem" aria-hidden="true">
              <div class="overview-hero__emblem-ring">
                <Crown class="tw:w-9 tw:h-9 tw:text-amber-600" stroke-width="1.5" />
              </div>
            </div>
          </div>
        </section>

        <section class="overview-benefits">
          <div class="overview-section-head">
            <h3 class="overview-section-head__title">Included in your plan</h3>
            <p class="overview-section-head__desc">Premium tools unlocked on your profile</p>
          </div>
          <ul class="overview-benefits__grid">
            <li
              v-for="item in premiumBenefitItems"
              :key="item.label"
              class="overview-benefit"
            >
              <span class="overview-benefit__icon">
                <component :is="item.icon" class="tw:w-4 tw:h-4" stroke-width="1.75" />
              </span>
              <span class="overview-benefit__label">{{ item.label }}</span>
            </li>
          </ul>
        </section>

        <section class="overview-actions-section">
          <div class="overview-section-head">
            <h3 class="overview-section-head__title">Quick access</h3>
            <p class="overview-section-head__desc">Manage billing details and receipts</p>
          </div>
          <div class="overview-actions">
            <button type="button" class="no-hover overview-action" @click="openBillingTab('subscription')">
              <span class="overview-action__icon overview-action__icon--blue">
                <Settings class="tw:w-5 tw:h-5" />
              </span>
              <span class="overview-action__content">
                <span class="overview-action__title">Subscription &amp; billing</span>
                <span class="overview-action__desc">Plan details, card &amp; billing address</span>
              </span>
              <span class="overview-action__arrow">
                <ArrowRight class="tw:w-4 tw:h-4" />
              </span>
            </button>
            <button type="button" class="no-hover overview-action" @click="openBillingTab('invoices')">
              <span class="overview-action__icon overview-action__icon--slate">
                <FileText class="tw:w-5 tw:h-5" />
              </span>
              <span class="overview-action__content">
                <span class="overview-action__title">Invoices</span>
                <span class="overview-action__desc">Receipts and payment history</span>
              </span>
              <span class="overview-action__arrow">
                <ArrowRight class="tw:w-4 tw:h-4" />
              </span>
            </button>
          </div>
        </section>
      </div>

      <!-- Subscription & billing (separate panel — not a new route) -->
      <div v-show="premiumBillingTab === 'subscription'">
        <ManageSubscriptionSection
          ref="manageSubscriptionRef"
          embedded
          :active="premiumBillingTab === 'subscription'"
          @view-invoices="openBillingTab('invoices')"
        />
      </div>

      <!-- Invoices -->
      <div v-show="premiumBillingTab === 'invoices'">
        <BillingInvoicesSection
          ref="billingInvoicesRef"
          embedded
          :active="premiumBillingTab === 'invoices'"
        />
      </div>
    </div>

    <!-- ── Free Plan View ───────────────────────────────────── -->
    <div v-else class="plan-fade-in">

      <!-- Plan Cards Row -->
      <div class="tw:bg-[#F6F1E7] tw:rounded-xl tw:p-4 tw:md:p-6 tw:mb-6">
        <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-12 tw:gap-6">

          <!-- Current Plan (Free) -->
          <div class="tw:col-span-1 tw:md:col-span-7">
            <h2 class="tw:text-base tw:font-semibold tw:text-gray-900 tw:mb-4">Event Package</h2>
            <div class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:p-6 tw:flex tw:flex-col tw:min-h-[200px]">
              <span class="tw:inline-block tw:bg-blue-100 tw:text-blue-700 tw:px-2.5 tw:py-1 tw:rounded-md tw:text-xs tw:font-semibold tw:w-fit tw:mb-3">
                Current Plan
              </span>
              <h3 class="tw:text-2xl tw:font-bold tw:text-gray-900 tw:mb-2">Free</h3>
              <p class="tw:text-gray-500 tw:text-sm tw:mb-4">Publish unlimited events and tickets for free.</p>
              <ul class="tw:space-y-1.5 tw:mb-auto">
                <li v-for="f in freeFeatures" :key="f"
                  class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
                  <svg class="tw:w-4 tw:h-4 tw:text-green-500 tw:flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ f }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Upgrade Card -->
          <div class="tw:col-span-1 tw:md:col-span-5">
            <h2 class="tw:text-base tw:font-semibold tw:text-gray-900 tw:mb-4">Upgrade to Premium</h2>
            <div class="tw:bg-white tw:border-2 tw:border-dashed tw:border-amber-300 tw:rounded-xl tw:p-5 tw:md:p-6 tw:flex tw:flex-col tw:min-h-[200px]">
              <div class="tw:flex tw:items-center tw:gap-2 tw:mb-3">
                <svg class="tw:w-5 tw:h-5 tw:text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.5 7l2.5 8h14l2.5-8-4.5 3-3-5-3 5L6.5 7z"/>
                  <rect x="5.5" y="16" width="13" height="2" rx="1"/>
                </svg>
                <span class="tw:text-sm tw:font-bold tw:text-amber-700">Premium</span>
              </div>
              <ul class="tw:space-y-1.5 tw:mb-4 tw:flex-1">
                <li v-for="f in premiumFeatures" :key="f"
                  class="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-gray-600">
                  <svg class="tw:w-3.5 tw:h-3.5 tw:text-amber-500 tw:flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ f }}
                </li>
              </ul>
              <button
                v-if="upgradeStep === 'idle'"
                @click="upgradeStep = 'select-type'"
                class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition hover:tw:opacity-90 tw:text-sm"
                style="background-color: var(--primary-color)">
                Upgrade to Premium →
              </button>
              <div v-else class="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-blue-600">
                <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Upgrade in progress ↓
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Inline Upgrade Flow ─────────────────────────────── -->
      <Transition name="slide-down">
        <div v-if="upgradeStep !== 'idle'" class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:p-4 tw:md:p-6 tw:mb-4 plan-fade-in">

          <!-- Step Header -->
          <div class="tw:flex tw:items-center tw:justify-between tw:mb-5">
            <div class="tw:flex tw:items-center tw:gap-3">
              <!-- Step Dots -->
              <div class="tw:hidden tw:md:flex tw:items-center tw:gap-1.5">
                <span class="tw:w-6 tw:h-6 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:text-white"
                  :style="{ backgroundColor: 'var(--primary-color)' }">
                  {{ upgradeStep === 'select-type' ? '1' : '✓' }}
                </span>
                <span class="tw:text-xs tw:text-gray-400 tw:font-medium">Billing Type</span>
              </div>
              <div class="tw:hidden tw:md:block tw:w-8 tw:h-px tw:bg-gray-200"></div>
              <div class="tw:hidden tw:md:flex tw:items-center tw:gap-1.5">
                <span class="tw:w-6 tw:h-6 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold"
                  :class="upgradeStep === 'billing-details' ? 'tw:text-white' : 'tw:text-gray-500 tw:bg-gray-200'"
                  :style="upgradeStep === 'billing-details' ? { backgroundColor: 'var(--primary-color)' } : {}">
                  2
                </span>
                <span class="tw:text-xs tw:font-medium"
                  :class="upgradeStep === 'billing-details' ? 'tw:text-gray-700' : 'tw:text-gray-400'">
                  Billing Details
                </span>
              </div>
            </div>

            <button @click="cancelUpgrade"
              class="no-hover tw:text-gray-400 hover:tw:text-gray-600 tw:transition">
              <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Error Banner -->
          <div v-if="submitError"
            class="tw:bg-red-50 tw:border tw:border-red-300 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-5 tw:text-sm">
            {{ submitError }}
          </div>

          <!-- STEP 1: Select Billing Type -->
          <div v-if="upgradeStep === 'select-type'">
            <h3 class="tw:text-lg tw:font-bold tw:text-gray-800 tw:mb-1" style="color: var(--primary-color)">
              Billing Type
            </h3>
            <p class="tw:text-gray-500 tw:text-sm tw:mb-5">How would you like to be billed?</p>

            <div class="tw:space-y-3 tw:mb-4">
              <button type="button"
                @click="billing.type = 'private'; clearBillingError('type')"
                :class="billingTypeCardClass(billing.type === 'private')">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-blue-100 tw:flex tw:items-center tw:justify-center tw:text-xl tw:flex-shrink-0">👤</div>
                <div class="tw:flex-1">
                  <div class="tw:font-semibold tw:text-gray-800">Private Individual</div>
                  <div class="tw:text-xs tw:text-gray-500 tw:mt-0.5">Personal billing, no VAT required</div>
                </div>
                <div :class="radioCircleClass(billing.type === 'private')">
                  <div v-if="billing.type === 'private'" class="tw:w-2.5 tw:h-2.5 tw:rounded-full" style="background: var(--primary-color)"></div>
                </div>
              </button>

              <button type="button"
                @click="billing.type = 'business'; clearBillingError('type')"
                :class="billingTypeCardClass(billing.type === 'business')">
                <div class="tw:w-10 tw:h-10 tw:rounded-full tw:bg-purple-100 tw:flex tw:items-center tw:justify-center tw:text-xl tw:flex-shrink-0">🏢</div>
                <div class="tw:flex-1">
                  <div class="tw:font-semibold tw:text-gray-800">Business</div>
                  <div class="tw:text-xs tw:text-gray-500 tw:mt-0.5">Company billing with VAT number</div>
                </div>
                <div :class="radioCircleClass(billing.type === 'business')">
                  <div v-if="billing.type === 'business'" class="tw:w-2.5 tw:h-2.5 tw:rounded-full" style="background: var(--primary-color)"></div>
                </div>
              </button>
            </div>

            <p v-if="billingErrors.type" class="tw:text-red-500 tw:text-xs tw:mb-3">{{ billingErrors.type }}</p>

            <button type="button" @click="handleBillingTypeNext"
              class="no-hover tw:w-full tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition"
              style="background-color: var(--primary-color)">
              Continue →
            </button>
          </div>

          <!-- STEP 2: Billing Details -->
          <div v-else-if="upgradeStep === 'billing-details'">
            <div class="tw:flex tw:items-center tw:gap-2 tw:mb-1">
              <h3 class="tw:text-lg tw:font-bold" style="color: var(--primary-color)">Billing Details</h3>
              <span class="tw:text-xs tw:px-2 tw:py-1 tw:rounded-full tw:font-medium"
                :class="billing.type === 'business' ? 'tw:bg-purple-100 tw:text-purple-700' : 'tw:bg-blue-100 tw:text-blue-700'">
                {{ billing.type === 'business' ? '🏢 Business' : '👤 Private' }}
              </span>
            </div>
            <p class="tw:text-gray-500 tw:text-sm tw:mb-5">Enter your billing information</p>

            <form @submit.prevent="handleSubmit" class="tw:space-y-4">

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
              <div class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-3">
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

              <div class="tw:flex tw:flex-col tw:md:flex-row tw:gap-3 tw:pt-1">
                <button type="button" @click="upgradeStep = 'select-type'"
                  class="no-hover tw:flex-1 tw:border tw:border-gray-300 tw:text-gray-600 tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition hover:tw:bg-gray-50">
                  ← Back
                </button>
                <button type="submit"
                  :disabled="submitting"
                  class="no-hover tw:flex-[2] tw:text-white tw:font-semibold tw:py-2.5 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed tw:flex tw:items-center tw:justify-center tw:gap-2"
                  style="background-color: var(--primary-color)">
                  <svg v-if="submitting" class="tw:animate-spin tw:w-4 tw:h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="tw:opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="tw:opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{{ submitting ? 'Redirecting to payment...' : 'Continue to Payment →' }}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </Transition>

    </div>

    <!-- Stripe Redirect Overlay -->
    <PaymentLoadingOverlay :visible="redirectingToStripe" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, type Component } from 'vue'
import {
  ArrowRight,
  BarChart3,
  Crown,
  FileText,
  Headphones,
  Palette,
  Settings,
  Sparkles,
  Star,
  Users,
  BadgeCheck,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useUpgradePlan } from '@/composables/useUpgradePlan'
import PaymentLoadingOverlay from '@/components/ui/PaymentLoadingOverlay.vue'
import BillingInvoicesSection from '@/components/settings/BillingInvoicesSection.vue'
import ManageSubscriptionSection from '@/components/settings/ManageSubscriptionSection.vue'
import {
  fetchSubscription,
  formatSubscriptionAmount,
  subscriptionPlanName,
  subscriptionAmount,
  subscriptionCurrency,
  type SubscriptionOverview,
} from '@/api/subscription'

const authStore = useAuthStore()

const {
  billing,
  billingErrors,
  vatValidating,
  vatValidationState,
  redirectingToStripe,
  submitError,
  submitting,
  clearBillingError,
  onVatInput,
  validateVat,
  validateBillingType,
  resetBilling,
  submitUpgrade,
  inputClass,
  billingTypeCardClass,
  radioCircleClass,
} = useUpgradePlan()

const loadingUser = ref(false)
const upgradeStep = ref<'idle' | 'select-type' | 'billing-details'>('idle')
const billingInvoicesRef = ref<InstanceType<typeof BillingInvoicesSection> | null>(null)
const manageSubscriptionRef = ref<InstanceType<typeof ManageSubscriptionSection> | null>(null)

type PremiumBillingTab = 'overview' | 'subscription' | 'invoices'
const premiumBillingTab = ref<PremiumBillingTab>('overview')
const premiumBillingTabs: { id: PremiumBillingTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'subscription', label: 'Subscription & billing' },
  { id: 'invoices', label: 'Invoices' },
]

const isPremium = computed(() =>
  authStore.user?.account_type == 'premium' && authStore.user?.status == 'active'
)

const freeFeatures = [
  'Unlimited event listings',
  'Basic analytics',
  'Standard support',
  'Up to 500 attendees',
]

const premiumFeatures = [
  'Advanced analytics & reports',
  'Priority support',
  'Unlimited attendees',
  'Custom branding',
  'Featured listings',
]

const premiumBenefitItems: { label: string; icon: Component }[] = [
  { label: 'Advanced analytics', icon: BarChart3 },
  { label: 'Priority support', icon: Headphones },
  { label: 'Unlimited attendees', icon: Users },
  { label: 'Custom branding', icon: Palette },
  { label: 'Featured listings', icon: Star },
  { label: 'Premium badge', icon: BadgeCheck },
]

const overviewSnapshot = ref<SubscriptionOverview | null>(null)
const overviewSnapshotLoading = ref(false)

const overviewPlanLabel = computed(() =>
  overviewSnapshot.value
    ? subscriptionPlanName(overviewSnapshot.value.subscription)
    : 'Premium'
)

const overviewPriceLabel = computed(() => {
  const sub = overviewSnapshot.value?.subscription
  if (!sub || subscriptionAmount(sub) <= 0) return null
  return formatSubscriptionAmount(subscriptionAmount(sub), subscriptionCurrency(sub))
})

async function loadOverviewSnapshot() {
  if (overviewSnapshot.value || overviewSnapshotLoading.value) return
  overviewSnapshotLoading.value = true
  try {
    overviewSnapshot.value = await fetchSubscription()
  } catch {
    overviewSnapshot.value = null
  } finally {
    overviewSnapshotLoading.value = false
  }
}

watch(
  () => premiumBillingTab.value,
  (tab) => {
    if (tab === 'overview') loadOverviewSnapshot()
  },
  { immediate: true }
)

onMounted(async () => {
  if (!authStore.user) {
    loadingUser.value = true
    await authStore.fetchUser()
    loadingUser.value = false
  }
})

function handleBillingTypeNext() {
  if (!validateBillingType()) return
  upgradeStep.value = 'billing-details'
}

async function handleSubmit() {
  await submitUpgrade()
}

function cancelUpgrade() {
  upgradeStep.value = 'idle'
  resetBilling()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function openBillingTab(tab: PremiumBillingTab) {
  premiumBillingTab.value = tab
  await nextTick()
  if (tab === 'subscription') {
    manageSubscriptionRef.value?.refresh()
  } else if (tab === 'invoices') {
    billingInvoicesRef.value?.refresh()
  }
}

</script>

<style scoped>
/* Sub-navigation */
.plan-subnav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1.75rem;
  padding-bottom: 0;
  border-bottom: 1px solid rgb(229 231 235);
}
.plan-subnav__tab {
  position: relative;
  padding: 0.625rem 1rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(107 114 128);
  transition: color 0.2s;
  margin-bottom: -1px;
}
.plan-subnav__tab:hover {
  color: rgb(55 65 81);
}
.plan-subnav__tab--active {
  color: var(--primary-color, #0061ff);
}
.plan-subnav__tab--active::after {
  content: '';
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--primary-color, #0061ff);
}

/* Overview */
.overview-panel {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.overview-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgb(229 231 235 / 0.9);
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.04);
}
.overview-hero__glow {
  pointer-events: none;
  position: absolute;
  top: -40%;
  right: -10%;
  width: 55%;
  height: 140%;
  background: radial-gradient(
    ellipse at center,
    rgb(251 191 36 / 0.12) 0%,
    transparent 70%
  );
}
.overview-hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem 1.5rem;
}
@media (min-width: 768px) {
  .overview-hero__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2rem 2rem 2.25rem;
  }
}
.overview-hero__main {
  flex: 1;
  min-width: 0;
}
.overview-hero__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}
.overview-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(146 64 14);
  background: linear-gradient(135deg, rgb(254 243 199), rgb(253 230 138 / 0.6));
  border: 1px solid rgb(251 191 36 / 0.35);
}
.overview-hero__since {
  font-size: 0.75rem;
  color: rgb(156 163 175);
}
.overview-hero__title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgb(17 24 39);
  line-height: 1.15;
}
@media (min-width: 768px) {
  .overview-hero__title {
    font-size: 2rem;
  }
}
.overview-hero__subtitle {
  margin-top: 0.5rem;
  max-width: 32rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: rgb(107 114 128);
}
.overview-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 2rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(243 244 246);
}
.overview-stat dt {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgb(156 163 175);
  margin-bottom: 0.25rem;
}
.overview-stat dd {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(17 24 39);
}
.overview-stat__pill {
  display: inline-flex;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.overview-stat__pill--active {
  color: rgb(4 120 87);
  background: rgb(236 253 245);
  box-shadow: inset 0 0 0 1px rgb(167 243 208);
}
.overview-hero__stats-skeleton {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(243 244 246);
}
.overview-hero__stats-skeleton span {
  height: 2rem;
  width: 5.5rem;
  border-radius: 0.5rem;
  background: rgb(243 244 246);
  animation: pulse 1.5s ease-in-out infinite;
}
.overview-hero__emblem {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
.overview-hero__emblem-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 1.25rem;
  background: linear-gradient(145deg, rgb(255 251 235), rgb(254 243 199 / 0.5));
  border: 1px solid rgb(251 191 36 / 0.25);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.8);
}
@media (min-width: 768px) {
  .overview-hero__emblem-ring {
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 1.5rem;
  }
}

.overview-section-head {
  margin-bottom: 1rem;
}
.overview-section-head__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(17 24 39);
  letter-spacing: -0.01em;
}
.overview-section-head__desc {
  font-size: 0.8125rem;
  color: rgb(156 163 175);
  margin-top: 0.125rem;
}

.overview-benefits__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (min-width: 640px) {
  .overview-benefits__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }
}
.overview-benefit {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.75rem;
  background: #fff;
  border: 1px solid rgb(243 244 246);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.overview-benefit:hover {
  border-color: rgb(229 231 235);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.03);
}
.overview-benefit__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  color: rgb(217 119 6);
  background: rgb(255 251 235);
}
.overview-benefit__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(55 65 81);
  line-height: 1.3;
}

.overview-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .overview-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}
.overview-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-align: left;
  padding: 1.125rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgb(229 231 235 / 0.9);
  background: #fff;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.overview-action:hover {
  border-color: rgb(209 213 219);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.06);
  transform: translateY(-1px);
}
.overview-action__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}
.overview-action__icon--blue {
  color: var(--primary-color, #0061ff);
  background: rgb(239 246 255);
}
.overview-action__icon--slate {
  color: rgb(71 85 105);
  background: rgb(248 250 252);
}
.overview-action__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.overview-action__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(17 24 39);
}
.overview-action__desc {
  font-size: 0.75rem;
  color: rgb(107 114 128);
  line-height: 1.4;
}
.overview-action__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: rgb(156 163 175);
  background: rgb(249 250 251);
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.overview-action:hover .overview-action__arrow {
  color: var(--primary-color, #0061ff);
  background: rgb(239 246 255);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Slide-down Transition ────────────────────────────── */
.slide-down-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ── Fade in ──────────────────────────────────────────── */
.plan-fade-in {
  animation: planFadeIn 0.4s ease-out;
}

@keyframes planFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
