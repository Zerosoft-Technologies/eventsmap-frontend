<template>
  <header :class="fixedMenu ? 'tw:fixed tw:top-0 tw:left-0 z-50': ''" class="tw:w-full tw:bg-transparent tw:py-2 tw:px-4 tw:md:py-3 tw:md:px-8 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-y-2 header-root">
    <h1 class="tw:font-bold tw:leading-[1.4] tw:tracking-[-0.5px] tw:text-lg">
      <RouterLink to="/" @click.prevent="goToHomeMap">
        <img src="../assets/logo.png" alt="Logo" style="width: 80px;" />
      </RouterLink>
    </h1>
    <div v-if="!isProfilePage" class="tw:hidden tw:relative tw:md:flex tw:items-center tw:gap-3">
      <div class="search-bar tw:flex tw:relative tw:bg-white tw:gap-6 tw:items-center tw:py-3 tw:pr-3 tw:pl-4 tw:rounded-lg" style="height: 40px;">
        <div class="tw:flex tw:gap-2 tw:relative tw:cursor-pointer tw:items-center tw:w-[169px] overflow-hidden" @click="openSearchSuggestions">
          <img src="../assets/search.png" alt="Search Icon" class="search-icon" />
          <input ref="searchInput" @keyup.enter="filterBy('search')" v-model="searchTerm" @focus="openSearchSuggestions" @blur="handleSuggestionBlur" type="text" class="tw:outline-none tw:placeholder-(--primary-color) search-input tw:bg-transparent tw:text-sm" :placeholder="$t('header.search.placeholder')">        
        </div>
        <div class="divider-v"></div>
        <div class="tw:flex tw:gap-1.5 tw:cursor-pointer tw:items-center location-pill" ref="locationToggler" @click="toggleLocation">
          <img src="../assets/location-01.png" alt="Location Icon" class="tw:opacity-70" />
          <p class="tw:text-sm tw:font-medium tw:m-0">{{ city || $t('header.defaultLocation') }}</p>
          <img src="../assets/chevron-down.png" alt="Chevron Down" class="chevron-icon tw:ml-0.5" />
        </div>   
        <transition name="fade">
          <div v-if="showLocation" v-click-outside="handleOutsideClick" class="dropdown-panel tw:absolute tw:flex tw:flex-col tw:gap-2.5 tw:overflow-x-visible tw:mt-px tw:right-0 tw:top-full tw:rounded-2xl tw:p-4 tw:z-10">
            <div class="dropdown-input-row tw:flex tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:rounded-md">
              <img src="../assets/maps-search.png" alt="Map Icon" />
              <input v-model="searchLocation" @keyup.enter="debouncedSearch" @input="debouncedSearch" type="text" class="tw:outline-none tw:placeholder-(--primary-color) tw:w-[15ch] tw:text-sm tw:bg-transparent" :placeholder="$t('header.location.placeholder')"> 
            </div>   
            <div @click="getLocation({ openList: true })" class="dropdown-input-row tw:flex tw:cursor-pointer tw:items-center tw:justify-center tw:gap-2.5 tw:text-sm tw:py-2.5 tw:px-4 tw:rounded-md">
              <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
              <p class="m-0">{{ $t('header.currentLocation') }}</p>
            </div>          
          </div>
        </transition> 
        <transition name="fade">
          <div v-if="searchResults.length > 0" class="dropdown-panel tw:absolute tw:w-[400px] tw:flex tw:flex-col tw:overflow-x-visible tw:mt-px tw:top-full tw:left-full tw:z-10 tw:rounded-2xl tw:p-4">
            <div v-for="(result, index) in searchResults" @click="selectCity(result)" :key="index" class="tw:cursor-pointer search-result-item tw:text-sm tw:py-2.5">
              <p class="m-0">{{ result.display_name }}</p>
            </div>          
          </div>
        </transition>         
      </div>
      <div>
        <button class="header-btn header-date-field tw:bg-white tw:py-3 tw:hidden tw:gap-2 tw:items-center tw:lg:flex tw:px-4 tw:rounded-lg" style="height: 40px;"><img src="../assets/calendar.png" alt="Calendar Icon"/><span class="tw:text-sm">
          <DatePicker :key="desktopPickerKey" :initial-date-range="dateRange" @update:dateRange="dateRange = $event" @update:session="onSessionFilterUpdate" />
        </span></button>
      </div>
      <!-- Browse-as (desktop): organisers / talents / venues — kept outside search so search stays events-only -->
      <div v-if="!isProfilePage" class="tw:hidden tw:lg:block">
        <select
          class="header-profile-type-select tw:h-10 tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:py-2 tw:pl-3 tw:pr-8 tw:text-sm tw:font-medium tw:text-[var(--primary-color)]"
          :aria-label="$t('header.profileType.ariaLabel')"
          :value="discoveryProfileType"
          @change="onDesktopProfileTypeChange"
        >
          <option v-for="opt in profileTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <transition name="fade">
        <div v-if="showSuggestion" @mousedown.prevent class="suggestion-panel tw:absolute tw:left-0 tw:top-full tw:rounded-2xl tw:p-3 tw:z-10 tw:w-max tw:max-w-[min(920px,calc(100vw-2rem))]">
          <div class="tw:flex tw:items-center tw:gap-2 tw:min-w-0">
            <button
              type="button"
              @click="scrollCategories('left')"
              class="scroll-btn tw:bg-white tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories left"
            >
              <img src="../assets/arrow-right.png" alt="Left" class="tw:w-4 tw:h-4 tw:rotate-180" />
            </button>

            <!-- Event categories + subcategories only (no talent/venue/organiser switcher in search) -->
            <div v-if="categoriesLoading" class="tw:flex tw:items-center tw:gap-2 tw:py-1 tw:min-w-0 tw:max-w-[min(560px,calc(100vw-16rem))] tw:overflow-hidden">
              <div v-for="i in 5" :key="i" class="tw:inline-flex tw:shrink-0 tw:animate-pulse">
                <div class="tw:h-9 tw:bg-gray-200 tw:rounded-md" :style="{ width: `${80 + Math.random() * 40}px` }"></div>
              </div>
            </div>

            <!-- Categories list -->
            <div
              v-else
              ref="categoriesScrollEl"
              class="cat-scroll tw:flex tw:items-center tw:gap-2 tw:overflow-x-auto tw:whitespace-nowrap tw:py-1 tw:min-w-0 tw:max-w-[min(560px,calc(100vw-16rem))]"
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
                  'category-pill tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-5 tw:rounded-full tw:transition-all',
                  selectedCategory?.id === category.id
                    ? 'category-pill--active'
                    : 'category-pill--default'
                ]"
              >
                {{ category.name }}
              </button>

              <button
                v-if="selectedCategory"
                type="button"
                @click="clearCategoryFilter"
                class="tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-4 tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors clear-btn"
              >
                {{ $t('common.clear') }}
              </button>
            </div>

            <button
              type="button"
              @click="scrollCategories('right')"
              class="scroll-btn tw:bg-white tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center"
              aria-label="Scroll categories right"
            >
              <img src="../assets/arrow-right.png" alt="Right" class="tw:w-4 tw:h-4" />
            </button>
          </div>
        </div>
      </transition>
    </div>
    <button class="tw:shrink-0 tw:lg:hidden tw:text-2xl" type="button" @click="toggleMobileMenu" aria-label="Open menu">☰</button>

    <div class="tw:hidden tw:lg:flex tw:items-center tw:gap-3">
      <div>
        <button @click="toggleWishlistPanel" style="height: 40px;" class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative">
          <img src="../assets/favourite.png" alt="Favourite Icon"/>
          <span v-if="wishlistStore.wishlistEvents.length > 0" class="badge badge--red">{{ wishlistStore.wishlistEvents.length }}</span>
        </button>
      </div>
      <!-- Chat (authenticated only) -->
      <div v-if="authStore.isAuthenticated">
        <button
          type="button"
          @click="toggleChatPanel"
          style="height: 40px;"
          class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative"
          :aria-label="$t('header.chat')"
        >
          <MessageSquareText class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
        </button>
      </div>
      <!-- Invitation notifications (authenticated only) -->
      <div v-if="authStore.isAuthenticated" class="tw:relative">
        <button
          ref="notificationToggler"
          @click="showNotificationDropdown = !showNotificationDropdown"
          style="height: 40px;"
          class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative"
          :aria-label="$t('header.notifications') || 'Notifications'"
        >
          <Bell class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
          <span v-if="notificationStore.pendingCount > 0" class="badge badge--amber">{{ notificationStore.pendingCount }}</span>
        </button>
        <transition name="fade">
          <div
            v-if="showNotificationDropdown"
            v-click-outside="handleNotificationDropdownOutsideClick"
            class="notif-dropdown tw:absolute tw:right-0 tw:top-full tw:mt-2 tw:overflow-hidden tw:z-20 tw:min-w-[280px] tw:max-w-[360px]"
          >
            <div class="tw:px-4 tw:py-3 tw:border-b tw:border-gray-100 tw:font-semibold tw:text-sm tw:text-gray-700">
              {{ $t('header.invitationNotifications') || 'Invitation notifications' }}
            </div>
            <div v-if="notificationStore.pendingInvitations.length === 0" class="tw:px-4 tw:py-5 tw:text-sm tw:text-gray-400 tw:text-center">
              {{ $t('header.noPendingInvitations') || 'No pending invitations.' }}
            </div>
            <ul v-else class="tw:max-h-[320px] tw:overflow-y-auto">
              <li
                v-for="n in notificationStore.pendingInvitations"
                :key="n.id"
                class="tw:px-4 tw:py-3 tw:border-b tw:border-gray-50 last:tw:border-b-0 tw:text-sm notif-item"
              >
                <div class="tw:flex tw:items-start tw:gap-2.5">
                  <div class="tw:w-9 tw:h-9 tw:rounded-lg tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:shrink-0">
                    <component :is="invitationRoleIcon(n.receiver_type)" class="tw:w-4 tw:h-4 tw:text-gray-600" aria-hidden="true" />
                  </div>
                  <div class="tw:min-w-0 tw:flex-1">
                    <p class="tw:text-gray-800 tw:mb-0.5 tw:font-medium">{{ formatInvitationMessage(n) }}</p>
                    <p class="tw:text-gray-400 tw:text-xs tw:mb-2">{{ n.event_title }}</p>
                    <div class="tw:flex tw:gap-2 tw:mt-1.5">
                      <button
                        @click="handleInvitationResponse(n.invitation_id, 'accepted')"
                        :disabled="respondingInvitations.has(n.invitation_id)"
                        class="accept-btn tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:rounded-md tw:flex tw:items-center tw:gap-1"
                      >
                        <Loader2 v-if="respondingInvitations.has(n.invitation_id)" class="tw:w-3 tw:h-3 tw:animate-spin" />
                        {{ $t('header.invitationAccept') }}
                      </button>
                      <button
                        @click="handleInvitationResponse(n.invitation_id, 'rejected')"
                        :disabled="respondingInvitations.has(n.invitation_id)"
                        class="decline-btn tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:rounded-md tw:flex tw:items-center tw:gap-1"
                      >
                        {{ $t('header.invitationDecline') }}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div v-if="!authStore.isAuthenticated">
        <RouterLink to="/register" style="height: 40px;" class="header-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-1.5">
          <img src="../assets/user.png" alt="User Icon"/>
          <span class="tw:text-sm tw:font-medium">{{ $t('header.createProfile') }}</span>
        </RouterLink>
      </div>      
      <!-- Language Switcher -->
      <div class="tw:relative">
        <button 
          ref="languageToggler"
          @click="toggleLanguageDropdown"
          style="height: 40px;"
          class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-2 tw:cursor-pointer"
        >
          <img :src="currentLanguage.flag" :alt="currentLanguage.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
          <img src="../assets/chevron-down.png" alt="Chevron Down" class="chevron-icon" style="height: 8px;" />
        </button>
        
        <transition name="fade">
          <div 
            v-if="showLanguageDropdown" 
            v-click-outside="handleLanguageDropdownOutsideClick"
            class="lang-dropdown tw:absolute tw:right-0 tw:top-full tw:mt-2 tw:overflow-hidden tw:z-20"
          >
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="tw:w-full tw:px-4 tw:py-2.5 tw:flex tw:items-center tw:gap-3 tw:text-left lang-option"
              :class="{ 'lang-option--active': lang.code === currentLocale }"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-4 tw:h-4 tw-object-cover tw-rounded-sm" />
            </button>
          </div>
        </transition>
      </div>
      <div>
        <!-- Authenticated: user menu -->
        <div v-if="authStore.isAuthenticated" class="tw:flex tw:items-center tw:gap-2">
          <router-link :to="userCreatePath" @click="onHeaderProfileNav" style="height: 40px;" class="user-name-btn no-hover tw:bg-white tw:px-3.5 tw:py-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-2">
            <img
              v-if="headerUserAvatarUrl"
              :src="headerUserAvatarUrl"
              alt=""
              class="header-user-avatar tw:w-8 tw:h-8 tw:rounded-full tw:object-cover tw:shrink-0"
            />
            <span class="tw:text-sm tw:font-semibold" style="color: var(--primary-color)">{{ authStore.user?.name || 'Profile' }}</span>
          </router-link>
          <button @click="handleLogout" style="height: 40px;" class="header-btn no-hover tw:bg-white tw:px-3.5 tw:py-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-1">
            <span class="tw:text-sm tw:text-gray-500">{{ $t('header.logout') || 'Logout' }}</span>
          </button>
        </div>
        <!-- Not authenticated: login button -->
        <button v-else type="button" @click="goToLogin" style="height: 40px;" class="header-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-1.5">
          <img src="../assets/login.png" alt="Login Icon"/>
          <span class="tw:text-sm tw:font-medium">{{ $t('header.login') }}</span>
        </button>
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
          <DatePicker :key="desktopPickerKey" :initial-date-range="dateRange" @update:dateRange="dateRange = $event" @update:session="onSessionFilterUpdate" />
        </div>

        <div class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <p>Link</p>
        </div>

        <div v-if="!authStore.isAuthenticated" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <RouterLink to="/register"><p>{{ $t('header.createProfile') }}</p></RouterLink>
        </div>

        <div v-if="authStore.isAuthenticated" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg">
          <router-link :to="userCreatePath" @click="onHeaderProfileNav"><p>{{ authStore.user?.name || 'Profile' }}</p></router-link>
        </div>
        <div v-if="authStore.isAuthenticated" @click="handleLogout" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg tw:cursor-pointer">
          <p>{{ $t('header.logout') || 'Logout' }}</p>
        </div>
        <div v-if="!authStore.isAuthenticated" @click="goToLogin" class="tw:bg-white tw:py-3 tw:px-4 tw:border tw:border-(--secondary-color) tw:rounded-lg tw:cursor-pointer">
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
        class="mobile-close-btn tw:absolute tw:top-4 tw:right-4 tw:rounded-md tw:p-2 tw:z-[90] tw:pointer-events-auto tw:bg-white"
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
            style="height: 40px;"
            class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative"
            aria-label="Wishlist"
          >
            <img src="../assets/favourite.png" alt="Favourite Icon"/>
            <span
              v-if="wishlistStore.wishlistEvents.length > 0"
              class="badge badge--red"
            >
              {{ wishlistStore.wishlistEvents.length }}
            </span>
          </button>

          <!-- Chat icon (authenticated only) -->
          <button
            v-if="authStore.isAuthenticated"
            type="button"
            @click="toggleChatPanelMobile"
            style="height: 40px;"
            class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative"
            :aria-label="$t('header.chat')"
          >
            <MessageSquareText class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
          </button>

          <!-- Invitation notifications icon (authenticated only) -->
          <button
            v-if="authStore.isAuthenticated"
            type="button"
            ref="notificationToggler"
            @click="showNotificationDropdown = !showNotificationDropdown"
            style="height: 40px;"
            class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:gap-1.5 tw:items-center tw:relative"
            :aria-label="$t('header.notifications') || 'Notifications'"
          >
            <Bell class="tw:w-5 tw:h-5 tw:text-(--primary-color)" />
            <span
              v-if="notificationStore.pendingCount > 0"
              class="badge badge--amber"
            >
              {{ notificationStore.pendingCount }}
            </span>
          </button>

          <button
            type="button"
            ref="languageToggler"
            @click="toggleField('language')"
            style="height: 40px;"
            class="icon-btn tw:bg-white tw:p-2.5 tw:rounded-md tw:flex tw:items-center tw:gap-2 tw:cursor-pointer"
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
              class="chevron-icon tw:ml-1"
              style="height: 8px;"
              :class="activeField === 'language' ? 'tw:rotate-180' : ''"
            />
          </button>
        </div>

        <!-- Language Dropdown (mobile) -->
        <div
          v-if="activeField === 'language'"
          class="mobile-dropdown-card tw:w-full tw:mt-2 tw:p-4"
        >
          <div class="tw:mb-3 tw:font-semibold tw:text-sm tw:text-gray-700">
            {{ $t('header.language') || 'Language' }}
          </div>
          <div class="tw:flex tw:flex-col tw:gap-1">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              type="button"
              @click="handleMobileLanguageSelect(lang.code)"
              class="tw:w-full tw:px-4 tw:py-2.5 tw:flex tw:items-center tw:gap-3 tw:text-left tw:rounded-md lang-option"
              :class="lang.code === currentLocale ? 'lang-option--active' : ''"
            >
              <img :src="lang.flag" :alt="lang.name + ' flag'" class="tw:w-5 tw:h-4 tw-object-cover tw-rounded-sm" />
              <span class="tw:text-sm tw:font-medium">{{ lang.name }}</span>
            </button>
          </div>
        </div>

        <!-- In-flow notifications dropdown (mobile) -->
        <div v-if="showNotificationDropdown && authStore.isAuthenticated" class="mobile-dropdown-card tw:w-full tw:p-4">
          <div class="tw:pb-2 tw:border-b tw:border-gray-100 tw:font-semibold tw:text-sm tw:text-gray-700">
            {{ $t('header.invitationNotifications') || 'Invitation notifications' }}
          </div>
          <div v-if="notificationStore.pendingInvitations.length === 0" class="tw:pt-4 tw:text-sm tw:text-gray-400 tw:text-center">
            {{ $t('header.noPendingInvitations') || 'No pending invitations.' }}
          </div>
          <ul v-else class="tw:mt-2 tw:max-h-[320px] tw:overflow-y-auto">
            <li
              v-for="n in notificationStore.pendingInvitations"
              :key="n.id"
              class="tw:px-1 tw:py-3 tw:border-b tw:border-gray-50 last:tw:border-b-0 tw:text-sm notif-item"
            >
              <div class="tw:flex tw:items-start tw:gap-2.5">
                <div class="tw:w-9 tw:h-9 tw:rounded-lg tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:shrink-0">
                  <component :is="invitationRoleIcon(n.receiver_type)" class="tw:w-4 tw:h-4 tw:text-gray-600" aria-hidden="true" />
                </div>
                <div class="tw:min-w-0 tw:flex-1">
                  <p class="tw:text-gray-800 tw:mb-0.5 tw:font-medium">{{ formatInvitationMessage(n) }}</p>
                  <p class="tw:text-gray-400 tw:text-xs tw:mb-2">{{ n.event_title }}</p>
                  <div class="tw:flex tw:gap-2 tw:mt-1.5">
                    <button
                      @click="handleInvitationResponse(n.invitation_id, 'accepted')"
                      :disabled="respondingInvitations.has(n.invitation_id)"
                      class="accept-btn tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:rounded-md tw:flex tw:items-center tw:gap-1"
                    >
                      <Loader2 v-if="respondingInvitations.has(n.invitation_id)" class="tw:w-3 tw:h-3 tw:animate-spin" />
                      {{ $t('header.invitationAccept') }}
                    </button>
                    <button
                      @click="handleInvitationResponse(n.invitation_id, 'rejected')"
                      :disabled="respondingInvitations.has(n.invitation_id)"
                      class="decline-btn tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:rounded-md tw:flex tw:items-center tw:gap-1"
                    >
                      {{ $t('header.invitationDecline') }}
                    </button>
                  </div>
                </div>
              </div>
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
            class="mobile-field-input tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none tw:placeholder-(--primary-color) tw:text-sm"
            aria-label="Search events"
          />

          <!-- Location Field -->
          <div class="tw:w-full">
            <button
              type="button"
              class="mobile-field-btn tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:text-left"
              @click="toggleField('location')"
              aria-label="Select location"
            >
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <span class="tw:text-sm tw:font-medium">{{ city || $t('header.defaultLocation') }}</span>
                <img
                  src="../assets/chevron-down.png"
                  alt="Chevron Down"
                  class="chevron-icon"
                  :class="activeField === 'location' ? 'tw:rotate-180' : ''"
                />
              </div>
            </button>

            <div
              v-if="activeField === 'location'"
              class="mobile-dropdown-card tw:w-full tw:mt-2 tw:p-4"
            >
              <div class="tw:relative tw:z-10 tw:flex tw:flex-col tw:gap-3">
                <input
                  v-model="searchLocation"
                  @keyup.enter="debouncedSearch"
                  @input="debouncedSearch"
                  type="text"
                  :placeholder="$t('header.location.placeholder')"
                  class="mobile-field-input tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none tw:text-sm"
                  aria-label="Search location"
                />

                <div v-if="searchResults.length > 0" class="tw:flex tw:flex-col tw:gap-1">
                  <button
                    v-for="(result, index) in searchResults"
                    :key="index"
                    type="button"
                    class="tw:text-left tw:px-3 tw:py-2.5 tw:rounded-md tw:bg-white tw:text-sm search-result-item"
                    @click="selectCity(result)"
                  >
                    {{ result.display_name }}
                  </button>
                </div>

                <button
                  type="button"
                  class="mobile-field-btn tw:rounded-lg tw:px-4 tw:py-3 tw:flex tw:items-center tw:justify-center tw:gap-2"
                  @click="useCurrentLocationFromMobile"
                  aria-label="Use current location"
                >
                  <img src="../assets/location-01.png" width="16" height="16" alt="Location Icon" />
                  <span class="tw:text-sm">{{ $t('header.currentLocation') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Date Picker -->
          <div class="tw:w-full">
            <button
              type="button"
              class="mobile-field-btn tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:text-left"
              @click="toggleField('date')"
              aria-label="Select dates"
            >
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <span class="tw:text-sm tw:font-medium">
                  {{
                    dateRange[0] && dateRange[1]
                      ? `${dateRange[0]} - ${dateRange[1]}`
                      : 'Date'
                  }}
                </span>
                <img
                  src="../assets/chevron-down.png"
                  alt="Chevron Down"
                  class="chevron-icon"
                  :class="activeField === 'date' ? 'tw:rotate-180' : ''"
                />
              </div>
            </button>

            <div
              v-if="activeField === 'date'"
              class="mobile-datepicker-panel tw:relative tw:z-40 tw:w-full tw:mt-2 tw:overflow-visible tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white"
              @click.capture="handleMobileDatepickerContainerClick"
            >
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

          <!-- Browse-as + category filters (mobile menu only — not on the home header strip) -->
          <div
            v-if="!isProfilePage"
            class="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:bg-gray-50/90 tw:p-3 tw:flex tw:flex-col tw:gap-3"
          >
            <span class="tw:text-xs tw:font-semibold tw:text-gray-500 tw:uppercase tw:tracking-wide">
              {{ $t('header.profileType.ariaLabel') }}
            </span>
            <select
              class="header-profile-type-select tw:w-full tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:py-2.5 tw:pl-3 tw:pr-8 tw:text-sm tw:font-medium tw:text-[var(--primary-color)]"
              :aria-label="$t('header.profileType.ariaLabel')"
              :value="discoveryProfileType"
              @change="onMobileProfileTypeChange"
            >
              <option v-for="opt in profileTypeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>

            <div v-if="categoriesLoading" class="tw:flex tw:items-center tw:gap-2 tw:py-1 tw:overflow-hidden">
              <div v-for="i in 4" :key="i" class="tw:inline-flex tw:shrink-0 tw:animate-pulse">
                <div class="tw:h-9 tw:w-16 tw:bg-gray-200 tw:rounded-md" />
              </div>
            </div>

            <div v-else class="tw:flex tw:items-center tw:gap-2 tw:min-w-0">
              <button
                type="button"
                @click="scrollCategories('left')"
                class="scroll-btn tw:bg-white tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:border tw:border-gray-200"
                aria-label="Scroll categories left"
              >
                <img src="../assets/arrow-right.png" alt="" class="tw:w-4 tw:h-4 tw:rotate-180" />
              </button>

              <div
                ref="categoriesScrollElMobile"
                class="cat-scroll tw:flex tw:items-center tw:gap-2 tw:overflow-x-auto tw:whitespace-nowrap tw:py-1 tw:min-w-0 tw:flex-1 tw:[-webkit-overflow-scrolling:touch]"
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
                  @click="selectCategoryFromMobileMenu(category)"
                  :class="[
                    'category-pill tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-3 tw:rounded-full tw:transition-all',
                    selectedCategory?.id === category.id
                      ? 'category-pill--active'
                      : 'category-pill--default'
                  ]"
                >
                  {{ category.name }}
                </button>

                <button
                  v-if="selectedCategory"
                  type="button"
                  @click="clearCategoryFilterFromMobileMenu"
                  class="tw:inline-flex tw:shrink-0 tw:text-sm tw:py-2 tw:px-2 tw:text-gray-400 hover:tw:text-gray-600 tw:transition-colors clear-btn"
                >
                  {{ $t('common.clear') }}
                </button>
              </div>

              <button
                type="button"
                @click="scrollCategories('right')"
                class="scroll-btn tw:bg-white tw:rounded-md tw:p-2 tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:border tw:border-gray-200"
                aria-label="Scroll categories right"
              >
                <img src="../assets/arrow-right.png" alt="" class="tw:w-4 tw:h-4" />
              </button>
            </div>
          </div>
        </template>

        <!-- Email Box -->
        <template v-if="authStore.isAuthenticated">
          <button
            type="button"
            @click="handleMobileEmailClick"
            :class="activeField === 'date' ? 'tw:pointer-events-none' : ''"
            class="mobile-field-btn tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:outline-none tw:text-left tw:text-sm tw:flex tw:items-center tw:gap-3"
            aria-label="Go to profile"
          >
            <img
              v-if="headerUserAvatarUrl"
              :src="headerUserAvatarUrl"
              alt=""
              class="tw:w-10 tw:h-10 tw:rounded-full tw:object-cover tw:border tw:border-gray-200 tw:shrink-0"
            />
            <span class="tw:truncate">{{ authStore.user?.email || '' }}</span>
          </button>

          <!-- Gallery link (premium only, mobile) -->
          <RouterLink
            v-if="authStore.user?.account_type === 'premium'"
            :to="galleryRoute"
            @click="closeMobileHeader()"
            class="mobile-field-btn tw:rounded-lg tw:px-4 tw:py-3 tw:bg-white tw:w-full tw:relative tw:z-10 tw:flex tw:items-center tw:gap-2"
          >
            <Images class="tw:w-5 tw:h-5" style="color: var(--primary-color)" />
            <span style="color: var(--primary-color)" class="tw:font-semibold tw:text-sm">Gallery</span>
            <span class="tw:ml-auto tw:text-xs tw:bg-emerald-100 tw:text-emerald-700 tw:px-2 tw:py-0.5 tw:rounded-full tw:font-medium">PREMIUM</span>
          </RouterLink>

          <!-- Logout Button -->
          <button
            type="button"
            class="mobile-field-btn tw:bg-white tw:py-3 tw:rounded-lg tw:flex tw:gap-2 tw:items-center tw:justify-center tw:px-4 tw:font-semibold tw:text-sm tw:text-gray-600"
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
            style="height: 40px;"
            @click="closeMobileHeader()"
            class="mobile-field-btn tw:px-4 tw:bg-white tw:rounded-md tw:flex tw:items-center tw:gap-1.5"
          >
            <img src="../assets/user.png" alt="User Icon"/>
            <span class="tw:text-sm tw:font-medium">{{ $t('header.createProfile') }}</span>
          </RouterLink>

          <!-- Login Button (mobile) -->
          <button
            type="button"
            style="height: 40px;"
            @click="goToLogin"
            class="mobile-field-btn tw:px-4 tw:bg-white tw:rounded-md tw:flex tw:items-center tw:gap-1.5"
          >
            <img src="../assets/login.png" alt="Login Icon"/>
            <span class="tw:text-sm tw:font-medium">{{ $t('header.login') }}</span>
          </button>
        </template>
      </div>
    </div>
  </transition>

  <div v-if="showListingOnHome">
    <AllEvents
      ref="allEventsRef"
      :events="viewportFilteredEvents"
      :loading="eventsLoading"
      :profile-type="discoveryProfileType"
      :selected-category="selectedCategory"
      :available-subcategories="availableSubcategories"
      :selected-subcategory-slugs="selectedSubcategorySlugs"
      :start-time="startTime"
      :end-time="endTime"
      :venue-open-time="venueOpenTime"
      :venue-close-time="venueCloseTime"
      @closeResults="handleClose"
      @resetSearch="clearListFilters"
      @viewEvent="handleViewEvent"
      @viewProfile="handleViewProfile"
      @toggleSubcategory="toggleSubcategory"
      @clearSubcategories="clearSubcategories"
      @update:startTime="startTime = $event"
      @update:endTime="endTime = $event"
      @update:venueOpenTime="venueOpenTime = $event"
      @update:venueCloseTime="venueCloseTime = $event"
      @panelMinimized="handleListingPanelMinimized"
      @listingDockLayout="homeListingDockLayout = $event"
    />
  </div>
  
  <!-- Event Details Panel -->
  <EventDetailsPanel 
    :visible="showEventDetailsPanel" 
    :event="selectedEvent"
    :map-listing-expanded="detailPanelBesideExpandedListing"
    @close="closeEventDetailsPanel"
    @viewProfile="handleViewProfile"
  />

  <!-- Discovery Profile Details Panel -->
  <DiscoveryProfileDetailsPanel
    :visible="showProfileDetailsPanel"
    :profile="selectedProfile"
    :profile-type="profileDetailsPanelType"
    :map-listing-expanded="detailPanelBesideExpandedListing"
    @close="closeProfileDetailsPanel"
    @viewEvent="handleViewEvent"
  />
</template>

<!-- ─────────── All script blocks unchanged ─────────── -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed, defineAsyncComponent, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from "./DatePicker.vue";
import LocationPermissionPrompt from './LocationPermissionPrompt.vue';
import { useLocationPermission } from '../composables/useLocationPermission';
import { useLanguageSwitch } from '../composables/useLanguageSwitch';
import { useAuthStore } from '@/stores/auth';
import { useMapStore } from '@/stores/mapStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useChatStore } from '@/stores/chatStore';
import { getCreateRoute } from '@/utils/routeResolver';
import { getUserProfileImageUrl } from '@/utils/userProfileImage';
import { Bell, Images, Loader2, ChevronDown, MessageSquareText } from 'lucide-vue-next';
import { respondToInvitation } from '@/services/invitationService';
import { invitationRoleMeta } from '@/utils/invitationRoleMeta';
import {
  MAP_OPEN_EVENT_DETAIL,
  MAP_OPEN_PROFILE_DETAIL,
  MAP_RESTORE_EVENT_POPUP,
  MAP_POPUP_CLOSED,
  MAP_RESET_HOME,
} from '@/utils/mapPopupBridge'
import { filterItemsByMapViewport } from '@/utils/mapViewportFilter'
import { filterActiveDiscoveryEvents } from '@/utils/eventSchedule'
import {
  appendDiscoveryDateTimeFilters,
  formatDiscoveryDateToApi,
  getHomeStartDiscoveryWindow,
  parseStoredSessionFilter,
} from '@/utils/discoveryDateTimeFilters'
import EventDetailsPanel from './EventDetailsPanel.vue'
import DiscoveryProfileDetailsPanel from './DiscoveryProfileDetailsPanel.vue'

const AllEvents = defineAsyncComponent(() => import('./AllEvents.vue'))

const emit = defineEmits(['toggle-wishlist'])

const { t, locale } = useI18n()
const { switchLanguage, getAvailableLanguages, initializeLanguage } = useLanguageSwitch()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const chatStore = useChatStore()
const mapStore = useMapStore()
const router = useRouter()
const route = useRoute()

const userCreatePath = computed(() =>
  getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type)
)

