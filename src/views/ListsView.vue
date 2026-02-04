<template>
    <AppLayout pageTitle="Watchlists">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <p class="text-gray-500 text-sm">Centrally manage blocked or trusted entities to power your risk engine.
                </p>
            </div>
            <button @click="showAddModal = true"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center active:scale-95">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add New Entry
            </button>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div class="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit">
                <button v-for="tab in ['BLACKLIST', 'WHITELIST']" :key="tab" @click="activeTab = tab"
                    :class="[activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
                    class="px-6 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest">
                    {{ tab }}
                </button>
            </div>

            <div class="relative w-full md:w-80">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input v-model="searchQuery" type="text" placeholder="Search by value or reason..."
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm" />
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Entity
                                Value</th>
                            <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Type
                            </th>
                            <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Reason
                            </th>
                            <th class="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Created
                            </th>
                            <th class="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="item in filteredItems" :key="item._id.$oid || item._id"
                            class="hover:bg-gray-50/80 transition-colors group">
                            <td class="px-6 py-4">
                                <span
                                    class="font-mono text-sm font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100 italic">
                                    {{ item.value }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
                                    {{ item.entityType }}
                                </span>
                            </td>
                            <td class="px-6 py-4 max-w-sm">
                                <p class="text-xs text-gray-500 leading-relaxed truncate" :title="item.reason">
                                    {{ item.reason }}
                                </p>
                            </td>
                            <td class="px-6 py-4 text-[11px] text-gray-400 font-medium">
                                {{ formatDate(item.createdAt).date }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button @click="deleteEntry(item)"
                                    class="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredItems.length === 0">
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center">
                                    <div
                                        class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <svg class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p class="text-gray-400 italic text-sm">No entries match your criteria.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="showAddModal"
                class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div
                    class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 class="font-bold text-gray-900 text-lg tracking-tight">Add Watchlist Entry</h3>
                        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-8 space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">List
                                    Type</label>
                                <select v-model="newItem.listType"
                                    class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="BLACKLIST">Blacklist</option>
                                    <option value="WHITELIST">Whitelist</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Entity
                                    Type</label>
                                <select v-model="newItem.entityType"
                                    class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="ip">IP Address</option>
                                    <option value="email">Email Address</option>
                                    <option value="phone">Phone Number</option>
                                    <option value="deviceId">Device ID</option>
                                    <option value="cardHash">Card Hash</option>
                                    <option value="phone">Phone Number</option>
                                    <option value="userId">User ID</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Value</label>
                            <input v-model="newItem.value" type="text" :placeholder="placeholderText"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Reason</label>
                            <textarea v-model="newItem.reason" rows="3" placeholder="Provide context for this entry..."
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                        </div>
                    </div>

                    <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                        <button @click="closeModal"
                            class="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                        <button @click="saveEntry" :disabled="isSaving || !isFormValid"
                            class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all">
                            {{ isSaving ? 'Saving...' : 'Add to List' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

// State
const listItems = ref([]);
const activeTab = ref('BLACKLIST');
const searchQuery = ref('');
const showAddModal = ref(false);
const isSaving = ref(false);

const newItem = reactive({
    listType: 'BLACKLIST',
    entityType: 'ip',
    value: '',
    reason: ''
});

// Computed Logic
const placeholderText = computed(() => {
    const map = { ip: '1.2.3.4', email: 'user@domain.com', phone: '233XXXXXXXXX' };
    return `e.g. ${map[newItem.entityType]}`;
});

const isFormValid = computed(() => {
    return newItem.value.trim().length > 3 && newItem.reason.trim().length > 5;
});

const filteredItems = computed(() => {
    return listItems.value.filter(item => {
        const matchesTab = item.listType === activeTab.value;
        const q = searchQuery.value.toLowerCase();
        const matchesSearch = !q || item.value.toLowerCase().includes(q) || item.reason.toLowerCase().includes(q);
        return matchesTab && matchesSearch;
    });
});

// Methods
const formatDate = (isoString) => {
    // Split the string at the 'T' separator
    const [datePart, timeWithExtras] = isoString.split('T');

    // Extract just the first 5 characters (HH:mm) from the time part
    const timePart = timeWithExtras.slice(0, 5);

    return {
        date: datePart, // "2026-01-15"
        time: timePart  // "03:15"
    };
}

const fetchLists = async () => {
    try {
        const res = await axios.post('/get-lists');
        listItems.value = res.data.data || [];
    } catch (err) {
        console.error("RiskGuard Error: Could not fetch watchlists", err);
    }
};

const saveEntry = async () => {
    isSaving.value = true;
    try {
        const res = await axios.post('/lists', newItem);
        listItems.value.unshift(res.data.data);
        closeModal();
    } catch (err) {
        alert("Error: " + (err.response?.data?.message || "Could not save entry"));
    } finally {
        isSaving.value = false;
    }
};

const deleteEntry = async (item) => {
    if (!confirm(`Remove ${item.value} from the ${item.listType}?`)) return;
    try {
        await axios.delete(`/api/lists/${item._id.$oid || item._id}`);
        listItems.value = listItems.value.filter(i => i._id !== item._id && i._id.$oid !== item._id.$oid);
    } catch (err) {
        alert("Failed to delete entry.");
    }
};

const closeModal = () => {
    showAddModal.value = false;
    newItem.value = '';
    newItem.reason = '';
};

onMounted(fetchLists);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>