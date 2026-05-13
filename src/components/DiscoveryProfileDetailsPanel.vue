<template>
  <transition name="slide">
    <div
      v-if="visible"
      class="tw:fixed tw:p-0 tw:bg-white tw:rounded-2xl tw:top-32 tw:bottom-4 tw:z-40 tw:w-[420px] tw:max-w-[calc(100vw-2rem)] tw:shadow-xl tw:flex tw:flex-col tw:overflow-hidden"
      style="left: 430px;"
    >
      <!-- Gallery slider -->
      <div class="tw:relative tw:h-56 tw:md:h-64 tw:overflow-hidden tw:flex-shrink-0">
        <div
          class="tw:flex tw:transition-transform tw:duration-300 tw:ease-in-out tw:h-full"
          :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
        >
          <div v-for="(img, i) in images" :key="i" class="tw:w-full tw:flex-shrink-0 tw:h-full">
            <img :src="img" class="tw:w-full tw:h-full tw:object-cover" :alt="`${profile?.title} - ${i + 1}`" />
          </div>
        </div>

        <button
          v-if="images.length > 1"
          @click="prevImage"
          class="tw:absolute tw:left-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-8 tw:h-8 tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-lg tw:z-10 tw:transition-all hover:tw:bg-white"
          aria-label="Previous image"
        >
          <ChevronLeftIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="tw:absolute tw:right-4 tw:top-1/2 tw:-translate-y-1/2 tw:w-8 tw:h-8 tw:bg-white/90 tw:backdrop-blur-sm tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-lg tw:z-10 tw:transition-all hover:tw:bg-white"
          aria-label="Next image"
        >
          <ChevronRightIcon class="tw:w-4 tw:h-4 tw:text-gray-700" />
        </button>
        <div
          v-if="images.length > 1"
          class="tw:absolute tw:bottom-4 tw:right-4 tw:px-2 tw:py-1 tw:bg-black/60 tw:backdrop-blur-sm tw:rounded-full tw:z-10"
        >
          <span class="tw:text-xs tw:text-white tw:font-medium">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
        </div>

        <!-- Profile type badge -->
        <div class="tw:absolute tw:top-3 tw:left-3 tw:z-10">
          <span
            class="tw:text-[10px] tw:font-bold tw:uppercase tw:tracking-wider tw:px-2.5 tw:py-1 tw:rounded-full tw:backdrop-blur-sm"
            :class="badgeClass"
          >{{ profileLabel }}</span>
        </div>
      </div>

      <!-- Header: title + close -->
      <div class="tw:px-4 tw:py-3 tw:flex tw:items-start tw:justify-between tw:gap-3 tw:flex-shrink-0">
        <div class="tw:flex-1 tw:min-w-0">
          <h2 class="tw:text-xl tw:font-semibold tw:leading-tight tw:text-gray-900">
            {{ profile?.title || '—' }}
          </h2>
          <p v-if="profile?.address" class="tw:mt-0.5 tw:text-xs tw:text-gray-500 tw:flex tw:items-center tw:gap-1">
            <svg class="tw:w-3 tw:h-3 tw:shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ profile.address }}
          </p>
        </div>
        <button
          @click="emit('close')"
          class="tw:p-2 tw:rounded-lg tw:hover:bg-gray-100 tw:transition-colors tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
          aria-label="Close"
        >
          <XIcon class="tw:w-5 tw:h-5 tw:text-gray-600" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="tw:px-2 tw:pb-0 tw:bg-[#FAFBFF] tw:sticky tw:top-0 tw:z-10 tw:flex-shrink-0">
        <div class="tw:flex tw:items-center tw:gap-1">
          <button
            v-show="tabsOverflow"
            type="button"
            class="tw:flex tw:h-9 tw:w-9 tw:flex-shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:shadow-sm tw:transition-colors hover:tw:border-[#FF7700]/40 hover:tw:text-[#FF7700] disabled:tw:opacity-35 disabled:tw:pointer-events-none"
            :disabled="!canScrollTabsLeft"
            @click="scrollTabsPrev"
          >
            <ChevronLeftIcon class="tw:h-4 tw:w-4" />
          </button>
          <div
            ref="tabsScrollEl"
            class="tw:flex tw:min-w-0 tw:flex-1 tw:overflow-x-hidden tw:scrollbar-hide"
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
            >{{ tab.label }}</button>
          </div>
          <button
            v-show="tabsOverflow"
            type="button"
            class="tw:flex tw:h-9 tw:w-9 tw:flex-shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:shadow-sm tw:transition-colors hover:tw:border-[#FF7700]/40 hover:tw:text-[#FF7700] disabled:tw:opacity-35 disabled:tw:pointer-events-none"
            :disabled="!canScrollTabsRight"
            @click="scrollTabsNext"
          >
            <ChevronRightIcon class="tw:h-4 tw:w-4" />
          </button>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:overscroll-contain">

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tw:px-4 tw:py-4 tw:space-y-5">

          <!-- Title -->
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">Name</p>
            <p class="tw:text-base tw:font-medium tw:text-[#1a73e8]">{{ profile?.title }}</p>
          </div>

          <!-- Description -->
          <div v-if="profile?.description">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">About</p>
            <p class="tw:text-sm tw:text-gray-700 tw:leading-relaxed tw:whitespace-pre-line">{{ profile.description }}</p>
          </div>

          <!-- Category -->
          <div v-if="profileCategoryName">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">Category</p>
            <span class="tw:inline-flex tw:items-center tw:rounded-full tw:border tw:border-[#1a73e8]/25 tw:bg-[#1a73e8]/5 tw:px-3 tw:py-1 tw:text-sm tw:font-medium tw:text-[#1a73e8]">
              {{ profileCategoryName }}
            </span>
          </div>

          <!-- Subcategories -->
          <div v-if="subcategoryLabels.length">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-2">Subcategories</p>
            <div class="tw:flex tw:flex-wrap tw:gap-2">
              <span
                v-for="sub in subcategoryLabels"
                :key="sub"
                class="tw:inline-flex tw:items-center tw:rounded-full tw:bg-orange-50 tw:border tw:border-orange-200 tw:px-3 tw:py-1 tw:text-sm tw:font-medium tw:text-orange-600"
              >{{ sub }}</span>
            </div>
          </div>

          <!-- Talent extras -->
          <template v-if="profileType === 'talents'">
            <div v-if="profile.highlights">
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">Highlights</p>
              <p class="tw:text-sm tw:text-gray-700 tw:leading-relaxed tw:whitespace-pre-line">{{ profile.highlights }}</p>
            </div>
            <div v-if="profile.nationality" class="tw:flex tw:items-center tw:gap-3">
              <div>
                <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-0.5">Nationality</p>
                <p class="tw:text-sm tw:text-gray-800">{{ profile.nationality }}</p>
              </div>
            </div>
            <div v-if="profile.languages?.length">
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-2">Languages</p>
              <div class="tw:flex tw:flex-wrap tw:gap-2">
                <span
                  v-for="lang in profile.languages"
                  :key="lang"
                  class="tw:text-xs tw:px-2.5 tw:py-1 tw:rounded-full tw:bg-emerald-50 tw:text-emerald-700 tw:border tw:border-emerald-200"
                >{{ lang }}</span>
              </div>
            </div>
          </template>

          <!-- View full profile link -->
          <a
            :href="profileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-[#1a73e8] hover:tw:underline tw:underline-offset-2"
          >
            <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            View full profile
          </a>
        </div>

        <!-- Location tab (matches DateLocationTab location card + map) -->
        <div v-else-if="activeTab === 'location'" class="tw:px-4 tw:py-4">
          <div
            class="tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:p-4 tw:shadow-sm"
          >
            <p class="tw:text-base tw:font-semibold tw:text-[#1a73e8] tw:mb-4">
              {{ profileLocationSectionTitle }}
            </p>

            <div class="tw:flex tw:gap-3 tw:items-start">
              <span
                class="tw:inline-flex tw:flex-shrink-0 tw:pt-0.5 tw:text-[#FF7700]"
                aria-hidden="true"
              >
                <svg class="tw:w-6 tw:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div class="tw:flex-1 tw:min-w-0">
                <p class="tw:text-base tw:font-bold tw:text-gray-800">
                  {{ locationDisplayName }}
                </p>
                <p class="tw:mt-1 tw:text-sm tw:text-gray-600 tw:leading-relaxed">
                  {{ displayLocationAddress }}
                </p>
              </div>
            </div>

            <div class="tw:mt-4 tw:relative tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:shadow-sm">
              <Transition name="fade">
                <div
                  v-if="isLocationMapLoading"
                  class="tw:absolute tw:inset-0 tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:z-10"
                >
                  <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
                    <div class="tw:w-8 tw:h-8 tw:border-[3px] tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin" />
                    <span class="tw:text-sm tw:text-gray-600">{{ t('discoveryProfile.mapLoading') }}</span>
                  </div>
                </div>
              </Transition>

              <div
                v-if="hasValidCoordinates"
                ref="locationMapRef"
                class="tw:h-[220px] sm:tw:h-[280px] tw:w-full"
              />

              <div
                v-else
                class="tw:h-[220px] sm:tw:h-[280px] tw:bg-gray-50 tw:flex tw:items-center tw:justify-center"
              >
                <div class="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center tw:px-6">
                  <div class="tw:w-12 tw:h-12 tw:bg-gray-200 tw:rounded-full tw:flex tw:items-center tw:justify-center">
                    <svg class="tw:w-6 tw:h-6 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p class="tw:text-sm tw:text-gray-500">{{ t('discoveryProfile.mapNoCoordinates') }}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:mt-4 tw:py-2.5 tw:px-3 tw:rounded-lg tw:bg-[#FF7700] tw:text-white tw:font-medium tw:text-sm hover:tw:bg-orange-600 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
              :disabled="!hasValidCoordinates && !externalMapsUrl"
              @click="onDirectionsClick"
            >
              <svg class="tw:w-4 tw:h-4 tw:flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {{ t('dateLocation.directions') }}
            </button>
          </div>
        </div>

        <!-- Gallery Tab -->
        <!-- <div v-else-if="activeTab === 'gallery'" class="tw:p-3">
          <div v-if="galleryImages.length > 0" class="tw:grid tw:grid-cols-2 tw:gap-2">
            <div
              v-for="(img, i) in galleryImages"
              :key="i"
              class="tw:aspect-square tw:rounded-xl tw:overflow-hidden tw:bg-gray-100"
            >
              <img :src="img" class="tw:w-full tw:h-full tw:object-cover" :alt="`Gallery ${i + 1}`" loading="lazy" />
            </div>
          </div>
          <p v-else class="tw:text-sm tw:text-gray-500 tw:p-4 tw:text-center">No additional images available.</p>
        </div> -->

        <!-- Opening Hours Tab (venues) -->
        <div v-else-if="activeTab === 'hours'" class="tw:px-4 tw:py-4">
          <div class="tw:space-y-1.5">
            <div
              v-for="slot in profile.opening_hours"
              :key="slot.day"
              class="tw:flex tw:items-center tw:justify-between tw:py-1.5 tw:border-b tw:border-gray-100 last:tw:border-0"
            >
              <span class="tw:w-28 tw:text-sm tw:font-medium tw:text-gray-800">{{ slot.day }}</span>
              <span v-if="slot.is_open && slot.open && slot.close" class="tw:text-sm tw:text-gray-600">
                {{ slot.open }} – {{ slot.close }}
              </span>
              <span v-else class="tw:text-sm tw:text-gray-400 tw:italic">Closed</span>
            </div>
          </div>
        </div>

        <!-- Amenities Tab (venues) -->
        <div v-else-if="activeTab === 'amenities'" class="tw:px-4 tw:py-4">
          <ul class="tw:space-y-2">
            <li
              v-for="item in profile.description_items"
              :key="item"
              class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-700"
            >
              <svg class="tw:w-4 tw:h-4 tw:shrink-0 tw:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Contact Tab -->
        <div v-else-if="activeTab === 'contact'" class="tw:px-4 tw:py-4 tw:space-y-4">

          <div v-if="profile.contact_phone" class="tw:flex tw:items-center tw:gap-3">
            <div class="tw:w-9 tw:h-9 tw:rounded-full tw:bg-blue-50 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
              <svg class="tw:w-4 tw:h-4 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <p class="tw:text-xs tw:text-gray-400 tw:font-medium">Phone</p>
              <a :href="`tel:${profile.contact_phone}`" class="tw:text-sm tw:font-medium tw:text-gray-800 hover:tw:text-[#1a73e8]">
                {{ profile.contact_phone }}
              </a>
            </div>
          </div>

          <div v-if="profile.contact_email" class="tw:flex tw:items-center tw:gap-3">
            <div class="tw:w-9 tw:h-9 tw:rounded-full tw:bg-blue-50 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
              <svg class="tw:w-4 tw:h-4 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="tw:text-xs tw:text-gray-400 tw:font-medium">Email</p>
              <a :href="`mailto:${profile.contact_email}`" class="tw:text-sm tw:font-medium tw:text-gray-800 hover:tw:text-[#1a73e8]">
                {{ profile.contact_email }}
              </a>
            </div>
          </div>

          <div v-if="profile.contact_website" class="tw:flex tw:items-center tw:gap-3">
            <div class="tw:w-9 tw:h-9 tw:rounded-full tw:bg-blue-50 tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
              <svg class="tw:w-4 tw:h-4 tw:text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
            </div>
            <div class="tw:min-w-0">
              <p class="tw:text-xs tw:text-gray-400 tw:font-medium">Website</p>
              <a
                :href="profile.contact_website"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:text-sm tw:font-medium tw:text-[#1a73e8] tw:truncate tw:block hover:tw:underline"
              >
                {{ profile.contact_website }}
              </a>
            </div>
          </div>

          <!-- Social links -->
          <div v-if="socialLinks.length" class="tw:pt-2">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-3">Social Media</p>
            <div class="tw:flex tw:flex-col tw:gap-3">
              <a
                v-for="link in socialLinks"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:flex tw:items-center tw:gap-3 hover:tw:opacity-80 tw:transition-opacity"
              >
                <div class="tw:w-9 tw:h-9 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
                  :style="{ backgroundColor: link.color + '15', border: `1px solid ${link.color}30` }">
                  <svg class="tw:w-4 tw:h-4" :style="{ color: link.color }" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="link.iconPath" />
                  </svg>
                </div>
                <span class="tw:text-sm tw:font-medium tw:text-gray-700">{{ link.label }}</span>
              </a>
            </div>
          </div>

          <!-- Contact box message -->
          <div v-if="profile.contact_box_message" class="tw:mt-4 tw:p-4 tw:rounded-xl tw:bg-blue-50 tw:border tw:border-blue-100">
            <p class="tw:text-sm tw:text-gray-700 tw:italic tw:leading-relaxed">{{ profile.contact_box_message }}</p>
          </div>
        </div>

        <!-- Upcoming Events Tab -->
        <div v-else-if="activeTab === 'upcomingEvents'" class="tw:px-4 tw:py-4">
          <div v-if="upcomingEvents.length === 0" class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-10 tw:gap-3">
            <svg class="tw:w-12 tw:h-12 tw:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="tw:text-sm tw:text-gray-500 tw:text-center">{{ t('discoveryProfile.upcomingEventsEmpty') }}</p>
          </div>

          <div v-else class="tw:space-y-4">
            <div
              v-for="ev in upcomingEvents"
              :key="ev.id"
              class="tw:w-full tw:overflow-hidden"
            >
              <Suspense>
                <EventCard
                  :event="ev"
                  @viewEvent="emit('viewEvent', $event)"
                  class="tw:!w-full"
                />
                <template #fallback>
                  <div class="tw:h-52 tw:rounded-2xl tw:bg-gray-100 tw:animate-pulse" />
                </template>
              </Suspense>
            </div>
          </div>
        </div>

      </div>

      <!-- Close handle on right edge (matches EventDetailsPanel) -->
      <button
        @click="emit('close')"
        class="tw:absolute tw:z-[60] tw:top-1/2 tw:-translate-y-1/2 tw:-right-3 tw:w-7 tw:h-12 tw:bg-white tw:shadow-md tw:flex tw:items-center tw:justify-center hover:tw:shadow-lg tw:transition-all hover:tw:-right-4"
        style="border-radius: 0; border-top-right-radius: 10px; border-bottom-right-radius: 10px; right: -28px;"
      >
        <img src="../assets/chevron-bold-left.png" class="tw:w-3 tw:h-3" />
      </button>
    </div>
  </transition>

  <DirectionsPanel
    :visible="showDirectionsPanel"
    :event="directionsEventForPanel"
    @close="showDirectionsPanel = false"
    @routeDrawn="drawRouteOnProfileMap"
    @routeCleared="clearRouteFromProfileMap"
  />
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from '@/config/mapConfig'
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import DirectionsPanel from './DirectionsPanel.vue'

const EventCard = defineAsyncComponent(() => import('./Event.vue'))

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  profile: { type: Object, default: null },
  profileType: { type: String, default: 'organisers' },
})

