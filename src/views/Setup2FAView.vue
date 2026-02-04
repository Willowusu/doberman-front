<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-200">

            <div class="text-center mb-8">
                <div
                    class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Enable 2FA</h2>
                <p class="mt-2 text-sm text-gray-500">Scan the QR code to secure your RiskGuard account.</p>
            </div>

            <div
                class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                <div v-if="loading" class="w-48 h-48 flex items-center justify-center">
                    <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <img v-else :src="qrCode" class="w-48 h-48 rounded-lg shadow-sm" alt="MFA Setup QR Code" />
                <p class="mt-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Scan with Authenticator
                    App</p>
            </div>

            <div class="space-y-6">
                <div>
                    <label class="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-3 text-center">
                        Verification Code
                    </label>
                    <input v-model="code" type="text" maxlength="6" placeholder="000 000" @keyup.enter="handleSetup"
                        class="w-full text-center text-2xl tracking-[0.3em] font-mono py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>

                <div v-if="error"
                    class="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-sm text-center">
                    {{ error }}
                </div>

                <button @click="handleSetup" :disabled="isSubmitting || code.length !== 6"
                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50">
                    {{ isSubmitting ? 'Finalizing Setup...' : 'Confirm and Access' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const qrCode = ref('');
const code = ref('');
const loading = ref(true);
const isSubmitting = ref(false);
const error = ref('');

onMounted(async () => {
    try {
        
        const response = await axios.post('/auth/generate-mfa', {});

        // Accessing your standard response wrapper: response(200, { qrCodeUrl }, ...)
        qrCode.value = response.data.data.qrCodeUrl;
    } catch (err) {
        console.error(err);
        error.value = "Security session expired. Please restart the login process.";
    } finally {
        loading.value = false;
    }
});

const handleSetup = async () => {
    if (code.value.length !== 6) return;

    isSubmitting.value = true;
    error.value = '';

    try {
        const response = await axios.post('/auth/confirm-mfa-setup', {
            code: code.value
        });

        if (response.data.statusCode === 200) {
            router.push('/dashboard');
        } else {
            error.value = response.data.message || "Invalid code.";
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Verification failed.";
    } finally {
        isSubmitting.value = false;
    }
};
</script>