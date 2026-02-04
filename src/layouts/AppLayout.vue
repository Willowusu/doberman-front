<template>
    <div class="flex bg-gray-50 min-h-screen">
        <Sidebar @logout="handleLogout" />

        <div class="flex-1 flex flex-col">
            <header
                class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 class="font-bold text-gray-800 tracking-tight">{{ pageTitle }}</h2>
                <div class="flex items-center space-x-4">
                    <span
                        class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 uppercase tracking-widest">MFA
                        Protected</span>
                    <div class="h-8 w-px bg-gray-200"></div>
                    <div
                        class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        JD
                    </div>
                </div>
            </header>

            <main class="p-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

defineProps({
    pageTitle: String
});

const router = useRouter();

const handleLogout = async () => {
    try {
        await axios.post('/auth/logout');
        router.push('/');
    } catch (err) {
        router.push('/');
    }
};
</script>