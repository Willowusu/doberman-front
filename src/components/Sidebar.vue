<template>
    <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div class="p-6 flex items-center space-x-3">
            <div
                class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.93V10c0 5.185-3.147 9.855-8 11.303C5.647 19.855 2.5 15.185 2.5 10V5.83a1 1 0 01.666-.93z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <span class="font-bold text-xl tracking-tight">RiskGuard</span>
        </div>

        <nav class="flex-1 px-4 space-y-1 mt-4">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
                class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200"
                :class="[$route.path === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                <component :is="item.icon" class="h-5 w-5" />
                <span class="font-medium text-sm">{{ item.name }}</span>
            </router-link>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <button @click="$emit('logout')"
                class="flex items-center space-x-3 p-3 w-full text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'svg-icon-here' }, // Use SVGs or Icon components
    { name: 'Customers', path: '/customers', icon: 'svg-icon-here' }, // Use SVGs or Icon components
    { name: 'Events', path: '/events', icon: 'svg-icon-here' },
    { name: 'Rules', path: '/rules', icon: 'svg-icon-here' },
    { name: 'Lists', path: '/lists', icon: 'svg-icon-here' },
    { name: 'Alerts', path: '/global-alerts', icon: 'svg-icon-here' },
    { name: 'Cases', path: '/cases', icon: 'svg-icon-here' },
    { name: 'Sanction Screening', path: '/sanction-screening', icon: 'svg-icon-here' },
    { name: 'PEP Screening', path: '/pep-screening', icon: 'svg-icon-here' },
    { name: 'Audit Logs', path: '/audit-logs', icon: 'svg-icon-here' },
    { name: 'Settings', path: '/settings', icon: 'svg-icon-here' },
];
</script>