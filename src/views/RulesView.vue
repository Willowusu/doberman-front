<template>
    <AppLayout pageTitle="Fraud & Risk Rules">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <p class="text-gray-500 text-sm">Manage the automated logic that protects your business from fraudulent
                    transactions.</p>
            </div>

            <div class="flex items-center space-x-3 w-full md:w-auto">
                <div class="relative flex-1 md:w-64">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input v-model="searchQuery" type="text" placeholder="Search rules..."
                        class="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
                </div>

                <button @click="$router.push('/rules/create')"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Rule
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
            <div v-for="rule in filteredRules" :key="rule._id.$oid"
                class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 transition-all group relative overflow-hidden">
                <div :class="priorityAccent(rule.priority)" class="absolute left-0 top-0 bottom-0 w-1"></div>

                <div class="flex flex-col md:flex-row justify-between gap-6">
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-3 mb-2">
                            <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ rule.name }}</h3>
                            <span :class="priorityClass(rule.priority)"
                                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                {{ rule.priority }}
                            </span>
                            <span
                                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                Score: +{{ rule.score }}
                            </span>
                        </div>

                        <p class="text-sm text-gray-500 mb-5 leading-relaxed max-w-2xl">{{ rule.description }}</p>

                        <div
                            class="inline-flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-2 border border-slate-100">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic:</span>
                            <code class="text-xs text-indigo-600 font-mono font-semibold">
                {{ formatLogicSummary(rule.logic) }}
              </code>
                        </div>
                    </div>

                    <div
                        class="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                        <div class="flex items-center space-x-3">
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-tighter">{{ rule.isActive ?
                                'Active' : 'Paused' }}</span>
                            <button @click="toggleRule(rule)" :class="rule.isActive ? 'bg-indigo-600' : 'bg-gray-200'"
                                class="w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none">
                                <div :class="rule.isActive ? 'translate-x-6' : 'translate-x-1'"
                                    class="absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm">
                                </div>
                            </button>
                        </div>

                        <div class="flex items-center space-x-1">
                            <button @click="goToEdit(rule._id.$oid || rule._id)"
                                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit Rule">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button @click="deleteRule(rule)"
                                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Rule">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredRules.length === 0"
                class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h4 class="text-gray-900 font-bold">No Rules Found</h4>
                <p class="text-gray-400 text-sm mt-1">Try a different search term or create a new fraud rule.</p>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const rules = ref([]);
const searchQuery = ref('');

// Computed filtering logic
const filteredRules = computed(() => {
    if (!searchQuery.value) return rules.value;
    const q = searchQuery.value.toLowerCase();
    return rules.value.filter(rule =>
        rule.name.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q)
    );
});

// Priority Color Schemes
const priorityClass = (p) => {
    switch (p) {
        case 'high': return 'bg-red-50 text-red-700 border border-red-100';
        case 'medium': return 'bg-orange-50 text-orange-700 border border-orange-100';
        default: return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
};

const priorityAccent = (p) => {
    switch (p) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-orange-400';
        default: return 'bg-indigo-500';
    }
};

// Helper to show logic at a glance
const formatLogicSummary = (logic) => {
    if (!logic) return 'No logic defined';
    const mainOp = Object.keys(logic)[0];
    const conditions = logic[mainOp]?.length || 0;
    return `${mainOp.toUpperCase()} (${conditions} condition${conditions !== 1 ? 's' : ''})`;
};

// API Interactions
const fetchRules = async () => {
    try {
        const res = await axios.post('/get-rules');
        rules.value = res.data.data || [];
    } catch (err) {
        console.error("RiskGuard Error: Could not fetch rules", err);
    }
};

const toggleRule = async (rule) => {
    const originalStatus = rule.isActive;
    try {
        rule.isActive = !originalStatus; // Optimistic UI update
        await axios.patch(`/rules/${rule._id.$oid || rule._id}`, {
            isActive: rule.isActive
        });
    } catch (err) {
        rule.isActive = originalStatus; // Revert on failure
        console.error("Could not update rule status", err);
    }
};

const goToEdit = (ruleId) => {
    router.push(`/rules/edit/${ruleId}`);
};

const deleteRule = async (rule) => {
    if (!confirm(`Are you sure you want to delete "${rule.name}"?`)) return;
    try {
        await axios.delete(`/rules/${rule._id.$oid || rule._id}`);
        rules.value = rules.value.filter(r => r._id !== rule._id);
    } catch (err) {
        alert("Failed to delete rule.");
    }
};

onMounted(fetchRules);
</script>