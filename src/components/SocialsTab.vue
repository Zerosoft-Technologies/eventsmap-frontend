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
            <component :is="iconFor(link.key)" class="tw:h-6 tw:w-6" />
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
import { h } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
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

/** Inline SVG icons (brand marks) for a polished look without extra deps */
function iconFor(key: string) {
  const k = key.toLowerCase()
  const gid = `sm-ig-${k.replace(/[^a-z0-9]/gi, '')}`
  if (k === 'facebook') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-[#1877F2]' },
        h('path', {
          d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
        })
      )
  }
  if (k === 'instagram') {
    const url = `url(#${gid})`
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'none', class: 'tw:text-gray-900' },
        [
          h('defs', {}, [
            h(
              'linearGradient',
              { id: gid, x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
              [
                h('stop', { offset: '0%', 'stop-color': '#fd5949' }),
                h('stop', { offset: '50%', 'stop-color': '#d6249f' }),
                h('stop', { offset: '100%', 'stop-color': '#285AEB' })
              ]
            )
          ]),
          h('path', {
            stroke: url,
            'stroke-width': '1.75',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z'
          }),
          h('circle', {
            cx: '12',
            cy: '12',
            r: '3.25',
            stroke: url,
            'stroke-width': '1.75'
          }),
          h('circle', { cx: '17.5', cy: '6.5', r: '0.9', fill: url })
        ]
      )
  }
  if (k === 'tiktok') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-gray-900' },
        h('path', {
          d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z'
        })
      )
  }
  if (k === 'twitter' || k === 'x') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-gray-900' },
        h('path', {
          d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
        })
      )
  }
  if (k === 'youtube') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-red-600' },
        h('path', {
          d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
        })
      )
  }
  if (k === 'linkedin') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-[#0A66C2]' },
        h('path', {
          d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
        })
      )
  }
  if (k === 'spotify') {
    return () =>
      h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'currentColor', class: 'tw:text-[#1DB954]' },
        h('path', {
          d: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z'
        })
      )
  }
  return () =>
    h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        class: 'tw:text-[#0061FF]'
      },
      [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' })
      ]
    )
}
</script>
