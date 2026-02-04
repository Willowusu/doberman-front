<template>
    <AppLayout pageTitle="Compliance & AML Cases">
    <div class="layout-wrapper flex h-screen bg-gray-50">
        <Sidebar active-menu="cases" />

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white border-b h-16 flex items-center justify-between px-8">
                <div class="flex items-center gap-4">
                    <h2 class="text-xl font-semibold text-gray-800">Compliance & AML Cases</h2>
                    <span class="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {{ stats.open }} Pending
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <button @click="fetchCases" class="p-2 text-gray-400 hover:text-indigo-600">
                        <RefreshIcon class="w-5 h-5" />
                    </button>
                    <div
                        class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        G
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-8">

                <div class="flex justify-between items-center mb-6">
                    <div class="flex gap-2">
                        <button v-for="status in ['OPEN', 'UNDER_REVIEW', 'RESOLVED']" :key="status"
                            @click="filters.status = status; fetchCases()"
                            :class="filters.status === status ? 'bg-white shadow-sm border-indigo-500 text-indigo-600' : 'text-gray-500 border-transparent'"
                            class="px-4 py-2 text-sm font-medium border-b-2 transition-all">
                            {{ status.replace('_', ' ') }}
                        </button>
                    </div>

                    <div class="flex gap-3">
                        <input type="text" placeholder="Search Case ID or Customer..."
                            class="border rounded-lg px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <select v-model="filters.severity" @change="fetchCases"
                            class="border rounded-lg px-3 py-2 text-sm outline-none">
                            <option value="">All Severities</option>
                            <option value="CRITICAL">Critical Only</option>
                            <option value="HIGH">High Risk</option>
                        </select>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case
                                    Reference</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Customer / Merchant</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Trigger</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Severity</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk
                                    Score</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="item in cases" :key="item._id" class="hover:bg-indigo-50/30 transition-colors">
                                <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ item.caseReference }}</td>
                                <td class="px-6 py-4">
                                    <div class="text-sm font-semibold text-gray-900">{{ item.customer?.name }}</div>
                                    <div class="text-xs text-gray-400">{{ item.customer?.email }}</div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ item.title }}</td>
                                <td class="px-6 py-4">
                                    <span :class="getSeverityBadge(item.severity)"
                                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                        {{ item.severity }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                            <div :style="{ width: item.totalRiskScore + '%' }"
                                                :class="getScoreColor(item.totalRiskScore)" class="h-full"></div>
                                        </div>
                                        <span class="text-xs font-bold text-gray-700">{{ item.totalRiskScore }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <button @click="selectedCase = item"
                                        class="bg-white border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-md text-xs font-semibold transition-all">
                                        Investigate
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="cases.length === 0" class="p-20 text-center">
                        <div class="text-gray-400 mb-2 font-medium">No pending cases found</div>
                        <p class="text-sm text-gray-500 text-light">System is clear. All transactions are within safety
                            parameters.</p>
                    </div>
                </div>
            </main>
        </div>

        <CaseDetailsDrawer v-if="selectedCase" :case="selectedCase" @close="selectedCase = null"
            @updated="fetchCases" />
    </div>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const cases = ref([]);
const stats = ref({ open: 0 });
const selectedCase = ref(null);
const filters = ref({ status: 'OPEN', severity: '' });

const fetchCases = async () => {
    const { data } = await axios.get('/cases', { params: filters.value });
    cases.value = data.data;
    stats.value.open = cases.value.filter(c => c.status === 'OPEN').length;
};

const getSeverityClass = (sev) => {
    const map = {
        'CRITICAL': 'bg-red-600 text-white',
        'HIGH': 'bg-orange-100 text-orange-700',
        'MEDIUM': 'bg-yellow-100 text-yellow-700',
        'LOW': 'bg-blue-100 text-blue-700'
    };
    return map[sev];
};

const openCase = (item) => {
    selectedCase.value = item;
};

onMounted(fetchCases);
</script>