<template>
  <!-- Modal Backdrop -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="isOpen" 
        class="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-4"
      >
        <!-- Overlay -->
        <div 
          class="tw:absolute tw:inset-0 tw:bg-black/50 tw:backdrop-blur-sm"
          @click="closeModal"
        ></div>
        
        <!-- Modal Content -->
        <div class="tw:relative tw:w-full tw:max-w-2xl tw:max-h-[90vh] tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:overflow-hidden tw:flex tw:flex-col">
          
          <!-- Modal Header -->
          <div class="tw:flex tw:items-center tw:justify-between tw:px-6 tw:py-4 tw:border-b tw:border-gray-200">
            <h2 class="tw:text-xl tw:font-semibold tw:text-gray-900">
              {{ event?.title || 'Event Details' }}
            </h2>
            <button 
              @click="closeModal"
              class="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:text-gray-400 hover:tw:text-gray-600 hover:tw:bg-gray-100 tw:transition-colors"
            >
              <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Tabs Navigation -->
          <div class="tw:flex tw:border-b tw:border-gray-200 tw:px-4 tw:overflow-x-auto tw:scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              :class="[
                'tw:px-3 tw:py-3 tw:text-sm tw:font-medium tw:relative tw:transition-colors tw:flex-shrink-0 tw:whitespace-nowrap',
                activeTab === tab.id
                  ? 'tw:text-[#FF7700]'
                  : 'tw:text-gray-500 hover:tw:text-gray-700'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="activeTab === tab.id"
                class="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:h-0.5 tw:bg-[#FF7700] tw:rounded-full"
              ></span>
            </button>
          </div>
          
          <!-- Tab Content -->
          <div class="tw:flex-1 tw:overflow-y-auto">
            <Transition name="tab-fade" mode="out-in">
              
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" key="overview" class="tw:p-3">
                <!-- Event Details List -->
                <div class="tw:space-y-1">
                  <!-- Event title -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1 tw:min-w-0">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Event title</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ modalOverviewTitle }}</p>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="tw:flex tw:items-start tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5 tw:pt-0.5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1 tw:min-w-0">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Description</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:whitespace-pre-line tw:leading-relaxed">{{ modalOverviewDescription }}</p>
                    </div>
                  </div>

                  <!-- Category -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1 tw:min-w-0">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Category</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ modalOverviewCategory }}</p>
                    </div>
                  </div>

                  <!-- Subcategories -->
                  <div class="tw:flex tw:items-start tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5 tw:pt-0.5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1 tw:min-w-0">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Subcategories</p>
                      <div v-if="modalOverviewSubcategoryLabels.length" class="tw:flex tw:flex-wrap tw:gap-1.5">
                        <span
                          v-for="(name, idx) in modalOverviewSubcategoryLabels"
                          :key="`${name}-${idx}`"
                          class="tw:inline-flex tw:items-center tw:rounded-full tw:bg-gray-100 tw:px-2 tw:py-0.5 tw:text-xs tw:font-medium tw:text-gray-800"
                        >
                          {{ name }}
                        </span>
                      </div>
                      <p v-else class="tw:text-sm tw:font-medium tw:text-gray-900">Not specified</p>
                    </div>
                  </div>

                  <!-- Dress Code -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Dress Code</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:capitalize">{{ event?.dresscode || 'Not specified' }}</p>
                    </div>
                  </div>

                  <!-- Age -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Age</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900">{{ event?.age_limit || 'All ages' }}</p>
                    </div>
                  </div>

                  <!-- Entrance Status -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2 tw:border-b tw:border-gray-100">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Entrance Status</p>
                      <p class="tw:text-sm tw:font-medium tw:text-gray-900 tw:capitalize">{{ event?.entrance_status || 'Not specified' }}</p>
                    </div>
                  </div>

                  <!-- Venue Name -->
                  <div class="tw:flex tw:items-center tw:gap-2 tw:py-2">
                    <div class="tw:flex tw:items-center tw:justify-center tw:w-5">
                      <svg class="tw:w-4 tw:h-4 tw:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="tw:flex-1">
                      <p class="tw:text-xs tw:text-gray-500 tw:mb-0.5">Venue name</p>
                      <button
                        v-if="hasVenueTab && primaryInvitedVenueName"
                        type="button"
                        class="tw:text-sm tw:font-medium tw:text-blue-600 hover:tw:text-blue-700 tw:text-left tw:underline-offset-2 hover:tw:underline"
                        @click="activeTab = 'venues'"
                      >
                        {{ primaryInvitedVenueName }}
                      </button>
                      <p
                        v-else
                        class="tw:text-sm tw:font-medium tw:text-gray-900"
                      >
                        {{ overviewVenueDisplay }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Like Button -->
                <div class="tw:mt-6 tw:px-3">
                  <button class="tw:w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-4 tw:py-2.5 tw:bg-[#FF7700] tw:text-white tw:font-medium tw:rounded-lg tw:transition-colors hover:tw:bg-[#E66800]">
                    <svg class="tw:w-5 tw:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    Like Event
                  </button>
                </div>
              </div>

              <!-- Talents Tab -->
              <div v-else-if="activeTab === 'talents'" key="talents" class="tw:p-6">
                <div class="tw:space-y-4">
                  <ul
                    class="tw:grid tw:grid-cols-2 tw:gap-3 md:tw:grid-cols-3 tw:list-none tw:m-0 tw:p-0"
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
                        <div class="tw:flex tw:flex-1 tw:flex-col tw:gap-1 tw:p-3">
                          <h3
                            class="tw:m-0 tw:line-clamp-2 tw:text-sm tw:font-semibold tw:leading-snug tw:text-gray-900 tw:tracking-tight"
                          >
                            {{ talentTitle(talent) }}
                          </h3>
                          <div class="tw:mt-0.5 tw:flex tw:flex-col tw:gap-1">
                            <span
                              v-if="talentGenre(talent)"
                              class="tw:inline-flex tw:w-fit tw:max-w-full tw:items-center tw:truncate tw:rounded-md tw:bg-[#1a73e8]/10 tw:px-2 tw:py-0.5 tw:text-[11px] tw:font-semibold tw:text-[#1557b0]"
                            >
                              {{ talentGenre(talent) }}
                            </span>
                            <span
                              v-if="talentCity(talent)"
                              class="tw:inline-flex tw:max-w-full tw:items-center tw:gap-0.5 tw:truncate tw:text-[11px] tw:text-gray-500"
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
                    class="tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-dashed tw:border-gray-300 tw:bg-gray-50/80 tw:py-3 tw:text-sm tw:font-semibold tw:text-gray-700 tw:transition-colors hover:tw:border-[#FF7700]/50 hover:tw:bg-[#FFFAF5] hover:tw:text-[#1a73e8]"
                    @click="showAllTalents = true"
                  >
                    <span>Show all talents</span>
                    <span class="tw:rounded-full tw:bg-gray-200/80 tw:px-2.5 tw:py-0.5 tw:text-xs tw:font-medium tw:text-gray-600">
                      +{{ invitedTalentsObjects.length - TALENTS_LIMIT }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Organisers Tab -->
              <div v-else-if="activeTab === 'organisers'" key="organisers" class="tw:p-6">
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
                        <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wide tw:text-gray-400 tw:mb-1">About</p>
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

              <!-- Venues Tab -->
              <div v-else-if="activeTab === 'venues'" key="venues" class="tw:p-6">
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
                        <!-- <p v-if="venue.slug" class="tw:text-xs tw:text-gray-400 tw:mt-1 tw:font-mono">/{{ venue.slug }}</p> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Date & Location Tab -->
              <div v-else-if="activeTab === 'dateLocation'" key="dateLocation" class="tw:p-6">
                <div class="tw:space-y-6">
                  
                  <!-- Date & Time Section -->
                  <div class="tw:flex tw:items-start tw:gap-4">
                    <div class="tw:w-10 tw:h-10 tw:bg-blue-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                      <svg class="tw:w-5 tw:h-5 tw:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-1">Date & Time</h4>
                      <p class="tw:text-sm tw:text-gray-700">{{ event?.formatted_date || 'Not specified' }}</p>
                    </div>
                  </div>
                  
                  <!-- Address Section -->
                  <div class="tw:flex tw:items-start tw:gap-4">
                    <div class="tw:w-10 tw:h-10 tw:bg-green-50 tw:rounded-lg tw:flex tw:items-center tw:justify-center tw:flex-shrink-0">
                      <svg class="tw:w-5 tw:h-5 tw:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="tw:flex-1">
                      <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-1">Address</h4>
                      <p class="tw:text-sm tw:text-gray-700 tw:mb-2">{{ event?.address || 'Address not available' }}</p>
                      
                      <!-- Coordinates -->
                      <div v-if="hasCoordinates" class="tw:flex tw:gap-4 tw:text-xs tw:text-gray-500">
                        <span class="tw:bg-gray-100 tw:px-2 tw:py-1 tw:rounded">
                          Lat: {{ event?.latitude?.toFixed(6) }}
                        </span>
                        <span class="tw:bg-gray-100 tw:px-2 tw:py-1 tw:rounded">
                          Lng: {{ event?.longitude?.toFixed(6) }}
                        </span>
                      </div>
                      
                      <!-- Action Buttons -->
                      <div class="tw:flex tw:gap-2 tw:mt-3">
                        <button 
                          @click="openDirections"
                          :disabled="!hasCoordinates"
                          class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-blue-600 tw:bg-blue-50 tw:rounded-lg hover:tw:bg-blue-100 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
                        >
                          <svg class="tw:w-3.5 tw:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Get Directions
                        </button>
                        <button 
                          @click="copyAddress"
                          :disabled="!event?.address"
                          class="tw:inline-flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-gray-600 tw:bg-gray-100 tw:rounded-lg hover:tw:bg-gray-200 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
                        >
                          <svg class="tw:w-3.5 tw:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {{ copySuccess ? 'Copied!' : 'Copy Address' }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Map Section -->
                  <div>
                    <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-3">Venue Map</h4>
                    
                    <div class="tw:relative tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:shadow-sm">
                      <!-- Loading State -->
                      <Transition name="fade">
                        <div 
                          v-if="isMapLoading && hasCoordinates" 
                          class="tw:absolute tw:inset-0 tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:z-10"
                        >
                          <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
                            <div class="tw:w-8 tw:h-8 tw:border-3 tw:border-blue-500 tw:border-t-transparent tw:rounded-full tw:animate-spin"></div>
                            <span class="tw:text-sm tw:text-gray-600">Loading map...</span>
                          </div>
                        </div>
                      </Transition>
                      
                      <!-- No Coordinates Fallback -->
                      <div 
                        v-if="!hasCoordinates" 
                        class="tw:h-[300px] lg:tw:h-[400px] tw:bg-gray-50 tw:flex tw:items-center tw:justify-center"
                      >
                        <div class="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center tw:px-6">
                          <div class="tw:w-12 tw:h-12 tw:bg-gray-200 tw:rounded-full tw:flex tw:items-center tw:justify-center">
                            <svg class="tw:w-6 tw:h-6 tw:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <p class="tw:text-sm tw:text-gray-500">Map coordinates are not available for this event</p>
                        </div>
                      </div>
                      
                      <!-- Map Container -->
                      <div 
                        v-show="hasCoordinates"
                        ref="mapContainer" 
                        class="tw:h-[300px] lg:tw:h-[400px] tw:w-full"
                      ></div>
                    </div>
                    
                    <!-- Map Attribution -->
                    <!-- <p class="tw:text-xs tw:text-gray-400 tw:mt-2 tw:text-right">
                      © MapLibre | OpenStreetMap contributors
                    </p> -->
                  </div>
                  
                </div>
              </div>
              
            </Transition>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getUserProfileImageUrl } from '@/utils/userProfileImage'

// Props
const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close'])

// State
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const isMapLoading = ref(false)
const copySuccess = ref(false)
const activeTab = ref('overview')

function normalizeInvitedList(raw) {
  if (!raw) return []
  return Array.isArray(raw) ? raw.filter(Boolean) : []
}

const invitedTalentsObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_talents_objects)
)

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
  return (
    v2?.profile_image ||
    v2?.cover_image ||
    v2?.image_path ||
    talent?.profile_image ||
    getUserProfileImageUrl(talent) ||
    null
  )
}