const emit = defineEmits(['close', 'viewEvent'])

const activeTab = ref('overview')

// ── Images ─────────────────────────────────────────────────────
const currentImageIndex = ref(0)

const images = computed(() => {
  const p = props.profile
  if (!p) return []
  const main = p.cover_image || p.image_path || p.profile_image || null
  const extras = Array.isArray(p.additional_images)
    ? p.additional_images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
    : []
  return [...(main ? [main] : []), ...extras]
})

const galleryImages = computed(() => {
  const p = props.profile
  if (!p || !Array.isArray(p.additional_images)) return []
  return p.additional_images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
})

function prevImage() {
  const n = images.value.length
  if (n <= 1) return
  currentImageIndex.value = (currentImageIndex.value - 1 + n) % n
}
function nextImage() {
  const n = images.value.length
  if (n <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % n
}

// ── Badge / label ─────────────────────────────────────────────
const profileLabel = computed(() => {
  const map = { organisers: 'Organiser', talents: 'Talent', venues: 'Venue' }
  return map[props.profileType] ?? props.profileType
})

const badgeClass = computed(() => {
  const map = {
    organisers: 'tw:bg-indigo-500/80 tw:text-white',
    talents: 'tw:bg-emerald-500/80 tw:text-white',
    venues: 'tw:bg-sky-500/80 tw:text-white',
  }
  return map[props.profileType] ?? 'tw:bg-gray-500/80 tw:text-white'
})

/** Location tab heading: event wording is wrong for discovery profiles */
const profileLocationSectionTitle = computed(() => {
  const map = {
    organisers: 'discoveryProfile.profileLocation.organiser',
    talents: 'discoveryProfile.profileLocation.talent',
    venues: 'discoveryProfile.profileLocation.venue',
  }
  return t(map[props.profileType] ?? 'discoveryProfile.profileLocation.default')
})

// ── Category / subcategories ───────────────────────────────────
const profileCategoryName = computed(() => {
  const p = props.profile
  if (!p) return null
  if (props.profileType === 'organisers') return p.organiser_category?.name ?? p.category?.name ?? null
  if (props.profileType === 'talents') return p.talent_category?.name ?? p.category?.name ?? null
  if (props.profileType === 'venues') return p.venue_category?.name ?? p.category?.name ?? null
  return p.category?.name ?? null
})

const subcategoryLabels = computed(() => {
  const p = props.profile
  if (!p) return []
  let subs = []
  if (props.profileType === 'organisers') subs = p.organiser_subcategories ?? p.subcategories ?? []
  else if (props.profileType === 'talents') subs = p.talent_subcategories ?? p.subcategories ?? []
  else if (props.profileType === 'venues') subs = p.venue_subcategories ?? p.subcategories ?? []
  else subs = p.subcategories ?? []
  return subs.map(s => s.name)
})

// ── Profile URL ────────────────────────────────────────────────
const profileUrl = computed(() => {
  const slug = props.profile?.slug
  if (!slug) return '#'
  const map = { organisers: '/organisers', talents: '/talents', venues: '/venues' }
  return `${map[props.profileType] ?? ''}/${slug}`
})

// ── Location (aligned with DateLocationTab) ───────────────────
const locationMapRef = ref(null)
const locationMapInstance = ref(null)
const locationMarkerInstance = ref(null)
const isLocationMapLoading = ref(false)
const isLocationMapInitialized = ref(false)

const latitudeValue = computed(() => {
  const p = props.profile
  if (!p) return null
  const lat = p.lat ?? p.latitude
  if (lat === null || lat === undefined || lat === '') return null
  const num = Number(lat)
  if (Number.isNaN(num) || num === 0) return null
  return num
})

const longitudeValue = computed(() => {
  const p = props.profile
  if (!p) return null
  const lng = p.lng ?? p.longitude
  if (lng === null || lng === undefined || lng === '') return null
  const num = Number(lng)
  if (Number.isNaN(num)) return null
  return num
})

const hasValidCoordinates = computed(
  () => latitudeValue.value != null && longitudeValue.value != null
)

const locationDisplayName = computed(() => {
  const p = props.profile
  if (!p?.title?.trim()) return t('dateLocation.notSpecified')
  return p.title.trim()
})

const displayLocationAddress = computed(() => {
  const p = props.profile
  if (!p) return t('dateLocation.notSpecified')
  const parts = []
  if (p.address?.trim()) parts.push(p.address.trim())
  if (p.city?.trim()) parts.push(p.city.trim())
  if (p.country?.trim()) parts.push(p.country.trim())
  return parts.length ? parts.join(', ') : t('dateLocation.notSpecified')
})

const showLocationTab = computed(() => {
  const p = props.profile
  if (!p) return false
  return Boolean(
    p.address?.trim() ||
      p.city?.trim() ||
      p.country?.trim() ||
      hasValidCoordinates.value
  )
})

const externalMapsUrl = computed(() => {
  if (hasValidCoordinates.value) {
    const lat = latitudeValue.value
    const lng = longitudeValue.value
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }
  const q = displayLocationAddress.value
  if (q && q !== t('dateLocation.notSpecified')) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
  }
  return ''
})

