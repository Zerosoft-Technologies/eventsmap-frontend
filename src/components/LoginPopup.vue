<template>
    <div v-if="props.isOpen" class="tw:fixed tw:inset-0 tw:z-9999 tw:flex tw:items-center tw:justify-center tw:bg-black/50 tw:p-4"
        @click.self="closePopup">
        <div class="tw:w-full tw:max-w-sm tw:bg-white tw:rounded-2xl tw:shadow-xl tw:p-3 tw:md:p-6 animate-fade-in">
            <div class="tw:flex tw:justify-between tw:items-center tw:mb-6">
                <h2 class="tw:text-xl tw:font-semibold tw:text-(--primary-color)">Login</h2>
                <button @click="closePopup" class="tw:text-gray-500 tw:hover:text-gray-700">
                    ✕
                </button>
            </div>
            
            <form @submit.prevent="submitLogin" class="tw:space-y-5">
                <div>
                    <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Email</label>
                    <input type="email" v-model="email"
                        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
                        placeholder="Enter your email" required />
                </div>

                <div>
                    <label class="tw:block tw:text-sm tw:text-gray-600 tw:mb-1">Password</label>
                    <input type="password" v-model="password"
                        class="tw:w-full tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:focus:border-(--secondary-color) tw:outline-none"
                        placeholder="Enter your password" required />
                </div>

                <button type="submit"
                    class="tw:w-full tw:bg-(--primary-color) tw:text-white tw:font-semibold tw:py-2 tw:rounded-lg tw:transition">
                    Login
                </button>
            </form>
        </div>
    </div>

</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["close"]);

const email = ref("");
const password = ref("");

const closePopup = () => emit("close");

const submitLogin = () => {
    console.log("Email:", email.value);
    console.log("Password:", password.value);
};
</script>
