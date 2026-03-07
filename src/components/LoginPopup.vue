<template>
    <div v-if="props.isOpen" class="tw:fixed tw:inset-0 tw:z-9999 tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:p-4"
        @click.self="closePopup">
        <div class="tw:w-full tw:max-w-sm tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-3 tw:md:p-6 animate-fade-in">
            <div class="tw:flex tw:justify-between tw:items-center tw:mb-6">
                <h2 class="tw:text-xl tw:font-semibold tw:text-(--primary-color)">{{ $t('auth.loginTitle') }}</h2>
                <button @click="closePopup" class="tw:text-gray-500 tw:hover:text-gray-700">
                    ✕
                </button>
            </div>

            <!-- Error Banner -->
            <div v-if="authStore.error" class="tw:bg-red-50 tw:border tw:border-red-200 tw:text-red-700 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
                {{ authStore.error }}
            </div>

            <!-- Unverified Email Banner -->
            <div v-if="showResendBanner" class="tw:bg-yellow-50 tw:border tw:border-yellow-200 tw:text-yellow-800 tw:rounded-lg tw:px-4 tw:py-3 tw:mb-4 tw:text-sm">
                <p>Your email is not verified.</p>
                <button
                    @click="handleResend"
                    :disabled="resending"
                    class="no-hover tw:mt-1 tw:font-semibold tw:underline hover:tw:no-underline tw:disabled:opacity-50"
                    style="color: var(--primary-color)"
                >
                    {{ resending ? 'Sending...' : 'Resend verification email' }}
                </button>
                <p v-if="resendMessage" class="tw:text-green-600 tw:mt-1">{{ resendMessage }}</p>
            </div>
            
            <form @submit.prevent="submitLogin" class="tw:space-y-5">
                <div>
                    <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">{{ $t('auth.email') }}</label>
                    <input type="email" v-model="email"
                        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
                        :placeholder="$t('auth.email')" required />
                </div>

                <div>
                    <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">{{ $t('auth.password') }}</label>
                    <input type="password" v-model="password"
                        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
                        :placeholder="$t('auth.password')" required />
                </div>

                <button type="submit"
                    :disabled="authStore.loading"
                    class="no-hover tw:w-full tw:bg-(--primary-color) tw:text-white tw:font-semibold tw:py-2 tw:rounded-lg tw:transition tw:disabled:opacity-50 tw:disabled:cursor-not-allowed">
                    <span v-if="authStore.loading">Signing in...</span>
                    <span v-else>{{ $t('auth.signIn') }}</span>
                </button>
            </form>

            <div class="tw:flex tw:justify-between tw:items-center tw:mt-4 tw:text-sm">
                <router-link to="/forgot-password" @click="closePopup" class="no-hover tw:font-medium hover:tw:underline" style="color: var(--primary-color)">
                    Forgot Password?
                </router-link>
                <router-link to="/register" @click="closePopup" class="no-hover tw:font-medium hover:tw:underline" style="color: var(--primary-color)">
                    Create Account
                </router-link>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from "vue";
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getCreateRoute } from '@/utils/routeResolver';

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["close"]);

const email = ref("");
const password = ref("");
const showResendBanner = ref(false);
const resending = ref(false);
const resendMessage = ref("");

const closePopup = () => {
    authStore.clearErrors();
    showResendBanner.value = false;
    resendMessage.value = "";
    emit("close");
};

const submitLogin = async () => {
    showResendBanner.value = false;
    resendMessage.value = "";
    authStore.clearErrors();

    const result = await authStore.login({ email: email.value, password: password.value });

    if (result.success) {
        closePopup();
        // Ensure we have profile_type & account_type (e.g. if login response was minimal)
        if (!authStore.user?.profile_type || !authStore.user?.account_type) {
            await authStore.fetchUser();
        }
        router.push(getCreateRoute(authStore.user?.profile_type, authStore.user?.account_type));
    } else if (!result.emailVerified) {
        showResendBanner.value = true;
    }
};

const handleResend = async () => {
    resending.value = true;
    resendMessage.value = "";
    const msg = await authStore.resendVerification(email.value);
    if (msg) {
        resendMessage.value = msg;
    }
    resending.value = false;
};
</script>
