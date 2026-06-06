<template>
  <transition name="backdrop-fade">
    <div
      v-if="visible"
      class="tw:fixed tw:inset-0 tw:z-[59] tw:bg-black/40 tw:md:hidden"
      @click="close"
    />
  </transition>

  <transition :name="isMobile ? 'slide-up' : 'slide'">
    <div
      v-if="visible"
      :class="[
        'tw:fixed tw:p-0 tw:bg-white tw:flex tw:flex-col tw:overflow-hidden',
        'tw:inset-x-0 tw:bottom-0 tw:rounded-t-3xl tw:shadow-2xl tw:max-h-[92dvh] tw:z-[60]',
        'tw:md:inset-x-auto tw:md:bottom-4 tw:md:rounded-2xl tw:md:top-32 tw:md:w-[420px] tw:md:max-w-[calc(100vw-2rem)] tw:md:shadow-xl tw:md:z-40',
      ]"
      :style="desktopPanelOuterStyle"
    >
      <!-- Mobile bottom-sheet handle -->
      <div class="tw:flex tw:justify-center tw:pt-3 tw:pb-1 tw:flex-shrink-0 tw:md:hidden">
        <div class="tw:w-10 tw:h-1.5 tw:rounded-full tw:bg-gray-300" />
      </div>

      <!-- Gallery Slider - AT THE VERY TOP -->
      <div class="tw:relative tw:h-52 tw:md:h-64 tw:overflow-hidden tw:flex-shrink-0">
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

        <!-- Event status (live / upcoming / past) — on image for visibility -->
        <div
          v-if="eventStatus"
          class="tw:absolute tw:top-3 tw:left-3 tw:z-20 tw:max-w-[calc(100%-5.5rem)]"
        >
          <span
            role="status"
            class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-semibold tw:rounded-full tw:border tw:shadow-lg tw:backdrop-blur-sm"
            :class="eventStatusBadgeClass"
          >
            <span
              v-if="eventStatus.type === 'live'"
              class="tw:w-2 tw:h-2 tw:rounded-full tw:bg-white tw:shrink-0 tw:animate-pulse"
              aria-hidden="true"
            />
            <span class="tw:truncate">{{ eventStatus.text }}</span>
          </span>
        </div>
      </div>

      <!-- Header: title + close -->
      <div class="tw:px-4 tw:py-4 tw:flex tw:items-start tw:justify-between tw:gap-3">
        <h2 class="tw:text-xl tw:font-semibold tw:leading-snug tw:flex-1 tw:min-w-0 tw:text-gray-900 tw:line-clamp-2">
          {{ event?.title || $t('eventDetails.untitled') }}
        </h2>

        <button
          type="button"
          @click="close"
          class="tw:p-2 tw:rounded-lg tw:hover:tw:bg-gray-100 tw:transition-colors tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
          :aria-label="$t('eventDetails.close')"
        >
          <XIcon class="tw:w-5 tw:h-5 tw:text-gray-600" />
        </button>
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
              <!-- Event title -->
              <!-- <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewEventTitle') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ overviewTitleDisplay }}</span>
                </div>
              </div> -->

              <!-- Description -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.eventDescription') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-start tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:mt-0.5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8] tw:whitespace-pre-line tw:leading-relaxed">{{ overviewDescriptionDisplay }}</span>
                </div>
              </div>

              <!-- Category -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewCategory') }}
                </p>
                <div class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ overviewCategoryDisplay }}</span>
                </div>
              </div>

              <!-- Subcategories -->
              <div>
                <p class="tw:text-base tw:font-semibold tw:text-gray-900">
                  {{ $t('eventDetails.overviewSubcategories') }}
                </p>
                <div v-if="overviewSubcategoryLabels.length" class="tw:mt-2 tw:flex tw:flex-wrap tw:gap-2">
                  <span
                    v-for="(name, idx) in overviewSubcategoryLabels"
                    :key="`${name}-${idx}`"
                    class="tw:inline-flex tw:items-center tw:rounded-full tw:border tw:border-[#1a73e8]/25 tw:bg-[#1a73e8]/5 tw:px-3 tw:py-1 tw:text-sm tw:font-medium tw:text-[#1a73e8]"
                  >
                    {{ name }}
                  </span>
                </div>
                <div v-else class="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                  <svg class="tw:w-5 tw:h-5 tw:flex-shrink-0 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ $t('eventDetails.notSpecified') }}</span>
                </div>
              </div>

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
              <ul
                class="tw:grid tw:grid-cols-2 tw:gap-2.5 tw:list-none tw:m-0 tw:p-0"
                role="list"
              >
                <li
                  v-for="(talent, index) in visibleTalents"
                  :key="talent.id ?? `talent-${index}`"
                  class="tw:min-w-0"
                >
                  <article
                    class="tw:group tw:flex tw:h-full tw:min-h-0 tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:bg-white tw:shadow-[0_1px_3px_rgba(0,0,0,0.06)] tw:ring-1 tw:ring-gray-200/90 tw:transition-all tw:duration-200 hover:tw:-translate-y-0.5 hover:tw:shadow-[0_10px_28px_rgba(0,0,0,0.09)] hover:tw:ring-[#FF7700]/35"
                  >
                    <div
                      class="tw:relative tw:aspect-[3/4] tw:w-full tw:overflow-hidden tw:bg-gradient-to-br tw:from-slate-100 tw:to-slate-200/90"
                    >
                      <img
                        v-if="talentImageUrl(talent)"
                        :src="talentImageUrl(talent)"
                        :alt="talentTitle(talent)"
                        class="tw:h-full tw:w-full tw:object-cover tw:transition-transform tw:duration-300 tw:ease-out group-hover:tw:scale-[1.04]"
                        loading="lazy"
                      />
                      <div
                        v-else
                        class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center"
                      >
                        <span class="tw:text-xl tw:font-bold tw:tracking-tight tw:text-slate-400">{{
                          initialsFromName(talentTitle(talent))
                        }}</span>
                      </div>
                    </div>
                    <div class="tw:flex tw:flex-1 tw:flex-col tw:gap-1 tw:p-2.5">
                      <h3
                        class="tw:m-0 tw:line-clamp-2 tw:text-xs tw:font-semibold tw:leading-snug tw:text-gray-900 tw:tracking-tight sm:tw:text-[13px]"
                      >
                        {{ talentTitle(talent) }}
                      </h3>
                      <div class="tw:mt-0.5 tw:flex tw:flex-col tw:gap-1">
                        <span
                          v-if="talentGenre(talent)"
                          class="tw:inline-flex tw:w-fit tw:max-w-full tw:items-center tw:truncate tw:rounded-md tw:bg-[#1a73e8]/10 tw:px-1.5 tw:py-px tw:text-[10px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-[#1557b0] sm:tw:text-[11px] sm:tw:normal-case sm:tw:tracking-normal"
                        >
                          {{ talentGenre(talent) }}
                        </span>
                        <span
                          v-if="talentCity(talent)"
                          class="tw:inline-flex tw:max-w-full tw:items-center tw:gap-0.5 tw:truncate tw:text-[10px] tw:text-gray-500 sm:tw:text-[11px]"
                        >
                          <svg
                            class="tw:h-3 tw:w-3 tw:flex-shrink-0 tw:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {{ talentCity(talent) }}
                        </span>
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
              <button
                v-if="invitedTalentsObjects.length > TALENTS_LIMIT && !showAllTalents"
                type="button"
                class="tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-dashed tw:border-gray-300 tw:bg-gray-50/80 tw:py-2.5 tw:text-xs tw:font-semibold tw:text-gray-700 tw:transition-colors hover:tw:border-[#FF7700]/50 hover:tw:bg-[#FFFAF5] hover:tw:text-[#1a73e8] sm:tw:text-sm"
                @click="showAllTalents = true"
              >
                <span>Show all</span>
                <span class="tw:rounded-full tw:bg-gray-200/80 tw:px-2 tw:py-0.5 tw:text-[10px] tw:font-medium tw:text-gray-600">
                  +{{ invitedTalentsObjects.length - TALENTS_LIMIT }}
                </span>
              </button>
            </div>
            <TalentsTab v-else :talents="event?.talents || []" />
          </div>

          <!-- Organisers Tab (invited API objects) -->
          <div v-else-if="activeTab === 'organisers'" class="tw:p-3">
            <div class="tw:space-y-5">
              <div
                v-for="(org, index) in invitedOrganisersObjects"
                :key="org.id ?? `org-${index}`"
                class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:overflow-hidden tw:shadow-sm"
              >
                <div class="tw:w-full tw:h-40 tw:bg-gray-100 tw:relative tw:overflow-hidden">
                  <img
                    v-if="organiserImageUrl(org)"
                    :src="organiserImageUrl(org)"
                    :alt="organiserDisplayName(org)"
                    class="tw:w-full tw:h-full tw:object-cover"
                  />
                  <div
                    v-else
                    class="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:bg-gradient-to-br tw:from-indigo-50 tw:to-indigo-100"
                  >
                    <svg class="tw:w-12 tw:h-12 tw:text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>

                <div class="tw:p-4 tw:space-y-4">
                  <div>
                    <p class="tw:font-semibold tw:text-gray-900 tw:text-base">{{ organiserDisplayName(org) }}</p>
                  </div>

                  <div v-if="organiserDescription(org)">
                    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">Description</p>
                    <p class="tw:text-sm tw:text-gray-700 tw:leading-relaxed tw:line-clamp-4">{{ organiserDescription(org) }}</p>
                  </div>

                  <a
                    v-if="organiserProfileSlug(org)"
                    :href="`/organisers/${organiserProfileSlug(org)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-[#1a73e8] hover:tw:underline tw:underline-offset-2"
                  >
                    <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Click Here to see full Organiser Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Invited Venues Tab -->
          <div v-else-if="activeTab === 'venues'" class="tw:p-3">
            <div class="tw:space-y-5">
              <div
                v-for="(venue, index) in invitedVenuesObjects"
                :key="venue.id ?? `venue-${index}`"
                class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:overflow-hidden tw:shadow-sm"
              >
                <!-- Header image -->
                <div class="tw:w-full tw:h-40 tw:bg-gray-100 tw:relative tw:overflow-hidden">
                  <img
                    v-if="venueImageUrl(venue)"
                    :src="venueImageUrl(venue)"
                    :alt="venue.name"
                    class="tw:w-full tw:h-full tw:object-cover"
                  />
                  <div v-else class="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:bg-gradient-to-br tw:from-orange-50 tw:to-orange-100">
                    <svg class="tw:w-12 tw:h-12 tw:text-[#FF7700]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>

                <div class="tw:p-4 tw:space-y-4">
                  <!-- Name + address -->
                  <div>
                    <p class="tw:font-semibold tw:text-gray-900 tw:text-base">{{ venue.name || '—' }}</p>
                    <p v-if="venue.address" class="tw:text-sm tw:text-gray-500 tw:mt-0.5 tw:flex tw:items-start tw:gap-1">
                      <svg class="tw:w-3.5 tw:h-3.5 tw:mt-0.5 tw:flex-shrink-0 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ venue.address }}
                    </p>
                  </div>

                  <!-- Description -->
                  <div v-if="venueDescription(venue)">
                    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">Description</p>
                    <p class="tw:text-sm tw:text-gray-700 tw:leading-relaxed tw:line-clamp-4">{{ venueDescription(venue) }}</p>
                  </div>

                  <!-- Opening hours -->
                  <div v-if="venueOpeningHours(venue).length">
                    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-2">Opening hours</p>
                    <div class="tw:space-y-1">
                      <div
                        v-for="slot in venueOpeningHours(venue)"
                        :key="slot.day"
                        class="tw:flex tw:items-center tw:justify-between tw:text-sm"
                      >
                        <span class="tw:w-24 tw:text-gray-700 tw:font-medium">{{ slot.day }}</span>
                        <span
                          v-if="slot.is_open && slot.open && slot.close"
                          class="tw:text-gray-600"
                        >{{ slot.open }} – {{ slot.close }}</span>
                        <span v-else class="tw:text-gray-400 tw:italic">Closed</span>
                      </div>
                    </div>
                  </div>

                  <!-- Read more link -->
                  <a
                    v-if="venueProfileSlug(venue)"
                    :href="`/venues/${venueProfileSlug(venue)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-[#1a73e8] hover:tw:underline tw:underline-offset-2"
                  >
                    <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Click here to see full Venue profile
                  </a>
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

          <!-- Booking info Tab -->
          <div
            v-else-if="activeTab === 'bookingInfo'"
            class="tw:px-4 tw:py-4 tw:bg-gradient-to-b tw:from-[#FAFBFF] tw:to-white tw:min-h-[120px]"
          >
            <p
              v-if="bookingInstructionsDisplay"
              class="tw:text-base tw:text-gray-800 tw:whitespace-pre-line tw:leading-relaxed"
            >
              {{ bookingInstructionsDisplay }}
            </p>
            <p v-else class="tw:text-base tw:text-gray-500">
              {{ $t('eventDetails.bookingInfoEmpty') }}
            </p>
          </div>

          <!-- Contact Tab (premium events only) -->
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
      <!-- Close button (desktop edge handle) -->
      <button
        @click="close"
        class="tw:hidden tw:md:flex tw:absolute tw:z-[60] tw:top-1/2 tw:-translate-y-1/2 tw:w-7 tw:h-12 tw:bg-white tw:shadow-md tw:items-center tw:justify-center hover:tw:shadow-lg tw:transition-all"
        style="border-radius: 0; border-top-right-radius: 10px; border-bottom-right-radius: 10px; right: -28px;"
      >
        <img src="../assets/chevron-bold-left.png" class="tw:w-3 tw:h-3" alt="" />
      </button>
    </div>

  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
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

