<template>
  <div class="tw:px-4">
    <!-- Top Description Paragraph -->
    <p v-if="description" class="tw:text-sm tw:text-blue tw-leading-relaxed tw-mb-6 tw:py-1">
      {{ description }}
    </p>

    <!-- 2-Column Grid Layout -->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw:py-1">
      <!-- Left Column -->
      <div class="tw-space-y-5 tw:py-1">
        <!-- Accessibility Section -->
        <div v-if="hasAccessibilityItems" class="tw:py-1">
          <h5 class="tw:text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.accessibility') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div v-if="about?.accessibility?.wheelchair_accessible" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.wheelchairAccessible') }}</span>
            </div>
            <div v-if="about?.accessibility?.wheelchair_entrance" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.wheelchairEntrance') }}</span>
            </div>
            <div v-if="about?.accessibility?.wheelchair_parking" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.wheelchairParking') }}</span>
            </div>
            <div v-if="about?.accessibility?.accessible_toilets" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.accessibleToilets') }}</span>
            </div>
            <div v-if="about?.accessibility?.elevator_access" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.elevatorAccess') }}</span>
            </div>
          </div>
        </div>

        <!-- Planning Section -->
        <div v-if="hasPlanningItems" class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.planning') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div v-if="about?.planning?.advance_booking_recommended" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.advanceBookingRecommended') }}</span>
            </div>
            <div v-if="about?.planning?.ticket_required" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.ticketRequired') }}</span>
            </div>
            <div v-if="about?.planning?.door_sales_available" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.doorSalesAvailable') }}</span>
            </div>
          </div>
        </div>

        <!-- Rules Section -->
        <div v-if="about?.rules && about.rules.length > 0" class="tw:py-1">
          <h5 class="tw:text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.rules') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px;">
            <div v-for="(rule, index) in about.rules" :key="index" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-red-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-gray-600 tw:py-1">{{ rule }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="tw-space-y-5">
        <!-- Services Section -->
        <div v-if="hasServicesItems">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.serviceOptions') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div v-if="about?.services?.wifi" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.wifi') }}</span>
            </div>
            <div v-if="about?.services?.coat_check" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.coatCheck') }}</span>
            </div>
            <div v-if="about?.services?.parking" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.parking') }}</span>
            </div>
            <div v-if="about?.services?.lockers" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.lockers') }}</span>
            </div>
            <div v-if="about?.services?.smoking_area" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.smokingArea') }}</span>
            </div>
          </div>
        </div>

        <!-- Amenities Section -->
        <div v-if="hasAmenitiesItems" class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.amenities') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div v-if="about?.amenities?.restaurant" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.restaurant') }}</span>
            </div>
            <div v-if="about?.amenities?.bar" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.bar') }}</span>
            </div>
            <div v-if="about?.amenities?.terrace" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.terrace') }}</span>
            </div>
            <div v-if="about?.amenities?.vip_area" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.vipArea') }}</span>
            </div>
            <div v-if="about?.amenities?.dance_floor" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.danceFloor') }}</span>
            </div>
            <div v-if="about?.amenities?.food_court" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.foodCourt') }}</span>
            </div>
            <div v-if="about?.amenities?.merchandise" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.merchandise') }}</span>
            </div>
            <div v-if="about?.amenities?.vip_lounge" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.vipLounge') }}</span>
            </div>
          </div>
        </div>

        <!-- Children Section -->
        <div v-if="hasChildrenItems" class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.children') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div v-if="about?.children?.suitable_for_children" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.suitableForChildren') }}</span>
            </div>
            <div v-if="about?.children?.baby_changing_table" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.babyChangingTable') }}</span>
            </div>
            <div v-if="about?.children?.kids_area" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">{{ t('about.kidsArea') }}</span>
            </div>
          </div>
        </div>

        <!-- Tips Section -->
        <div v-if="about?.tips && about.tips.length > 0" class="tw:py-1">
          <h5 class="tw:text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.tips') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px;">
            <div v-for="(tip, index) in about.tips" :key="index" class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-green-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-gray-600 tw:py-1">{{ tip }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-if="!hasAnyData" class="tw:text-sm tw:text-gray-500 tw:py-4 tw:text-center">
      {{ t('about.noInfoAvailable') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EventAbout } from '../types/events'

const { t } = useI18n()

interface Props {
  about?: EventAbout | null
  description?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  about: null,
  description: null
})

const hasAccessibilityItems = computed(() => {
  const a = props.about?.accessibility
  return a?.wheelchair_accessible || a?.wheelchair_entrance || a?.wheelchair_parking || a?.accessible_toilets || a?.elevator_access
})

const hasPlanningItems = computed(() => {
  const p = props.about?.planning
  return p?.advance_booking_recommended || p?.ticket_required || p?.door_sales_available
})

const hasServicesItems = computed(() => {
  const s = props.about?.services
  return s?.wifi || s?.coat_check || s?.parking || s?.lockers || s?.smoking_area
})

const hasAmenitiesItems = computed(() => {
  const a = props.about?.amenities
  return a?.restaurant || a?.bar || a?.terrace || a?.vip_area || a?.dance_floor || a?.food_court || a?.merchandise || a?.vip_lounge
})

const hasChildrenItems = computed(() => {
  const c = props.about?.children
  return c?.suitable_for_children || c?.baby_changing_table || c?.kids_area
})

const hasAnyData = computed(() => {
  return props.description || 
    hasAccessibilityItems.value || 
    hasPlanningItems.value || 
    hasServicesItems.value || 
    hasAmenitiesItems.value || 
    hasChildrenItems.value ||
    (props.about?.rules && props.about.rules.length > 0) ||
    (props.about?.tips && props.about.tips.length > 0)
})
</script>
