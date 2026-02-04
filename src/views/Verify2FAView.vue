<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">

            <div
                class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Identity Verification</h2>
            <p class="mt-2 text-sm text-gray-500 mb-8">
                Enter the 6-digit code from your RiskGuard authenticator app to continue.
            </p>

            <div class="space-y-6 text-left">
                <div>
                    <label class="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-3 text-center">
                        Security Code
                    </label>
                    <input v-model="code" type="text" maxlength="6" placeholder="······" @keyup.enter="handleVerify"
                        autofocus
                        class="w-full text-center text-3xl tracking-[0.4em] font-mono py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-200" />
                </div>

                <div v-if="error"
                    class="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-sm text-center font-medium">
                    {{ error }}
                </div>

                <button @click="handleVerify" :disabled="isVerifying || code.length !== 6"
                    class="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50">
                    <span v-if="isVerifying">Verifying...</span>
                    <span v-else>Authorize Session</span>
                </button>

                <button @click="router.push('/')"
                    class="w-full text-sm text-gray-400 hover:text-indigo-600 transition-colors">
                    Cancel and return to login
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const code = ref('');
const isVerifying = ref(false);
const error = ref('');

const handleVerify = async () => {
    if (code.length < 6) return;

    isVerifying.value = true;
    error.value = '';

    try {
        const response = await axios.post('/auth/verify-mfa', {
            code: code.value
        });

        if (response.data.statusCode === 200) {
            router.push('/dashboard');
        } else {
            error.value = response.data.message || "Incorrect code. Please check your app.";
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Verification failed. Please try again.";
    } finally {
        isVerifying.value = false;
    }
};
</script>