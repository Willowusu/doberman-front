<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div class="max-w-md w-full text-center space-y-6">
            <div
                class="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-indigo-50 text-indigo-600 mb-4">
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 class="text-4xl font-black text-gray-900 tracking-tight">404 - Lost in Space</h1>
            <p class="text-gray-500 text-sm leading-relaxed">
                The page or customer record you are looking for doesn't exist or has been moved to another dimension.
            </p>
            <div class="pt-4">
                <router-link to="/"
                    class="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Back to Dashboard
                </router-link>
            </div>
        </div>
    </div>
</template>