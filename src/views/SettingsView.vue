<template>
    <AppLayout pageTitle="System Configuration">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20">

            <aside class="w-full md:w-64 space-y-2">
                <div class="p-4 mb-4">
                    <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</h2>
                </div>
                <button v-for="item in navItems" :key="item.id" @click="activeSection = item.id"
                    :class="activeSection === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-gray-500 hover:bg-gray-100'"
                    class="w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between">
                    {{ item.label }}
                    <svg v-if="activeSection === item.id" class="w-3 h-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </aside>

            <main class="flex-1 space-y-6">

                <section v-if="activeSection === 'general'"
                    class="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div class="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-black text-gray-900">Organization</h3>
                            <p class="text-xs text-gray-400">Legal entity and primary contact data.</p>
                        </div>
                        <div
                            class="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase border border-indigo-100">
                            {{ business.planLevel }} Plan
                        </div>
                    </div>
                    <div class="p-8 space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div class="group space-y-2">
                                <label
                                    class="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Business
                                    Name</label>
                                <div class="relative transition-all duration-300">
                                    <input v-model="business.name" type="text"
                                        class="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 outline-none group-focus-within:bg-white group-focus-within:border-indigo-400 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50 shadow-sm transition-all"
                                        placeholder="e.g. Acme Fintech Ltd">
                                </div>
                            </div>

                            <div class="group space-y-2">
                                <label
                                    class="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Primary
                                    Email</label>
                                <div class="relative">
                                    <input v-model="business.email" type="email"
                                        class="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 outline-none group-focus-within:bg-white group-focus-within:border-indigo-400 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50 shadow-sm transition-all"
                                        placeholder="support@acme.com">
                                </div>
                            </div>

                            <div class="group space-y-2">
                                <label
                                    class="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Phone
                                    Number</label>
                                <div class="relative">
                                    <input v-model="business.phone" type="text"
                                        class="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 outline-none group-focus-within:bg-white group-focus-within:border-indigo-400 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50 shadow-sm transition-all"
                                        placeholder="+233 55 000 0000">
                                </div>
                            </div>

                            <div class="group space-y-2">
                                <label
                                    class="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Office
                                    Address</label>
                                <div class="relative">
                                    <input v-model="business.address" type="text"
                                        class="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 outline-none group-focus-within:bg-white group-focus-within:border-indigo-400 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50 shadow-sm transition-all"
                                        placeholder="123 Innovation Drive, Accra">
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <section v-if="activeSection === 'risk'"
                    class="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div class="p-8 border-b border-gray-100">
                        <h3 class="text-xl font-black text-gray-900">Decision Engine</h3>
                        <p class="text-xs text-gray-400">Control automation thresholds and risk sensitivity.</p>
                    </div>
                    <div class="p-8 space-y-10">

                        <div
                            class="flex items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                            <div>
                                <p class="text-sm font-black text-slate-900">Autonomous Blocking</p>
                                <p class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Auto-decline
                                    transactions above high-risk threshold</p>
                            </div>
                            <button @click="business.isAutoDeclineEnabled = !business.isAutoDeclineEnabled"
                                :class="business.isAutoDeclineEnabled ? 'bg-rose-500' : 'bg-gray-300'"
                                class="w-14 h-7 rounded-full relative transition-colors duration-300">
                                <div :class="business.isAutoDeclineEnabled ? 'translate-x-8' : 'translate-x-1'"
                                    class="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm">
                                </div>
                            </button>
                        </div>

                        <div class="space-y-12">
                            <div class="space-y-4">
                                <div class="flex justify-between items-end">
                                    <span class="text-[10px] font-black text-rose-600 uppercase tracking-widest">High
                                        Risk (Decline)</span>
                                    <span class="text-2xl font-black text-slate-900">≥ {{ business.thresholds.decline
                                        }}</span>
                                </div>
                                <input v-model.number="business.thresholds.decline" type="range" min="0" max="100"
                                    class="risk-slider accent-rose-500">
                                <p class="text-[10px] text-gray-400 leading-relaxed">Transactions scoring <span
                                        class="font-bold text-gray-600">{{ business.thresholds.decline }}</span> or
                                    higher will be marked as <span class="text-rose-600 font-bold">DECLINED</span>.</p>
                            </div>

                            <div class="space-y-4">
                                <div class="flex justify-between items-end">
                                    <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest">Medium
                                        Risk (Review)</span>
                                    <span class="text-2xl font-black text-slate-900">≥ {{ business.thresholds.review
                                        }}</span>
                                </div>
                                <input v-model.number="business.thresholds.review" type="range" min="0" max="100"
                                    class="risk-slider accent-amber-500">
                                <p class="text-[10px] text-gray-400 leading-relaxed">Scores between <span
                                        class="font-bold text-gray-600">{{ business.thresholds.review }}</span> and
                                    <span class="font-bold text-gray-600">{{ business.thresholds.decline - 1 }}</span>
                                    enter the manual review queue.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section v-if="activeSection === 'api'"
                    class="bg-white rounded-[40px] border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div class="p-8 border-b border-gray-100">
                        <h3 class="text-xl font-black text-gray-900">Developer Tools</h3>
                        <p class="text-xs text-gray-400">Connect your platform via API and Webhooks.</p>
                    </div>
                    <div class="p-8 space-y-8">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Webhook
                                Endpoint</label>
                            <input v-model="business.webhookUrl" type="url"
                                placeholder="https://your-api.com/webhooks/risk"
                                class="setting-input font-mono text-xs italic">
                            <p class="text-[9px] text-gray-400">We will POST a JSON payload to this URL for every
                                analyzed event.</p>
                        </div>

                        <div class="p-8 bg-slate-900 rounded-[32px] space-y-4 shadow-xl">
                            <div class="flex justify-between items-center">
                                <label class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Secret
                                    API Key</label>
                                <button @click="rotateKey"
                                    class="text-[9px] font-black text-rose-400 uppercase hover:text-rose-300 transition-colors">Rotate
                                    Key</button>
                            </div>
                            <div class="flex gap-3">
                                <input :type="showKey ? 'text' : 'password'" readonly :value="business.apiKey"
                                    class="flex-1 bg-slate-800 border-none text-emerald-400 font-mono text-xs rounded-2xl px-5 py-3 outline-none ring-1 ring-slate-700">
                                <button @click="showKey = !showKey"
                                    class="px-6 py-3 bg-slate-700 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-slate-600 transition-all">
                                    {{ showKey ? 'Hide' : 'Reveal' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="flex justify-end pt-4">
                    <button @click="handleSave" :disabled="isSaving"
                        class="px-14 py-5 bg-indigo-600 text-white rounded-[28px] text-xs font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50">
                        {{ isSaving ? 'Syncing...' : 'Save All Changes' }}
                    </button>
                </div>
            </main>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

// UI State
const activeSection = ref('general');
const isSaving = ref(false);
const showKey = ref(false);

const navItems = [
    { id: 'general', label: 'Organization' },
    { id: 'risk', label: 'Risk & Thresholds' },
    { id: 'api', label: 'API & Webhooks' },
    { id: 'team', label: 'Team Members' }
];

// Data Model (Matches your Mongoose Schema)
const business = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    apiKey: '',
    webhookUrl: '',
    isAutoDeclineEnabled: true,
    planLevel: 'free',
    thresholds: {
        decline: 80,
        review: 30
    }
});

// Load Settings
const fetchSettings = async () => {
    try {
        const res = await axios.get('/settings');
        // Safely update reactive object
        Object.assign(business, res.data.data);
    } catch (e) {
        console.error("Settings Load Error:", e);
    }
};

// Save Settings
const handleSave = async () => {
    if (business.thresholds.review >= business.thresholds.decline) {
        alert("Review threshold must be lower than Decline threshold.");
        return;
    }

    isSaving.value = true;
    try {
        await axios.patch('/settings', business);
        // You could trigger a global notification here
    } catch (e) {
        alert("Update failed. Please check permissions.");
    } finally {
        isSaving.value = false;
    }
};

// Rotate API Key
const rotateKey = async () => {
    if (!confirm("This will invalidate your current key. Integrations will break until updated. Continue?")) return;
    try {
        const res = await axios.post('/settings/rotate-key');
        business.apiKey = res.data.data.apiKey;
    } catch (e) {
        alert("Failed to rotate key.");
    }
};

onMounted(fetchSettings);
</script>

<style scoped>
.setting-input {
    @apply w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-300 outline-none transition-all;
}

.risk-slider {
    @apply w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer transition-all;
}

/* Tooltip/Animation helper */
.animate-in {
    animation-duration: 400ms;
}
</style>