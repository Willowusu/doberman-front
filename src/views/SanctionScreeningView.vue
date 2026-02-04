<template>
    <AppLayout pageTitle="Sanctions Intelligence">
        <div class="max-w-7xl mx-auto space-y-6">

            <section class="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                <div class="relative z-10 space-y-4 max-w-2xl">
                    <h3 class="text-2xl font-black uppercase tracking-tight">Global Watchlist Search</h3>
                    <p class="text-slate-400 text-xs">Cross-reference entities against US OFAC (SDN), UN Security
                        Council, and EU Financial Sanctions lists in real-time.</p>

                    <div class="flex gap-3 pt-4">
                        <div class="relative flex-1">
                            <input v-model="searchQuery" @keyup.enter="performSearch" type="text"
                                placeholder="Enter individual or entity name..."
                                class="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                            <div v-if="isSearching" class="absolute right-4 top-4">
                                <svg class="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <button @click="performSearch"
                            class="bg-indigo-600 hover:bg-indigo-500 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                            Run Screening
                        </button>
                    </div>
                </div>
                <div class="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
            </section>

            <div v-if="results.length > 0" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex justify-between items-center px-4">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matches Detected ({{
                                results.length }})</h4>
                    <span class="text-[9px] font-bold text-gray-400">Similarity Search: PostgREST Trigram Enabled</span>
                </div>

                <div v-for="(entity, index) in results" :key="index"
                    class="bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl hover:border-indigo-100 transition-all group">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <span :class="sourceBadge(entity.source)"
                                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase border">
                                    {{ entity.source }}
                                </span>
                                <h5 class="text-lg font-black text-slate-900">{{ entity.names[0] }}</h5>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <span v-for="alt in entity.names.slice(1)" :key="alt"
                                    class="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 italic">
                                    Alt: {{ alt }}
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-[9px] font-black text-gray-400 uppercase">Internal ID</p>
                                <p class="text-xs font-mono font-bold text-slate-600">{{ entity.source_id }}</p>
                            </div>
                            <button @click="logMatch(entity)"
                                class="bg-slate-50 group-hover:bg-rose-600 group-hover:text-white p-3 rounded-2xl transition-all">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="hasSearched && !isSearching"
                class="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                <div
                    class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h4 class="font-black text-slate-900">No Direct Matches Found</h4>
                <p class="text-xs text-gray-400 mt-2">The entity does not appear on US, UN, or EU primary sanctions
                    lists.</p>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const searchQuery = ref('');
const results = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);

const performSearch = async () => {
    if (!searchQuery.value) return;

    isSearching.value = true;
    hasSearched.value = true;

    try {
        // Calling the trigram similarity endpoint for fuzzy matching
        const response = await axios.get('https://api.sanctions.network/rpc/search_sanctions', {
            params: {
                name: searchQuery.value
            }
        });
        results.value = response.data;

        // Log the search action in our backend audit log
        await axios.post('/audit-logs/manual-screen', {
            query: searchQuery.value,
            resultsFound: results.value.length
        });

    } catch (error) {
        console.error("Sanctions API Error:", error);
    } finally {
        isSearching.value = false;
    }
};

const sourceBadge = (source) => {
    switch (source) {
        case 'ofac': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'unsc': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
        case 'eu': return 'bg-amber-50 text-amber-600 border-amber-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};

const logMatch = async (entity) => {
    if (confirm(`Flag ${entity.names[0]} as a confirmed sanctions match?`)) {
        // Here you would call your backend to block the user or merchant
        console.log("Flagging entity:", entity.source_id);
    }
};
</script>

<style scoped>
.risk-slider {
    @apply w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer;
}
</style>