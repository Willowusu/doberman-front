<template>
    <AppLayout pageTitle="PEP Screening">
        <div class="p-6 max-w-7xl mx-auto">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900">PEP Screening</h1>
                <p class="text-gray-500">Search against the Senzing Politically Exposed Persons (PEP) registry.</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div class="flex gap-4">
                    <div class="relative flex-1">
                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <SearchIcon class="h-5 w-5" />
                        </span>
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Enter full name (e.g. Mahama)"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button @click="handleSearch" :disabled="loading || searchQuery.length < 3"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        <span v-if="loading">Searching...</span>
                        <span v-else>Search PEP List</span>
                    </button>
                </div>
            </div>

            <div v-if="results.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Full Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Country</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="pep in results" :key="pep.recordId" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-gray-900"
                                    v-html="highlightMatch(pep.fullName, searchQuery)"></div>
                                <div class="text-xs text-gray-400">ID: {{ pep.recordId }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {{ pep.category }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-400 text-xs font-mono bg-gray-100 px-1 rounded">{{
                                        pep.country }}</span>
                                    <span class="text-sm text-gray-600">{{ getCountryName(pep.country) }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500 italic">{{ pep.dataSource }}</td>
                            <td class="px-6 py-4 text-right">
                                <button @click="openDetails(pep)"
                                    class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="!loading && searched"
                class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p class="text-gray-500">No Politically Exposed Persons found matching "{{ searchQuery }}"</p>
            </div>
        </div>

        <div v-if="isDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
            <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="isDrawerOpen = false">
            </div>
            <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="w-screen max-w-md bg-white shadow-xl flex flex-col">
                    <div class="p-6 border-b flex justify-between items-center">
                        <h2 class="text-lg font-bold text-gray-900">PEP Entity Details</h2>
                        <button @click="isDrawerOpen = false" class="text-gray-400 hover:text-gray-500">✕</button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-6 space-y-8">
                        <section>
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Biographic Info
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs text-gray-500">Record Type</label>
                                    <p class="text-sm font-medium">{{ selectedPep.recordType }}</p>
                                </div>
                                <div v-if="selectedPep.aliases?.length">
                                    <label class="text-xs text-gray-500">Aliases / Other Names</label>
                                    <ul class="text-sm list-disc pl-4">
                                        <li v-for="alias in selectedPep.aliases" :key="alias">{{ alias }}</li>
                                    </ul>
                                </div>
                                <div v-if="selectedPep.dates?.length">
                                    <label class="text-xs text-gray-500">Important Dates</label>
                                    <div v-for="d in selectedPep.dates" :key="d" class="text-sm">
                                        {{ d.DATE_OF_BIRTH || d.REGISTRATION_DATE }} <span
                                            class="text-xs text-gray-400">(DOB/Reg)</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section v-if="selectedPep.addresses?.length">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Addresses /
                                Locations</h3>
                            <div v-for="(addr, i) in selectedPep.addresses" :key="i"
                                class="p-3 bg-gray-50 rounded-lg text-sm mb-2">
                                {{ addr.ADDR_FULL || addr.PLACE_OF_BIRTH }}
                                <div class="text-xs text-blue-500 mt-1">{{ addr.ADDR_TYPE || 'Birth Place' }}</div>
                            </div>
                        </section>

                        <section>
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">External
                                Verification</h3>
                            <div class="space-y-2">
                                <a v-for="link in selectedPep.sourceLinks" :key="link.SOURCE_URL"
                                    :href="link.SOURCE_URL" target="_blank"
                                    class="block text-xs text-blue-600 truncate hover:underline border-l-2 border-blue-200 pl-2">
                                    {{ link.SOURCE_URL }}
                                </a>
                                <a :href="selectedPep.url" target="_blank"
                                    class="block text-sm font-bold text-purple-700 mt-4 underline">
                                    View Full OpenSanctions Profile ↗
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';
import { SearchIcon } from 'lucide-vue-next';
import { getCountryName } from '../utils/countryMapper';

const searchQuery = ref('');
const loading = ref(false);
const searched = ref(false);
const results = ref([]);

// Drawer State
const isDrawerOpen = ref(false);
const selectedPep = ref(null);

const handleSearch = async () => {
    if (searchQuery.value.length < 3) return;
    loading.value = true;
    searched.value = true;
    try {
        const response = await axios.get(`/pep/search`, {
            params: { name: searchQuery.value }
        });
        results.value = response.data.data.results;
    } catch (error) {
        console.error("PEP Search failed", error);
    } finally {
        loading.value = false;
    }
};

const openDetails = (pep) => {
    selectedPep.value = pep;
    isDrawerOpen.value = true;
};

const highlightMatch = (text, query) => {
    if (!query) return text;
    const tokens = query.split(/\s+/).filter(t => t.length > 0);
    let highlighted = text;

    tokens.forEach(token => {
        const regex = new RegExp(`(${token})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    return highlighted;
};
</script>