<template>
    <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div class="p-6 flex items-center space-x-3">
            <div
                class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheckIcon class="h-5 w-5 text-white" />
            </div>
            <span class="font-bold text-xl tracking-tight">RiskGuard</span>
        </div>

        <nav class="flex-1 px-4 space-y-1 mt-4">
            <template v-for="item in menuItems" :key="item.name">

                <router-link v-if="!item.children" :to="item.path"
                    class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group"
                    :class="[$route.path === item.path ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <component :is="item.icon" class="h-5 w-5 transition-colors" />
                    <span class="font-medium text-sm">{{ item.name }}</span>
                </router-link>

                <div v-else class="space-y-1">
                    <button @click="toggleTransactions"
                        class="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group"
                        :class="[isTransactionRoute ? 'text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                        <div class="flex items-center space-x-3">
                            <BanknotesIcon class="h-5 w-5" />
                            <span class="font-medium text-sm">Transactions</span>
                        </div>
                        <ChevronDownIcon :class="{ 'rotate-180': showTransactions }"
                            class="h-4 w-4 transition-transform duration-200" />
                    </button>

                    <transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <div v-show="showTransactions || isTransactionRoute" class="pl-10 space-y-1 pb-2">
                            <router-link v-for="sub in item.children" :key="sub.path" :to="sub.path"
                                class="block p-2 text-xs font-bold rounded-lg transition-colors"
                                :class="[$route.path === sub.path ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-indigo-300']">
                                {{ sub.name }}
                            </router-link>
                        </div>
                    </transition>
                </div>

            </template>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <button @click="$emit('logout')"
                class="flex items-center space-x-3 p-3 w-full text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
                <ArrowLeftOnRectangleIcon class="h-5 w-5" />
                <span>Sign Out</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// Heroicons imports
import {
    Squares2X2Icon as DashboardIcon,
    UsersIcon as CustomersIcon,
    BoltIcon as EventsIcon,
    ScaleIcon as RulesIcon,
    ListBulletIcon as ListsIcon,
    BellIcon as AlertsIcon,
    BriefcaseIcon as CasesIcon,
    NoSymbolIcon as SanctionIcon,
    UserMinusIcon as PepIcon,
    FingerPrintIcon as AuditIcon,
    Cog6ToothIcon as SettingsIcon,
    BanknotesIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const showTransactions = ref(false);

const isTransactionRoute = computed(() => route.path.startsWith('/transactions'));

const toggleTransactions = () => {
    showTransactions.value = !showTransactions.value;
};

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    {
        name: 'Transactions',
        icon: BanknotesIcon,
        children: [
            { name: 'Collections', path: '/transactions/collections' },
            { name: 'Remittance', path: '/transactions/remittance' },
            { name: 'Payout', path: '/transactions/payout' },
            { name: 'Top-up', path: '/transactions/topup' },
            { name: 'Transfer', path: '/transactions/transfer' },
        ]
    },
    { name: 'Customers', path: '/customers', icon: CustomersIcon },
    { name: 'Events', path: '/events', icon: EventsIcon },
    { name: 'Rules', path: '/rules', icon: RulesIcon },
    { name: 'Lists', path: '/lists', icon: ListsIcon },
    { name: 'Alerts', path: '/global-alerts', icon: AlertsIcon },
    { name: 'Cases', path: '/cases', icon: CasesIcon },
    { name: 'Sanction Screening', path: '/sanction-screening', icon: SanctionIcon },
    { name: 'PEP Screening', path: '/pep-screening', icon: PepIcon },
    { name: 'Audit Logs', path: '/audit-logs', icon: AuditIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
];
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
}
</style>