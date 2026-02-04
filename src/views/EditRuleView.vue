<template>
    <AppLayout :pageTitle="`Editing Rule: ${form.name}`">
        <div class="max-w-4xl mx-auto">
            <button @click="$router.back()"
                class="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel and Return
            </button>

            <div v-if="isLoading"
                class="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p class="text-gray-400 text-sm">Synchronizing rule logic...</p>
            </div>

            <div v-else class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-8 space-y-8">
                    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Rule
                                Name</label>
                            <input v-model="form.name" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Domain
                                Context</label>
                            <select v-model="form.domain"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                                <option value="ALL">All Domains</option>
                                <option value="PSP">PSP / Collections</option>
                                <option value="REMITTANCE">Remittance</option>
                            </select>
                        </div>
                        <div class="space-y-2 md:col-span-2">
                            <label
                                class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                            <textarea v-model="form.description" rows="2"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                        </div>
                    </section>

                    <hr class="border-gray-50" />

                    <section>
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-gray-900">Logic Conditions</h3>
                            <button @click="addCondition"
                                class="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">+
                                Add Condition</button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(condition, index) in conditions" :key="index"
                                class="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <select v-model="condition.field"
                                    class="flex-[2] min-w-[200px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none">
                                    <optgroup v-for="(fields, category) in fieldOptions" :key="category"
                                        :label="category">
                                        <option v-for="f in fields" :key="f.path" :value="f.path">{{ f.label }}</option>
                                    </optgroup>
                                </select>

                                <select v-model="condition.operator"
                                    class="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-indigo-600">
                                    <option v-for="op in ['>', '<', '==', '!=', 'in_list']" :key="op" :value="op">{{ op
        === 'in_list' ? 'IN LIST' : op }}</option>
                                </select>

                                <input v-if="condition.operator !== 'in_list'" v-model="condition.value" type="text"
                                    class="flex-[1.5] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                                <select v-else v-model="condition.value"
                                    class="flex-[1.5] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none">
                                    <option value="BLACKLIST">Blacklist</option>
                                    <option value="SUSPICIOUS_ENTITIES">Suspicious Entities</option>
                                </select>

                                <button @click="removeCondition(index)"
                                    class="p-2 text-gray-300 hover:text-red-500"><svg class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg></button>
                            </div>
                        </div>
                    </section>

                </div>

                <div class="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button @click="deleteRule"
                        class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Delete Rule</button>
                    <button @click="updateRule" :disabled="isSaving"
                        class="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50">
                        {{ isSaving ? 'Updating...' : 'Save Changes' }}
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const isSaving = ref(false);

const conditions = ref([]);
const form = reactive({
    name: '',
    description: '',
    domain: 'ALL',
    action: 'REVIEW',
    priority: 'low',
    score: 0
});

const fieldOptions = {
    "Event Metadata": [
        { label: "Domain (PSP/REMIT)", path: "domain" },
        { label: "Action Type (TX/REG)", path: "action_type" },
        { label: "IP Address", path: "ipAddress" },
        { label: "Device ID", path: "deviceId" }
    ],
    "Financials": [
        { label: "Tx Amount", path: "transaction_amount" },
        { label: "Tx Currency", path: "transaction_currency" },
        { label: "Tx Type", path: "transaction_type" },
        { label: "Send Amount", path: "send_amount" },
        { label: "Receive Amount", path: "receive_amount" },
        { label: "Payment Mode", path: "payment_mode" },
        { label: "Gateway/Provider", path: "payment_provider" }
    ],
    "Entities & Locations": [
        { label: "Merchant ID", path: "merchant_id" },
        { label: "Station/Branch ID", path: "station_id" },
        { label: "Sender ID", path: "sender_id" },
        { label: "Sender Country", path: "sender_country" },
        { label: "Receiver ID", path: "receiver_id" },
        { label: "Receiver Country", path: "receiver_country" }
    ],
    "Identity Intelligence": [
        { label: "User Email", path: "user_email" },
        { label: "User Phone", path: "user_phone_number" },
        { label: "IP Country Code", path: "enrichedData.ipDetails.country_code" },
        { label: "Is VPN", path: "enrichedData.ipDetails.privacy.is_vpn" },
        { label: "IP Risk Score", path: "enrichedData.ipDetails.score" },
        { label: "Email Disposable", path: "enrichedData.emailDetails.validation_details.disposable" },
        { label: "Phone Valid", path: "enrichedData.phoneDetails.valid" }
    ]
};

const fetchRule = async () => {
    try {
        const { id } = route.params;
        const res = await axios.get(`/rules/${id}`);
        const rule = res.data.data;

        form.name = rule.name;
        form.description = rule.description;
        form.domain = rule.domain || 'ALL';
        form.action = rule.action;
        form.priority = rule.priority;
        form.score = rule.score;

        // DECONSTRUCTION LOGIC
        // We need to handle: single objects, {and: [...]}, and domain filters
        let rawLogic = rule.logic;
        if (!rawLogic) return isLoading.value = false;

        let logicArray = [];
        if (rawLogic.and) {
            // Filter out the domain check so it doesn't show in the conditions list
            logicArray = rawLogic.and.filter(item => {
                const op = Object.keys(item)[0];
                return !(op === '==' && item[op][0].var === 'domain');
            });
        } else {
            logicArray = [rawLogic];
        }

        conditions.value = logicArray.map(item => {
            const operator = Object.keys(item)[0];
            const field = item[operator][0].var;
            const value = item[operator][1];
            return { field, operator, value };
        });

        isLoading.value = false;
    } catch (err) {
        console.error(err);
        router.push('/rules');
    }
};

const buildLogicJson = () => {
    const logicArray = conditions.value.map(c => {
        let val = c.value;
        if (val === 'true' || val === true) val = true;
        else if (val === 'false' || val === false) val = false;
        else if (!isNaN(val) && val !== '') val = Number(val);

        if (c.operator === 'in_list') {
            return { "in_list": [{ "var": c.field }, c.value, { "var": "listData" }] };
        }
        return { [c.operator]: [{ "var": c.field }, val] };
    });

    if (form.domain !== 'ALL') {
        logicArray.push({ "==": [{ "var": "domain" }, form.domain] });
    }

    return logicArray.length > 1 ? { and: logicArray } : logicArray[0];
};

const updateRule = async () => {
    isSaving.value = true;
    try {
        const payload = { ...form, logic: buildLogicJson() };
        await axios.put(`/rules/${route.params.id}`, payload);
        router.push('/rules');
    } catch (err) {
        alert("Update failed.");
    } finally {
        isSaving.value = false;
    }
};

const deleteRule = async () => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`/rules/${route.params.id}`);
    router.push('/rules');
};

const addCondition = () => {
    conditions.value.push({ field: 'transaction_amount', operator: '==', value: '' });
};

const removeCondition = (index) => {
    if (conditions.value.length > 1) conditions.value.splice(index, 1);
};

onMounted(fetchRule);
</script>