<template>
  <div ref="rootEl" id="billing-invoices" :class="embedded ? '' : 'tw:mt-8'">
    <header
      v-if="!embedded"
      class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-start tw:md:justify-between tw:gap-4 tw:mb-5"
    >
      <div>
        <h3 class="tw:text-lg tw:font-semibold tw:text-gray-900">Invoices</h3>
        <p class="tw:text-sm tw:text-gray-500 tw:mt-1">
          Premium payment receipts and renewals.
        </p>
      </div>
      <button
        type="button"
        class="tw:self-start tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-600 tw:border tw:border-gray-200 tw:bg-white tw:px-3 tw:py-2 tw:rounded-lg hover:tw:bg-gray-50 disabled:tw:opacity-50"
        :disabled="loading"
        @click="loadInvoices(page)"
      >
        <RefreshCw :class="['tw:w-4 tw:h-4', loading ? 'tw:animate-spin' : '']" />
        Refresh
      </button>
    </header>

    <div
      v-else
      class="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:mb-5"
    >
      <p class="tw:text-sm tw:text-gray-500">
        Download PDF receipts for all premium payments
      </p>
      <button
        type="button"
        class="tw:flex tw:items-center tw:gap-1.5 tw:text-sm tw:font-medium tw:text-gray-600 hover:tw:text-gray-900 disabled:tw:opacity-50"
        :disabled="loading"
        @click="loadInvoices(page)"
      >
        <RefreshCw :class="['tw:w-3.5 tw:h-3.5', loading ? 'tw:animate-spin' : '']" />
        Refresh
      </button>
    </div>

    <div v-if="loading && !invoices.length" class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:p-12 tw:text-center">
      <p class="tw:text-sm tw:text-gray-500">Loading your invoices…</p>
    </div>

    <div
      v-else-if="loadError"
      class="tw:bg-white tw:border tw:border-red-200 tw:rounded-2xl tw:p-6"
    >
      <p class="tw:text-sm tw:text-red-600 tw:mb-3">{{ loadError }}</p>
      <button
        type="button"
        class="tw:text-sm tw:font-medium tw:text-[#2563eb] hover:tw:underline"
        @click="loadInvoices(1)"
      >
        Try again
      </button>
    </div>

    <div
      v-else-if="!invoices.length"
      class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:p-12 tw:text-center"
    >
      <FileText class="tw:w-10 tw:h-10 tw:text-gray-300 tw:mx-auto tw:mb-3" />
      <h4 class="tw:text-sm tw:font-semibold tw:text-gray-900 tw:mb-1">No invoices yet</h4>
      <p class="tw:text-xs tw:text-gray-500 tw:max-w-sm tw:mx-auto">
        Invoices are created automatically after each confirmed premium payment.
      </p>
    </div>

    <template v-else>
      <!-- Summary -->
      <p v-if="pagination?.total" class="tw:text-xs tw:text-gray-500 tw:mb-3">
        {{ pagination.total }} invoice{{ pagination.total === 1 ? '' : 's' }} on record
        <span v-if="showingRange"> · showing {{ showingRange }}</span>
      </p>

      <!-- Desktop table -->
      <div class="tw:hidden md:tw:block tw:bg-white tw:border tw:border-gray-200 tw:rounded-2xl tw:overflow-hidden tw:shadow-sm">
        <div class="tw:overflow-x-auto">
          <table class="tw:w-full tw:text-left tw:text-sm">
            <thead class="tw:bg-gray-50 tw:border-b tw:border-gray-200">
              <tr>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600">Invoice</th>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600">Date</th>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600">Description</th>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600">Amount</th>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600">Status</th>
                <th class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-600 tw:text-right">Action</th>
              </tr>
            </thead>
            <tbody class="tw:divide-y tw:divide-gray-100">
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="hover:tw:bg-gray-50/80"
              >
                <td class="tw:px-4 tw:py-3 tw:font-medium tw:text-gray-900 tw:whitespace-nowrap">
                  {{ invoice.invoice_number }}
                </td>
                <td class="tw:px-4 tw:py-3 tw:text-gray-600 tw:whitespace-nowrap">
                  {{ formatInvoiceDate(invoice.paid_at) }}
                </td>
                <td class="tw:px-4 tw:py-3 tw:text-gray-700 tw:max-w-xs">
                  <span class="tw:line-clamp-2">{{ invoice.product_description }}</span>
                  <span
                    v-if="invoice.plan_interval"
                    class="tw:block tw:text-xs tw:text-gray-400 tw:mt-0.5"
                  >
                    {{ invoice.plan_interval }}
                  </span>
                </td>
                <td class="tw:px-4 tw:py-3 tw:font-semibold tw:text-[#2563eb] tw:whitespace-nowrap">
                  {{ formatInvoiceAmount(invoice.total_amount, invoice.currency) }}
                </td>
                <td class="tw:px-4 tw:py-3">
                  <span
                    :class="[
                      'tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium tw:capitalize',
                      statusBadgeClass(invoice.payment_status),
                    ]"
                  >
                    {{ invoice.payment_status }}
                  </span>
                </td>
                <td class="tw:px-4 tw:py-3 tw:text-right">
                  <button
                    type="button"
                    class="tw:inline-flex tw:items-center tw:gap-1.5 tw:bg-white tw:text-[#2563eb] tw:border tw:border-orange-500 tw:px-3 tw:py-1.5 tw:rounded-md tw:text-xs tw:font-medium tw:transition hover:tw:bg-blue-50 disabled:tw:opacity-50"
                    :disabled="downloadingId === invoice.id"
                    @click="handleDownload(invoice)"
                  >
                    <Download class="tw:w-3.5 tw:h-3.5" />
                    {{ downloadingId === invoice.id ? '…' : 'Download' }}
                  </button>
                  <p
                    v-if="downloadErrorId === invoice.id && downloadError"
                    class="tw:mt-1 tw:text-xs tw:text-red-600"
                  >
                    {{ downloadError }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile list -->
      <div class="md:tw:hidden tw:space-y-3">
        <div
          v-for="invoice in invoices"
          :key="`m-${invoice.id}`"
          class="tw:bg-white tw:border tw:border-gray-200 tw:rounded-xl tw:p-4 tw:shadow-sm"
        >
          <div class="tw:flex tw:justify-between tw:items-start tw:gap-2 tw:mb-2">
            <div>
              <p class="tw:text-sm tw:font-semibold tw:text-gray-900">{{ invoice.invoice_number }}</p>
              <p class="tw:text-xs tw:text-gray-500">{{ formatInvoiceDate(invoice.paid_at) }}</p>
            </div>
            <span
              :class="[
                'tw:inline-flex tw:px-2 tw:py-0.5 tw:rounded-full tw:text-xs tw:font-medium tw:capitalize tw:shrink-0',
                statusBadgeClass(invoice.payment_status),
              ]"
            >
              {{ invoice.payment_status }}
            </span>
          </div>
          <p class="tw:text-sm tw:text-gray-700 tw:mb-1">{{ invoice.product_description }}</p>
          <p v-if="invoice.plan_interval" class="tw:text-xs tw:text-gray-400 tw:mb-2">
            {{ invoice.plan_interval }}
          </p>
          <div class="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:pt-2 tw:border-t tw:border-gray-100">
            <p class="tw:text-base tw:font-semibold tw:text-[#2563eb]">
              {{ formatInvoiceAmount(invoice.total_amount, invoice.currency) }}
            </p>
            <button
              type="button"
              class="tw:flex tw:items-center tw:gap-2 tw:rounded-lg tw:border tw:border-gray-200 tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 hover:tw:bg-gray-50 disabled:tw:opacity-50"
              :disabled="downloadingId === invoice.id"
              @click="handleDownload(invoice)"
            >
              <Download class="tw:w-4 tw:h-4" />
              {{ downloadingId === invoice.id ? 'Downloading…' : 'Download' }}
            </button>
          </div>
          <p v-if="downloadErrorId === invoice.id && downloadError" class="tw:mt-2 tw:text-xs tw:text-red-600">
            {{ downloadError }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && (pagination.last_page > 1 || pagination.total > perPage)"
        class="tw:flex tw:flex-col sm:tw:flex-row tw:items-center tw:justify-between tw:gap-3 tw:pt-4 tw:border-t tw:border-gray-200"
      >
        <p class="tw:text-xs tw:text-gray-500">
          Page {{ pagination.current_page }} of {{ pagination.last_page }}
          <span v-if="pagination.total"> · {{ pagination.total }} total</span>
        </p>
        <div class="tw:flex tw:flex-wrap tw:gap-2">
          <button
            type="button"
            class="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-200 tw:rounded-md tw:bg-white hover:tw:bg-gray-50 disabled:tw:opacity-40"
            :disabled="page <= 1 || loading"
            @click="goToPage(1)"
          >
            First
          </button>
          <button
            type="button"
            class="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-200 tw:rounded-md tw:bg-white hover:tw:bg-gray-50 disabled:tw:opacity-40"
            :disabled="page <= 1 || loading"
            @click="goToPage(page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            class="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-200 tw:rounded-md tw:bg-white hover:tw:bg-gray-50 disabled:tw:opacity-40"
            :disabled="page >= pagination.last_page || loading"
            @click="goToPage(page + 1)"
          >
            Next
          </button>
          <button
            type="button"
            class="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-200 tw:rounded-md tw:bg-white hover:tw:bg-gray-50 disabled:tw:opacity-40"
            :disabled="page >= pagination.last_page || loading"
            @click="goToPage(pagination.last_page)"
          >
            Last
          </button>
        </div>
      </div>

      <p v-if="loading" class="tw:text-center tw:text-xs tw:text-gray-400 tw:pt-2">Updating list…</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    embedded?: boolean
    active?: boolean
  }>(),
  { embedded: false, active: true }
)
import { FileText, Download, RefreshCw } from 'lucide-vue-next'
import {
  fetchInvoices,
  downloadInvoicePdf,
  openInvoicePdfUrl,
  formatInvoiceAmount,
  formatInvoiceDate,
  InvoiceApiError,
  type Invoice,
  type InvoicePagination,
} from '@/api/invoices'

