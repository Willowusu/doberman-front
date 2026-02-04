<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full text-center">

            <div class="flex justify-center mb-6">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </div>

            <div v-if="status === 'verifying'">
                <h2 class="text-2xl font-bold text-gray-900 tracking-tight mb-2">Verifying Identity</h2>
                <p class="text-gray-500 mb-8">Please wait while we secure your access session...</p>

                <div class="flex justify-center">
                    <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin">
                    </div>
                </div>
            </div>

            <div v-if="status === 'error'" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div
                    class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Link Invalid or Expired</h2>
                <p class="text-gray-500 text-sm mb-6">
                    The security token provided is no longer valid. Magic links expire after 15 minutes or after a
                    single use.
                </p>
                <router-link to="/"
                    class="inline-block w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg transition-colors">
                    Return to Login
                </router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const status = ref('verifying'); // 'verifying' | 'error'

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        status.value = 'error';
        return;
    }

    try {
        // Calling your backend verifyMagicLink route
        const response = await axios.post('/auth/verify-magic-token', { token });

        // Based on your backend structure: res.json(response(200, { hasMFA }, ...))
        const { hasMFA } = response.data.data;

        // Small delay so the user sees the verification happening (better UX)
        setTimeout(() => {
            if (hasMFA) {
                router.push('/verify-2fa');
            } else {
                router.push('/setup-2fa');
            }
        }, 1500);

    } catch (error) {
        console.error('Verification failed:', error);
        status.value = 'error';
    }
});
</script>