const headerUserAvatarUrl = computed(() =>
  getUserProfileImageUrl(authStore.user ?? undefined),
)

const galleryRoute = computed(() => {
  if (!authStore.user?.account_type || authStore.user.account_type !== 'premium') return '#'
  const profileType = authStore.user.profile_type
  let basePath = ''
  switch (profileType) {
    case 'event': basePath = '/create-event-premium'; break
    case 'organizer': basePath = '/create-organiser-premium'; break
    case 'venue': basePath = '/create-venue-premium'; break
    case 'talent': basePath = '/create-talents-premium'; break
    default: basePath = '/create-event-premium'
  }
  return `${basePath}/gallery-images`
})

function goToLogin() {
  dismissMapOverlays()
  closeMobileHeader()
  const path = route.path.toLowerCase()
  if (path === '/login' || path === '/register') {
    router.push({ name: 'Login' })
    return
  }
  router.push({ name: 'Login', query: { redirect: route.fullPath } })
}

async function handleLogout() {
  closeMobileHeader()
  await authStore.logout()
  goToHomeMap()
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) activeField.value = null
}

function closeMobileHeader() {
  isMobileMenuOpen.value = false
  activeField.value = null
  showNotificationDropdown.value = false
}

function toggleField(field) {
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

function toggleChatPanel() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  chatStore.toggle()
}