function talentGenre(talent) {
  const v2 = talent?.talent_v2
  if (!v2) return null
  return v2.talent_category?.name || v2.category?.name || null
}

function talentCity(talent) {
  return talent?.talent_v2?.city || null
}

const invitedOrganisersObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_organisers_objects)
)

const invitedVenuesObjects = computed(() =>
  normalizeInvitedList(props.event?.invited_venues_objects)
)

const tabs = computed(() => {
  const list = [
    { id: 'overview', label: 'Overview' },
    { id: 'dateLocation', label: 'Date & Location' }
  ]
  if (invitedTalentsObjects.value.length > 0) {
    list.push({ id: 'talents', label: 'Talents' })
  }
  if (invitedOrganisersObjects.value.length > 0) {
    list.push({ id: 'organisers', label: 'Organisers' })
  }
  if (invitedVenuesObjects.value.length > 0) {
    list.push({
      id: 'venues',
      label: invitedVenuesObjects.value.length > 1 ? 'Venues' : 'Venue'
    })
  }
  return list
})

const hasVenueTab = computed(() => invitedVenuesObjects.value.length > 0)

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
  if (ev?.invited_venues?.length) return 'See Venue tab'
  return 'Not specified'
})

const modalOverviewTitle = computed(() => {
  const raw = props.event?.title
  if (raw == null || String(raw).trim() === '') return 'Untitled Event'
  return String(raw).trim()
})

