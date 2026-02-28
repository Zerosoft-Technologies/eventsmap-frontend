<template>
  <div>
    <!-- ── Loading Skeleton ─────────────────────────────────── -->
    <div v-if="loadingUser" class="tw:animate-pulse">
      <div class="tw:grid tw:grid-cols-12 tw:gap-6 tw:mb-8">
        <div class="tw:col-span-7">
          <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-32 tw:mb-4"></div>
          <div class="tw:bg-gray-100 tw:rounded-xl tw:p-6 tw:min-h-[200px]">
            <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-20 tw:mb-3"></div>
            <div class="tw:h-7 tw:bg-gray-200 tw:rounded tw:w-16 tw:mb-2"></div>
            <div class="tw:h-4 tw:bg-gray-200 tw:rounded tw:w-48"></div>
          </div>
        </div>
        <div class="tw:col-span-5">
          <div class="tw:h-5 tw:bg-gray-200 tw:rounded tw:w-40 tw:mb-4"></div>
          <div class="tw:bg-gray-100 tw:rounded-xl tw:p-6 tw:min-h-[200px] tw:flex tw:items-center tw:justify-center">
            <div class="tw:h-9 tw:bg-gray-200 tw:rounded-lg tw:w-32"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Premium Member Card ──────────────────────────────── -->
    <div v-else-if="isPremium" class="plan-fade-in">
      <div class="premium-card tw:rounded-2xl tw:p-10 tw:text-center tw:relative tw:overflow-hidden tw:group">
        <!-- Subtle background shimmer -->
        <div class="premium-shimmer"></div>
        
        <!-- Golden pulse border animation -->
        <div class="premium-pulse-border"></div>

        <!-- Animated Crown Icon -->
        <div class="tw:flex tw:justify-center tw:mb-5 tw:relative tw:z-10">
          <div class="premium-crown-container tw:w-24 tw:h-24 tw:rounded-full tw:flex tw:items-center tw:justify-center premium-icon-bg">
            <svg class="tw:w-12 tw:h-12 crown-icon" viewBox="0 0 24 24" fill="currentColor" style="color: #b45309">
              <path d="M2.5 7l2.5 8h14l2.5-8-4.5 3-3-5-3 5L6.5 7z"/>
              <rect x="5.5" y="16" width="13" height="2" rx="1"/>
            </svg>
            <!-- Sparkle decorations -->
            <div class="sparkle sparkle-1"></div>
            <div class="sparkle sparkle-2"></div>
            <div class="sparkle sparkle-3"></div>
          </div>
        </div>

        <!-- Badge -->
        <div class="tw:flex tw:justify-center tw:mb-4 tw:relative tw:z-10">
          <span class="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:rounded-full tw:text-sm tw:font-bold premium-badge">
            <svg class="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Premium Member
          </span>
        </div>

        <!-- Title -->
        <h2 class="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-2 tw:relative tw:z-10">
          You're on the Premium Plan
        </h2>
        
        <!-- Thank You Message -->
        <div class="tw:bg-gradient-to-r tw:from-amber-50 tw:to-yellow-50 tw:border tw:border-amber-200 tw:rounded-xl tw:px-4 tw:py-3 tw:mb-6 tw:relative tw:z-10">
          <p class="tw:text-sm tw:text-amber-800 tw:font-medium tw:flex tw:items-center tw:justify-center tw:gap-2">
            <svg class="tw:w-5 tw:h-5 tw:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            Thank you for being a premium member!
          </p>
        </div>

        <!-- Benefits Grid -->
        <div class="tw:grid tw:grid-cols-2 tw:gap-3 tw:mb-8 tw:relative tw:z-10">
          <div v-for="benefit in premiumBenefits" :key="benefit"
            class="tw:flex tw:items-center tw:gap-2.5 tw:bg-white/70 tw:backdrop-blur-sm tw:rounded-xl tw:px-4 tw:py-3 tw:text-left tw:border tw:border-white/50 tw:shadow-sm hover:tw:shadow-md tw:transition-all">
            <div class="tw:w-5 tw:h-5 tw:rounded-full tw:bg-gradient-to-br tw:from-amber-400 tw:to-amber-600 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
              <svg class="tw:w-3 tw:h-3 tw:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="tw:text-sm tw:text-gray-700 tw:font-medium">{{ benefit }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="tw:flex tw:gap-3 tw:mb-6 tw:relative tw:z-10">
          <button
            @click="manageSubscription"
            class="no-hover tw:flex-1 tw:bg-gradient-to-r tw:from-amber-500 tw:to-amber-600 tw:text-white tw:font-semibold tw:py-3 tw:px-4 tw:rounded-xl tw:transition-all tw:shadow-md hover:tw:shadow-lg hover:tw:scale-[1.02] tw:flex tw:items-center tw:justify-center tw:gap-2">
            <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Manage Subscription
          </button>
          <button
            @click="downloadInvoice"
            class="no-hover tw:flex-1 tw:bg-white tw:text-amber-700 tw:font-semibold tw:py-3 tw:px-4 tw:rounded-xl tw:border-2 tw:border-amber-200 tw:transition-all hover:tw:border-amber-300 hover:tw:bg-amber-50 tw:flex tw:items-center tw:justify-center tw:gap-2">
            <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download Invoice
          </button>
        </div>

        <!-- Member Since -->
        <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-xs tw:text-gray-400 tw:relative tw:z-10">
          <svg class="tw:w-4 tw:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span v-if="authStore.user?.created_at">
            Premium member since {{ formatDate(authStore.user.created_at) }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Free Plan View ───────────────────────────────────── -->
    <div v-else class="plan-fade-in">

      <!-- Plan Cards Row -->
      <div class="tw:bg-[#F6F1E7] tw:rounded-xl tw:p-6 tw:mb-6">
        <div class="tw:grid tw:grid-cols-12 tw:gap-6">

          <!-- Current Plan (Free) -->
          <div class="tw:col-span-7">
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
          <div class="tw:col-span-5">
            <h2 class="tw:text-base tw:font-semibold tw:text-gray-900 tw:mb-4">Upgrade to Premium</h2>
            <div class="tw:bg-white tw:border-2 tw:border-dashed tw:border-amber-300 tw:rounded-xl tw:p-6 tw:flex tw:flex-col tw:min-h-[200px]">
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
        <div v-if="upgradeStep !== 'idle'" class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:p-6 tw:mb-4 plan-fade-in">

          <!-- Step Header -->
          <div class="tw:flex tw:items-center tw:justify-between tw:mb-5">
            <div class="tw:flex tw:items-center tw:gap-3">
              <!-- Step Dots -->
              <div class="tw:flex tw:items-center tw:gap-1.5">
                <span class="tw:w-6 tw:h-6 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-bold tw:text-white"
                  :style="{ backgroundColor: 'var(--primary-color)' }">
                  {{ upgradeStep === 'select-type' ? '1' : '✓' }}
                </span>
                <span class="tw:text-xs tw:text-gray-400 tw:font-medium">Billing Type</span>
              </div>
              <div class="tw:w-8 tw:h-px tw:bg-gray-200"></div>
              <div class="tw:flex tw:items-center tw:gap-1.5">
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

              <div class="tw:flex tw:gap-3 tw:pt-1">
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUpgradePlan } from '@/composables/useUpgradePlan'
import PaymentLoadingOverlay from '@/components/ui/PaymentLoadingOverlay.vue'

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