function toggleChatPanelMobile() {
  toggleChatPanel()
  closeMobileHeader()
}

function useCurrentLocationFromMobile() { getLocation({ openList: true }) }

function handleMobileLanguageSelect(langCode) {
  switchLanguage(langCode)
  activeField.value = null
  showNotificationDropdown.value = false
}

function handleMobileDatepickerContainerClick(e) {
  const target = e?.target
  if (!target?.closest) return
  const closeIcon = target.closest('.text-vtd-orange')
  if (closeIcon && activeField.value === 'date') activeField.value = null
}

function handleMobileSessionUpdate(newSession) {
  if (newSession) tempSessionFilter.value = { ...newSession }
}

async function handleMobileEmailClick() {
  if (!authStore.isAuthenticated) return
  closeMobileHeader()
  closeHomePanelsForNav()
  await router.push(userCreatePath.value)
}

function formatInvitationMessage(n) {
  const sender = n?.sender_name || 'Someone'
  if (n?.message?.includes('Please log in')) {
    return t('header.invitationPending', { sender })
  }
  return n?.message || t('header.invitationPending', { sender })
}

function closeHomePanelsForNav() {
  showResults.value = false
  showEventDetailsPanel.value = false
  showProfileDetailsPanel.value = false
  selectedEvent.value = null
  selectedProfile.value = null
  homeListingDockLayout.value = 'hidden'
}

