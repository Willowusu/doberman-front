<template>
    <Transition name="fade">
        <div v-if="toast.show"
            class="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-700">
            <div class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span class="text-sm font-bold">{{ toast.message }}</span>
        </div>
    </Transition>

    <AppLayout pageTitle="Intelligence Stream">
        <div class="space-y-6">

            <div
                class="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-end gap-6">
                <div class="flex flex-wrap items-center gap-6 w-full lg:w-auto">

                    <div class="relative w-full md:w-72 group">
                        <label
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Search
                            Events</label>
                        <div class="relative">
                            <MagnifyingGlassIcon
                                class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input v-model="filters.search" @input="debounceSearch" type="text"
                                placeholder="Merchant, User or ID..."
                                class="pl-11 pr-4 py-3 w-full bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                        </div>
                    </div>

                    <div class="flex flex-col w-full md:w-44 group">
                        <label
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Decision
                            Status</label>
                        <div class="relative">
                            <FunnelIcon
                                class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <select v-model="filters.status" @change="handleFilterChange"
                                class="pl-11 pr-10 py-3 w-full appearance-none bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer shadow-sm">
                                <option value="ALL">All Decisions</option>
                                <option value="APPROVE">Approved</option>
                                <option value="REVIEW">Flagged for Review</option>
                                <option value="DECLINE">Declined</option>
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
                        class="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 px-4 py-2">Reset</button>
                    <button @click="handleFilterChange"
                        class="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-indigo-600 transition-all">Apply</button>
                </div>
            </div>

            <div class="relative min-h-[calc(100vh-160px)]">
                <div :class="[selectedDecision ? 'mr-[450px]' : 'mr-0']"
                    class="transition-all duration-300 ease-in-out">
                    <div class="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50 border-b border-gray-100">
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                            Time</th>
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                            Context</th>
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                            Subject</th>
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-right">
                                            Volume</th>
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400 text-center">
                                            Score</th>
                                        <th
                                            class="px-6 py-5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                            Decision</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    <tr v-for="decision in decisions" :key="decision._id"
                                        @click="selectedDecision = decision"
                                        class="group cursor-pointer transition-all hover:bg-indigo-50/20"
                                        :class="[selectedDecision?._id === decision._id ? 'bg-indigo-50/60' : '']">
                                        <td class="px-6 py-4 text-xs text-gray-500 font-mono">
                                            <div>{{ formatDate(decision.createdAt).date }}</div>
                                            <div>{{ formatDate(decision.createdAt).time }}</div>
                                        </td>

                                        <td class="px-6 py-4">
                                            <span
                                                class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded mr-2 uppercase">
                                                {{ decision.eventId?.domain }}
                                            </span>
                                            <div
                                                class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                                {{ decision.eventId?.payload.transactionType }}
                                            </div>
                                        </td>

                                        <td class="px-6 py-4">
                                            <div class="text-sm font-bold text-gray-900">
                                                {{ decision.eventId?.payload?.merchantName ||
            decision.eventId?.payload?.senderName || 'System Actor' }}
                                            </div>
                                            <div class="text-[10px] text-gray-400 font-mono uppercase">ID: {{
            decision.eventId?.payload?.transactionId || 'N/A' }}</div>
                                        </td>

                                        <td class="px-6 py-4 text-sm font-black text-right"
                                            :class="getAmountColor(decision)">
                                            GHS {{ formatCurrency(getAmount(decision)) }}
                                        </td>

                                        <td class="px-6 py-4 text-center font-black"
                                            :class="scoreColor(decision.score)">
                                            {{ decision.score }}
                                        </td>

                                        <td class="px-6 py-4">
                                            <span class="px-2 py-1 rounded-md text-[10px] font-black border uppercase"
                                                :class="decisionStyles(decision.status)">
                                                {{ decision.status }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                Total Decisions: {{ pagination.total }}
                            </p>
                            <div class="flex items-center space-x-2">
                                <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
                                    class="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                                    Previous
                                </button>
                                <span class="text-xs font-mono font-black px-4 text-indigo-600">{{ pagination.page
                                    }}</span>
                                <button @click="changePage(pagination.page + 1)" :disabled="!pagination.hasMore"
                                    class="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <EventDetailsDrawer :decision="selectedDecision" @close="selectedDecision = null"
                    @open-override="showOverrideModal = true" />
            </div>
        </div>

        <OverrideModal :isOpen="showOverrideModal" :decisionId="selectedDecision?._id"
            :history="selectedDecision?.manualOverrides" @close="showOverrideModal = false"
            @updated="handleDecisionUpdated" />
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';
import EventDetailsDrawer from '../components/EventDetailsDrawer.vue';
import OverrideModal from '../components/OverrideModal.vue';
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

const decisions = ref([]);
const selectedDecision = ref(null);
const showOverrideModal = ref(false);
const toast = reactive({ show: false, message: '' });

const filters = reactive({
    search: '',
    status: 'ALL',
    startDate: '',
    endDate: ''
});

const pagination = reactive({
    page: 1,
    limit: 15,
    total: 0,
    hasMore: false
});

let searchTimeout = null;

const fetchDecisions = async () => {
    try {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            search: filters.search,
            status: filters.status === 'ALL' ? '' : filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate
        };
        const res = await axios.post('/get-events', { params }); // Assuming GET for list fetching
        decisions.value = res.data.data.docs || [];
        pagination.total = res.data.data.total || 0;
        pagination.hasMore = res.data.data.hasMore;
    } catch (err) {
        console.error("Failed to stream decisions:", err);
    }
};

