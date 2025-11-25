<template>
    <div v-if="props.isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
        @click.self="closePopup">
        <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-3 md:p-6 animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-[var(--primary-color)]">Login</h2>
                <button @click="closePopup" class="text-gray-500 cursor-pointer hover:text-gray-700">
                    ✕
                </button>
            </div>
            
            <form @submit.prevent="submitLogin" class="space-y-5">
                <div>
                    <label class="block text-sm text-gray-600 mb-1">Email</label>
                    <input type="email" v-model="email"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--secondary-color)] outline-none"
                        placeholder="Enter your email" required />
                </div>

                <div>
                    <label class="block text-sm text-gray-600 mb-1">Password</label>
                    <input type="password" v-model="password"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--secondary-color)] outline-none"
                        placeholder="Enter your password" required />
                </div>

                <button type="submit"
                    class="w-full bg-[var(--primary-color)] cursor-pointer text-white font-semibold py-2 rounded-lg transition">
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
