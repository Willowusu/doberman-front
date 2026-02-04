<template>
    <AppLayout pageTitle="Audit Trails">
        <div class="max-w-7xl mx-auto space-y-6">

            <div
                class="bg-white p-4 rounded-[30px] border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div class="flex gap-2">
                    <input v-model="filters.search" type="text" placeholder="Search by user or action..."
                        class="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-64">
                    <select v-model="filters.status"
                        class="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none">
                        <option value="">All Statuses</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILURE">Failure</option>
                    </select>
                </div>
                <button @click="fetchLogs"
                    class="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-800 transition-all">
                    Refresh Logs
                </button>
            </div>

            <section class="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400">
                        <tr>
                            <th class="px-8 py-5">Timestamp</th>
                            <th class="px-8 py-5">User</th>
                            <th class="px-8 py-5">Action</th>
                            <th class="px-8 py-5">Resource</th>
                            <th class="px-8 py-5">IP Address</th>
                            <th class="px-8 py-5 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="log in logs" :key="log._id" class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-8 py-6 text-xs font-mono text-slate-400">
                                {{ formatDate(log.createdAt) }}
                            </td>
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                        {{ log.user?.name?.charAt(0) }}
                                    </div>
                                    <span class="text-xs font-bold text-slate-700">{{ log.user?.name || 'System'
                                        }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-6">
                                <span
                                    class="text-[11px] font-black px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 uppercase tracking-tight">
                                    {{ log.action.replace('_', ' ') }}
                                </span>
                            </td>
                            <td class="px-8 py-6 text-xs text-slate-500">
                                {{ log.resource }}
                            </td>
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-mono text-slate-400">{{ log.ipAddress }}</span>
                                    <svg v-if="log.userAgent.includes('Chrome')" class="w-3 h-3 text-slate-300"
                                        fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                                    </svg>
                                </div>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <span :class="log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'"
                                    class="text-[10px] font-black uppercase">
                                    {{ log.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const logs = ref([]);
const filters = ref({ search: '', status: '' });

const fetchLogs = async () => {
    try {
        const res = await axios.get('/audit-logs', { params: filters.value });
        logs.value = res.data.data;
    } catch (e) {
        console.error("Failed to fetch logs");
    }
};

const formatDate = (d) => {
    return new Date(d).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

onMounted(fetchLogs);
</script>