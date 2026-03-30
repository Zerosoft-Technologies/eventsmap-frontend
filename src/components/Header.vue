<template>
  <header :class="fixedMenu ? 'tw:fixed tw:top-0 tw:left-0 z-50': ''" class="tw:w-full tw:bg-[#ECEEF4] tw:py-2 tw:px-4 tw:md:py-3 tw:md:px-8 tw:flex tw:items-center tw:justify-between tw:border-b tw:border-gray-300">
    <h1 class="tw:font-bold tw:leading-[1.4] tw:tracking-[-0.5px] tw:text-lg">
      <RouterLink to="/">
        <img src="../assets/logo.png" alt="Logo" style="width: 80px;" />
      </RouterLink>
    </h1>
    <div v-if="!isProfilePage" class="tw:hidden tw:relative tw:md:flex tw:items-center tw:gap-3">
      <div class="tw:flex tw:relative tw:bg-white tw:gap-6 tw:items-center tw:py-3 tw:pr-3 tw:pl-4 tw:border tw:border-(--secondary-color) tw:rounded-lg" >
        <div class="tw:flex tw:gap-2 tw:relative tw:cursor-pointer tw:items-center tw:w-[169px] overflow-hidden">
          <img src="../assets/search.png" alt="Search Icon" />
          <input ref="searchInput" @keyup.enter="filterBy('search')" v-model="searchTerm" @focus="showSuggestion = true" @blur="handleSuggestionBlur" type="text" class="tw:outline-none tw:placeholder-(--primary-color)" :placeholder="$t('header.search.placeholder')">        
        </div>
        <div class="tw:w-px tw:h-[22px] tw:bg-(--primary-color)"></div>
        <div class="tw:flex tw:gap-1 tw:cursor-pointer tw:items-center" ref="locationToggler" @click="toggleLocation"><img src="../assets/location-01.png" alt="Location Icon" />
          <p>{{ city || $t('header.defaultLocation') }}</p>
          <img src="../assets/chevron-down.png" alt="Chevron Down" class="ml-1" />
        </div>   
        <transition name="fade">
          <div v-if="showLocation" v-click-outside="handleOutsideClick" class="tw:absolute tw:flex tw:flex-col tw:gap-2.5 tw:overflow-x-visible tw:mt-px tw:right-0 tw:top-full tw:rounded-2xl tw:p-4 tw:bg-(--gray-color) tw:z-10">
            <div class="tw:bg-white tw:flex tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/maps-search.png" alt="Map Icon" />
              <input v-model="searchLocation" @keyup.enter="debouncedSearch" @input="debouncedSearch" type="text" class="tw:outline-none tw:placeholder-(--primary-color) tw:w-[15ch]" :placeholder="$t('header.location.placeholder')"> 
            </div>   
            <div @click="getLocation" class="tw:bg-white tw:flex tw:cursor-pointer tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-md">
              <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
              <p class="m-0">{{ $t('header.currentLocation') }}</p>
            </div>          
          </div>
        </transition> 
        <transition name="fade">
          <div v-if="searchResults.length > 0" class="tw:absolute tw:w-[400px] tw:flex tw:flex-col tw:overflow-x-visible tw:mt-px tw:top-full tw:left-full tw:z-10 tw:rounded-2xl tw:p-4 tw:bg-(--gray-color)">
            <div v-for="(result, index) in searchResults" @click="selectCity(result)" :key="index" class="tw:cursor-pointer border-b tw:border-(--secondary-color) tw:text-sm tw:py-2.5">
              <p class="m-0">{{ result.display_name }}</p>
            </div>          
          </div>
        </transition>         
      </div>
      <div>
        <button class="tw:bg-white tw:py-3 tw:hidden tw:gap-2 tw:items-center tw:lg:flex tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg"><img src="../assets/calendar.png" alt="Calendar Icon"/><span>
          <DatePicker @update:dateRange="dateRange = $event" />
        </span></button>
      </div>      
      <transition name="fade">
        <div v-if="showSuggestion" @mousedown.prevent class="tw:absolute tw:left-0 tw:top-full tw:rounded-2xl tw:p-3 tw:bg-(--gray-color) tw:z-10 tw:w-[35vw]">
          <div class="tw:flex tw:items-center tw:gap-2">
            <button
              type="button"
              @click="scrollCategories('left')"
              class="tw:bg-white tw:border tw:border-(--secondary-color) tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories left"
            >
              <img src="../assets/arrow-right.png" alt="Left" class="tw:w-4 tw:h-4 tw:rotate-180" />
            </button>

            <!-- Categories loading skeleton -->
            <div v-if="categoriesLoading" class="tw:flex tw:items-center tw:gap-2 tw:flex-1 tw:py-1">
              <div v-for="i in 5" :key="i" class="tw:inline-flex tw:shrink-0 tw:animate-pulse">
                <div class="tw:h-9 tw:bg-gray-300 tw:rounded-md" :style="{ width: `${80 + Math.random() * 40}px` }"></div>
              </div>
            </div>

            <!-- Categories list -->
            <div
              v-else
              ref="categoriesScrollEl"
              class="cat-scroll tw:flex tw:items-center tw:gap-2 tw:overflow-x-auto tw:whitespace-nowrap tw:flex-1 tw:py-1"
              :class="catIsDragging ? 'tw:cursor-grabbing' : 'tw:cursor-grab'"
              @mousedown="onCatMouseDown"
              @mousemove="onCatMouseMove"
              @mouseup="stopCatDrag"
              @mouseleave="stopCatDrag"
            >
              <button
                v-for="category in categories.filter(c => c.name.toLowerCase() != 'sports')"
                :key="category.id"
                type="button"
                @click="selectCategory(category)"
                :class="[
                  'tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-5 tw:border tw:rounded-md tw:transition-colors',
                  selectedCategory?.id === category.id
                    ? 'tw:bg-[var(--primary-color)] tw:text-white tw:border-[var(--primary-color)]'
                    : 'tw:bg-white tw:border-(--secondary-color) hover:tw:bg-gray-50'
                ]"
              >
                {{ category.name }}
              </button>

              <button
                v-if="selectedCategory"
                type="button"
                @click="clearCategoryFilter"
                class="tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-4 tw:text-gray-500 hover:tw:text-gray-700"
              >
                {{ $t('common.clear') }}
              </button>
            </div>

            <button
              type="button"
              @click="scrollCategories('right')"
              class="tw:bg-white tw:border tw:border-(--secondary-color) tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories right"
            >
              <img src="../assets/arrow-right.png" alt="Right" class="tw:w-4 tw:h-4" />
            </button>
          </div>
        </div>
      </transition>
    </div>
    <button class="tw:lg:hidden tw:text-2xl" type="button" @click="toggleMobileMenu" aria-label="Open menu">☰</button>

    <div class="tw:hidden tw:lg:flex tw:items-center tw:gap-4">
      <div>
        <button @click="toggleWishlistPanel" style="height: 50px;" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color) tw:relative hover:tw:border-red-400 hover:tw:bg-red-50 tw:transition-colors">
          <img src="../assets/favourite.png" alt="Favourite Icon"/>
          <span v-if="wishlistStore.wishlistEvents.length > 0" class="tw:absolute tw:-top-1.5 tw:-right-1.5 tw:bg-red-500 tw:text-white tw:text-[10px] tw:font-bold tw:w-5 tw:h-5 tw:rounded-full tw:flex tw:items-center tw:justify-center">{{ wishlistStore.wishlistEvents.length }}</span>
        </button>
      </div>
      <!-- Invitation notifications (authenticated only) -->
      <div v-if="authStore.isAuthenticated" class="tw:relative">
        <button
          ref="notificationToggler"
          @click="showNotificationDropdown = !showNotificationDropdown"
          style="height: 50px;"
          class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color) tw:relative hover:tw:bg-gray-50 tw:transition-colors"
          :aria-label="$t('header.notifications') || 'Notifications'"
        >
          <Bell class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
          <span v-if="notificationStore.pendingCount > 0" class="tw:absolute tw:-top-1.5 tw:-right-1.5 tw:bg-amber-500 tw:text-white tw:text-[10px] tw:font-bold tw:min-w-[18px] tw:h-[18px] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:px-1">{{ notificationStore.pendingCount }}</span>
        </button>
        <transition name="fade">
          <div
            v-if="showNotificationDropdown"
            v-click-outside="handleNotificationDropdownOutsideClick"
            class="tw:absolute tw:right-0 tw:top-full tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-(--secondary-color) tw:overflow-hidden tw:z-20 tw:min-w-[280px] tw:max-w-[360px]"
          >
            <div class="tw:px-3 tw:py-2 tw:border-b tw:border-gray-200 tw:font-medium tw:text-sm tw:text-gray-700">
              {{ $t('header.invitationNotifications') || 'Invitation notifications' }}
            </div>
            <div v-if="notificationStore.pendingInvitations.length === 0" class="tw:px-3 tw:py-4 tw:text-sm tw:text-gray-500">
              {{ $t('header.noPendingInvitations') || 'No pending invitations.' }}
            </div>
            <ul v-else class="tw:max-h-[320px] tw:overflow-y-auto">
              <li
                v-for="n in notificationStore.pendingInvitations"
                :key="n.id"
                class="tw:px-3 tw:py-3 tw:border-b tw:border-gray-100 last:tw:border-b-0 tw:text-sm"
              >
                <p class="tw:text-gray-800 tw:mb-0.5">{{ n.message }}</p>
                <p class="tw:text-gray-500 tw:text-xs tw:mb-0">{{ n.event_title }}</p>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div v-if="!authStore.isAuthenticated">
        <RouterLink to="/register" style="height: 50px;" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/user.png" alt="User Icon"/><span>{{ $t('header.createProfile') }}</span></RouterLink>
      </div>      
      <!-- Language Switcher -->
      <div class="tw:relative">
        <button 
          ref="languageToggler"
          @click="toggleLanguageDropdown"
          style="height: 50px;"
          class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-2 tw:border-(--secondary-color) tw:cursor-pointer"
        >
          <img :src="currentLanguage.flag" :alt="currentLanguage.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
          <!-- <span class="tw:text-sm">{{ currentLanguage.name }}</span> -->
          <img src="../assets/chevron-down.png" alt="Chevron Down" class="tw:w-3 tw:h-3 tw-ml-1" style="height: 8px;" />
        </button>
        
        <transition name="fade">
          <div 
            v-if="showLanguageDropdown" 
            v-click-outside="handleLanguageDropdownOutsideClick"
            class="tw:absolute tw:right-0 tw:top-full tw:mt-1 tw:bg-white tw:rounded-lg tw:shadow-lg tw:border tw:border-(--secondary-color) tw:overflow-hidden tw:z-20"
          >
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="tw:w-full tw:px-4 tw:py-2 tw:flex tw:items-center tw:gap-3 tw:hover:bg-gray-50 tw-transition-colors tw:text-left"
              :class="{ 'tw:bg-gray-100': lang.code === currentLocale }"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
              <!-- <span class="tw:text-sm">{{ lang.name }}</span> -->
              <!-- <svg 
                v-if="lang.code === currentLocale" 
                class="tw:w-4 tw:h-4 tw:ml-auto tw:text-green-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg> -->
            </button>
          </div>
        </transition>
      </div>
      <div>
        <!-- Authenticated: user menu -->
        <div v-if="authStore.isAuthenticated" class="tw:flex tw:items-center tw:gap-2">
          <!-- Gallery link (premium only) -->
          <router-link
            v-if="authStore.user?.account_type === 'premium'"
            :to="galleryRoute"
            @click="handleGalleryClick"
            style="height: 50px;"
            class="no-hover tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color) hover:tw:bg-gray-50"
          >
            <Images class="tw:w-5 tw:h-5" style="color: var(--primary-color)" />
            <span class="tw:text-sm tw:font-medium" style="color: var(--primary-color)">Gallery</span>
          </router-link>
          <router-link :to="userCreatePath" style="height: 50px;" class="no-hover tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color) hover:tw:bg-gray-50">
            <span class="tw:text-sm tw:font-medium" style="color: var(--primary-color)">{{ authStore.user?.name || 'Profile' }}</span>
          </router-link>
          <button @click="handleLogout" style="height: 50px;" class="no-hover tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color) hover:tw:bg-gray-50">
            <span class="tw:text-sm">{{ $t('header.logout') || 'Logout' }}</span>
          </button>
        </div>
        <!-- Not authenticated: login button -->
        <button v-else @click="$emit('open-login')" style="height: 50px;" class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"><img src="../assets/login.png" alt="Login Icon"/><span>{{ $t('header.login') }}</span></button>
      </div>
    </div>

    <transition name="slide-right">
      <div
        v-if="false"
        class="tw:absolute tw:top-full tw:left-0 tw:md:left-auto tw:md:right-0 tw:w-full tw:md:w-1/2 tw:bg-transparent tw:shadow-md tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:lg:hidden tw:transition-all tw:duration-300"
      >
        <div class="tw:flex tw:bg-white tw:md:hidden tw:gap-4 tw:items-center tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>{{ $t('header.search.placeholder') }}</p>
        </div>
        <div class="tw:bg-white tw:md:hidden tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Amsterdam</p>
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <DatePicker @update:dateRange="dateRange = $event" @update:session="sessionFilter = $event" />
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Link</p>
        </div>

        <div v-if="!authStore.isAuthenticated" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <RouterLink to="/register"><p>{{ $t('header.createProfile') }}</p></RouterLink>
        </div>

        <div v-if="authStore.isAuthenticated" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <router-link :to="userCreatePath"><p>{{ authStore.user?.name || 'Profile' }}</p></router-link>
        </div>
        <div v-if="authStore.isAuthenticated" @click="handleLogout" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg tw:cursor-pointer">
          <p>{{ $t('header.logout') || 'Logout' }}</p>
        </div>
        <div v-if="!authStore.isAuthenticated" @click="$emit('open-login')" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg tw:cursor-pointer">
          <p>{{ $t('header.login') }}</p>
        </div>

        <!-- Mobile Language Switcher -->
        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p class="tw-mb-2 tw-font-medium">{{ $t('header.language') }}</p>
          <div class="tw:flex tw:flex-col tw-gap-2">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="tw:flex tw-items-center tw-gap-2 tw:text-sm tw-py-1"
              :class="{ 'tw-font-semibold': lang.code === currentLocale }"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-6 tw:h-4 tw-object-cover tw-rounded-sm" />
              <span>{{ lang.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>

  <!-- Mobile Overlay Menu -->
  <transition name="slide-right">
    <div
      v-if="isMobileMenuOpen"
      class="tw:fixed tw:inset-0 tw:w-full tw:h-screen tw:bg-white tw:z-50 tw:flex tw:flex-col tw:transition-all tw:duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <button
        v-if="activeField !== 'date'"
        type="button"
        class="tw:absolute tw:top-4 tw:right-4 tw:border tw:border-orange-400 tw:rounded-md tw:p-2 tw:z-[90] tw:pointer-events-auto tw:bg-white"
        @click="closeMobileHeader"
        aria-label="Close menu"
      >
        X
      </button>

      <!-- Scrollable content -->
      <div class="tw:flex-1 tw:overflow-y-auto tw:px-4 tw:pb-4 tw:pt-20 tw:flex tw:flex-col tw:gap-4">
        <!-- Icons Row -->
        <div class="tw:flex tw:items-center tw:justify-end tw:gap-3">
          <button
            type="button"
            @click="toggleWishlistPanelMobile"
            style="height: 50px;"
            class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color) tw:relative hover:tw:border-red-400 hover:tw:bg-red-50 tw:transition-colors"
            aria-label="Wishlist"
          >
            <img src="../assets/favourite.png" alt="Favourite Icon"/>
            <span
              v-if="wishlistStore.wishlistEvents.length > 0"
              class="tw:absolute tw:-top-1.5 tw:-right-1.5 tw:bg-red-500 tw:text-white tw:text-[10px] tw:font-bold tw:w-5 tw:h-5 tw:rounded-full tw:flex tw:items-center tw:justify-center"
            >
              {{ wishlistStore.wishlistEvents.length }}
            </span>
          </button>

          <!-- Invitation notifications icon (authenticated only) -->
          <button
            v-if="authStore.isAuthenticated"
            type="button"
            ref="notificationToggler"
            @click="showNotificationDropdown = !showNotificationDropdown"
            style="height: 50px;"
            class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1 tw:items-center tw:border tw:border-(--secondary-color) tw:relative hover:tw:bg-gray-50 tw:transition-colors"
            :aria-label="$t('header.notifications') || 'Notifications'"
          >
            <Bell class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
            <span
              v-if="notificationStore.pendingCount > 0"
              class="tw:absolute tw:-top-1.5 tw:-right-1.5 tw:bg-amber-500 tw:text-white tw:text-[10px] tw:font-bold tw:min-w-[18px] tw:h-[18px] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:px-1"
            >
              {{ notificationStore.pendingCount }}
            </span>
          </button>

          <button
            type="button"
            ref="languageToggler"
            @click="toggleField('language')"
            style="height: 50px;"
            class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-2 tw:border-(--secondary-color) tw:cursor-pointer"
            :aria-label="$t('header.language') || 'Language'"
          >
            <img
              :src="currentLanguage.flag"
              :alt="currentLanguage.name + ' flag'"
              class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm"
            />
            <img
              src="../assets/chevron-down.png"
              alt="Chevron Down"
              class="tw:w-3 tw:h-3 tw:ml-1"
              style="height: 8px;"
              :class="activeField === 'language' ? 'tw:rotate-180' : ''"
            />
          </button>
        </div>

        <!-- Language Dropdown (mobile) -->
        <div
          v-if="activeField === 'language'"
          class="tw:w-full tw:mt-2 tw:bg-white tw:border tw:rounded-lg tw:p-4 tw:shadow-md tw:max-h-[60vh] tw:overflow-y-auto"
        >
          <div class="tw:mb-2 tw-font-medium tw:text-sm tw:text-gray-700">
            {{ $t('header.language') || 'Language' }}
          </div>
          <div class="tw:flex tw:flex-col tw:gap-2">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              type="button"
              @click="handleMobileLanguageSelect(lang.code)"
              class="tw:w-full tw:px-4 tw:py-2 tw:flex tw:items-center tw:gap-3 tw:hover:bg-gray-50 tw-transition-colors tw:text-left tw:rounded-md"
              :class="lang.code === currentLocale ? 'tw:bg-gray-100' : 'tw:bg-white'"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
              <span class="tw:text-sm">{{ lang.name }}</span>
            </button>
          </div>
        </div>

        <!-- In-flow notifications dropdown (mobile) -->
        <div v-if="showNotificationDropdown && authStore.isAuthenticated" class="tw:w-full tw:bg-white tw:rounded-lg tw:shadow-md tw:border tw:border-(--secondary-color) tw:p-4">
          <div class="tw:px-1 tw:pb-2 tw:border-b tw:border-gray-200 tw:font-medium tw:text-sm tw:text-gray-700">
            {{ $t('header.invitationNotifications') || 'Invitation notifications' }}
          </div>
          <div v-if="notificationStore.pendingInvitations.length === 0" class="tw:pt-3 tw:text-sm tw:text-gray-500">
            {{ $t('header.noPendingInvitations') || 'No pending invitations.' }}
          </div>
          <ul v-else class="tw:mt-2 tw:max-h-[320px] tw:overflow-y-auto">
            <li
              v-for="n in notificationStore.pendingInvitations"
              :key="n.id"
              class="tw:px-2 tw:py-3 tw:border-b tw:border-gray-100 last:tw:border-b-0 tw:text-sm"
            >
              <p class="tw:text-gray-800 tw:mb-0.5">{{ n.message }}</p>
              <p class="tw:text-gray-500 tw:text-xs tw:mb-0">{{ n.event_title }}</p>
            </li>
          </ul>
        </div>

        <template v-if="fixedMenu">
          <!-- Search Field -->
          <input
            ref="searchInput"
            v-model="searchTerm"
            @focus="activeField = null"
            @keyup.enter="filterBy('search'); closeMobileHeader()"
            type="text"
            :placeholder="$t('header.search.placeholder')"
            class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none tw:placeholder-(--primary-color)"
            aria-label="Search events"
          />

          <!-- Location Field -->
          <div class="tw:w-full">
            <button
              type="button"
              class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:text-left"
              @click="toggleField('location')"
              aria-label="Select location"
            >
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <span>{{ city || $t('header.defaultLocation') }}</span>
                <img
                  src="../assets/chevron-down.png"
                  alt="Chevron Down"
                  :class="activeField === 'location' ? 'tw:rotate-180' : ''"
                />
              </div>
            </button>

            <div
              v-if="activeField === 'location'"
              class="tw:w-full tw:mt-2 tw:bg-white tw:border tw:rounded-lg tw:p-4 tw:shadow-md tw:max-h-[60vh] tw:overflow-y-auto"
            >
              <div class="tw:relative tw:z-10 tw:flex tw:flex-col tw:gap-3">
                <input
                  v-model="searchLocation"
                  @keyup.enter="debouncedSearch"
                  @input="debouncedSearch"
                  type="text"
                  :placeholder="$t('header.location.placeholder')"
                  class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none"
                  aria-label="Search location"
                />

                <div v-if="searchResults.length > 0" class="tw:flex tw:flex-col tw:gap-1">
                  <button
                    v-for="(result, index) in searchResults"
                    :key="index"
                    type="button"
                    class="tw:text-left tw:px-3 tw:py-2 tw:border tw:border-(--secondary-color) tw:rounded-md tw:bg-white hover:tw:bg-gray-50"
                    @click="selectCity(result)"
                  >
                    {{ result.display_name }}
                  </button>
                </div>

                <button
                  type="button"
                  class="tw:bg-white tw:border tw:border-(--secondary-color) tw:rounded-lg tw:px-4 tw:py-3 tw:flex tw:items-center tw:justify-center tw:gap-2 hover:tw:bg-gray-50"
                  @click="useCurrentLocationFromMobile"
                  aria-label="Use current location"
                >
                  <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
                  <span>{{ $t('header.currentLocation') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Date Picker -->
          <div class="tw:w-full">
            <button
              type="button"
              class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:text-left"
              @click="toggleField('date')"
              aria-label="Select dates"
            >
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <span>
                  {{
                    dateRange[0] && dateRange[1]
                      ? `${dateRange[0]} - ${dateRange[1]}`
                      : 'Date'
                  }}
                </span>
                <img
                  src="../assets/chevron-down.png"
                  alt="Chevron Down"
                  :class="activeField === 'date' ? 'tw:rotate-180' : ''"
                />
              </div>
            </button>

            <div
              v-if="activeField === 'date'"
              class="mobile-datepicker-panel tw:relative tw:z-40 tw:w-full tw:mt-2 tw:overflow-visible tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white"
              @click.capture="handleMobileDatepickerContainerClick"
            >
              <!-- Apply/Cancel live inside vue-tailwind-datepicker (auto-apply=false); no extra header actions -->
              <div
                class="tw:relative tw:z-40 tw:max-h-[min(60vh,520px)] tw:overflow-y-auto tw:overflow-x-visible tw:px-4 tw:py-3 tw:border tw:border-orange-400 tw:rounded-lg tw:bg-white"
              >
                <DatePicker
                  :key="mobilePickerKey"
                  :inline="true"
                  :noInput="false"
                  :initial-date-range="mobileInitialDateRange"
                  :initial-session="tempSessionFilter"
                  :persist-session-to-storage="false"
                  @update:dateRange="handleMobileDateRangeUpdate"
                  @update:session="handleMobileSessionUpdate"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Email Box -->
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            @click="handleMobileEmailClick"
            :class="activeField === 'date' ? 'tw:pointer-events-none' : ''"
            class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none tw:text-left"
            aria-label="Go to profile"
          >
            {{ authStore.user?.email || '' }}
          </button>

          <!-- Gallery link (premium only, mobile) -->
          <RouterLink
            v-if="authStore.user?.account_type === 'premium'"
            :to="galleryRoute"
            @click="closeMobileHeader()"
            class="tw:border tw:border-orange-400 tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:flex tw:items-center tw:gap-2"
          >
            <Images class="tw:w-5 tw:h-5" style="color: var(--primary-color)" />
            <span style="color: var(--primary-color)" class="tw:font-medium">Gallery</span>
            <span class="tw:ml-auto tw:text-xs tw:bg-emerald-100 tw:text-emerald-700 tw:px-2 tw:py-0.5 tw:rounded-full">PREMIUM</span>
          </RouterLink>

          <!-- Logout Button -->
          <button
            type="button"
            class="tw:bg-white tw:py-3 tw:rounded-lg tw:flex tw:gap-2 tw:items-center tw:justify-center tw:px-4 tw:border tw:border-(--secondary-color) hover:tw:bg-gray-50 tw:transition-colors tw:font-medium"
            @click="closeMobileHeader(); handleLogout()"
            aria-label="Logout"
          >
            {{ $t('header.logout') || 'Logout' }}
          </button>
        </template>

        <template v-else>
          <!-- Register Button (mobile) -->
          <RouterLink
            to="/register"
            style="height: 50px;"
            @click="closeMobileHeader()"
            class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"
          >
            <img src="../assets/user.png" alt="User Icon"/>
            <span>{{ $t('header.createProfile') }}</span>
          </RouterLink>

          <!-- Login Button (mobile) -->
          <button
            type="button"
            style="height: 50px;"
            @click="closeMobileHeader(); $emit('open-login')"
            class="tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:border tw:gap-1 tw:border-(--secondary-color)"
          >
            <img src="../assets/login.png" alt="Login Icon"/>
            <span>{{ $t('header.login') }}</span>
          </button>
        </template>
      </div>
    </div>
  </transition>

  <!-- Location permission prompt -->
  <!-- <LocationPermissionPrompt
    v-show="showManualEnablePrompt"
    @dismiss="() => {}"
    @continue-without="() => {}"
      /> -->
  <div v-if="showResults">
    <AllEvents @closeResults="handleClose" @resetSearch="handleReset" @viewEvent="handleViewEvent" :events="events" :loading="eventsLoading" />
  </div>
  
  <!-- Event Details Panel -->
  <EventDetailsPanel 
    :visible="showEventDetailsPanel" 
    :event="selectedEvent"
    @close="closeEventDetailsPanel"
  />
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from "./DatePicker.vue";
import LocationPermissionPrompt from './LocationPermissionPrompt.vue';
import { useLocationPermission } from '../composables/useLocationPermission';
import { useLanguageSwitch } from '../composables/useLanguageSwitch';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { getCreateRoute } from '@/utils/routeResolver';
import { Bell, Images } from 'lucide-vue-next';
import { useMapStore } from '@/stores/mapStore'

// Lazy load AllEvents to avoid circular import issue
const AllEvents = defineAsyncComponent(() => import('./AllEvents.vue'))

// Lazy load EventDetailsPanel for event details side panel
const EventDetailsPanel = defineAsyncComponent(() => import('./EventDetailsPanel.vue'))

const emit = defineEmits(['open-login', 'toggle-wishlist'])

const { t, locale } = useI18n()
const { switchLanguage, getAvailableLanguages, initializeLanguage } = useLanguageSwitch()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const mapStore = useMapStore()
const router = useRouter()

const userCreatePath = computed(() =>
  getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type)
)

const galleryRoute = computed(() => {
  if (!authStore.user?.account_type || authStore.user.account_type !== 'premium') {
    return '#'
  }
  
  const profileType = authStore.user.profile_type
  let basePath = ''
  
  switch (profileType) {
    case 'event':
      basePath = '/create-event-premium'
      break
    case 'organizer':
      basePath = '/create-organiser-premium'
      break
    case 'venue':
      basePath = '/create-venue-premium'
      break
    case 'talent':
      basePath = '/create-talents-premium'
      break
    default:
      basePath = '/create-event-premium'
  }
  
  return `${basePath}/gallery-images`
})

async function handleLogout() {
  closeMobileHeader()
  await authStore.logout()
  router.push({ name: 'Login' })
}

function handleGalleryClick() {
  router.push(galleryRoute.value)
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) {
    activeField.value = null
  }
}

function closeMobileHeader() {
  isMobileMenuOpen.value = false
  activeField.value = null
  showNotificationDropdown.value = false
}

function toggleField(field) {
  // Close any other dropdown-like UI inside the mobile menu
  showNotificationDropdown.value = false
  activeField.value = activeField.value === field ? null : field
  if (field === 'date' && activeField.value === 'date') {
    tempSessionFilter.value = { ...sessionFilter.value }
    mobilePickerKey.value++
  }
}

function toggleWishlistPanelMobile() {
  toggleWishlistPanel()
  closeMobileHeader()
}

function handleLanguageIconClick() {
  const idx = availableLanguages.findIndex((l) => l.code === currentLocale.value)
  const next = availableLanguages[(idx + 1) % availableLanguages.length]
  if (next) switchLanguage(next.code)
  closeMobileHeader()
}

function useCurrentLocationFromMobile() {
  // getLocation handles closing when the mobile menu is open
  getLocation()
}

function handleMobileLanguageSelect(langCode) {
  switchLanguage(langCode)
  activeField.value = null
  showNotificationDropdown.value = false
}

function handleMobileDatepickerContainerClick(e) {
  const target = e?.target
  if (!target?.closest) return
  // vue-tailwind-datepicker close icon has class `text-vtd-orange`
  const closeIcon = target.closest('.text-vtd-orange')
  if (closeIcon && activeField.value === 'date') {
    activeField.value = null
  }
}

function handleMobileSessionUpdate(newSession) {
  if (newSession) tempSessionFilter.value = { ...newSession }
}

async function handleMobileEmailClick() {
  if (!authStore.isAuthenticated) return
  closeMobileHeader()
  await router.push(userCreatePath.value)
}

function handleMobileDateRangeUpdate(newRange) {
  // auto-apply=false: emitted when user taps Apply inside the calendar footer
  if (!newRange) return
  dateRange.value = Array.isArray(newRange) ? [...newRange] : newRange
  sessionFilter.value = { ...tempSessionFilter.value }
  localStorage.setItem('datepicker-session', JSON.stringify(sessionFilter.value))
  closeMobileHeader()
}

function handleMobileMenuKeydown(e) {
  if (e.key === 'Escape' && isMobileMenuOpen.value) closeMobileHeader()
}

// Notification dropdown state
const showNotificationDropdown = ref(false)
const notificationToggler = ref(null)

// Language switcher state
const showLanguageDropdown = ref(false)
const languageToggler = ref(null)
const availableLanguages = getAvailableLanguages()
const currentLocale = computed(() => locale.value)
const currentLanguage = computed(() => 
  availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
)

const showSuggestion = ref(false)
const isMobileMenuOpen = ref(false)
// 'search' | 'location' | 'date' | null
const activeField = ref(null)
/** Mobile: session draft until user confirms range via calendar Apply (auto-apply=false). */
const tempSessionFilter = ref({
  morning: false,
  afternoon: false,
  evening: false,
  night: false
})
const mobilePickerKey = ref(0)
const isCalendarOpen = computed(
  () => isMobileMenuOpen.value && activeField.value === 'date'
)

// Prevent background scroll when the mobile overlay is open
watch(isMobileMenuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

const showResults = ref(false)
const searchInput = ref(null)
const route = useRoute()
const city = ref("");
const searchLocation = ref("")
const searchTerm = ref('')
const searchResults = ref([])
const categories = ref([])
const categoriesLoading = ref(false)
const selectedCategory = ref(null)
const categoriesScrollEl = ref(null)
const catIsDragging = ref(false)
const catDidDrag = ref(false)
let catDragStartX = 0
let catDragStartScrollLeft = 0
const dateRange = ref([null, null])
const sessionFilter = ref({
  morning: false,
  afternoon: false,
  evening: false,
  night: false
})
/** Seed mobile inline picker from applied filters when opening the date field. */
const mobileInitialDateRange = computed(() => {
  if (activeField.value !== 'date') return null
  return dateRange.value[0] && dateRange.value[1]
    ? [dateRange.value[0], dateRange.value[1]]
    : null
})
const selectedLocation = ref({ lat: 52.3676, lng: 4.9041, name: "Amsterdam" }) // Default to Amsterdam

// Event Details Panel state
const showEventDetailsPanel = ref(false)
const selectedEvent = ref(null)

// Initialize location permission composable
const { 
  permissionStatus: locationPermissionStatus, 
  coords: locationCoords, 
  error: locationError, 
  isLoading: locationLoading,
  getLocation: getCurrentLocation,
  showManualEnablePrompt
} = useLocationPermission()

// Language switcher functions
function toggleLanguageDropdown() {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

function handleLanguageDropdownOutsideClick(e) {
  if (languageToggler.value && languageToggler.value.contains(e.target)) {
    return
  }
  showLanguageDropdown.value = false
}

function handleNotificationDropdownOutsideClick(e) {
  if (notificationToggler.value && notificationToggler.value.contains(e.target)) {
    return
  }
  showNotificationDropdown.value = false
}

function handleSuggestionBlur() {
  setTimeout(() => {
    showSuggestion.value = false
  }, 150)
}

function scrollCategories(direction) {
  const el = categoriesScrollEl.value
  if (!el) return
  const amount = 240
  el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
}

function onCatMouseDown(e) {
  const el = categoriesScrollEl.value
  if (!el) return
  catIsDragging.value = true
  catDidDrag.value = false
  catDragStartX = e.clientX
  catDragStartScrollLeft = el.scrollLeft
}

function onCatMouseMove(e) {
  const el = categoriesScrollEl.value
  if (!el || !catIsDragging.value) return
  e.preventDefault()
  const dx = e.clientX - catDragStartX
  if (Math.abs(dx) > 5) catDidDrag.value = true
  el.scrollLeft = catDragStartScrollLeft - dx
}

function stopCatDrag() {
  if (!catIsDragging.value) return
  catIsDragging.value = false
  if (catDidDrag.value) {
    setTimeout(() => {
      catDidDrag.value = false
    }, 0)
  }
}

// Load categories from API
async function loadCategories() {
  categoriesLoading.value = true;
  try {
    const { fetchCategories } = await import('../api/categories');
    categories.value = await fetchCategories();
    console.log('Categories loaded:', categories.value);
  } catch (e) {
    console.error('Failed to load categories:', e);
    categories.value = [];
  } finally {
    categoriesLoading.value = false;
  }
}

// Handle category selection
function selectCategory(category) {
  if (catDidDrag.value) return
  selectedCategory.value = category;
  showSuggestion.value = false;
  loadEventsFromApi(searchTerm.value.trim());
  showResults.value = true;
}

function clearCategoryFilter() {
  selectedCategory.value = null
  loadEventsFromApi(searchTerm.value.trim())
  showResults.value = true
}

onMounted(() => {
  getLocation();
  loadCategories();
  window.addEventListener('keydown', handleMobileMenuKeydown)
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleMobileMenuKeydown)
  // Restore default scroll behavior
  document.body.style.overflow = ''
})

function filterBy(action){
  if(action == 'search'){
    // Load events from API and show in AllEvents panel
    loadEventsFromApi(searchTerm.value.trim());
    showResults.value = true;
    searchInput.value.blur();

    // Apply pending location to map only when user actually searches
    mapStore.setAppliedLocation({
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      name: selectedLocation.value.name
    })
  } else {
    // Load events without search filter
    loadEventsFromApi();
    showResults.value = true;
  }
}

const fixedMenu = computed(() => { 
  return route.name === 'Home'
})

// Check if current route is a profile/creation page
const isProfilePage = computed(() => {
  const path = route.path.toLowerCase()
  return path.includes('/create-') || 
         path.includes('/settings') || 
         path.includes('/report') ||
         path.includes('organiser') ||
         path.includes('venue') ||
         path.includes('talent') ||
         path.includes('event') ||
         path.includes('login') ||
         path.includes('register') ||
         path.includes('forgot-password')
})

function toggleWishlistPanel() {
  // Emit toggle event - auth guard and state management handled in App.vue
  emit('toggle-wishlist')
}

function handleClose(){
  showResults.value = false
}

function handleReset(){
  showResults.value = false
  searchTerm.value = ""  
  searchInput.value.blur();
  city.value = "Amsterdam";
  selectedCategory.value = null
  selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
  sessionFilter.value = {
    morning: false,
    afternoon: false,
    evening: false,
    night: false
  }
}

async function getLocation() {
  const location = await getCurrentLocation();
  
  if (location) {
    // Successfully got location, now reverse geocode to get city name
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
      );
      const data = await res.json();
      const cityName = data.address.city || data.address.town || data.address.village || "Amsterdam";
      city.value = cityName;
      
      // Store current location coordinates
      selectedLocation.value = {
        lat: location.latitude,
        lng: location.longitude,
        name: cityName
      };
      // Do not move map immediately; mark pending until user searches
      mapStore.setPendingLocation({
        lat: location.latitude,
        lng: location.longitude,
        name: cityName
      })
    } catch (e) {
      console.error('Failed to reverse geocode location:', e);
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
      mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
    }
  } else {
    // Location access failed or was denied
    if (locationError.value?.isPermissionDenied) {
      city.value = "Amsterdam";
      // Keep Amsterdam as default
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
      mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
    } else if (locationError.value) {
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
      mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
    } else {
      city.value = "Amsterdam";
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" };
      mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
    }
  }

  if (isMobileMenuOpen.value) closeMobileHeader()
}