function openExternalDirections() {
  const url = externalMapsUrl.value
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const showDirectionsPanel = ref(false)

const directionsEventForPanel = computed(() => {
  const p = props.profile
  if (!p || !hasValidCoordinates.value) return null
  const addr = displayLocationAddress.value
  return {
    ...p,
    lat: latitudeValue.value,
    lng: longitudeValue.value,
    latitude: latitudeValue.value,
    longitude: longitudeValue.value,
    title: p.title,
    address: addr !== t('dateLocation.notSpecified') ? addr : (p.address ?? ''),
  }
})

function onDirectionsClick() {
  if (hasValidCoordinates.value) {
    showDirectionsPanel.value = true
  } else {
    openExternalDirections()
  }
}

// Route overlay on the Location tab map (same pattern as DateLocationTab)
let profileRouteSource = null
let profileRouteLayer = null
let profileRouteUserMarker = null

function clearRouteFromProfileMap() {
  const m = locationMapInstance.value
  if (m && m.loaded()) {
    if (profileRouteLayer && m.getLayer(profileRouteLayer)) m.removeLayer(profileRouteLayer)
    if (profileRouteSource && m.getSource(profileRouteSource)) m.removeSource(profileRouteSource)
  }
  profileRouteLayer = null
  profileRouteSource = null
  if (profileRouteUserMarker) {
    profileRouteUserMarker.remove()
    profileRouteUserMarker = null
  }
}

function drawRouteOnProfileMap(payload) {
  clearRouteFromProfileMap()
  const m = locationMapInstance.value
  if (!m || !m.loaded() || !hasValidCoordinates.value) return

  const srcId = 'dpp-profile-route-src'
  const layId = 'dpp-profile-route-layer'
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: payload.polyline.map(([lat, lng]) => [lng, lat]),
    },
    properties: {},
  }
  m.addSource(srcId, { type: 'geojson', data: geojson })
  m.addLayer({
    id: layId,
    type: 'line',
    source: srcId,
    paint: { 'line-color': '#F97316', 'line-width': 4, 'line-opacity': 0.85 },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  })
  profileRouteSource = srcId
  profileRouteLayer = layId

  const el = document.createElement('div')
  el.style.cssText =
    'width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 0 6px rgba(59,130,246,0.5);'
  profileRouteUserMarker = new maplibregl.Marker({ element: el })
    .setLngLat([payload.userLng, payload.userLat])
    .addTo(m)

  const bounds = new maplibregl.LngLatBounds()
  bounds.extend([payload.userLng, payload.userLat])
  const lat = latitudeValue.value
  const lng = longitudeValue.value
  if (lat != null && lng != null) bounds.extend([lng, lat])
  m.fitBounds(bounds, { padding: 50, duration: 600 })
}

