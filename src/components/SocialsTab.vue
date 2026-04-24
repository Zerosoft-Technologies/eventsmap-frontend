<template>
  <div class="tw:space-y-4">
    <p class="tw:text-sm tw:text-gray-500 tw:leading-relaxed">
      {{ $t('eventDetails.socials.subtitle') }}
    </p>

    <ul class="tw:list-none tw:space-y-3 tw:p-0 tw:m-0" role="list">
      <li v-for="link in links" :key="link.key">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="tw:group tw:flex tw:min-h-[4.5rem] tw:overflow-hidden tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white tw:shadow-sm tw:transition-all tw:duration-200 hover:tw:border-gray-200 hover:tw:shadow-md focus:tw:outline-none focus-visible:tw:ring-2 focus-visible:tw:ring-[#FF7700]/35 focus-visible:tw:ring-offset-2"
          :aria-label="$t('eventDetails.socials.openLink', { platform: link.label })"
        >
          <div
            class="tw:flex tw:w-[3.25rem] tw:flex-shrink-0 tw:items-center tw:justify-center tw:bg-gradient-to-b tw:from-gray-50 tw:to-gray-100/90"
            :class="stripeClass(link.key)"
            aria-hidden="true"
          >
            <SocialPlatformGlyph :platform-key="link.key" />
          </div>
          <div class="tw:flex tw:min-w-0 tw:flex-1 tw:items-center tw:justify-between tw:gap-3 tw:px-4 tw:py-3">
            <div class="tw:min-w-0 tw:flex-1">
              <p class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:tracking-tight">
                {{ link.label }}
              </p>
              <p class="tw:mt-0.5 tw:truncate tw:text-xs tw:text-gray-500 group-hover:tw:text-gray-600">
                {{ displayHost(link.href) }}
              </p>
            </div>
            <ExternalLink
              class="tw:h-4 tw:w-4 tw:flex-shrink-0 tw:text-gray-400 tw:transition-colors group-hover:tw:text-[#FF7700]"
              :stroke-width="2"
              aria-hidden="true"
            />
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import SocialPlatformGlyph from './SocialPlatformGlyph.vue'
import type { SocialMediaLinkItem } from '@/utils/socialMediaUrls'

defineProps<{
  links: SocialMediaLinkItem[]
}>()

function displayHost(href: string): string {
  try {
    const u = new URL(href)
    return (u.host + u.pathname + u.search).replace(/\/$/, '') || href
  } catch {
    return href
  }
}

function stripeClass(key: string): string {
  const k = key.toLowerCase()
  const map: Record<string, string> = {
    facebook: 'tw:border-r tw:border-[#1877F2]/25 tw:bg-[#1877F2]/[0.07]',
    instagram: 'tw:border-r tw:border-fuchsia-500/25 tw:bg-gradient-to-br tw:from-[#fdf497]/30 tw:via-[#fd5949]/15 tw:to-[#285AEB]/15',
    tiktok: 'tw:border-r tw:border-gray-900/15 tw:bg-gray-900/[0.06]',
    twitter: 'tw:border-r tw:border-sky-500/25 tw:bg-sky-500/[0.08]',
    x: 'tw:border-r tw:border-gray-900/20 tw:bg-gray-900/[0.06]',
    youtube: 'tw:border-r tw:border-red-600/25 tw:bg-red-600/[0.07]',
    linkedin: 'tw:border-r tw:border-[#0A66C2]/25 tw:bg-[#0A66C2]/[0.07]',
    spotify: 'tw:border-r tw:border-[#1DB954]/30 tw:bg-[#1DB954]/[0.08]'
  }
  return map[k] || 'tw:border-r tw:border-[#0061FF]/20 tw:bg-[#0061FF]/[0.06]'
}
</script>
