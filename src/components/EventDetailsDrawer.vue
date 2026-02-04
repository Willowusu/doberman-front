<template>
    <div v-if="decision" class="fixed inset-0 z-50 overflow-hidden">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

        <div class="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col">
            <header class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <div class="flex items-center gap-3">
                        <h2 class="text-xl font-bold text-gray-900">Event Investigation</h2>
                        <span :class="statusBadge(decision.status)"
                            class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase border">
                            {{ decision.status }}
                        </span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1 font-mono">ID: {{ decision.eventId?._id }}</p>
                </div>
                <button @click="$emit('close')"
                    class="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <nav class="flex border-b border-gray-100 px-6 bg-gray-50/30">
                <button v-for="tab in ['Overview', 'Rules', 'Raw Payload']" :key="tab" @click="activeTab = tab"
                    :class="[activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600']"
                    class="py-4 px-4 border-b-2 text-xs font-bold transition-all uppercase tracking-widest">
                    {{ tab }}
                </button>
            </nav>

            <div class="flex-1 overflow-y-auto p-8 space-y-8">
                <div v-if="activeTab === 'Overview'" class="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <section class="grid grid-cols-2 gap-6">
                        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase">Risk Score</p>
                            <p class="text-3xl font-black mt-1" :class="scoreColor(decision.score)">{{ decision.score }}
                            </p>
                        </div>
                        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p class="text-[10px] font-bold text-gray-400 uppercase">Processing Time</p>
                            <p class="text-3xl font-black mt-1 text-gray-700">{{ decision.processingTimeMs }}<span
                                    class="text-sm font-normal text-gray-400">ms</span></p>
                        </div>
                    </section>

                    <section class="space-y-4">
                        <h3 class="text-xs font-bold text-gray-900 flex items-center gap-2">
                            <div class="h-1 w-1 rounded-full bg-indigo-600"></div> Transaction Intelligence
                        </h3>
                        <div class="grid grid-cols-2 gap-y-6">
                            <DetailItem v-for="item in formattedPayload" :key="item.key" :label="item.label"
                                :value="item.value" />
                        </div>
                    </section>
                </div>

                <div v-if="activeTab === 'Rules'" class="space-y-4 animate-in fade-in">
                    <div v-for="rule in decision.triggeredRules" :key="rule.ruleId"
                        class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-between items-center">
                        <div>
                            <p class="text-sm font-bold text-gray-900">{{ rule.name }}</p>
                            <p class="text-[10px] text-gray-400 font-mono uppercase mt-1">Action: {{ rule.action }}</p>
                        </div>
                        <div class="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg font-black text-sm">
                            +{{ rule.scoreAdded }}
                        </div>
                    </div>
                    <div v-if="!decision.triggeredRules?.length" class="text-center py-20 text-gray-400 italic">
                        No specific rules were triggered for this event.
                    </div>
                </div>

                <div v-if="activeTab === 'Raw Payload'" class="animate-in fade-in">
                    <div class="bg-slate-900 rounded-2xl p-6 overflow-hidden">
                        <pre
                            class="text-indigo-300 text-xs font-mono overflow-x-auto"><code>{{ JSON.stringify(decision.eventId?.payload, null, 2) }}</code></pre>
                    </div>
                </div>
            </div>

            <footer class="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button @click="$emit('open-override')"
                    class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Override Decision
                </button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DetailItem from './DetailItem.vue';
import { computed } from 'vue';


const activeTab = ref('Overview');

const formatAmount = (payload) => {
    const val = payload?.transaction_amount || payload?.send_amount || 0;
    return val.toLocaleString('en-GH', { minimumFractionDigits: 2 });
};

const statusBadge = (status) => {
    const map = {
        APPROVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        REVIEW: 'bg-amber-50 text-amber-700 border-amber-100',
        DECLINE: 'bg-rose-50 text-rose-700 border-rose-100'
    };
    return map[status] || 'bg-gray-50 text-gray-400';
};

const scoreColor = (score) => {
    if (score > 75) return 'text-rose-600';
    if (score > 30) return 'text-amber-500';
    return 'text-emerald-600';
};

// 1. Ensure you are defining your props correctly
const props = defineProps({
    decision: {
        type: Object,
        default: () => ({})
    }
});

const formattedPayload = computed(() => {
    // Access decision via props.decision
    const rawPayload = props.decision?.eventId?.payload;

    // If no payload exists yet, return an empty array
    if (!rawPayload) return [];

    const excludedKeys = ['retryId', 'partnerRetryId', 'retryGateway', 'merchantId', 'partnerRetryId2', 'retryId2'];

    return Object.entries(rawPayload)
        .filter(([key, value]) => {
            return !excludedKeys.includes(key) && value !== null && value !== '';
        })
        .map(([key, value]) => {
            return {
                key: key,
                label: key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/_/g, ' ')
                    .replace(/^\w/, c => c.toUpperCase())
                    .trim(),
                value: formatValue(key, value)
            };
        });
});

const formatValue = (key, value) => {
    // 1. Handle Booleans first to stop the Prop Type Warning
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    // 2. Handle Currency/Numbers
    if (key.toLowerCase().includes('amount') || key === 'balance') {
        const num = parseFloat(value);
        return isNaN(num) ? value : `GHS ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    // 3. Handle Dates
    if (key.toLowerCase().includes('date')) {
        return new Date(value).toLocaleString();
    }

    // 4. Fallback for everything else (ensures result is always a string/number)
    return value === null || value === undefined ? 'N/A' : String(value);
};
</script>