const rootEl = ref<HTMLElement | null>(null)
const invoices = ref<Invoice[]>([])
const pagination = ref<InvoicePagination | undefined>()
const page = ref(1)
const perPage = 15
const loading = ref(false)
const loadError = ref<string | null>(null)
const downloadingId = ref<number | null>(null)
const downloadErrorId = ref<number | null>(null)
const downloadError = ref<string | null>(null)
const hasLoaded = ref(false)

const showingRange = computed(() => {
  const p = pagination.value
  if (!p?.total) return ''
  const from = p.from ?? (p.current_page - 1) * p.per_page + 1
  const to = p.to ?? Math.min(p.current_page * p.per_page, p.total)
  return `${from}–${to}`
})

function statusBadgeClass(status: string): string {
  const s = (status || '').toLowerCase()
  if (s === 'paid') return 'tw:bg-green-100 tw:text-green-700'
  if (s === 'pending' || s === 'processing') return 'tw:bg-yellow-100 tw:text-yellow-700'
  if (s === 'failed' || s === 'refunded') return 'tw:bg-red-100 tw:text-red-700'
  return 'tw:bg-gray-100 tw:text-gray-600'
}

async function loadInvoices(targetPage: number) {
  loading.value = true
  loadError.value = null
  try {
    const result = await fetchInvoices(targetPage, perPage)
    invoices.value = result.items
    pagination.value = result.pagination ?? {
      current_page: targetPage,
      last_page: 1,
      per_page: perPage,
      total: result.items.length,
    }
    page.value = targetPage
    hasLoaded.value = true
  } catch (err) {
    invoices.value = []
    pagination.value = undefined
    loadError.value =
      err instanceof InvoiceApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to load invoices'
  } finally {
    loading.value = false
  }
}

function goToPage(next: number) {
  if (next < 1) return
  if (pagination.value && next > pagination.value.last_page) return
  loadInvoices(next)
  rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function handleDownload(invoice: Invoice) {
  downloadingId.value = invoice.id
  downloadErrorId.value = null
  downloadError.value = null
  try {
    await downloadInvoicePdf(invoice.id, invoice.invoice_number)
  } catch {
    if (invoice.pdf_url) {
      openInvoicePdfUrl(invoice.pdf_url)
    } else {
      downloadErrorId.value = invoice.id
      downloadError.value = 'Could not download this invoice. Please try again later.'
    }
  } finally {
    downloadingId.value = null
  }
}

watch(
  () => props.active,
  (isActive) => {
    if (isActive && !hasLoaded.value && !loading.value) {
      loadInvoices(1)
    }
  },
  { immediate: true }
)

function scrollIntoView() {
  rootEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

defineExpose({
  refresh: () => loadInvoices(page.value),
  scrollIntoView,
})
</script>
