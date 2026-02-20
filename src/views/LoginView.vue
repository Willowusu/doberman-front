<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full">

            <div class="flex flex-col items-center mb-8">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">RiskGuard</h1>
                <p class="text-gray-500 font-medium">Enterprise Security Portal</p>
            </div>

            <div class="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800">Passwordless Sign in</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        Secure access via magic link. Enter your registered email to continue.
                    </p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div>
                        <label for="email" class="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">
                            Corporate Email
                        </label>
                        <input v-model="email" type="email" id="email" placeholder="employee@riskguard.com" required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200" />
                    </div>

                    <Transition name="fade">
                        <div v-if="statusMessage"
                            :class="isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'"
                            class="p-4 rounded-lg border text-sm text-center font-medium">
                            {{ statusMessage }}
                        </div>
                    </Transition>

                    <button type="submit" :disabled="isLoading"
                        class="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transform active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isLoading" class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Authorizing...
                        </span>
                        <span v-else>Request Access Link</span>
                    </button>
                </form>
            </div>

            <p class="mt-8 text-center text-xs text-gray-400">
                &copy; 2026 RiskGuard Systems. All rights reserved. <br>
                Protected by hardware-grade encryption.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const isError = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    statusMessage.value = '';
    isError.value = false;

    try {
        const response = await axios.post('/auth/magic-link', {
            email: email.value
        });
        statusMessage.value = `Link sent! Check your email to verify your identity. \n If you do not receive the link, copy and paste this into your browser:\n ${response.data.data.link}`;
    } catch (error) {
        isError.value = true;
        statusMessage.value = error.response?.data?.message || "Connection error. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>