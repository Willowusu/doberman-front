<template>
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
        <div class="flex items-center">
            <h2 class="font-bold text-gray-800 tracking-tight text-lg">{{ title }}</h2>
        </div>

        <div class="flex items-center space-x-6">
            <div
                class="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                <span class="relative flex h-2 w-2">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span class="text-[10px] font-bold text-green-700 uppercase tracking-widest">MFA Protected</span>
            </div>

            <div class="h-6 w-px bg-gray-200"></div>

            <div class="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-gray-900 leading-none">Admin User</p>
                    <p class="text-[10px] text-gray-500 mt-1">RiskGuard Authority</p>
                </div>
                <div
                    class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    A
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: 'Dashboard'
    }
});
</script>