function dismissMapOverlays() {
  closeHomePanelsForNav()
}

function onHeaderProfileNav() {
  closeHomePanelsForNav()
}

function handleMobileDateRangeUpdate(newRange) {
  if (!newRange) return
  dateRange.value = Array.isArray(newRange) ? [...newRange] : newRange
  onSessionFilterUpdate(tempSessionFilter.value)
  closeMobileHeader()
}

function handleMobileMenuKeydown(e) {
  if (e.key === 'Escape' && isMobileMenuOpen.value) closeMobileHeader()
}

const showNotificationDropdown = ref(false)
const notificationToggler = ref(null)
const respondingInvitations = ref(new Set())

async function handleInvitationResponse(invitationId, status) {
  if (respondingInvitations.value.has(invitationId)) return
  respondingInvitations.value.add(invitationId)
  try {
    const res = await respondToInvitation(Number(invitationId), { status })
    if (!res.success) {
      alert(res.message || 'Failed to respond. Please try again.')
    }
  } catch (err) {
    console.error('Failed to respond to invitation:', err)
    alert(err?.response?.data?.message || 'Failed to respond. Please try again.')
  } finally {
    respondingInvitations.value.delete(invitationId)
  }
}

function invitationRoleIcon(receiverType) {
  return invitationRoleMeta(receiverType).icon
}