const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        pagination.page = 1;
        fetchDecisions();
    }, 500);
};

const handleFilterChange = () => {
    pagination.page = 1;
    fetchDecisions();
};

const changePage = (newPage) => {
    pagination.page = newPage;
    fetchDecisions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetFilters = () => {
    filters.search = '';
    filters.status = 'ALL';
    filters.startDate = '';
    filters.endDate = '';
    pagination.page = 1;
    fetchDecisions();
};

// ... (Other helpers like getAmount, scoreColor, etc remain the same)
const getAmount = (d) => d.eventId?.payload?.amount || d.eventId?.payload?.sendAmount || 0;
const getCurrency = (d) => d.eventId?.payload?.transactionCurrency || d.eventId?.payload?.sendCurrency || 'GHS';
const getAmountColor = (d) => {
    const type = d.eventId?.payload?.transactionType?.toLowerCase();
    return ['collection', 'topup'].includes(type) ? 'text-emerald-600' : 'text-rose-600';
};
const showToast = (msg) => { toast.message = msg; toast.show = true; setTimeout(() => toast.show = false, 3000); };
const scoreColor = (s) => s >= 75 ? 'text-red-600' : (s >= 30 ? 'text-orange-500' : 'text-emerald-600');
const decisionStyles = (status) => {
    const styles = { APPROVE: 'bg-emerald-50 text-emerald-700 border-emerald-100', REVIEW: 'bg-amber-50 text-amber-700 border-amber-100', DECLINE: 'bg-rose-50 text-rose-700 border-rose-100' };
    return styles[status] || 'bg-gray-50 text-gray-600';
};
const formatCurrency = (val) => new Intl.NumberFormat('en-GH').format(val);
const formatDate = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const d = new Date(isoString);
    return { date: d.toLocaleDateString('en-GB'), time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
};

const handleDecisionUpdated = (updatedDecision) => {
    const idx = decisions.value.findIndex(d => d._id === updatedDecision._id);
    if (idx !== -1) decisions.value[idx] = updatedDecision;
    selectedDecision.value = updatedDecision;
    showToast(`Decision overridden to ${updatedDecision.status}`);
};

onMounted(fetchDecisions);
</script>