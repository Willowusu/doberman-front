<template>
    <AppLayout pageTitle="Customers">
        <div class="space-y-6">
            <div
                class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-end gap-6">
                <div class="flex flex-wrap items-center gap-4">
                    <div class="relative w-full md:w-64">
                        <label class="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">Search
                            Entity</label>
                        <input v-model="filters.search" @input="debounceSearch" type="text"
                            placeholder="Name, email or TIN..."
                            class="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                        <span class="absolute left-3 top-8 text-gray-400">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">Risk Tier</label>
                        <select v-model="filters.riskLevel" @change="handleFilterChange"
                            class="text-xs border-gray-200 rounded-xl bg-gray-50 focus:ring-indigo-500 min-w-[120px]">
                            <option value="ALL">All Levels</option>
                            <option value="LOW">Low Risk</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="MEDIUM-HIGH">Medium-High</option>
                            <option value="HIGH">High Risk</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-2">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">From</label>
                            <input type="date" v-model="filters.startDate" @change="handleFilterChange"
                                class="text-xs border-gray-200 rounded-xl bg-gray-50 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">To</label>
                            <input type="date" v-model="filters.endDate" @change="handleFilterChange"
                                class="text-xs border-gray-200 rounded-xl bg-gray-50 focus:ring-indigo-500" />
                        </div>
                    </div>
                </div>

                <button @click="resetFilters"
                    class="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                    Reset Filters
                </button>
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
                                        {{ customer.riskProfileScore || 0 }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center text-sm text-gray-600 font-mono">{{
                                    customer.totalTransactions }}</td>
                                <td class="px-6 py-4 text-sm font-bold text-emerald-600">{{
                                    formatCurrency(customer.totalInboundVolume) }}</td>
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