function destroyLocationMap() {
  clearRouteFromProfileMap()
  if (locationMarkerInstance.value) {
    locationMarkerInstance.value.remove()
    locationMarkerInstance.value = null
  }
  if (locationMapInstance.value) {
    locationMapInstance.value.remove()
    locationMapInstance.value = null
  }
  isLocationMapInitialized.value = false
  isLocationMapLoading.value = false
}

function addLocationMarker() {
  if (!locationMapInstance.value || !hasValidCoordinates.value) return
  const lng = longitudeValue.value
  const lat = latitudeValue.value
  const el = document.createElement('div')
  el.className = 'custom-map-marker'
  el.innerHTML = `
    <img 
      src="/marker.png" 
      alt="" 
      style="width: 40px; height: 40px; cursor: pointer; display: block;"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div style="display: none; width: 36px; height: 36px; background: #EF4444; border-radius: 50%; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `
  locationMarkerInstance.value = new maplibregl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat([lng, lat])
    .addTo(locationMapInstance.value)
}

async function initializeLocationMap() {
  if (!hasValidCoordinates.value || !locationMapRef.value) return
  destroyLocationMap()
  isLocationMapLoading.value = true
  try {
    await nextTick()
    const lng = longitudeValue.value
    const lat = latitudeValue.value
    locationMapInstance.value = new maplibregl.Map({
      container: locationMapRef.value,
      style: MAP_CONFIG.STYLE_URL,
      center: [lng, lat],
      zoom: MAP_CONFIG.DETAIL_ZOOM,
      attributionControl: false,
    })
    locationMapInstance.value.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    )
    locationMapInstance.value.on('load', () => {
      isLocationMapLoading.value = false
      isLocationMapInitialized.value = true
      locationMapInstance.value.resize()
      addLocationMarker()
    })
    locationMapInstance.value.on('error', (e) => {
      console.error('Profile location map error:', e)
      isLocationMapLoading.value = false
    })
  } catch (e) {
    console.error('Failed to initialize profile location map:', e)
    isLocationMapLoading.value = false
  }
}

