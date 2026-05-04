<template>
  <!-- Panel -->
  <transition name="slide">
    <div v-if="visible"
      class="tw:fixed tw:p-0 tw:bg-white tw:rounded-2xl tw:top-32 tw:bottom-4 tw:z-40 tw:w-[420px] tw:max-w-[calc(100vw-2rem)] tw:shadow-xl tw:flex tw:flex-col tw:overflow-hidden"
      style="left: 430px;">
      
      <!-- Gallery Slider - AT THE VERY TOP -->
      <div class="tw:relative tw:h-56 tw:md:h-64 tw:overflow-hidden tw:flex-shrink-0">
        <div class="tw:flex tw:transition-transform tw:duration-300 tw:ease-in-out tw:h-full"
          :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
          <div v-for="(image, index) in images" :key="index" class="tw:w-full tw:flex-shrink-0 tw:h-full">
            <img :src="image" :alt="`${event?.title} - Image ${index + 1}`"
              class="tw:w-full tw:h-full tw:object-cover" />
          </div>
        </div>

        <!-- Left arrow -->
        <button v-if="images.length > 1" @click="prevImage" 
          class="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2
          tw:w-8 tw:h-8
          tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full
          tw:flex tw:items-center tw:justify-center
          tw:transition-all tw:duration-200 hover:tw:bg-white tw:shadow-lg tw:z-10" 
          :aria-label="$t('eventDetails.previousImage')">
          <ChevronLeftIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>

        <!-- Right arrow -->
        <button v-if="images.length > 1" @click="nextImage" 
          class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2
          tw:w-8 tw:h-8
          tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full
          tw:flex tw:items-center tw:justify-center
          tw:transition-all tw:duration-200 hover:tw:bg-white tw:shadow-lg tw:z-10" 
          :aria-label="$t('eventDetails.nextImage')">
          <ChevronRightIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>

        <!-- Image counter -->
        <div v-if="images.length > 1"
          class="tw:absolute tw:bottom-4 tw:right-4 tw:px-2 tw:py-1 tw:bg-black/60 tw:backdrop-blur-sm tw:rounded-full tw:z-10">
          <span class="tw:text-xs tw:text-white tw:font-medium">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </span>
        </div>
      </div>

      <!-- Header with Title and Event Status -->
      <div class="tw:px-4 tw:py-4 tw:flex tw:items-center tw:justify-between tw:gap-3">
        <h2 class="tw:text-xl tw:font-semibold tw:leading-tight tw:flex-1">
          {{ event?.title || $t('eventDetails.untitled') }}
        </h2>
        
        <div class="tw:flex tw:items-center tw:gap-2">
          <!-- Event Status Button -->
          <button v-if="eventStatus" class="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:rounded-full tw:border tw:border-[#0061FF] tw:bg-white">
            <!-- <img src="../assets/live-streaming-blue.png" :alt="eventStatus.text" class="tw:w-3 tw:h-3" /> -->
            <span>{{ eventStatus.text }}</span>
          </button>
          
          <!-- Close Button in Header -->
          <button 
            @click="close"
            class="tw:p-2 tw:rounded-lg tw:hover:tw:bg-gray-100 tw:transition-colors tw:tw-flex tw:items-center tw:justify-center"
            :aria-label="$t('eventDetails.close')"
          >
            <XIcon class="tw:w-5 tw:h-5 tw:text-gray-600" />
          </button>
        </div>
      </div>

      <!-- <div class="tw:h-px tw:bg-gray-200 tw:mb-3"></div> -->

      <!-- Filter Chips - COMMENTED OUT -->
      <!-- <div class="tw:px-4 tw:py-3 tw:flex tw:gap-2 tw:overflow-x-auto tw:scrollbar-hide tw:flex-shrink-0">
        <button
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
          {{ event?.category ? event.category.name : 'Category' }}
        </button>
        <button v-if="event?.start_datetime"
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ openingHours }}
        </button>
        <button v-if="event?.price || event?.min_price || event?.max_price"
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ formattedPrice }}
        </button>
        <button v-if="eventStatus" 
          class="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:text-sm tw:whitespace-nowrap tw:text-gray-600 tw:bg-white hover:tw:bg-gray-50 tw:transition-colors tw:flex-shrink-0">
          <span class="tw:w-2 tw:h-2 tw:bg-red-500 tw:rounded-full" :class="eventStatus.type === 'live' ? 'tw:animate-pulse' : ''"></span>
          {{ eventStatus.text }}
        </button>
      </div> -->

      <!-- Action Buttons - COMMENTED OUT -->
      <!-- <div class="tw:px-4 tw:pb-4 tw:flex tw:gap-2 tw:flex-shrink-0">
        <button @click="handleWishlistToggle"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50"
          :class="wishlistStore.isWishlisted(event?.id) ? 'tw:border-red-200 tw:bg-red-50 tw:text-red-600' : ''"
          :disabled="wishlistLoading">
          <svg 
            class="tw:w-4 tw:h-4 tw:transition-colors tw:duration-200" 
            :class="wishlistStore.isWishlisted(event?.id) ? 'tw:text-red-500 tw:fill-red-500' : 'tw:text-gray-400 tw:fill-none'"
            :style="wishlistLoading ? 'opacity: 0.5' : ''"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ $t('eventCard.save') }}
        </button>
        <button @click="handleRoute"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {{ $t('eventCard.route') }}
        </button>
        <button @click="handleShare"
          class="tw:flex-1 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:text-sm tw:font-medium tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:transition-all tw:duration-200 hover:tw:bg-gray-50">
          <svg class="tw:w-4 tw:h-4 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
          </svg>
          {{ $t('event.share') }}
        </button>
      </div> -->

      <!-- Tabs Navigation (scroll + arrows when overflow) -->
      <div class="tw:px-2 tw:pb-0 tw:bg-[#FAFBFF] tw:sticky tw:top-0 tw:z-10 tw:flex-shrink-0">
        <div class="tw:flex tw:items-center tw:gap-1">
          <button
            v-show="tabsOverflow"
            type="button"
            class="tw:flex tw:h-9 tw:w-9 tw:flex-shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:shadow-sm tw:transition-colors hover:tw:border-[#FF7700]/40 hover:tw:text-[#FF7700] disabled:tw:pointer-events-none disabled:tw:opacity-35"
            :disabled="!canScrollTabsLeft"
            :aria-label="$t('eventDetails.tabsScrollPrevious')"
            @click="scrollTabsPrev"
          >
            <ChevronLeftIcon class="tw:h-4 tw:w-4" aria-hidden="true" />
          </button>
          <div
            ref="tabsScrollEl"
            class="tw:flex tw:min-w-0 tw:flex-1 tw:overflow-x-auto tw:scrollbar-hide"
            @scroll.passive="updateTabsScrollArrows"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              :class="[
                'tw:px-3 tw:py-3 tw:text-sm tw:font-medium tw:whitespace-nowrap tw:relative tw:border-b-2 tw:flex-shrink-0 tw:transition-colors tw:duration-200',
                activeTab === tab.id
                  ? 'tw:text-[#FF7700] tw:border-[#FF7700]'
                  : 'tw:text-gray-500 tw:border-transparent hover:tw:text-gray-700'
              ]"
            >
              {{ $t(tab.labelKey) }}
            </button>
          </div>
          <button
            v-show="tabsOverflow"
            type="button"
            class="tw:flex tw:h-9 tw:w-9 tw:flex-shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:text-gray-700 tw:shadow-sm tw:transition-colors hover:tw:border-[#FF7700]/40 hover:tw:text-[#FF7700] disabled:tw:pointer-events-none disabled:tw:opacity-35"
            :disabled="!canScrollTabsRight"
            :aria-label="$t('eventDetails.tabsScrollNext')"
            @click="scrollTabsNext"
          >
            <ChevronRightIcon class="tw:h-4 tw:w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:overscroll-contain">
        <!-- Tab Content -->
        <div class="tw:flex-1 tw:overflow-y-auto">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="tw:px-4 tw:py-4">
            <!-- Event details: label above value; checkmarks on first three rows only -->
            <div class="tw:space-y-6">
              <!-- Dress code -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewDressCode') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ overviewDresscodeDisplay }}</span>
                </div>
              </div>

              <!-- Age -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewAge') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ overviewAgeDisplay }}</span>
                </div>
              </div>

              <!-- Entrance fee -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewEntranceFee') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ overviewEntranceFeeDisplay }}</span>
                </div>
              </div>

              <!-- Venue name (no checkmark; blue text) -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewVenueName') }}
                </p>
                <div class="tw:mt-2">
                  <button
                    v-if="invitedVenuesObjects.length && primaryInvitedVenueName"
                    type="button"
                    class="tw:text-base tw:font-medium tw:text-[#1a73e8] tw:text-left hover:tw:underline tw:underline-offset-2"
                    @click="activeTab = 'venues'"
                  >
                    {{ primaryInvitedVenueName }}
                  </button>
                  <p v-else class="tw:text-base tw:font-medium tw:text-[#1a73e8]">
                    {{ overviewVenueDisplay }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Like Button -->
            <div class="tw:mt-8">
              <button
                type="button"
                class="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:px-5 tw:py-2.5 tw:bg-white tw:border-2 tw:border-[#FF7700] tw:rounded-lg tw:text-[#1a73e8] tw:font-medium tw:transition-colors hover:tw:bg-[#FFFAF5] focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[#FF7700]/40"
              >
                <ThumbsUpIcon class="tw:w-5 tw:h-5 tw:flex-shrink-0" :stroke-width="2" aria-hidden="true" />
                Like
              </button>
            </div>
          </div>

          <!-- Talents Tab (invited API objects and/or legacy talents) -->
          <div v-else-if="activeTab === 'talents'" class="tw:p-3">
            <div v-if="invitedTalentsObjects.length" class="tw:space-y-3">
              <div
                v-for="(talent, index) in invitedTalentsObjects"
                :key="talent.id ?? `talent-${index}`"
                class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-[#FAFBFF] tw:p-4"
              >
                <div class="tw:flex tw:gap-3">
                  <div
                    class="tw:w-12 tw:h-12 tw:rounded-full tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0 tw:text-sm tw:font-semibold tw:text-gray-600"
                  >
                    <img
                      v-if="invitedProfileImageUrl(talent)"
                      :src="invitedProfileImageUrl(talent)"
                      alt=""
                      class="tw:w-full tw:h-full tw:object-cover"
                    />
                    <template v-else>{{ initialsFromName(talent.name) }}</template>
                  </div>
                  <div class="tw:flex-1 tw:min-w-0">
                    <p class="tw:font-semibold tw:text-gray-900 tw:truncate">{{ talent.name || '—' }}</p>
                    <p v-if="talent.email" class="tw:text-sm tw:text-gray-600 tw:truncate">{{ talent.email }}</p>
                    <div class="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                      <span
                        v-if="talent.role"
                        class="tw:inline-flex tw:items-center tw:text-xs tw:font-medium tw:px-2 tw:py-0.5 tw:rounded-full tw:bg-gray-100 tw:text-gray-700"
                      >
                        {{ talent.role }}
                      </span>
                      <span
                        v-if="talent.is_active !== undefined"
                        class="tw:inline-flex tw:items-center tw:text-xs tw:font-medium tw:px-2 tw:py-0.5 tw:rounded-full"
                        :class="talent.is_active ? 'tw:bg-green-50 tw:text-green-800' : 'tw:bg-gray-100 tw:text-gray-600'"
                      >
                        {{ talent.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TalentsTab v-else :talents="event?.talents || []" />
          </div>

          <!-- Organisers Tab (invited API objects) -->
          <div v-else-if="activeTab === 'organisers'" class="tw:p-3">
            <div class="tw:space-y-3">
              <div
                v-for="(org, index) in invitedOrganisersObjects"
                :key="org.id ?? `org-${index}`"
                class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-[#FAFBFF] tw:p-4"
              >
                <div class="tw:flex tw:gap-3">
                  <div
                    class="tw:w-12 tw:h-12 tw:rounded-full tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-indigo-50 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
                  >
                    <img
                      v-if="invitedProfileImageUrl(org)"
                      :src="invitedProfileImageUrl(org)"
                      alt=""
                      class="tw:w-full tw:h-full tw:object-cover"
                    />
                    <svg
                      v-else
                      class="tw:w-6 tw:h-6 tw:text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="tw:flex-1 tw:min-w-0">
                    <p class="tw:font-semibold tw:text-gray-900 tw:truncate">{{ org.name || '—' }}</p>
                    <p v-if="org.email" class="tw:text-sm tw:text-gray-600 tw:truncate">{{ org.email }}</p>
                    <div class="tw:flex tw:flex-wrap tw:gap-2 tw:mt-2">
                      <span
                        v-if="org.role"
                        class="tw:inline-flex tw:items-center tw:text-xs tw:font-medium tw:px-2 tw:py-0.5 tw:rounded-full tw:bg-gray-100 tw:text-gray-700"
                      >
                        {{ org.role }}
                      </span>
                      <span
                        v-if="org.is_active !== undefined"
                        class="tw:inline-flex tw:items-center tw:text-xs tw:font-medium tw:px-2 tw:py-0.5 tw:rounded-full"
                        :class="org.is_active ? 'tw:bg-green-50 tw:text-green-800' : 'tw:bg-gray-100 tw:text-gray-600'"
                      >
                        {{ org.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Invited Venues Tab -->
          <div v-else-if="activeTab === 'venues'" class="tw:p-3">
            <div class="tw:space-y-3">
              <div
                v-for="(venue, index) in invitedVenuesObjects"
                :key="venue.id ?? `venue-${index}`"
                class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-[#FAFBFF] tw:p-4"
              >
                <div class="tw:flex tw:gap-3">
                  <div class="tw:w-10 tw:h-10 tw:rounded-lg tw:bg-orange-50 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                    <svg class="tw:w-5 tw:h-5 tw:text-[#FF7700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="tw:flex-1 tw:min-w-0">
                    <p class="tw:font-semibold tw:text-gray-900">{{ venue.name || '—' }}</p>
                    <p v-if="venue.address" class="tw:text-sm tw:text-gray-600 tw:mt-1">{{ venue.address }}</p>
                    <p v-if="venue.slug" class="tw:text-xs tw:text-gray-400 tw:mt-1 tw:font-mono">/{{ venue.slug }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Socials Tab -->
          <div
            v-else-if="activeTab === 'socials'"
            class="tw:px-4 tw:py-4 tw:bg-gradient-to-b tw:from-[#FAFBFF] tw:to-white tw:min-h-[120px]"
          >
            <SocialsTab :links="socialMediaLinks" />
          </div>

          <!-- Contact Tab -->
          <div
            v-else-if="activeTab === 'contact'"
            class="tw:px-4 tw:py-4 tw:bg-gradient-to-b tw:from-[#FAFBFF] tw:to-white tw:min-h-[120px]"
          >
            <ContactTab :event="event" />
          </div>

          <!-- About Tab -->
          <AboutTab v-else-if="activeTab === 'about'" :about="event?.about"
            :description="event?.about?.description || event?.description" />

          <!-- Date & Location Tab -->
          <DateLocationTab v-else-if="activeTab === 'dateLocation'" :event="event"
            :location-details="event?.location_details" />

          <!-- Venue Tab (legacy location_details) -->
          <VenueTab v-else-if="activeTab === 'venue'" :event="event"
            :location-details="event?.location_details" />

          <!-- Community Tab -->
          <!-- <CommunityTab v-else-if="activeTab === 'community'" :community="event?.community || mockCommunity" /> -->
        </div>
      </div>
      <!-- Close button -->
      <button @click="close"
        class="tw:absolute tw:z-[60] tw:top-1/2 tw:-translate-y-1/2 tw:-right-3 tw:w-7 tw:h-12 tw:bg-white tw:shadow-md tw:flex tw:items-center tw:justify-center hover:tw:shadow-lg tw:transition-all hover:tw:-right-4"
        style="border-radius: 0; border-top-right-radius: 10px; border-bottom-right-radius: 10px; right: -28px;">
        <img src="../assets/chevron-bold-left.png" class="tw:w-3 tw:h-3" />
      </button>
    </div>

  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  Share2Icon,
  MusicIcon,
  TicketIcon,
  ShirtIcon,
  UsersIcon,
  CalendarIcon,
  LinkIcon,
  UserIcon,
  ThumbsUpIcon
} from 'lucide-vue-next'
import AboutTab from './AboutTab.vue'
import DateLocationTab from './DateLocationTab.vue'
import VenueTab from './VenueTab.vue'
import TalentsTab from './TalentsTab.vue'
import CommunityTab from './CommunityTab.vue'
import SocialsTab from './SocialsTab.vue'
import ContactTab from './ContactTab.vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { buildEventGalleryImageUrls } from '@/utils/eventGalleryImages'
import { parseSocialMediaUrlEntries } from '@/utils/socialMediaUrls'
import { getUserProfileImageUrl } from '@/utils/userProfileImage'

const { t } = useI18n()
const router = useRouter()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

// Props
const props = defineProps({
  /**
   * Controls panel visibility
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * Event object containing all event data
   * Should match the Event type from types/events.ts
   */
  event: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'link', 'route', 'share'])

const detailsWishlistBtnClass = computed(() => {
  const pending = wishlistStore.isWishlistPending(props.event?.id)
  const base = pending
    ? 'tw:opacity-90 tw:pointer-events-none tw:cursor-wait'
    : ''
  if (wishlistStore.isWishlisted(props.event?.id)) {
    return `${base} tw:border-[var(--primary-color)] tw:bg-[var(--primary-color)]/10`
  }
  return `${base}`
})

const detailsWishlistIconClass = computed(() => {
  if (wishlistStore.isWishlisted(props.event?.id)) {
    return 'tw:text-[var(--primary-color)] tw:fill-[var(--primary-color)] tw:stroke-[var(--primary-color)]'
  }
  return 'tw:text-gray-400 tw:fill-none'
})

// Wishlist toggle (optimistic UI + rollback + toast in store)
async function handleWishlistToggle() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login' })
    return
  }
  if (!props.event) return
  await wishlistStore.toggleWishlist(props.event)
}

// State
const currentImageIndex = ref(0)
const activeTab = ref('overview')

/** Horizontal tab strip scroll (many tabs on narrow panel) */
const tabsScrollEl = ref(null)
const tabsOverflow = ref(false)
const canScrollTabsLeft = ref(false)
const canScrollTabsRight = ref(false)

function updateTabsScrollArrows() {
  const el = tabsScrollEl.value
  if (!el) {
    tabsOverflow.value = false
    canScrollTabsLeft.value = false
    canScrollTabsRight.value = false
    return
  }
  const { scrollLeft, scrollWidth, clientWidth } = el
  const overflow = scrollWidth > clientWidth + 2
  tabsOverflow.value = overflow
  if (!overflow) {
    canScrollTabsLeft.value = false
    canScrollTabsRight.value = false
    return
  }
  canScrollTabsLeft.value = scrollLeft > 2
  canScrollTabsRight.value = scrollLeft + clientWidth < scrollWidth - 2
}

function scrollTabsPrev() {
  const el = tabsScrollEl.value
  if (!el) return
  const step = Math.max(100, Math.floor(el.clientWidth * 0.65))
  el.scrollBy({ left: -step, behavior: 'smooth' })
  window.setTimeout(updateTabsScrollArrows, 320)
}

function scrollTabsNext() {
  const el = tabsScrollEl.value
  if (!el) return
  const step = Math.max(100, Math.floor(el.clientWidth * 0.65))
  el.scrollBy({ left: step, behavior: 'smooth' })
  window.setTimeout(updateTabsScrollArrows, 320)
}

let tabsResizeObserver = null

watch(
  tabsScrollEl,
  (el, prev) => {
    if (typeof ResizeObserver === 'undefined') return
    if (!tabsResizeObserver) {
      tabsResizeObserver = new ResizeObserver(() => updateTabsScrollArrows())
    }
    if (prev) tabsResizeObserver.unobserve(prev)
    if (el) tabsResizeObserver.observe(el)
    nextTick(updateTabsScrollArrows)
  },
  { flush: 'post' }
)

onBeforeUnmount(() => {
  tabsResizeObserver?.disconnect()
  tabsResizeObserver = null
})

watch(
  () => props.visible,
  async (v) => {
    if (!v) return
    await nextTick()
    updateTabsScrollArrows()
    requestAnimationFrame(() => updateTabsScrollArrows())
  }
)

function normalizeInvitedList(raw) {
  if (!raw) return []
  return Array.isArray(raw) ? raw.filter(Boolean) : []
}

const invitedTalentsObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_talents_objects)
)

const invitedOrganisersObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_organisers_objects)
)

const invitedVenuesObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_venues_objects)
)

const showTalentsTab = computed(
  () =>
    invitedTalentsObjects.value.length > 0 ||
    (props.event?.talents?.length ?? 0) > 0
)

const socialMediaLinks = computed(() =>
  parseSocialMediaUrlEntries(props.event?.social_media_urls)
)

const showSocialsTab = computed(() => socialMediaLinks.value.length > 0)

const tabs = computed(() => {
  const list = [
    { id: 'overview', labelKey: 'eventDetails.tabs.overview' },
    { id: 'dateLocation', labelKey: 'eventDetails.tabs.dateLocation' }
  ]
  if (showSocialsTab.value) {
    list.push({ id: 'socials', labelKey: 'eventDetails.tabs.socials' })
  }
  if (showTalentsTab.value) {
    list.push({ id: 'talents', labelKey: 'eventDetails.tabs.talents' })
  }
  if (invitedOrganisersObjects.value.length > 0) {
    list.push({ id: 'organisers', labelKey: 'eventDetails.tabs.organisers' })
  }
  if (invitedVenuesObjects.value.length > 0) {
    list.push({
      id: 'venues',
      labelKey:
        invitedVenuesObjects.value.length > 1
          ? 'eventDetails.tabs.venues'
          : 'eventDetails.tabs.venue'
    })
  }
  list.push({ id: 'contact', labelKey: 'eventDetails.tabs.contact' })
  return list
})

const primaryInvitedVenueName = computed(() => {
  const v = invitedVenuesObjects.value[0]
  return v?.name?.trim() || ''
})

const overviewVenueDisplay = computed(() => {
  const ev = props.event
  if (ev?.venue?.name) return ev.venue.name
  const first = invitedVenuesObjects.value[0]?.name
  if (first) return first
  if (ev?.venue_name) return ev.venue_name
  if (ev?.invited_venues?.length) return t('eventDetails.venueDetailsAvailable')
  return t('eventDetails.notSpecified')
})

const overviewDresscodeDisplay = computed(() => {
  const raw = props.event?.dresscode
  if (raw == null || String(raw).trim() === '') return t('eventDetails.notSpecified')
  return String(raw).replace(/_/g, ' ')
})

const overviewAgeDisplay = computed(() => {
  const raw = props.event?.age_limit
  if (raw == null || String(raw).trim() === '') return t('eventDetails.allAges')
  return String(raw)
})

const overviewEntranceFeeDisplay = computed(() => {
  const ev = props.event
  const fp = ev?.formatted_price
  if (fp != null && String(fp).trim() !== '') return String(fp)
  const p = ev?.price
  if (p != null && String(p).trim() !== '') return String(p)
  if (ev?.entrance_fee != null && String(ev.entrance_fee).trim() !== '') return String(ev.entrance_fee)
  const es = ev?.entrance_status
  if (es != null && String(es).trim() !== '') {
    return String(es).replace(/_/g, ' ')
  }
  return t('eventDetails.notSpecified')
})

function initialsFromName(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function invitedProfileImageUrl(item) {
  return getUserProfileImageUrl(item)
}

function syncActiveTabWithTabs() {
  const ids = tabs.value.map((tab) => tab.id)
  if (!ids.includes(activeTab.value)) {
    activeTab.value = 'overview'
  }
}

watch(tabs, async () => {
  syncActiveTabWithTabs()
  await nextTick()
  updateTabsScrollArrows()
})

const mockTalents = [
  { name: "DJ Shadow", image: "https://picsum.photos/seed/talent1/200/200.jpg" },
  { name: "Luna Nova", image: "https://picsum.photos/seed/talent2/200/200.jpg" },
  { name: "The Vibes", image: "https://picsum.photos/seed/talent3/200/200.jpg" },
  { name: "Electric Dreams", image: "https://picsum.photos/seed/talent4/200/200.jpg" },
  { name: "Jazz Masters", image: "https://picsum.photos/seed/talent5/200/200.jpg" },
  { name: "Neon Lights", image: "https://picsum.photos/seed/talent6/200/200.jpg" },
  { name: "Rhythm Kings", image: "https://picsum.photos/seed/talent7/200/200.jpg" },
  { name: "Soul Train", image: "https://picsum.photos/seed/talent8/200/200.jpg" },
  { name: "Funk Factory", image: "https://picsum.photos/seed/talent9/200/200.jpg" },
  { name: "Beat Makers", image: "https://picsum.photos/seed/talent10/200/200.jpg" },
  { name: "Groove City", image: "https://picsum.photos/seed/talent11/200/200.jpg" },
  { name: "Sound Wave", image: "https://picsum.photos/seed/talent12/200/200.jpg" },
  { name: "Pulse Party", image: "https://picsum.photos/seed/talent13/200/200.jpg" },
  { name: "Jazz Jam", image: "https://picsum.photos/seed/talent14/200/200.jpg" },
  { name: "Electro Edge", image: "https://picsum.photos/seed/talent15/200/200.jpg" },
  { name: "Techno Tunes", image: "https://picsum.photos/seed/talent16/200/200.jpg" },
  { name: "Rave Revolution", image: "https://picsum.photos/seed/talent17/200/200.jpg" },
  { name: "Punk Parade", image: "https://picsum.photos/seed/talent18/200/200.jpg" },
  { name: "Metal Madness", image: "https://picsum.photos/seed/talent19/200/200.jpg" },
  { name: "Hip Hop Heat", image: "https://picsum.photos/seed/talent20/200/200.jpg" },
  { name: "Pop Culture", image: "https://picsum.photos/seed/talent21/200/200.jpg" },
  { name: "R&B Revolution", image: "https://picsum.photos/seed/talent22/200/200.jpg" }
]

const mockCommunity = [
  { name: "Alex Johnson", image: "https://picsum.photos/seed/user1/200/200.jpg" },
  { name: "Sarah Williams", image: "https://picsum.photos/seed/user2/200/200.jpg" },
  { name: "Mike Chen", image: "https://picsum.photos/seed/user3/200/200.jpg" },
  { name: "Emma Davis", image: "https://picsum.photos/seed/user4/200/200.jpg" },
  { name: "John Smith", image: "https://picsum.photos/seed/user5/200/200.jpg" },
  { name: "Lisa Anderson", image: "https://picsum.photos/seed/user6/200/200.jpg" },
  { name: "David Brown", image: "https://picsum.photos/seed/user7/200/200.jpg" },
  { name: "Maria Garcia", image: "https://picsum.photos/seed/user8/200/200.jpg" },
  { name: "Tom Wilson", image: "https://picsum.photos/seed/user9/200/200.jpg" },
  { name: "Anna Martinez", image: "https://picsum.photos/seed/user10/200/200.jpg" },
  { name: "Chris Taylor", image: "https://picsum.photos/seed/user11/200/200.jpg" },
  { name: "Julia White", image: "https://picsum.photos/seed/user12/200/200.jpg" },
  { name: "Ryan Lee", image: "https://picsum.photos/seed/user13/200/200.jpg" },
  { name: "Sophie Turner", image: "https://picsum.photos/seed/user14/200/200.jpg" },
  { name: "Mark Harris", image: "https://picsum.photos/seed/user15/200/200.jpg" },
  { name: "Nina Patel", image: "https://picsum.photos/seed/user16/200/200.jpg" },
  { name: "Oliver Jones", image: "https://picsum.photos/seed/user17/200/200.jpg" },
  { name: "Grace Kim", image: "https://picsum.photos/seed/user18/200/200.jpg" }
]

// Reset state when event changes
watch(() => props.event, () => {
  currentImageIndex.value = 0
  activeTab.value = 'overview'
})

// Computed: cover only, or cover + additional_images as carousel slides
const images = computed(() => {
  const ev = props.event
  if (!ev) {
    const dummyImage = new URL('../assets/dummy-event.png', import.meta.url).href
    return [dummyImage]
  }
  const urls = buildEventGalleryImageUrls(ev)
  if (urls.length > 0) return urls
  const dummyImage = new URL('../assets/dummy-event.png', import.meta.url).href
  return [dummyImage]
})

// Computed: Current displayed image
const currentImage = computed(() => {
  return images.value[currentImageIndex.value] || images.value[0]
})

// Computed: Formatted price
const formattedPrice = computed(() => {
  if (!props.event?.price) {
    return t('event.free')
  }
  return props.event.price
})

// Computed: Age requirement display
const ageRequirement = computed(() => {
  if (!props.event?.min_age) {
    return t('eventDetails.allAges')
  }
  return `${props.event.min_age}+`
})

// Computed: Event status (upcoming/live/past)
const eventStatus = computed(() => {
  if (!props.event?.event_date || !props.event?.start_time) {
    return null
  }

  const now = new Date()

  const start = new Date(
    `${props.event.event_date}T${props.event.start_time}`
  )

  const end = props.event.end_time
    ? new Date(`${props.event.event_date}T${props.event.end_time}`)
    : new Date(start)

  // Overnight event (02:38 is next day)
  if (end < start) {
    end.setDate(end.getDate() + 1)
  }

  if (now < start) {
    return {
      type: 'upcoming',
      text: t('eventCard.upcomingEvent'),
      icon: '../assets/calendar-upcoming.png'
    }
  }

  if (now >= start && now <= end) {
    return {
      type: 'live',
      text: t('eventCard.liveNow'),
      icon: '../assets/live-streaming.png'
    }
  }

  return {
    type: 'past',
    text: t('eventCard.pastEvent'),
    icon: '../assets/calendar-past.png'
  }
})

// Computed: Opening hours
const openingHours = computed(() => {
  if (!props.event?.start_datetime || !props.event?.event_date) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
  const end = props.event.end_datetime ? new Date(`${props.event.event_date}T${props.event.end_datetime}`) : null

  const timeOpts = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const startTime = start.toLocaleTimeString('en-US', timeOpts)

  if (end) {
    const endTime = end.toLocaleTimeString('en-US', timeOpts)
    return `${startTime} - ${endTime}`
  }

  return startTime
})

// Computed: Formatted date and time
const formattedDateTime = computed(() => {
  if (!props.event?.start_datetime || !props.event?.event_date) {
    return t('eventDetails.notSpecified')
  }

  const start = new Date(`${props.event.event_date}T${props.event.start_datetime}`)
  const end = props.event.end_datetime ? new Date(`${props.event.event_date}T${props.event.end_datetime}`) : null

  const dateOpts = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  const timeOpts = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const dateStr = start.toLocaleDateString('en-US', dateOpts)
  const startTime = start.toLocaleTimeString('en-US', timeOpts)

  if (end) {
    const endTime = end.toLocaleTimeString('en-US', timeOpts)
    return `${dateStr}, ${startTime} - ${endTime}`
  }

  return `${dateStr}, ${startTime}`
})

// Methods
function close() {
  emit('close')
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

// Action button handlers (UI only for now)
function handleLink() {
  emit('link', props.event)
}

function handleRoute() {
  emit('route', props.event)
}

function handleShare() {
  emit('share', props.event)
}
</script>

<style scoped>
/* Panel slide-in animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
}

/* Hide scrollbar for tabs and filter chips */
.tw\:scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tw\:scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar for content area */
.tw\:overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.tw\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
