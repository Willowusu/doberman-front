<template>
    <AppLayout :pageTitle="customer ? `Profile: ${customer.name}` : 'Loading...'">
        <div v-if="customer" class="max-w-7xl mx-auto space-y-6">

            <section class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div class="flex items-center space-x-5">
                        <div
                            class="h-20 w-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-lg uppercase">
                            {{ customer.name ? customer.name.split(' ').map(n => n[0]).join('') : '??' }}
                        </div>
                        <div>
                            <div class="flex items-center space-x-3">
                                <h2 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h2>
                                <span :class="riskBadgeStyle(customer.riskLevel)"
                                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase border">
                                    {{ customer.riskLevel }} Risk
                                </span>
                            </div>
                            <p class="text-gray-400 text-sm mt-1">External ID: <span
                                    class="font-mono text-xs text-indigo-600">{{ customer.externalId }}</span></p>
                        </div>
                    </div>

                    <div class="flex gap-3 w-full md:w-auto">
                        <button v-if="customer.status !== 'BANNED'" @click="updateStatus('BANNED')"
                            class="px-6 py-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all">
                            Restrict Entity
                        </button>
                        <button v-else @click="updateStatus('ACTIVE')"
                            class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-emerald-700 transition-all">
                            Reactivate
                        </button>
                    </div>
                </div>

                <div
                    class="grid grid-cols-2 md:grid-cols-5 border-t border-gray-100 divide-x divide-gray-100 bg-gray-50/30">
                    <MetricItem label="Total Inbound" :value="formatCurrency(customer.totalInboundVolume)" />
                    <MetricItem label="Inherent Risk (Onboarding)" :value="customer.onboardingRiskScore" />
                    <MetricItem label="Behavioral Risk (Live)" :value="customer.dynamicRiskScore.toFixed(2)"
                        :class="customer.dynamicRiskScore > customer.onboardingRiskScore ? 'text-rose-600' : 'text-emerald-600'" />
                    <MetricItem label="Cumulative Level" :value="customer.riskLevel" />
                    <MetricItem label="Account Status" :value="customer.status" />
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                    <CustomerRiskChart :history="history" v-if="history.length > 0" />

                    <section class="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entity Intelligence
                        </h3>
                        <div class="space-y-6">
                            <InfoRow label="Contact Email" :value="customer.email" icon="at-symbol" />
                            <InfoRow label="Phone Number" :value="customer.phone" icon="phone" />
                            <InfoRow label="Flags Raised" :value="customer.totalFlags?.toString() || '0'" icon="flag" />
                            <InfoRow label="Last Activity" :value="formatDate(customer.lastSeen || customer.createdAt)"
                                icon="clock" />
                        </div>
                    </section>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <div class="flex space-x-8 border-b border-gray-100 px-2">
                        <button @click="activeTab = 'risk'"
                            :class="activeTab === 'risk' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'"
                            class="pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all">
                            Risk Profile & Settlement
                        </button>
                        <button @click="activeTab = 'history'"
                            :class="activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'"
                            class="pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all">
                            Decision History
                        </button>
                        <button @click="activeTab = 'alerts'"
                            :class="activeTab === 'alerts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'"
                            class="pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all">
                            Monitoring Alerts
                        </button>
                    </div>

                    <section v-if="activeTab === 'history'"
                        class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="font-bold text-gray-900 text-sm">Automated Decisions</h3>
                            <p class="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">Last {{
                                history.length }} Events</p>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead class="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
                                    <tr>
                                        <th class="px-6 py-4">Timestamp</th>
                                        <th class="px-6 py-4">Action / Type</th>
                                        <th class="px-6 py-4 text-center">Score</th>
                                        <th class="px-6 py-4">Status</th>
                                        <th class="px-6 py-4 text-right">Volume</th>
                                        <th class="px-6 py-4 text-right">Inspect</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    <tr v-for="dec in history" :key="dec._id"
                                        class="hover:bg-indigo-50/30 transition-colors group">
                                        <td class="px-6 py-4 text-xs font-mono text-gray-500">{{
                                            formatDateShort(dec.createdAt) }}</td>
                                        <td class="px-6 py-4">
                                            <div class="text-[11px] font-bold text-gray-900">{{ dec.eventId?.actionType
                                                }}</div>
                                            <div class="text-[10px] text-gray-400 uppercase">{{
                                                dec.eventId?.payload?.transactionType || 'N/A' }}</div>
                                        </td>
                                        <td class="px-6 py-4 text-sm font-black text-center"
                                            :class="scoreColor(dec.score)">{{ dec.score }}</td>
                                        <td class="px-6 py-4">
                                            <span :class="decisionStatusStyle(dec.status)"
                                                class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter">
                                                {{ dec.status }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right text-xs font-bold"
                                            :class="getAmountColor(dec.eventId?.payload?.transactionType)">
                                            {{ getDirectionIcon(dec.eventId?.payload?.transactionType) }}
                                            GHS {{ formatNumber(dec.eventId?.payload?.amount ||
                                            dec.eventId?.payload?.send_amount || 0) }}
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <button @click="openDrawer(dec)"
                                                class="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all">
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section v-if="activeTab === 'risk'" class="space-y-6 animate-in fade-in duration-300">

                        <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 class="font-bold text-gray-900 text-sm">Business Registration & Tax</h3>
                                <span class="text-[10px] font-mono text-gray-400 uppercase">TIN:
                                    {{customer.complianceData?.bus_tin || 'N/A' }}</span>
                            </div>
                            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <InfoRow label="Business Type" :value="customer.complianceData?.bus_type"
                                    icon="briefcase" />
                                <InfoRow label="Reg Number" :value="customer.complianceData?.bus_reg_number"
                                    icon="document-text" />
                                <InfoRow label="RGD Status" :value="customer.riskProfile?.rgdStatus"
                                    icon="shield-check" />
                                <InfoRow label="Address" :value="customer.complianceData?.address"
                                    icon="location-marker" class="md:col-span-2" />
                                <InfoRow label="Staff Size" :value="customer.complianceData?.staff_size" icon="users" />
                            </div>
                        </div>

                        <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 class="font-bold text-gray-900 text-sm">Director(s) / Beneficial Owners</h3>
                            </div>
                            <div class="divide-y divide-gray-100">
                                <div v-for="(director, index) in customer.directors" :key="index" class="p-6">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                            Director {{ index + 1 }}</h4>
                                        <span v-if="customer.riskProfile?.isPep"
                                            class="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded uppercase">PEP
                                            Flag</span>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <InfoRow label="Full Name" :value="director.name" />
                                        <InfoRow label="Date of Birth" :value="formatDate(director.dob)" />
                                        <InfoRow label="ID Type" :value="director.id_type" />
                                        <InfoRow label="ID Number" :value="director.id_number"
                                            class="font-mono text-indigo-600" />
                                        <InfoRow label="Issue Date" :value="formatDate(director.card_issue_date)" />
                                        <InfoRow label="Expiry Date" :value="formatDate(director.card_expiry_date)"
                                            :class="isExpired(director.card_expiry_date) ? 'text-rose-600 font-bold' : ''" />

                                        <div v-if="director.photoIDurl" class="md:col-span-2">
                                            <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Identity
                                                Document</p>
                                            <a :href="director.photoIDurl" target="_blank"
                                                class="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                                View Ghana Card Upload
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="!customer.directors?.length"
                                    class="p-10 text-center text-gray-400 text-xs italic">
                                    No director information was captured during registration.
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 class="font-bold text-gray-900 text-sm">Risk Assessment Variables</h3>
                            </div>
                            <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                                <InfoRow label="Origination" :value="customer.riskProfile?.originationMethod" />
                                <InfoRow label="Resident Status" :value="customer.riskProfile?.residencyStatus" />
                                <InfoRow label="Business Purpose" :value="customer.riskProfile?.purpose" />
                                <InfoRow label="Industry Category" :value="customer.riskProfile?.industry" />
                                <InfoRow label="Monthly Target"
                                    :value="`GHS ${formatNumber(customer.riskProfile?.expectedMonthlyVolume || 0)}`" />
                                <InfoRow label="Location Zone" :value="customer.riskProfile?.locationZone" />
                                <InfoRow label="Product Type" :value="customer.riskProfile?.productType" />
                                <InfoRow label="Third Party Oversight"
                                    :value="customer.riskProfile?.thirdPartyOversight" />
                            </div>
                        </div>
                    </section>

                    <section v-if="activeTab === 'alerts'" class="animate-in fade-in duration-300">
                        <CustomerAlertsTab :customerId="customer._id" :businessId="customer.business" />
                    </section>
                </div>
            </div>

            <EventDetailsDrawer :decision="selectedDecision" @close="selectedDecision = null"
                @open-override="isOverrideModalOpen = true" />
            <OverrideModal :isOpen="isOverrideModalOpen" :decisionId="selectedDecision?._id"
                :history="selectedDecision?.manualOverrides" @close="isOverrideModalOpen = false"
                @updated="onDecisionUpdated" />
        </div>

        <div v-else class="h-96 flex flex-col items-center justify-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p class="text-gray-400 font-medium tracking-tight">Accessing Intel Terminal...</p>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Components
import AppLayout from '../layouts/AppLayout.vue';
import MetricItem from '../components/MetricItem.vue';
import InfoRow from '../components/InfoRow.vue';
import EventDetailsDrawer from '../components/EventDetailsDrawer.vue';
import OverrideModal from '../components/OverrideModal.vue';
import CustomerRiskChart from '../components/CustomerRiskChart.vue';
import CustomerAlertsTab from '../components/CustomerAlertsTab.vue'; // New Import

const route = useRoute();
const customer = ref(null);
const history = ref([]);
const activeTab = ref('history');

// UI State
const selectedDecision = ref(null);
const isOverrideModalOpen = ref(false);

// 1. DATA INITIALIZATION
const init = async () => {
    try {
        const { id } = route.params;
        const [custRes, histRes] = await Promise.all([
            axios.get(`/customers/${id}`),
            axios.get(`/customers/${id}/history`)
        ]);
        customer.value = custRes.data.data;
        history.value = histRes.data.data;
    } catch (err) {
        console.error("Critical Load Error:", err);
    }
};

// 2. LOGIC HANDLERS
const openDrawer = (decision) => {
    selectedDecision.value = decision;
};

const onDecisionUpdated = (updatedDecision) => {
    const index = history.value.findIndex(d => d._id === updatedDecision._id);
    if (index !== -1) history.value[index] = updatedDecision;
    selectedDecision.value = updatedDecision;
};

const updateStatus = async (newStatus) => {
    if (!confirm(`Switch entity status to ${newStatus}?`)) return;
    try {
        const res = await axios.patch(`/customers/${customer.value._id}/status`, { status: newStatus });
        customer.value.status = res.data.data.status;
    } catch (err) {
        alert("Status update failed.");
    }
};

// 3. STYLE & VIEW HELPERS
const getAmountColor = (type) => {
    const inbound = ['collection', 'topup'];
    return inbound.includes(type?.toLowerCase()) ? 'text-emerald-600' : 'text-rose-600';
};

const getDirectionIcon = (type) => {
    const inbound = ['collection', 'topup'];
    return inbound.includes(type?.toLowerCase()) ? '+' : '-';
};

const riskBadgeStyle = (level) => {
    // Standardize the level to handle spaces or underscores from the DB
    const normalizedLevel = level?.toUpperCase().replace(/[\s-]/g, '_');

    const map = {
        HIGH: 'bg-rose-50 text-rose-700 border-rose-100',
        MEDIUM_HIGH: 'bg-orange-50 text-orange-700 border-orange-100',
        MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
        LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    return map[normalizedLevel] || 'bg-gray-50 text-gray-500';
};

const decisionStatusStyle = (status) => {
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

const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val);
};

const formatNumber = (num) => {
    return num.toLocaleString('en-GH', { minimumFractionDigits: 2 });
};

// Check if a document is expired
const isExpired = (dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    return expiryDate < new Date(); // Returns true if the date is in the past
};

const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

onMounted(init);
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
    height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>