/** Below md breakpoint: bottom sheet + backdrop; desktop keeps side panel */
const isMobile = ref(false)
function updateIsMobile() {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768
}
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

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
  },
  /**
   * When true (default): desktop panel sits to the right of the expanded Home listing dock (`left: 430px`).
   * When false: panel aligns with the dock gutter only (`left: 1.75rem`) — minimized/hidden dock or no results list.
   */
  mapListingExpanded: {
    type: Boolean,
    default: true,
  },
})

const desktopPanelOuterStyle = computed(() => {
  if (isMobile.value) return {}
  const left = props.mapListingExpanded ? '430px' : '1.75rem'
  return { left }
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
  document.body.style.overflow = ''
  window.removeEventListener('resize', updateIsMobile)
})

watch(
  () => props.visible,
  async (v) => {
    if (!v) {
      if (isMobile.value) document.body.style.overflow = ''
      return
    }
    if (isMobile.value) document.body.style.overflow = 'hidden'
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

const isPremiumEvent = computed(() => {
  const ev = props.event
  if (!ev || typeof ev !== 'object') return false
  const et = ev.event_type ?? ev.eventType
  if (et == null || et === '') return false
  return String(et).trim().toLowerCase() === 'premium'
})

const bookingInstructionsDisplay = computed(() => {
  const ev = props.event
  if (!ev || typeof ev !== 'object') return ''
  const raw = ev.booking_instructions ?? ev.bookingInstructions
  if (raw == null || String(raw).trim() === '') return ''
  return String(raw)
})

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
  if (bookingInstructionsDisplay.value) {
    list.push({ id: 'bookingInfo', labelKey: 'eventDetails.tabs.bookingInfo' })
  }
  if (isPremiumEvent.value) {
    list.push({ id: 'contact', labelKey: 'eventDetails.tabs.contact' })
  }
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

const overviewTitleDisplay = computed(() => {
  const raw = props.event?.title
  if (raw == null || String(raw).trim() === '') return t('eventDetails.untitled')
  return String(raw).trim()
})

const overviewDescriptionDisplay = computed(() => {
  const raw = props.event?.description
  if (raw == null || String(raw).trim() === '') return t('eventDetails.noDescription')
  return String(raw)
})

const overviewCategoryDisplay = computed(() => {
  const ev = props.event
  const c = ev?.category
  if (c && typeof c === 'object' && c.name != null && String(c.name).trim() !== '') {
    return String(c.name).trim()
  }
  if (typeof c === 'string' && c.trim() !== '') return c.trim()
  if (ev?.category_name != null && String(ev.category_name).trim() !== '') {
    return String(ev.category_name).trim()
  }
  return t('eventDetails.notSpecified')
})

const overviewSubcategoryLabels = computed(() => {
  const ev = props.event
  const list = ev?.subcategories
  if (Array.isArray(list) && list.length > 0) {
    const names = list
      .map((s) => (s && typeof s === 'object' ? s.name : s))
      .filter((n) => n != null && String(n).trim() !== '')
      .map((n) => String(n).trim())
    return [...new Set(names)]
  }
  const sc = ev?.sub_category
  if (sc && typeof sc === 'object' && sc.name != null && String(sc.name).trim() !== '') {
    return [String(sc.name).trim()]
  }
  return []
})

function initialsFromName(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── Talent tab helpers ────────────────────────────────────────────────────────
const TALENTS_LIMIT = 10
const showAllTalents = ref(false)

const visibleTalents = computed(() =>
  showAllTalents.value
    ? invitedTalentsObjects.value
    : invitedTalentsObjects.value.slice(0, TALENTS_LIMIT)
)

function talentTitle(talent) {
  return talent?.talent_v2?.title || talent?.name || '—'
}

function talentImageUrl(talent) {
  const v2 = talent?.talent_v2
  return v2?.profile_image || v2?.cover_image || v2?.image_path ||
    talent?.profile_image || getUserProfileImageUrl(talent) || null
}

function talentGenre(talent) {
  const v2 = talent?.talent_v2
  if (!v2) return null
  return v2.talent_category?.name || v2.category?.name || null
}

function talentCity(talent) {
  return talent?.talent_v2?.city || null
}

// ── Venue tab helpers ─────────────────────────────────────────────────────────
function venueImageUrl(venue) {
  const v2 = venue?.venue_v2
  return v2?.cover_image || v2?.profile_image || v2?.image_path || null
}

function venueDescription(venue) {
  return venue?.venue_v2?.description || venue?.description || null
}

function venueOpeningHours(venue) {
  return venue?.venue_v2?.opening_hours || []
}

function venueProfileSlug(venue) {
  return venue?.venue_v2?.slug || venue?.slug || null
}

// ── Organiser tab helpers ─────────────────────────────────────────────────────
function organiserImageUrl(org) {
  const v2 = org?.organiser_v2
  return (
    v2?.cover_image ||
    v2?.profile_image ||
    v2?.image_path ||
    org?.profile_image ||
    getUserProfileImageUrl(org) ||
    null
  )
}

function organiserDisplayName(org) {
  return org?.organiser_v2?.title || org?.name || '—'
}

function organiserDescription(org) {
  return org?.organiser_v2?.description || null
}

function organiserProfileSlug(org) {
  return org?.organiser_v2?.slug || null
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
  showAllTalents.value = false
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

const eventStatusBadgeClass = computed(() => {
  const status = eventStatus.value
  if (!status) return ''
  switch (status.type) {
    case 'live':
      return 'tw:bg-red-600 tw:text-white tw:border-red-700/80'
    case 'upcoming':
      return 'tw:bg-white/95 tw:text-[#0061FF] tw:border-[#0061FF]/40'
    case 'past':
      return 'tw:bg-gray-900/80 tw:text-white tw:border-gray-700/60'
    default:
      return 'tw:bg-white/95 tw:text-gray-800 tw:border-gray-200'
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
/* Desktop: slide in from the right (unchanged behaviour) */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Mobile bottom sheet */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
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