const showLanguageDropdown = ref(false)
const languageToggler = ref(null)
const availableLanguages = getAvailableLanguages()
const currentLocale = computed(() => locale.value)
const currentLanguage = computed(() =>
  availableLanguages.find(lang => lang.code === locale.value) || availableLanguages[0]
)

const showSuggestion = ref(false)
const isMobileMenuOpen = ref(false)
const activeField = ref(null)
const tempSessionFilter = ref({ morning: false, afternoon: false, evening: false, night: false })
const mobilePickerKey = ref(0)
const desktopPickerKey = ref(0)
const isCalendarOpen = computed(() => isMobileMenuOpen.value && activeField.value === 'date')

watch(isMobileMenuOpen, (val) => { document.body.style.overflow = val ? 'hidden' : '' })

const showResults = ref(false)
const isHomePage = computed(() => route.name === 'Home')
const isGuestAuthPage = computed(() => {
  const name = route.name
  return name === 'Login' || name === 'Register' || name === 'ForgotPassword' || name === 'ResetPassword' || name === 'VerifyEmail' || name === 'EmailVerified'
})
/** Map list panel is only relevant on the home map — never on login/profile routes. */
const showListingOnHome = computed(() => showResults.value && isHomePage.value && !isGuestAuthPage.value)

watch(
  () => route.fullPath,
  () => {
    if (!isHomePage.value) {
      dismissMapOverlays()
    }
  },
)

const allEventsRef = ref(null)
/** Suppress list auto-open during cold start / logo reset; enabled after mount. */
let suppressListingOpenUntil = 0
const listingUserActionsReady = ref(false)
const searchInput = ref(null)
const city = ref("")
const searchLocation = ref("")
const searchTerm = ref('')
const searchResults = ref([])
const categories = ref([])
const categoriesLoading = ref(false)
const selectedCategory = ref(null)

/** Header “browse as” profile: picks /categories vs /categories-talents|organisers|venue */
const discoveryProfileType = ref('events')
const showProfileTypeMenu = ref(false)

const profileTypeOptions = computed(() => [
  { value: 'events', label: t('header.profileType.events') },
  { value: 'talents', label: t('header.profileType.talent') },
  { value: 'venues', label: t('header.profileType.venues') },
  { value: 'organisers', label: t('header.profileType.organisers') },
])

const discoveryProfileLabel = computed(() => {
  const cur = discoveryProfileType.value
  const hit = profileTypeOptions.value.find((x) => x.value === cur)
  return hit?.label ?? t('header.profileType.events')
})

function toggleProfileTypeMenu() {
  showProfileTypeMenu.value = !showProfileTypeMenu.value
}

function closeProfileTypeMenu() {
  showProfileTypeMenu.value = false
}

function selectDiscoveryProfile(type) {
  if (discoveryProfileType.value === type) {
    closeProfileTypeMenu()
    return
  }
  discoveryProfileType.value = type
  selectedCategory.value = null
  selectedSubcategorySlugs.value = []
  venueOpenTime.value = null
  venueCloseTime.value = null
  closeProfileTypeMenu()
  // Clear stale pins immediately so the previous profile type never overlaps on the map.
  mapStore.setMapProfiles([], type)
  events.value = []
  loadCategories()
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
}

function onDesktopProfileTypeChange(e) {
  const v = e.target && 'value' in e.target ? e.target.value : null
  if (v) selectDiscoveryProfile(v)
}

function onMobileProfileTypeChange(e) {
  const v = e.target && 'value' in e.target ? e.target.value : null
  if (v) selectDiscoveryProfile(v)
}

/** Maps header profile picker → GET /v2/events?category_scope=… (omit for events) */
const DISCOVERY_TO_CATEGORY_SCOPE = {
  events: null,
  talents: 'talent',
  organisers: 'organiser',
  venues: 'venue',
}
const selectedSubcategorySlugs = ref([])
const _homeDiscoveryDefaults = getHomeStartDiscoveryWindow()
const startTime = ref(_homeDiscoveryDefaults.startTime)
const endTime = ref(_homeDiscoveryDefaults.endTime)
const venueOpenTime = ref(null)
const venueCloseTime = ref(null)
const categoriesScrollEl = ref(null)
const categoriesScrollElMobile = ref(null)

const availableSubcategories = computed(() => {
  const c = selectedCategory.value
  if (!c || !Array.isArray(c.subcategories)) return []
  return c.subcategories
})

const catIsDragging = ref(false)
const catDidDrag = ref(false)
let catDragStartX = 0
let catDragStartScrollLeft = 0
/** Scroll container receiving drag (desktop or mobile category row) */
let catDragScrollEl = null
const dateRange = ref([..._homeDiscoveryDefaults.dateRange])
const sessionFilter = ref({ morning: false, afternoon: false, evening: false, night: false })

function onSessionFilterUpdate(next) {
  if (!next) return
  sessionFilter.value = { ...next }
  localStorage.setItem('datepicker-session', JSON.stringify(sessionFilter.value))
}
const mobileInitialDateRange = computed(() => {
  if (activeField.value !== 'date') return null
  return dateRange.value[0] && dateRange.value[1] ? [dateRange.value[0], dateRange.value[1]] : null
})
const selectedLocation = ref({ lat: 52.3676, lng: 4.9041, name: "Amsterdam" })

const showEventDetailsPanel = ref(false)
/** View Event was opened from a map marker info window — restore popup on close */
const eventDetailOpenedFromMapPopup = ref(false)
/** Restore list dock after map info-window flow */
const listingVisibleBeforeMapEvent = ref(false)
const selectedEvent = ref(null)

const showProfileDetailsPanel = ref(false)
const selectedProfile = ref(null)

/** Discovery detail panel badge/tabs: pin + list carry `profileType`; fallback = header browse mode (not `events`) */
const profileDetailsPanelType = computed(() => {
  const p = selectedProfile.value
  const pt = p?.profileType
  if (pt === 'organisers' || pt === 'talents' || pt === 'venues') return pt
  const d = discoveryProfileType.value
  if (d === 'organisers' || d === 'talents' || d === 'venues') return d
  return 'organisers'
})

/** Listing dock on Home: aligns EventDetailsPanel / DiscoveryProfileDetailsPanel with AllEvents (`md:left-7` + 380px vs gutter only). */
const homeListingDockLayout = ref('hidden')
/** When true, desktop detail panels use historical `left: 430px` beside expanded dock; when false, `left: 1.75rem` (dock gutter only). */
const detailPanelBesideExpandedListing = computed(() => {
  if (route.name !== 'Home') return true
  return showResults.value && homeListingDockLayout.value === 'expanded'
})

watch(showResults, (s) => {
  if (!s) homeListingDockLayout.value = 'hidden'
})

const { permissionStatus: locationPermissionStatus, coords: locationCoords, error: locationError, isLoading: locationLoading, getLocation: getCurrentLocation, showManualEnablePrompt } = useLocationPermission()

function toggleLanguageDropdown() { showLanguageDropdown.value = !showLanguageDropdown.value }

function handleLanguageDropdownOutsideClick(e) {
  if (languageToggler.value && languageToggler.value.contains(e.target)) return
  showLanguageDropdown.value = false
}