function scheduleLocationMapInit() {
  if (!props.visible || activeTab.value !== 'location' || !hasValidCoordinates.value) return
  nextTick(() => {
    setTimeout(() => {
      if (locationMapRef.value && hasValidCoordinates.value && props.visible && activeTab.value === 'location') {
        initializeLocationMap()
      }
    }, 50)
  })
}

watch(
  () => [activeTab.value, props.visible, props.profile?.id, latitudeValue.value, longitudeValue.value],
  () => {
    destroyLocationMap()
    scheduleLocationMapInit()
  }
)

// ── Social links ───────────────────────────────────────────────
const SOCIAL_CONFIGS = [
  { key: 'facebook_url', label: 'Facebook', color: '#1877F2', iconPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { key: 'instagram_url', label: 'Instagram', color: '#E4405F', iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { key: 'tiktok_url', label: 'TikTok', color: '#000000', iconPath: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  { key: 'fan_club_url', label: 'Fan Club', color: '#FF7700', iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
]

const socialLinks = computed(() => {
  const p = props.profile
  if (!p) return []
  return SOCIAL_CONFIGS
    .filter(cfg => p[cfg.key])
    .map(cfg => ({ ...cfg, url: p[cfg.key] }))
})

// ── Upcoming events ────────────────────────────────────────────
const upcomingEvents = computed(() => {
  const p = props.profile
  if (!p) return []
  if (!p.show_upcoming_events) return []
  const ev = p.upcoming_events
  if (!Array.isArray(ev) || ev.length === 0) return []
  return ev
})

// ── Tabs ───────────────────────────────────────────────────────
const tabs = computed(() => {
  const list = [{ id: 'overview', label: t('discoveryProfile.tabs.overview') }]
  if (upcomingEvents.value.length > 0) {
    list.push({
      id: 'upcomingEvents',
      label: `${t('discoveryProfile.tabs.upcomingEvents')} (${upcomingEvents.value.length})`,
    })
  }
  if (showLocationTab.value) {
    list.push({ id: 'location', label: t('discoveryProfile.tabs.location') })
  }
  // if (galleryImages.value.length > 0) list.push({ id: 'gallery', label: t('discoveryProfile.tabs.gallery') })
  if (props.profileType === 'venues' && props.profile?.opening_hours?.length) {
    list.push({ id: 'hours', label: t('discoveryProfile.tabs.openingHours') })
  }
  if (props.profileType === 'venues' && props.profile?.description_items?.length) {
    list.push({ id: 'amenities', label: t('discoveryProfile.tabs.amenities') })
  }
  const hasContact = props.profile?.contact_phone || props.profile?.contact_email ||
    props.profile?.contact_website || socialLinks.value.length > 0
  if (hasContact) list.push({ id: 'contact', label: t('discoveryProfile.tabs.contact') })
  return list
})

watch(() => props.profile, () => {
  currentImageIndex.value = 0
  activeTab.value = 'overview'
  showDirectionsPanel.value = false
  clearRouteFromProfileMap()
})

watch(activeTab, (tab) => {
  if (tab !== 'location' && showDirectionsPanel.value) {
    showDirectionsPanel.value = false
  }
})

// ── Tab strip scroll ───────────────────────────────────────────
const tabsScrollEl = ref(null)
const tabsOverflow = ref(false)
const canScrollTabsLeft = ref(false)
const canScrollTabsRight = ref(false)

function updateTabsScrollArrows() {
  const el = tabsScrollEl.value
  if (!el) { tabsOverflow.value = false; return }
  const { scrollLeft, scrollWidth, clientWidth } = el
  const overflow = scrollWidth > clientWidth + 2
  tabsOverflow.value = overflow
  canScrollTabsLeft.value = overflow && scrollLeft > 2
  canScrollTabsRight.value = overflow && scrollLeft + clientWidth < scrollWidth - 2
}

function scrollTabsPrev() {
  const el = tabsScrollEl.value
  if (!el) return
  el.scrollBy({ left: -Math.max(100, Math.floor(el.clientWidth * 0.65)), behavior: 'smooth' })
  window.setTimeout(updateTabsScrollArrows, 320)
}
function scrollTabsNext() {
  const el = tabsScrollEl.value
  if (!el) return
  el.scrollBy({ left: Math.max(100, Math.floor(el.clientWidth * 0.65)), behavior: 'smooth' })
  window.setTimeout(updateTabsScrollArrows, 320)
}

let tabsResizeObserver = null
watch(tabsScrollEl, (el, prev) => {
  if (!tabsResizeObserver && typeof ResizeObserver !== 'undefined') {
    tabsResizeObserver = new ResizeObserver(() => updateTabsScrollArrows())
  }
  if (prev) tabsResizeObserver?.unobserve(prev)
  if (el) tabsResizeObserver?.observe(el)
  nextTick(updateTabsScrollArrows)
}, { flush: 'post' })

onBeforeUnmount(() => {
  tabsResizeObserver?.disconnect()
  destroyLocationMap()
})

watch(() => props.visible, async (v) => {
  if (!v) {
    showDirectionsPanel.value = false
    destroyLocationMap()
    return
  }
  await nextTick()
  updateTabsScrollArrows()
  scheduleLocationMapInit()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
