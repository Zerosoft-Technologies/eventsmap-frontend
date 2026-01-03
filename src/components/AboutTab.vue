<template>
  <div class="tw:px-4">
    <!-- Top Description Paragraph -->
    <p class="tw:text-sm tw:text-blue tw-leading-relaxed tw-mb-6 tw:py-1">
      An evening of smooth jazz featuring local and international artists at the iconic Paradiso.
    </p>

    <!-- 2-Column Grid Layout -->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw:py-1">
      <!-- Left Column -->
      <div class="tw-space-y-5 tw:py-1">
        <!-- Toegankelijkheid Section -->
        <div class="tw:py-1">
          <h5 class="tw:text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.accessibility') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Rolstoeltoegankelijk</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Rolstoeltoegankelijke ingang</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Rolstoeltoegankelijke parking</span>
            </div>
          </div>
        </div>

        <!-- Planning Section -->
        <div class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.planning') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Aanbevolen om van tevoren tickets te kopen</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="tw-space-y-5">
        <!-- Serviceopties Section -->
        <div>
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.serviceOptions') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Services op bedrijfslocatie</span>
            </div>
          </div>
        </div>

        <!-- Voorzieningen Section -->
        <div class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.amenities') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Restaurants</span>
            </div>
          </div>
        </div>

        <!-- Kinderen Section -->
        <div class="tw:py-1">
          <h5 class="tw-text-base tw-font-medium tw:text-black tw-mb-3 tw:py-1">{{ t('about.children') }}</h5>
          <div class="tw-space-y-2 tw:py-1" style="font-size: 14px; display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Geschikt voor kinderen</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2 tw:py-1" style="display: flex;">
              <svg class="tw-w-4 tw-h-4 tw-text-blue-500 tw-flex-shrink-0 tw:py-1" fill="currentColor" viewBox="0 0 20 20" style="width: 15px;">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="tw-text-sm tw-text-blue-600 tw:py-1">Heeft een of meer babyverschoontafels</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