const events = ref([]);
const eventsLoading = ref(false);

// Convert DD/MM/YYYY to YYYY-MM-DD
function formatDateToApi(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

// Debounce utility (avoid spamming API while user is selecting)
function debounce(fn, delay = 450) {
  let t = null
  return (...args) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

// Load events from API
async function loadEventsFromApi(searchQuery = '') {
  eventsLoading.value = true;
  try {
    const { fetchEvents } = await import('../api/events');
        
    const params = {
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      radius: 100,
      per_page: 20
    };
    
    // Add search param if provided
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    // Add category filter if selected
    if (selectedCategory.value) {
      params.category = selectedCategory.value.slug;
    }
    
    // Add date range if selected
    if (dateRange.value[0]) {
      params.from_date = formatDateToApi(dateRange.value[0]);
    }
    if (dateRange.value[1]) {
      params.to_date = formatDateToApi(dateRange.value[1]);
    }
    
    // Add session filter if any sessions are selected
    const activeSessions = Object.entries(JSON.parse(localStorage.getItem('datepicker-session') || '{}'))
    .filter(([key, value]) => value)
    .map(([key]) => key);

    if (activeSessions.length > 0) {
      activeSessions.forEach(session => {
        params[session] = true
      })
    }
    
    const result = await fetchEvents(params);
    events.value = result.data;
  } catch (e) {
    console.error('Failed to load events:', e);
    events.value = [];
  } finally {
    eventsLoading.value = false;
  }
}

const debouncedReloadEvents = debounce(() => {
  loadEventsFromApi(searchTerm.value.trim())
  showResults.value = true
}, 500)

// Trigger API when applied date range changes (desktop picker updates dateRange directly; mobile uses Apply)
watch(dateRange, () => {
  debouncedReloadEvents()
}, { deep: true })

watch(sessionFilter, () => {
  debouncedReloadEvents()
}, { deep: true })

const searchCity = async () => {
  if (!searchLocation.value?.trim()) {
    searchResults.value = []
    return
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchLocation.value
      )}&addressdetails=1&limit=5`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();
    searchResults.value = data;
    // error.value = "";
  } catch (err) {
    // error.value = "Failed to fetch locations";
  }
};

let timeout = null;

const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(searchCity, 500);
};

const selectCity = (place) => {
  city.value = place.display_name.split(',')[0]; // Get city name from full address
  searchResults.value = [];
  
  // Store selected location coordinates
  selectedLocation.value = {
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    name: place.display_name.split(',')[0]
  };

  // Share with map pages (Home / Events)
  // Do not move map immediately; mark pending until user searches
  mapStore.setPendingLocation({
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    name: place.display_name.split(',')[0]
  })

  if (isMobileMenuOpen.value) closeMobileHeader()
};

const showLocation = ref(false)
const locationToggler = ref(null);

const toggleLocation = () => {  
  showLocation.value = !showLocation.value  
}

const handleOutsideClick = (e) => {
  if (locationToggler.value.contains(e.target)) {        
    return;
  }
  showLocation.value = false
}

/**
 * Handle view event - opens the event details panel
 * @param {Object} event - The event object to display
 */
function handleViewEvent(event) {
  console.log('[Header] handleViewEvent called with:', event)
  console.log('[Header] Event ID:', event?.id)
  console.log('[Header] Event title:', event?.title)
  console.log('[Header] latitude:', event?.latitude, 'type:', typeof event?.latitude)
  console.log('[Header] longitude:', event?.longitude, 'type:', typeof event?.longitude)
  console.log('[Header] address:', event?.address)
  
  // Ensure we're setting a proper event object with coordinates
  if (event) {
    selectedEvent.value = {
      ...event,
      // Ensure coordinates are numbers
      latitude: event.latitude !== undefined ? Number(event.latitude) : null,
      longitude: event.longitude !== undefined ? Number(event.longitude) : null
    }
    console.log('[Header] selectedEvent set to:', selectedEvent.value)
  } else {
    selectedEvent.value = null
  }
  
  showEventDetailsPanel.value = true
}

/**
 * Close the event details panel
 */
function closeEventDetailsPanel() {
  showEventDetailsPanel.value = false
  selectedEvent.value = null
}
</script>

<script>
import clickOutside from "../directives/click-outside.js";

export default {
  directives: { clickOutside },
  inheritAttrs: false
};
</script>

<style scoped>

/* Search suggestion animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Search suggestion animation */

 .cat-scroll {
   -ms-overflow-style: none;
   scrollbar-width: none;
   user-select: none;
 }

 .cat-scroll::-webkit-scrollbar {
   display: none;
 }

/* Menu animation */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-enter-active {
  transition: all 0.35s ease;
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-right-leave-active {
  transition: all 0.25s ease;
}
/* Menu animation */

/* Mobile datepicker layering and close affordance inside the calendar */
.mobile-datepicker-panel {
  z-index: 40;
  overflow: visible;
}

.mobile-datepicker-panel :deep(.vtd-datepicker) {
  position: relative;
  z-index: 40;
  padding-top: 2.75rem;
}

.mobile-datepicker-panel :deep(.text-vtd-orange) {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  left: auto !important;
  z-index: 60;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f97316;
  border-radius: 9999px;
  background-color: #ffffff;
  color: #f97316;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.mobile-datepicker-panel :deep(.text-vtd-orange:hover) {
  background-color: #fff7ed;
  border-color: #ea580c;
  color: #ea580c;
}

.mobile-datepicker-panel :deep(.text-vtd-orange svg) {
  width: 1.1rem;
  height: 1.1rem;
}
</style>