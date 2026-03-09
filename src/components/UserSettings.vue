<template>
    <div>
        <div v-if="!user" class="tw:text-sm tw:text-gray-500 tw:py-4">Loading profile…</div>

        <template v-else>
            <!-- ── Section 1: Profile ──────────────────────────── -->
            <div class="tw:mb-6">
                <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">Profile</h2>

                <div class="tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-4">
                    <!-- Name (editable) -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">Name</label>
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Full name"
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition"
                        />
                    </div>

                    <!-- Email (read-only — identity field) -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">
                            Email
                            <span class="tw:ml-1 tw:text-xs tw:text-gray-400 tw:font-normal">(read-only)</span>
                        </label>
                        <input
                            :value="user.email"
                            type="email"
                            readonly
                            disabled
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-200 tw:rounded-md tw:text-sm tw:text-gray-500 tw:bg-gray-100 tw:cursor-not-allowed"
                        />
                    </div>

                    <!-- New Password -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">New Password</label>
                        <div class="tw:relative">
                            <input
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="••••••••"
                                class="tw:w-full tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition tw:pr-10"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400 hover:tw:text-gray-600 tw:transition"
                            >
                                <component :is="showPassword ? EyeOff : Eye" class="tw:w-4 tw:h-4" />
                            </button>
                        </div>
                        <p class="tw:text-xs tw:text-gray-500">
                            Leave blank to keep current password. Minimum 8 characters.
                        </p>
                    </div>
                </div>
            </div>

            <!-- ── Section 2: Billing (premium only) ──────────── -->
            <div v-if="isPremium" class="tw:border-t tw:border-gray-200 tw:pt-6 tw:mb-6">
                <h2 class="tw:text-lg tw:font-semibold tw:text-gray-900 tw:mb-4">Billing</h2>

                <div class="tw:grid tw:grid-cols-2 tw:gap-x-6 tw:gap-y-4">
                    <!-- Billing Type -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">Billing Type</label>
                        <select
                            v-model="form.billing_type"
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition"
                        >
                            <option value="individual">Individual</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    <!-- Company Name (business only) -->
                    <div v-if="isBusiness" class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">Company Name</label>
                        <input
                            v-model="form.company_name"
                            type="text"
                            placeholder="Company name"
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition"
                        />
                    </div>

                    <!-- VAT Number (business only; locked when validated) -->
                    <div v-if="isBusiness" class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">
                            VAT Number
                            <span
                                v-if="user.vat_validated"
                                class="tw:ml-2 tw:inline-flex tw:items-center tw:px-2 tw:py-0.5 tw:rounded tw:text-xs tw:font-medium tw:bg-green-100 tw:text-green-700"
                            >
                                ✓ Validated
                            </span>
                        </label>
                        <input
                            v-model="form.vat_number"
                            type="text"
                            placeholder="e.g. NL000000000B00"
                            :readonly="!!user.vat_validated"
                            :disabled="!!user.vat_validated"
                            :class="[
                                'tw:px-4 tw:py-2.5 tw:border tw:rounded-md tw:text-sm tw:transition',
                                user.vat_validated
                                    ? 'tw:border-gray-200 tw:bg-gray-100 tw:text-gray-500 tw:cursor-not-allowed'
                                    : 'tw:border-gray-300 tw:bg-white tw:text-gray-900 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb]'
                            ]"
                        />
                    </div>

                    <!-- Address -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">Address</label>
                        <input
                            v-model="form.address"
                            type="text"
                            placeholder="Street address"
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition"
                        />
                    </div>

                    <!-- Country -->
                    <div class="tw:flex tw:flex-col tw:gap-2">
                        <label class="tw:text-sm tw:font-medium tw:text-gray-900">Country</label>
                        <input
                            v-model="form.country"
                            type="text"
                            placeholder="e.g. NL, DE, FR"
                            class="tw:px-4 tw:py-2.5 tw:border tw:border-gray-300 tw:rounded-md tw:text-sm tw:text-gray-900 tw:bg-white tw:placeholder-gray-400 focus:tw:outline-none focus:tw:ring-1 focus:tw:ring-[#2563eb] focus:tw:border-[#2563eb] tw:transition"
                        />
                    </div>
                </div>
            </div>

            <!-- ── Feedback messages ──────────────────────────── -->
            <div
                v-if="successMsg"
                class="tw:mb-4 tw:px-4 tw:py-3 tw:rounded-md tw:bg-green-50 tw:border tw:border-green-200 tw:text-sm tw:text-green-700"
            >
                {{ successMsg }}
            </div>
            <div
                v-if="errorMsg"
                class="tw:mb-4 tw:px-4 tw:py-3 tw:rounded-md tw:bg-red-50 tw:border tw:border-red-200 tw:text-sm tw:text-red-700"
            >
                {{ errorMsg }}
            </div>

            <!-- ── Save Button ─────────────────────────────────── -->
            <button
                :disabled="saving"
                :class="[
                    'tw:px-6 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:border tw:transition',
                    saving
                        ? 'tw:bg-gray-100 tw:text-gray-400 tw:border-gray-300 tw:cursor-not-allowed'
                        : 'tw:bg-white tw:text-[#2563eb] tw:border-orange-500 hover:tw:bg-blue-50'
                ]"
                @click="saveProfile"
            >
                {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const isPremium = computed(() => user.value?.account_type === 'premium')
const isBusiness = computed(() => form.billing_type === 'business')

const showPassword = ref(false)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = reactive({
    name: '',
    password: '',
    billing_type: '' as 'individual' | 'business' | '',
    company_name: '',
    vat_number: '',
    address: '',
    country: '',
})

onMounted(() => {
    if (user.value) {
        form.name = user.value.name ?? ''
        form.billing_type = (user.value.billing_type ?? '') as 'individual' | 'business' | ''
        form.company_name = user.value.company_name ?? ''
        form.vat_number = user.value.vat_number ?? ''
        form.address = user.value.address ?? ''
        form.country = user.value.country ?? ''
    }
})

async function saveProfile() {
    successMsg.value = ''
    errorMsg.value = ''

    if (form.password && form.password.length < 8) {
        errorMsg.value = 'Password must be at least 8 characters.'
        return
    }

    saving.value = true
    try {
        const payload: Record<string, unknown> = { name: form.name }

        if (form.password) {
            payload.password = form.password
        }

        if (isPremium.value) {
            payload.billing_type = form.billing_type
            payload.address = form.address
            payload.country = form.country

            if (isBusiness.value) {
                payload.company_name = form.company_name
                if (!user.value?.vat_validated) {
                    payload.vat_number = form.vat_number
                }
            }
        }

        const { data } = await api.put('user/profile', payload)
        const updated = data.data ?? data.user ?? data

        if (updated?.id) {
            authStore.setUser(updated)
        }

        form.password = ''
        successMsg.value = 'Changes saved successfully.'
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        errorMsg.value = e.response?.data?.message ?? 'Failed to save changes. Please try again.'
    } finally {
        saving.value = false
    }
}
</script>