function handleNotificationDropdownOutsideClick(e) {
  if (notificationToggler.value && notificationToggler.value.contains(e.target)) return
  showNotificationDropdown.value = false
}

function handleSuggestionBlur() {
  setTimeout(() => { showSuggestion.value = false }, 150)
}

/** Opens category strip when the search field is focused or clicked. */
function openSearchSuggestions() {
  showSuggestion.value = true
  searchInput.value?.focus()
}

function scrollCategories(direction) {
  const delta = direction === 'left' ? -240 : 240
  const els = [categoriesScrollEl.value, categoriesScrollElMobile.value].filter(Boolean)
  for (const el of els) {
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }
}

function onCatMouseDown(e) {
  const el = e.currentTarget
  if (!el || typeof el.scrollLeft !== 'number') return
  catDragScrollEl = el
  catIsDragging.value = true
  catDidDrag.value = false
  catDragStartX = e.clientX
  catDragStartScrollLeft = el.scrollLeft
}

function onCatMouseMove(e) {
  const el = catDragScrollEl
  if (!el || !catIsDragging.value) return
  e.preventDefault()
  const dx = e.clientX - catDragStartX
  if (Math.abs(dx) > 5) catDidDrag.value = true
  el.scrollLeft = catDragStartScrollLeft - dx
}

function stopCatDrag() {
  if (!catIsDragging.value) return
  catIsDragging.value = false
  catDragScrollEl = null
  if (catDidDrag.value) setTimeout(() => { catDidDrag.value = false }, 0)
}

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const { fetchCategoriesForProfile } = await import('../api/categories')
    categories.value = await fetchCategoriesForProfile(discoveryProfileType.value)
  } catch (e) {
    console.error('Failed to load categories:', e)
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

function selectCategory(category) {
  if (catDidDrag.value) return
  selectedCategory.value = category
  selectedSubcategorySlugs.value = []
  showSuggestion.value = false
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
}

function clearCategoryFilter() {
  selectedCategory.value = null
  selectedSubcategorySlugs.value = []
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
}

function selectCategoryFromMobileMenu(category) {
  selectCategory(category)
  closeMobileHeader()
}

function clearCategoryFilterFromMobileMenu() {
  clearCategoryFilter()
  closeMobileHeader()
}

function toggleSubcategory(slug) {
  const arr = selectedSubcategorySlugs.value
  const i = arr.indexOf(slug)
  selectedSubcategorySlugs.value = i >= 0 ? arr.filter(s => s !== slug) : [...arr, slug]
}

function clearSubcategories() {
  selectedSubcategorySlugs.value = []
}

onMounted(() => {
  suppressListingAutoOpen(1200)
  const storedSession = parseStoredSessionFilter(localStorage.getItem('datepicker-session'))
  if (storedSession) sessionFilter.value = storedSession
  getLocation({ openList: false })
  loadCategories()
  if (route.name === 'Home') {
    void loadListingFromApi(searchTerm.value.trim(), { openList: false })
  }
  nextTick(() => {
    listingUserActionsReady.value = true
  })
  window.addEventListener('keydown', handleMobileMenuKeydown)
  window.addEventListener(MAP_OPEN_EVENT_DETAIL, onMapOpenEventDetailFromHome)
  window.addEventListener(MAP_OPEN_PROFILE_DETAIL, onMapOpenProfileDetailFromHome)
  window.addEventListener(MAP_POPUP_CLOSED, onMapPopupClosedFromHome)

  const pendingProfileRaw = sessionStorage.getItem('pendingDiscoveryProfile')
  if (pendingProfileRaw) {
    sessionStorage.removeItem('pendingDiscoveryProfile')
    try {
      const parsed = JSON.parse(pendingProfileRaw)
      if (parsed?.profile) {
        handleViewProfile({ ...parsed.profile, profileType: parsed.profileType })
      }
    } catch {
      // ignore malformed session payload
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleMobileMenuKeydown)
  window.removeEventListener(MAP_OPEN_EVENT_DETAIL, onMapOpenEventDetailFromHome)
  window.removeEventListener(MAP_OPEN_PROFILE_DETAIL, onMapOpenProfileDetailFromHome)
  window.removeEventListener(MAP_POPUP_CLOSED, onMapPopupClosedFromHome)
  document.body.style.overflow = ''
})

function suppressListingAutoOpen(ms = 800) {
  suppressListingOpenUntil = Date.now() + ms
}

function shouldAutoOpenListing() {
  return listingUserActionsReady.value && Date.now() >= suppressListingOpenUntil
}

function openListingPanelForSearchAction() {
  if (!shouldAutoOpenListing()) return
  openListingPanel()
}

function openListingPanel() {
  showResults.value = true
  nextTick(() => {
    allEventsRef.value?.expand?.()
  })
}

function filterBy(action) {
  if (action == 'search') {
    void loadListingFromApi(searchTerm.value.trim(), { openList: true })
    searchInput.value?.blur()
    mapStore.setAppliedLocation({ lat: selectedLocation.value.lat, lng: selectedLocation.value.lng, name: selectedLocation.value.name })
  } else {
    void loadListingFromApi('', { openList: true })
  }
}

const fixedMenu = computed(() => route.name === 'Home')

const isProfilePage = computed(() => {
  const path = route.path.toLowerCase()
  return path.includes('/create-') || path.includes('/settings') || path.includes('/report') ||
    path.includes('organiser') || path.includes('venue') || path.includes('talent') ||
    path.includes('event') || path.includes('login') || path.includes('register') ||
    path.includes('forgot-password')
})

function toggleWishlistPanel() { emit('toggle-wishlist') }
function handleClose() { showResults.value = false }

function goToHomeMap() {
  handleReset()
  if (route.path !== '/') {
    void router.push('/')
  }
}

function handleReset() {
  suppressListingAutoOpen(1200)
  showResults.value = false
  showSuggestion.value = false
  showLocation.value = false
  showNotificationDropdown.value = false
  activeField.value = null
  isMobileMenuOpen.value = false
  homeListingDockLayout.value = 'hidden'
  listingVisibleBeforeMapEvent.value = false

  searchTerm.value = ''
  searchLocation.value = ''
  searchResults.value = []
  if (searchInput.value) searchInput.value.blur()

  showEventDetailsPanel.value = false
  selectedEvent.value = null
  eventDetailOpenedFromMapPopup.value = false
  showProfileDetailsPanel.value = false
  selectedProfile.value = null

  chatStore.close()

  city.value = 'Amsterdam'
  selectedCategory.value = null
  selectedSubcategorySlugs.value = []
  mapStore.setMapViewportBounds(null)

  sessionFilter.value = { morning: false, afternoon: false, evening: false, night: false }
  localStorage.removeItem('datepicker-session')

  resetDiscoveryDateTimeFilters()

  discoveryProfileType.value = 'events'
  closeProfileTypeMenu()

  events.value = []
  mapStore.resetMapMarkers()
  window.dispatchEvent(new CustomEvent(MAP_RESET_HOME))

  void loadCategories()
  void loadListingFromApi('', { openList: false })
  void getLocation({ openList: false })
}

/** Reset date range, clock window (list + header), session pills, and venue hours to home defaults. */
function resetDiscoveryDateTimeFilters() {
  const homeWindow = getHomeStartDiscoveryWindow()
  dateRange.value = [...homeWindow.dateRange]
  startTime.value = homeWindow.startTime
  endTime.value = homeWindow.endTime
  venueOpenTime.value = null
  venueCloseTime.value = null
  tempSessionFilter.value = { morning: false, afternoon: false, evening: false, night: false }
  desktopPickerKey.value++
  mobilePickerKey.value++
}

/** Clear list filters and restore discovery date/time window (keeps location & browse mode). */
function clearListFilters() {
  searchTerm.value = ''
  selectedCategory.value = null
  selectedSubcategorySlugs.value = []
  sessionFilter.value = { morning: false, afternoon: false, evening: false, night: false }
  localStorage.removeItem('datepicker-session')
  resetDiscoveryDateTimeFilters()
  void loadListingFromApi('', { openList: true })
}

async function getLocation(options = { openList: false }) {
  const location = await getCurrentLocation()
  if (location) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`)
      const data = await res.json()
      const cityName = data.address.city || data.address.town || data.address.village || "Amsterdam"
      city.value = cityName
      selectedLocation.value = { lat: location.latitude, lng: location.longitude, name: cityName }
      mapStore.setPendingLocation({ lat: location.latitude, lng: location.longitude, name: cityName })
    } catch (e) {
      city.value = "Amsterdam"
      selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" }
      mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
    }
  } else {
    city.value = "Amsterdam"
    selectedLocation.value = { lat: 52.3676, lng: 4.9041, name: "Amsterdam" }
    mapStore.setPendingLocation({ lat: 52.3676, lng: 4.9041, name: 'Amsterdam' })
  }
  if (route.name === 'Home') {
    mapStore.setAppliedLocation({
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      name: selectedLocation.value.name,
    })
    void loadListingFromApi(searchTerm.value.trim(), { openList: options.openList })
  }
  if (isMobileMenuOpen.value) closeMobileHeader()
}

const events = ref([])
const eventsLoading = ref(false)

/** List view mirrors map viewport — map leads, counts stay in sync when panning/zooming. */
const viewportFilteredEvents = computed(() => {
  let rows = events.value
  if (discoveryProfileType.value === 'events') {
    rows = filterActiveDiscoveryEvents(rows)
  }
  if (route.name !== 'Home') return rows
  return filterItemsByMapViewport(rows, mapStore.mapViewportBounds)
})

function formatDateToApi(dateStr) {
  return formatDiscoveryDateToApi(dateStr)
}

function debounce(fn, delay = 450) {
  let t = null
  return (...args) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

const debouncedFilterEvents = debounce(() => {
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
}, 300)

async function loadListingFromApi(searchQuery = '', options = { openList: false }) {
  eventsLoading.value = true
  try {
    const profileType = discoveryProfileType.value
    if (profileType === 'events') {
      await loadEventsFromApi(searchQuery)
    } else {
      await loadProfilesFromApi(profileType, searchQuery)
    }
  } catch (e) {
    console.error('Failed to load listing:', e)
    events.value = []
    mapStore.resetMapMarkers()
  } finally {
    eventsLoading.value = false
    if (options.openList) {
      openListingPanelForSearchAction()
    }
  }
}

async function loadEventsFromApi(searchQuery = '') {
  const { fetchEvents } = await import('../api/events')
  const params = { lat: selectedLocation.value.lat, lng: selectedLocation.value.lng, radius: 100, per_page: 20 }
  if (searchQuery) params.search = searchQuery
  if (selectedCategory.value) params.category = selectedCategory.value.slug
  if (selectedSubcategorySlugs.value.length > 0) params.subcategory = selectedSubcategorySlugs.value.join(',')
  if (startTime.value) params.start_time = startTime.value
  if (endTime.value) params.end_time = endTime.value
  appendDiscoveryDateTimeFilters(params, {
    dateRange: dateRange.value,
    sessionFilter: sessionFilter.value,
    formatDate: formatDateToApi,
  })
  const result = await fetchEvents(params)
  const rows = filterActiveDiscoveryEvents(Array.isArray(result.data) ? result.data : [])
  events.value = rows
  mapStore.setMapEvents(rows)
}

function normalizeDiscoveryProfileType(pt) {
  const v = String(pt).toLowerCase()
  if (v === 'talent') return 'talents'
  if (v === 'organizer' || v === 'organiser') return 'organisers'
  if (v === 'venue') return 'venues'
  return v
}

async function loadProfilesFromApi(profileType, searchQuery = '') {
  const { fetchProfiles, pickProfileLatLng } = await import('../api/discoveryProfiles')
  const { discoveryVenueMatchesHoursFilter } = await import('../utils/venueOpeningHours')
  const params = { per_page: 20 }
  if (searchQuery) params.search = searchQuery
  if (selectedCategory.value) params.category = selectedCategory.value.slug
  if (selectedSubcategorySlugs.value.length > 0) params.subcategory = selectedSubcategorySlugs.value.join(',')
  params.lat = selectedLocation.value.lat
  params.lng = selectedLocation.value.lng
  params.radius = 100
  const skipDateWindow = profileType === 'talents' || profileType === 'organisers'
  if (!skipDateWindow) {
    appendDiscoveryDateTimeFilters(params, {
      dateRange: dateRange.value,
      sessionFilter: sessionFilter.value,
      formatDate: formatDateToApi,
    })
  }
  const result = await fetchProfiles(profileType, params)
  let rows = (result.data ?? []).filter((p) => {
    const pt = p.profileType ?? p.profile_type
    if (!pt) return true
    return normalizeDiscoveryProfileType(pt) === profileType
  })

  if (
    profileType === 'venues' &&
    (venueOpenTime.value?.trim() || venueCloseTime.value?.trim())
  ) {
    rows = rows.filter((p) =>
      discoveryVenueMatchesHoursFilter(p.opening_hours, venueOpenTime.value, venueCloseTime.value),
    )
  }
  events.value = rows
  mapStore.setMapProfiles(
    rows
      .map((p) => {
        const ll = pickProfileLatLng(p)
        if (!ll) return null
        return { ...p, ...ll, profileType }
      })
      .filter(Boolean),
    profileType,
  )
}

const debouncedReloadEvents = debounce(() => {
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
}, 500)

watch(dateRange, () => { debouncedReloadEvents() }, { deep: true })
watch(sessionFilter, () => { debouncedReloadEvents() }, { deep: true })
watch(() => [selectedCategory.value?.id ?? null, [...selectedSubcategorySlugs.value].sort().join(','), startTime.value, endTime.value, venueOpenTime.value, venueCloseTime.value], () => { debouncedFilterEvents() })

const searchCity = async () => {
  if (!searchLocation.value?.trim()) { searchResults.value = []; return }
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation.value)}&addressdetails=1&limit=5`, { headers: { "Accept": "application/json" } })
    searchResults.value = await response.json()
  } catch {}
}