const modalOverviewDescription = computed(() => {
  const raw = props.event?.description
  if (raw == null || String(raw).trim() === '') return 'No description available for this event.'
  return String(raw)
})

const modalOverviewCategory = computed(() => {
  const ev = props.event
  const c = ev?.category
  if (c && typeof c === 'object' && c.name != null && String(c.name).trim() !== '') {
    return String(c.name).trim()
  }
  if (typeof c === 'string' && c.trim() !== '') return c.trim()
  if (ev?.category_name != null && String(ev.category_name).trim() !== '') {
    return String(ev.category_name).trim()
  }
  return 'Not specified'
})

const modalOverviewSubcategoryLabels = computed(() => {
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

// Computed
const isOpen = computed(() => props.modelValue)

const hasCoordinates = computed(() => {
  return props.event?.latitude != null && props.event?.longitude != null
})

// Methods
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const openDirections = () => {
  if (!hasCoordinates.value) return
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.event.latitude},${props.event.longitude}`
  window.open(url, '_blank')
}

const copyAddress = async () => {
  if (!props.event?.address) return
  try {
    await navigator.clipboard.writeText(props.event.address)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}

// Map initialization
const initializeMap = async () => {
  if (!hasCoordinates.value || !mapContainer.value) return
  
  // Cleanup existing map
  destroyMap()
  
  isMapLoading.value = true
  
  await nextTick()
  
  try {
    // Create map instance
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [props.event.longitude, props.event.latitude],
      zoom: 15,
      attributionControl: false
    })
    
    // Add navigation control
    map.value.addControl(
      new maplibregl.NavigationControl({ showCompass: false }), 
      'top-right'
    )
    
    // Wait for map to load
    map.value.on('load', () => {
      isMapLoading.value = false
      addMarker()
    })
    
    map.value.on('error', (e) => {
      console.error('Map error:', e)
      isMapLoading.value = false
    })
    
  } catch (error) {
    console.error('Failed to initialize map:', error)
    isMapLoading.value = false
  }
}

// Add marker with popup
const addMarker = () => {
  if (!map.value || !hasCoordinates.value) return
  
  // Create custom marker element
  const el = document.createElement('div')
  el.className = 'custom-marker'
  el.innerHTML = `
    <img 
      src="/marker.png" 
      alt="Location" 
      style="width: 40px; height: 40px; cursor: pointer;"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div style="display: none; width: 32px; height: 32px; background: #EF4444; border-radius: 50%; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `
  
  // Create popup
  const popup = new maplibregl.Popup({
    offset: [0, -35],
    closeButton: true,
    closeOnClick: false,
    className: 'event-popup'
  }).setHTML(`
    <div style="padding: 8px; min-width: 180px;">
      <h4 style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px;">
        ${props.event?.title || 'Event Location'}
      </h4>
      <p style="font-size: 12px; color: #6B7280; margin: 0;">
        ${props.event?.address || 'Address not available'}
      </p>
    </div>
  `)
  
  // Create marker
  marker.value = new maplibregl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat([props.event.longitude, props.event.latitude])
    .setPopup(popup)
    .addTo(map.value)
  
  // Show popup by default
  marker.value.togglePopup()
}

// Destroy map instance
const destroyMap = () => {
  if (marker.value) {
    marker.value.remove()
    marker.value = null
  }
  if (map.value) {
    map.value.remove()
    map.value = null
  }
}

// Watch for tab changes - initialize map when Date & Location tab becomes active
watch(activeTab, (newTab) => {
  if (newTab === 'dateLocation' && hasCoordinates.value) {
    nextTick(() => {
      initializeMap()
    })
  }
})

function syncActiveTabWithAvailableTabs() {
  const ids = tabs.value.map((t) => t.id)
  if (!ids.includes(activeTab.value)) {
    activeTab.value = 'overview'
  }
}

watch(tabs, () => {
  syncActiveTabWithAvailableTabs()
})

// Watch for modal open/close
watch(isOpen, (open) => {
  if (open) {
    activeTab.value = 'overview'
  } else {
    destroyMap()
    activeTab.value = 'overview'
  }
})

// Watch for event changes
watch(
  () => props.event,
  (newEvent) => {
    showAllTalents.value = false
    syncActiveTabWithAvailableTabs()
    if (newEvent && activeTab.value === 'dateLocation' && hasCoordinates.value) {
      nextTick(() => {
        initializeMap()
      })
    }
  },
  { deep: true }
)

// Cleanup on unmount
onUnmounted(() => {
  destroyMap()
})
</script>

<style scoped>
/* Modal animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Tab content animations */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading spinner */
.tw\:border-3 {
  border-width: 3px;
}

.tw\:animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom marker styles */
:deep(.custom-marker) {
  cursor: pointer;
  transition: transform 0.2s ease;
}

:deep(.custom-marker:hover) {
  transform: scale(1.1);
}

/* Popup styles */
:deep(.event-popup .maplibregl-popup-content) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
}

:deep(.event-popup .maplibregl-popup-close-button) {
  font-size: 16px;
  padding: 4px 8px;
  color: #9CA3AF;
}

:deep(.event-popup .maplibregl-popup-close-button:hover) {
  color: #374151;
  background: transparent;
}

:deep(.maplibregl-popup-tip) {
  border-top-color: white;
}

.tw\:scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tw\:scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
