<template>
    <AppLayout pageTitle="Customers">
        <div class="space-y-6">
            <div
                class="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-end gap-6 transition-all duration-300">

                <div class="flex flex-wrap items-center gap-6 w-full lg:w-auto">

                    <div class="relative w-full md:w-72 group">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                            Search Entity
                        </label>
                        <div class="relative">
                            <MagnifyingGlassIcon
                                class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input v-model="filters.search" @input="debounceSearch" type="text"
                                placeholder="Name, email or TIN..."
                                class="pl-11 pr-4 py-3 w-full bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                        </div>
                    </div>

                    <div class="flex flex-col w-full md:w-44 group">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">
                            Risk Tier
                        </label>
                        <div class="relative">
                            <FunnelIcon
                                class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <select v-model="filters.riskLevel" @change="handleFilterChange"
                                class="pl-11 pr-10 py-3 w-full appearance-none bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer shadow-sm">
                                <option value="ALL">All Levels</option>
                                <option value="LOW">Low Risk</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="MEDIUM-HIGH">Medium-High</option>
                                <option value="HIGH">High Risk</option>
                            </select>
                            <ChevronDownIcon
                                class="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="flex-1">
                            <label
                                class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">From</label>
                            <input type="date" v-model="filters.startDate" @change="handleFilterChange"
                                class="px-4 py-3 w-full bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                        </div>
                        <div class="mt-6 text-slate-300 font-bold">—</div>
                        <div class="flex-1">
                            <label
                                class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">To</label>
                            <input type="date" v-model="filters.endDate" @change="handleFilterChange"
                                class="px-4 py-3 w-full bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 w-full lg:w-auto">
                    <button @click="resetFilters"
                        class="flex-1 lg:flex-none text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-indigo-100">
                        Reset
                    </button>
                    <button @click="handleFilterChange"
                        class="flex-1 lg:flex-none bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95">
                        Apply Filters
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr
                                class="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400">
                                <th class="px-6 py-4">Customer</th>
                                <th class="px-6 py-4 text-center">Risk Level</th>
                                <th class="px-6 py-4 text-center">Inherent Score</th>
                                <th class="px-6 py-4 text-center">TX Count</th>
                                <th class="px-6 py-4">Total Inbound</th>
                                <th class="px-6 py-4">Total Outbound</th>
                                <th class="px-6 py-4">Last Seen</th>
                                <th class="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="customer in customers" :key="customer._id"
                                class="hover:bg-indigo-50/20 transition-colors group">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div
                                            class="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs mr-3 shadow-md uppercase">
                                            {{ customer.name ? customer.name.split(' ').map(n => n[0]).join('') : '??'
                                            }}
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-gray-900">{{ customer.name }}</div>
                                            <div class="text-[10px] text-gray-400 font-mono">{{ customer.externalId }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span :class="riskBadge(customer.riskLevel)"
                                        class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border">
                                        {{ customer.riskLevel }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        {{ customer.onboardingRiskScore || 0 }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center text-sm text-gray-600 font-mono">{{
                                customer.totalTransactions }}</td>
                                <td class="px-6 py-4 text-sm font-bold text-emerald-600">{{
                                formatCurrency(customer.totalInboundVolume) }}</td>
                                <td class="px-6 py-4 text-sm font-bold text-red-600">{{
                                formatCurrency(customer.totalOutboundVolume) }}</td>
                                <td class="px-6 py-4 text-[10px] text-gray-400 font-medium uppercase">{{
                                formatDate(customer.lastSeen || customer.createdAt) }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button @click="router.push(`/customers/${customer._id}`)"
                                        class="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Total Records: {{ pagination.total }}
                    </p>
                    <div class="flex items-center space-x-2">
                        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                            class="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                            Previous
                        </button>
                        <span class="text-xs font-mono font-bold px-4">Page {{ pagination.page }}</span>
                        <button @click="changePage(pagination.page + 1)" :disabled="!pagination.hasMore"
                            class="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const customers = ref([]);
let searchTimeout = null;

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
});

// Logic
const fetchCustomers = async () => {
    try {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            search: filters.search,
            startDate: filters.startDate,
            endDate: filters.endDate,
            riskLevel: filters.riskLevel
        };

        const res = await axios.get('/customers', { params });

        // Match the backend pagination structure
        customers.value = res.data.data.docs;
        pagination.total = res.data.data.total;
        pagination.hasMore = res.data.data.hasMore;
    } catch (err) {
        console.error("Failed to fetch customers:", err);
    }
};

const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        pagination.page = 1; // Reset to page 1 on new search
        fetchCustomers();
    }, 500);
};

const handleFilterChange = () => {
    pagination.page = 1;
    fetchCustomers();
};

const changePage = (newPage) => {
    pagination.page = newPage;
    fetchCustomers();
};

const filters = reactive({
    search: '',
    startDate: '',
    endDate: '',
    riskLevel: 'ALL' // Default value
});

const resetFilters = () => {
    filters.search = '';
    filters.startDate = '';
    filters.endDate = '';
    filters.riskLevel = 'ALL';
    pagination.page = 1;
    fetchCustomers();
};



// UI Helpers
const riskBadge = (level) => {
    const map = {
        HIGH: 'bg-rose-50 text-rose-700 border-rose-100',
        'MEDIUM-HIGH': 'bg-orange-50 text-orange-700 border-orange-100',
        MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
        LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    return map[level] || 'bg-gray-50 text-gray-500';
};

const formatCurrency = (val) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never';

onMounted(fetchCustomers);
</script>