let timeout = null
const debouncedSearch = () => { clearTimeout(timeout); timeout = setTimeout(searchCity, 500) }

const selectCity = (place) => {
  const lat = parseFloat(place.lat)
  const lng = parseFloat(place.lon)
  const name = place.display_name.split(',')[0]
  city.value = name
  searchResults.value = []
  selectedLocation.value = { lat, lng, name }
  mapStore.setAppliedLocation({ lat, lng, name })
  void loadListingFromApi(searchTerm.value.trim(), { openList: true })
  if (isMobileMenuOpen.value) closeMobileHeader()
}

const showLocation = ref(false)
const locationToggler = ref(null)
const toggleLocation = () => { showLocation.value = !showLocation.value }
const handleOutsideClick = (e) => {
  if (locationToggler.value.contains(e.target)) return
  showLocation.value = false
}

function handleViewEvent(event) {
  showProfileDetailsPanel.value = false
  selectedProfile.value = null
  if (event) {
    selectedEvent.value = { ...event, latitude: event.latitude !== undefined ? Number(event.latitude) : null, longitude: event.longitude !== undefined ? Number(event.longitude) : null }
  } else {
    selectedEvent.value = null
  }
  showEventDetailsPanel.value = true
}

function restoreListingAfterMapEventFlow() {
  if (listingVisibleBeforeMapEvent.value) {
    showResults.value = true
  }
  listingVisibleBeforeMapEvent.value = false
}

function closeEventDetailsPanel() {
  showEventDetailsPanel.value = false
  selectedEvent.value = null
  if (eventDetailOpenedFromMapPopup.value) {
    eventDetailOpenedFromMapPopup.value = false
    window.dispatchEvent(new CustomEvent(MAP_RESTORE_EVENT_POPUP))
    restoreListingAfterMapEventFlow()
  }
}

function handleViewProfile(profile) {
  eventDetailOpenedFromMapPopup.value = false
  showEventDetailsPanel.value = false
  selectedEvent.value = null
  selectedProfile.value = profile ?? null
  showProfileDetailsPanel.value = true
}

function onMapOpenEventDetailFromHome(e) {
  const d = e?.detail
  if (d) {
    listingVisibleBeforeMapEvent.value = showResults.value
    showResults.value = false
    eventDetailOpenedFromMapPopup.value = true
    handleViewEvent(d)
  }
}

function onMapPopupClosedFromHome() {
  if (!eventDetailOpenedFromMapPopup.value && !showEventDetailsPanel.value) {
    restoreListingAfterMapEventFlow()
  }
}

function onMapOpenProfileDetailFromHome(e) {
  const { profile, profileType } = e?.detail ?? {}
  if (!profile) return
  handleViewProfile({ ...profile, profileType: profileType ?? profile.profileType })
}

function closeProfileDetailsPanel() {
  showProfileDetailsPanel.value = false
  selectedProfile.value = null
}

/** Collapse/minimize listing dock — hide event & profile detail widgets (all browse modes) */
function handleListingPanelMinimized() {
  eventDetailOpenedFromMapPopup.value = false
  closeEventDetailsPanel()
  closeProfileDetailsPanel()
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
.header-profile-type-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  cursor: pointer;
}

/* ─── Search bar ─── */
.search-bar {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(255, 119, 0, 0.06);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-bar:focus-within {
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 12%, transparent),
    0 4px 16px rgba(255, 119, 0, 0.14);
}

.search-input::placeholder {
  color: var(--primary-color);
  opacity: 0.6;
  font-size: 0.8125rem;
}

.search-icon {
  opacity: 0.55;
  transition: opacity 0.15s;
}
.search-bar:focus-within .search-icon {
  opacity: 0.85;
}

