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
        <div class="relative min-h-[calc(100vh-160px)]">
            <div :class="[selectedDecision ? 'mr-[450px]' : 'mr-0']" class="transition-all duration-300 ease-in-out">
                <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div
                        class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                        <div>
                            <h3 class="font-bold text-gray-800 text-lg">Live Decision Stream</h3>
                            <p class="text-xs text-gray-500">Real-time risk evaluation across all domains</p>
                        </div>
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input v-model="searchQuery" type="text" placeholder="Search Merchant, User or ID..."
                                class="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-80 outline-none transition-all" />
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50/50 border-b border-gray-100">
                                    <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                        Time</th>
                                    <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                        Context</th>
                                    <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                        Subject</th>
                                    <th
                                        class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">
                                        Volume</th>
                                    <th
                                        class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-center">
                                        Score</th>
                                    <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                        Decision</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="decision in filteredDecisions" :key="decision._id"
                                    @click="selectedDecision = decision"
                                    class="group cursor-pointer transition-all hover:bg-gray-50"
                                    :class="[selectedDecision?._id === decision._id ? 'bg-indigo-50/60' : '']">

                                    <td class="px-6 py-4 text-xs text-gray-500 font-mono">
                                        {{ formatDate(decision.createdAt).time }}
                                    </td>

                                    <td class="px-6 py-4">
                                        <span
                                            class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded mr-2 uppercase">
                                            {{ decision.eventId?.domain }}
                                        </span>
                                        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {{ decision.eventId?.action_type }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-4">
                                        <div class="text-sm font-bold text-gray-900">
                                            {{ decision.eventId?.payload?.merchant_name ||
            decision.eventId?.payload?.sender_name || 'System Actor' }}
                                        </div>
                                        <div class="text-[10px] text-gray-400 font-mono uppercase">
                                            ID: {{ decision.eventId?.payload?.merchant_id ||
            decision.eventId?.payload?.user_id || 'N/A' }}
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 text-sm font-bold text-right"
                                        :class="getAmountColor(decision)">
                                        {{ getCurrency(decision) }} {{ formatCurrency(getAmount(decision)) }}
                                    </td>

                                    <td class="px-6 py-4 text-center font-black" :class="scoreColor(decision.score)">
                                        {{ decision.score }}
                                    </td>

                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 rounded-md text-[10px] font-bold border"
                                            :class="decisionStyles(decision.status)">
                                            {{ decision.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <EventDetailsDrawer :decision="selectedDecision" @close="selectedDecision = null"
                @open-override="showOverrideModal = true" />
        </div>

        <OverrideModal :isOpen="showOverrideModal" :decisionId="selectedDecision?._id"
            :history="selectedDecision?.manualOverrides" @close="showOverrideModal = false"
            @updated="handleDecisionUpdated" />
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';
import EventDetailsDrawer from '../components/EventDetailsDrawer.vue';
import OverrideModal from '../components/OverrideModal.vue';

const decisions = ref([]);
const selectedDecision = ref(null);
const searchQuery = ref('');
const showOverrideModal = ref(false);
const toast = reactive({ show: false, message: '' });

// Helper: Extract amount from payload
const getAmount = (d) => d.eventId?.payload?.transaction_amount || d.eventId?.payload?.send_amount || 0;
const getCurrency = (d) => d.eventId?.payload?.transaction_currency || d.eventId?.payload?.send_currency || 'GHS';

const getAmountColor = (d) => {
    const type = d.eventId?.payload?.transaction_type?.toLowerCase();
    return ['collection', 'topup'].includes(type) ? 'text-emerald-600' : 'text-rose-600';
};

const showToast = (msg) => {
    toast.message = msg;
    toast.show = true;
    setTimeout(() => toast.show = false, 3000);
};

const scoreColor = (s) => s >= 75 ? 'text-red-600' : (s >= 30 ? 'text-orange-500' : 'text-emerald-600');

const decisionStyles = (status) => {
    const styles = {
        APPROVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        REVIEW: 'bg-amber-50 text-amber-700 border-amber-100',
        DECLINE: 'bg-rose-50 text-rose-700 border-rose-100'
    };
    return styles[status] || 'bg-gray-50 text-gray-600';
};

const formatCurrency = (val) => new Intl.NumberFormat('en-GH').format(val);

const formatDate = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const d = new Date(isoString);
    return {
        date: d.toLocaleDateString('en-GB'),
        time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
};

const filteredDecisions = computed(() => {
    if (!searchQuery.value) return decisions.value;
    const q = searchQuery.value.toLowerCase();
    return decisions.value.filter(d => {
        const payload = d.eventId?.payload || {};
        return (
            payload.merchant_name?.toLowerCase().includes(q) ||
            payload.sender_name?.toLowerCase().includes(q) ||
            payload.merchant_id?.toLowerCase().includes(q) ||
            payload.transaction_id?.toLowerCase().includes(q)
        );
    });
});

const handleDecisionUpdated = (updatedDecision) => {
    const idx = decisions.value.findIndex(d => d._id === updatedDecision._id);
    if (idx !== -1) decisions.value[idx] = updatedDecision;
    selectedDecision.value = updatedDecision;
    showToast(`Decision overridden to ${updatedDecision.status}`);
};

onMounted(async () => {
    try {
        // Updated to your new backend route if necessary
        const res = await axios.post('/get-events');
        decisions.value = res.data.data || [];
    } catch (err) {
        console.error("Failed to stream decisions:", err);
    }
});
</script>