const premiumBenefits = [
  'Advanced analytics',
  'Priority support',
  'Unlimited attendees',
  'Custom branding',
  'Featured listings',
  'Premium badge',
]

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

function manageSubscription() {
  console.log('Opening subscription management...')
  alert('Subscription management coming soon!')
}

function downloadInvoice() {
  console.log('Downloading invoice...')
  alert('Invoice download coming soon!')
}
</script>

<style scoped>
/* ── Premium Card ─────────────────────────────────────── */
.premium-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow:
    0 0 0 2px #f59e0b,
    0 4px 24px rgba(245, 158, 11, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.05);
}

.premium-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  border-radius: inherit;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Golden Pulse Border ─────────────────────────────── */
.premium-pulse-border {
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
  background-size: 300% 300%;
  opacity: 0.4;
  animation: pulseBorder 4s ease-in-out infinite;
  z-index: 0;
  filter: blur(8px);
}

@keyframes pulseBorder {
  0%, 100% { 
    background-position: 0% 50%;
    opacity: 0.3;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.6;
  }
}

/* ── Crown Animation ─────────────────────────────────── */
.premium-crown-container {
  position: relative;
}

.crown-icon {
  animation: crownFloat 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes crownFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-4px) rotate(-2deg); }
  75% { transform: translateY(-4px) rotate(2deg); }
}

/* ── Sparkles ────────────────────────────────────────── */
.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50%;
  opacity: 0;
  animation: sparkleAnimation 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20%;
  left: 10%;
  animation-delay: 0.6s;
}

.sparkle-3 {
  bottom: 15%;
  right: 10%;
  animation-delay: 1.2s;
}

@keyframes sparkleAnimation {
  0%, 100% { 
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% { 
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
}

.premium-icon-bg {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.4),
    0 0 60px rgba(245, 158, 11, 0.2);
  transition: all 0.3s ease;
}

.premium-card:hover .premium-icon-bg {
  box-shadow: 
    0 0 40px rgba(245, 158, 11, 0.5),
    0 0 80px rgba(245, 158, 11, 0.3);
  transform: scale(1.05);
}

.premium-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  animation: badgePulse 3s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6); }
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
