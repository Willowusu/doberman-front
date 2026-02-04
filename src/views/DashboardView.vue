<template>
    <AppLayout pageTitle="Risk Command Center">
        <div class="max-w-7xl mx-auto space-y-8 pb-12">

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Volume (24h)" :value="formatCurrency(stats.totalVolume)" icon="chart-bar"
                    color="indigo" />
                <MetricCard title="High Risk Entities" :value="stats.highRiskCount" icon="shield-exclamation"
                    color="rose" />
                <MetricCard title="Pending Alerts" :value="stats.pendingAlerts" icon="bell" color="amber" />
                <MetricCard title="Auto-Decision Rate" :value="`${stats.decisionRate}%`" icon="cpu-chip"
                    color="emerald" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <div class="mb-6">
                        <h3 class="text-sm font-bold text-gray-900">Portfolio Risk Mix</h3>
                        <p class="text-[10px] text-gray-400 uppercase tracking-tight">Active Customer Distribution</p>
                    </div>
                    <RiskDistributionChart :data="stats.riskDistribution" />
                </div>

                <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 class="font-bold text-gray-900 text-sm">Critical Flagged Events</h3>
                        <router-link to="/alerts"
                            class="text-[10px] font-bold text-indigo-600 uppercase hover:underline">
                            View All Alerts
                        </router-link>
                    </div>

                    <div class="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                        <div v-for="alert in recentAlerts" :key="alert._id"
                            class="p-5 hover:bg-gray-50 transition-all flex items-center justify-between group">
                            <div class="flex items-center space-x-4">
                                <div :class="alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'"
                                    class="p-3 rounded-xl transition-transform group-hover:scale-110">
                                    <component
                                        :is="alert.severity === 'CRITICAL' ? ShieldExclamationIcon : ExclamationTriangleIcon"
                                        class="h-5 w-5" />
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-gray-900">{{ alert.customerName || 'Unknown Entity'
                                        }}</p>
                                    <p class="text-[10px] text-gray-400 uppercase font-mono tracking-tighter">{{
                    alert.reason }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-bold text-gray-900">GHS {{ formatNumber(alert.amount || 0) }}</p>
                                <p class="text-[10px] text-gray-400 font-medium">{{ formatDateShort(alert.createdAt) }}
                                </p>
                            </div>
                        </div>

                        <div v-if="recentAlerts.length === 0" class="p-10 text-center text-gray-400 text-xs italic">
                            No critical alerts recorded in the last 24 hours.
                        </div>
                    </div>
                </div>
            </div>

            <section class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-gray-900 text-sm">Recently Registered Entities</h3>
                    <router-link to="/customers"
                        class="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase">Directory</router-link>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-50 text-gray-400 font-bold uppercase tracking-widest">
                            <tr>
                                <th class="px-6 py-4">Entity Name</th>
                                <th class="px-6 py-4 text-center">Inherent Risk (Baseline)</th>
                                <th class="px-6 py-4 text-center">Dynamic Risk (Live)</th>
                                <th class="px-6 py-4">Status</th>
                                <th class="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="cust in customers" :key="cust._id"
                                class="hover:bg-indigo-50/20 transition-colors">
                                <td class="px-6 py-4 font-bold text-gray-900">{{ cust.name }}</td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="px-3 py-1 bg-gray-100 rounded-lg text-gray-600 font-mono text-[10px] border border-gray-200">
                                        {{ cust.riskProfileScore || 0 }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span :class="cust.dynamicRiskScore > 60 ? 'text-rose-600' : 'text-emerald-600'"
                                        class="font-black">
                                        {{ cust.dynamicRiskScore?.toFixed(2) || '0.00' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 uppercase">
                                    <span :class="riskBadgeStyle(cust.riskLevel)"
                                        class="px-2 py-0.5 rounded text-[10px] font-bold border">
                                        {{ cust.riskLevel }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button @click="$router.push(`/customers/${cust._id}`)"
                                        class="text-indigo-600 font-bold hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                                        Inspect
                                    </button>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Layout & Reusable Components
import AppLayout from '../layouts/AppLayout.vue';
import MetricCard from '../components/MetricCard.vue';
import RiskDistributionChart from '../components/RiskDistributionChart.vue';

// Heroicons for the Alert Feed
import {
    ShieldExclamationIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const stats = ref({
    totalVolume: 0,
    highRiskCount: 0,
    pendingAlerts: 0,
    decisionRate: 0,
    riskDistribution: []
});
const recentAlerts = ref([]);
const customers = ref([]);

const initDashboard = async () => {
    try {
        const [statsRes, alertRes, custRes] = await Promise.all([
            axios.get('/dashboard/stats'),
            axios.get('/alerts/global-feed'),
            axios.get('/customers?limit=5')
        ]);

        stats.value = statsRes.data.data;
        recentAlerts.value = alertRes.data.data;
        customers.value = custRes.data.data;
    } catch (err) {
        console.error("Dashboard Load Error:", err);
    }
};

// UI Formatting Helpers
const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        maximumFractionDigits: 0
    }).format(val);
};

const formatNumber = (num) => {
    return num?.toLocaleString('en-GH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatDateShort = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const riskBadgeStyle = (level) => {
    const map = {
        HIGH: 'bg-rose-50 text-rose-700 border-rose-100',
        'MEDIUM-HIGH': 'bg-orange-50 text-orange-700 border-orange-100',
        MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
        LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    return map[level] || 'bg-gray-50 text-gray-500 border-gray-100';
};

onMounted(initDashboard);
</script>