<template>
    <AppLayout pageTitle="Global Risk Feed">
        <div class="max-w-7xl mx-auto space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div v-for="stat in summaryStats" :key="stat.label"
                    class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
                    <p class="text-2xl font-black text-slate-900 mt-1">{{ stat.value }}</p>
                </div>
            </div>

            <section class="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h3 class="font-black text-gray-900 text-lg uppercase tracking-tight">Alert Activity Stream
                            </h3>

                            <div v-if="isLive"
                                class="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                <div class="relative flex h-2 w-2">
                                    <span
                                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </div>
                                <span
                                    class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                            </div>

                            <div v-else
                                class="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
                                <div class="h-2 w-2 rounded-full bg-rose-500"></div>
                                <span
                                    class="text-[9px] font-black text-rose-600 uppercase tracking-widest">Offline</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400">Monitoring all active tripwires and behavioral triggers</p>
                    </div>

                    <div class="flex gap-2">
                        <button @click="fetchFeed"
                            class="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400">
                            <tr>
                                <th class="px-8 py-5">Time</th>
                                <th class="px-8 py-5">Entity / Merchant</th>
                                <th class="px-8 py-5">Trigger Details</th>
                                <th class="px-8 py-5">Type</th>
                                <th class="px-8 py-5 text-right">Value</th>
                                <th class="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="log in feed" :key="log._id"
                                class="hover:bg-indigo-50/30 transition-colors group">
                                <td class="px-8 py-6 text-xs font-mono text-gray-400">
                                    {{ formatTime(log.createdAt) }}
                                </td>
                                <td class="px-8 py-6">
                                    <router-link :to="`/customers/${log.customer?._id}`" class="block">
                                        <div
                                            class="text-sm font-black text-gray-900 hover:text-indigo-600 transition-colors">
                                            {{ log.customer?.name || 'Unknown' }}
                                        </div>
                                        <div class="text-[10px] text-gray-400 uppercase font-bold">
                                            {{ log.customer?.riskLevel }} RISK
                                        </div>
                                    </router-link>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="text-xs font-bold text-slate-700">{{ log.triggerName }}</div>
                                    <div class="text-[10px] text-gray-400 flex items-center gap-1">
                                        <span class="px-1.5 py-0.5 bg-gray-100 rounded text-[9px]">{{ log.channel
                                            }}</span>
                                        <span>{{ log.recipient }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <span :class="typeStyle(log.alert?.type)"
                                        class="px-3 py-1 rounded-full text-[9px] font-black uppercase border">
                                        {{ log.alert?.type || 'SIMPLE' }}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-right text-sm font-black text-rose-600">
                                    {{ log.triggerValue ? log.triggerValue.toLocaleString() : 0 }}
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <router-link :to="`/customers/${log.customer?._id}`"
                                        class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">
                                        Investigate
                                    </router-link>
                                </td>
                            </tr>
                            <tr v-if="!feed.length">
                                <td colspan="6" class="p-20 text-center text-gray-400 text-sm italic">
                                    No alerts detected in this stream.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const feed = ref([]);
const isLoading = ref(true);
const isLive = ref(false); // We can toggle this via global event bus or store later

const fetchFeed = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get('/alerts/global-feed');
        feed.value = res.data.data;
    } catch (e) {
        console.error("Feed sync failed", e);
    } finally {
        isLoading.value = false;
    }
};

const summaryStats = computed(() => {
    const totalCount = feed.value.length;
    const simpleCount = feed.value.filter(l => l.alert?.type === 'SIMPLE').length;
    const aggregateCount = feed.value.filter(l => l.alert?.type === 'AGGREGATE').length;

    return [
        { label: 'Total Alerts (Stream)', value: totalCount },
        { label: 'Event Tripwires', value: simpleCount },
        { label: 'Behavioral Hits', value: aggregateCount },
        { label: 'System Health', value: '100%' }
    ];
});

const typeStyle = (type) => {
    return type === 'AGGREGATE'
        ? 'bg-purple-50 text-purple-600 border-purple-100'
        : 'bg-blue-50 text-blue-600 border-blue-100';
};

const formatTime = (d) => {
    if (!d) return '--:--';
    return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

onMounted(() => {
    fetchFeed();
});
</script>