/* ─── Vertical divider (inside search cluster; tint matches orange chrome) ─── */
.divider-v {
  width: 1px;
  height: 20px;
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, var(--secondary-color, #FF7700) 35%, rgba(0, 0, 0, 0.12)),
    transparent
  );
  flex-shrink: 0;
}

/* ─── Location pill ─── */
.location-pill {
  padding: 0 4px;
  border-radius: 6px;
  transition: background-color 0.15s;
}
.location-pill:hover {
  background-color: rgba(0,0,0,0.04);
}

/* ─── Chevron ─── */
.chevron-icon {
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.15s;
}
.location-pill:hover .chevron-icon { opacity: 0.8; }

/* ─── Header text buttons: Register, Login, Logout (orange chrome, not gray) ─── */
.header-btn {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(255, 119, 0, 0.06);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
}
.header-btn:hover {
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 2px color-mix(in srgb, var(--secondary-color, #FF7700) 10%, transparent);
  background-color: #fff;
  transform: translateY(-1px);
}
.header-btn:focus-visible {
  outline: none;
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 12%, transparent);
}
.header-btn:active { transform: translateY(0); }

/* Date range (desktop): same chrome; wins over .header-btn where both apply */
.header-date-field {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(255, 119, 0, 0.06);
}
.header-date-field:hover {
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 2px color-mix(in srgb, var(--secondary-color, #FF7700) 10%, transparent);
  background-color: #fff;
}
.header-date-field:focus-visible {
  outline: none;
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 12%, transparent);
}

.header-date-field :deep(button.bg-vtd-primary-600),
.header-date-field :deep(.bg-vtd-primary-600) {
  background-color: #ff7700 !important;
  color: #fff !important;
  border-color: #ff7700 !important;
}

.header-date-field :deep(button.bg-vtd-primary-600:hover),
.header-date-field :deep(.hover\:bg-vtd-primary-700:hover) {
  background-color: #ea580c !important;
  border-color: #ea580c !important;
  color: #fff !important;
}

/* ─── Icon buttons (wishlist, notifications, language) ─── */
.icon-btn {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(255, 119, 0, 0.06);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
}
.icon-btn:hover {
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 0 0 2px color-mix(in srgb, var(--secondary-color, #FF7700) 10%, transparent);
  background-color: #fff;
  transform: translateY(-1px);
}
.icon-btn:focus-visible {
  outline: none;
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 12%, transparent);
}
.icon-btn:active { transform: translateY(0); }

/* ─── User name button ─── */
.user-name-btn {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(255, 119, 0, 0.06);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.user-name-btn:hover {
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 2px 10px rgba(255, 119, 0, 0.15),
    0 0 0 2px color-mix(in srgb, var(--secondary-color, #FF7700) 10%, transparent);
  transform: translateY(-1px);
}
.user-name-btn:focus-visible {
  outline: none;
  border-color: var(--secondary-color, #FF7700);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 12%, transparent);
}

.header-user-avatar {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 45%, #e5e7eb);
}

/* ─── Badges ─── */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  border: 2px solid #fff;
}
.badge--red   { background: #ef4444; }
.badge--amber { background: #f59e0b; }

/* ─── Dropdown panels (location, search results) ─── */
.dropdown-panel {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.08);
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 10px 30px rgba(0,0,0,0.10);
  backdrop-filter: blur(8px);
}

.dropdown-input-row {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.09);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dropdown-input-row:hover,
.dropdown-input-row:focus-within {
  border-color: var(--secondary-color, #ff7700);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--secondary-color, #ff7700) 12%, transparent);
}

.search-result-item {
  border-bottom: 1px solid rgba(0,0,0,0.06);
  transition: background-color 0.12s, color 0.12s, padding-left 0.12s;
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover {
  background-color: rgba(255, 119, 0, 0.04);
  padding-left: 6px;
}

/* ─── Suggestion / category panel ─── */
.suggestion-panel {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.08);
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 12px 32px rgba(0,0,0,0.10);
  margin-top: 8px;
}

/* ─── Scroll arrow buttons ─── */
.scroll-btn {
  border: 1.5px solid rgba(0,0,0,0.10);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;
  flex-shrink: 0;
}
.scroll-btn:hover {
  border-color: rgba(0,0,0,0.18);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transform: scale(1.05);
}

/* ─── Category pills ─── */
.category-pill {
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s, transform 0.12s, box-shadow 0.15s;
}
.category-pill--default {
  background: #fff;
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 35%, rgba(0, 0, 0, 0.12));
  color: inherit;
}
.category-pill--default:hover {
  background: #f9fafb;
  border-color: var(--secondary-color, #FF7700);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
}
.category-pill--active {
  background: var(--secondary-color, #ff7700);
  border: 1.5px solid var(--secondary-color, #ff7700);
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--secondary-color, #ff7700) 35%, transparent);
}

.clear-btn {
  font-size: 0.8125rem;
  transition: color 0.15s;
}

/* ─── Notification dropdown ─── */
.notif-dropdown {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 12px 32px rgba(0,0,0,0.12);
}

.notif-item {
  transition: background-color 0.12s;
}
.notif-item:hover { background-color: #fafafa; }

.accept-btn {
  background: #16a34a;
  color: #fff;
  transition: background-color 0.15s, transform 0.12s, box-shadow 0.15s;
  box-shadow: 0 1px 4px rgba(22,163,74,0.25);
}
.accept-btn:hover:not(:disabled) {
  background: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(22,163,74,0.30);
}
.accept-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.decline-btn {
  background: #fff;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  transition: background-color 0.15s, border-color 0.15s;
}
.decline-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}
.decline-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Language dropdown ─── */
.lang-dropdown {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 12px 32px rgba(0,0,0,0.10);
  overflow: hidden;
}

.lang-option {
  transition: background-color 0.12s;
  cursor: pointer;
}
.lang-option:hover { background-color: #f9fafb; }
.lang-option--active { background-color: #f3f4f6; }

/* ─── Mobile ─── */
.mobile-close-btn {
  border: 1.5px solid var(--secondary-color, #ff7700);
  border-color: var(--secondary-color, #ff7700);
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.85rem;
  transition: background-color 0.15s;
}
.mobile-close-btn:hover { background-color: #fff7ed; }

.mobile-menu-btn {
  background: rgba(255,255,255,0.85);
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  border-radius: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow:
    0 1px 4px rgba(0,0,0,0.06),
    0 2px 8px rgba(255, 119, 0, 0.08);
  transition: background-color 0.15s, transform 0.12s, border-color 0.15s, box-shadow 0.15s;
  backdrop-filter: blur(6px);
}
.mobile-menu-btn:hover {
  background-color: #fff;
  border-color: var(--secondary-color, #FF7700);
  transform: scale(1.04);
}

.mobile-field-input,
.mobile-field-btn {
  border: 1.5px solid color-mix(in srgb, var(--secondary-color, #FF7700) 42%, rgba(0, 0, 0, 0.08));
  transition: border-color 0.15s, box-shadow 0.15s;
}
.mobile-field-input:focus,
.mobile-field-btn:hover {
  border-color: var(--secondary-color, #FF7700);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--secondary-color, #FF7700) 10%, transparent);
}

.mobile-dropdown-card {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-height: 60vh;
  overflow-y: auto;
}

/* ─── cat-scroll (unchanged) ─── */
.cat-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
  user-select: none;
}
.cat-scroll::-webkit-scrollbar { display: none; }

/* ─── Fade transition ─── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(4px); }

/* ─── Slide-right transition (mobile overlay) ─── */
.slide-right-enter-from { opacity: 0; transform: translateX(100%); }
.slide-right-enter-to   { opacity: 1; transform: translateX(0); }
.slide-right-enter-active { transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-right-leave-from { opacity: 1; transform: translateX(0); }
.slide-right-leave-to   { opacity: 0; transform: translateX(100%); }
.slide-right-leave-active { transition: all 0.25s ease; }

/* ─── Mobile datepicker panel (unchanged logic, refined border) ─── */
.mobile-datepicker-panel { z-index: 40; overflow: visible; }

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
  border: 1.5px solid var(--secondary-color, #ff7700);
  border-radius: 9999px;
  background-color: #ffffff;
  color: var(--secondary-color, #ff7700);
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

.mobile-datepicker-panel :deep(button.bg-vtd-primary-600),
.mobile-datepicker-panel :deep(.bg-vtd-primary-600) {
  background-color: #ff7700 !important;
  color: #fff !important;
  border-color: #ff7700 !important;
}

.mobile-datepicker-panel :deep(button.bg-vtd-primary-600:hover),
.mobile-datepicker-panel :deep(.hover\:bg-vtd-primary-700:hover) {
  background-color: #ea580c !important;
  border-color: #ea580c !important;
  color: #fff !important;
}
</style>