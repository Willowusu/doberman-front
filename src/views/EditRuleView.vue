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
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none font-bold">
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
                                class="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-all hover:bg-indigo-100">+
                                Add Condition</button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(condition, index) in conditions" :key="index" class="space-y-2">
                                <div class="flex items-center gap-3">
                                    <select v-model="condition.field"
                                        class="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none">
                                        <optgroup v-for="(fields, group) in fieldOptions" :label="group" :key="group">
                                            <option v-for="f in fields" :value="f.path" :key="f.path">{{ f.label }}
                                            </option>
                                        </optgroup>
                                    </select>

                                    <select v-model="condition.operator"
                                        class="w-32 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-indigo-600 outline-none text-center">
                                        <option value="==">==</option>
                                        <option value="!=">!=</option>
                                        <option value=">">&gt;</option>
                                        <option value="<">&lt;</option>
                                        <option value=">=">&gt;=</option>
                                        <option value="<=">&lt;=</option>
                                        <option value="in">IN ARRAY</option>
                                        <option value="contains_any">CONTAINS</option>
                                        <option value="in_list">IN LIST</option>
                                    </select>

                                    <div class="flex-1 relative">
                                        <div v-if="condition.isComplex"
                                            class="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-amber-700 flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                                                </svg>
                                                <span>ADVANCED: {{ condition.readableValue }}</span>
                                            </div>
                                        </div>

                                        <select v-else-if="condition.operator === 'in_list'" v-model="condition.value"
                                            class="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 text-sm font-black text-indigo-700 outline-none">
                                            <option value="" disabled>Select a System List...</option>
                                            <option v-for="listName in systemLists" :key="listName" :value="listName">{{
        listName }}</option>
                                        </select>

                                        <input v-else v-model="condition.value" type="text"
                                            :placeholder="['in', 'contains_any'].includes(condition.operator) ? 'e.g. Ghana, Nigeria' : 'Value...'"
                                            class="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors">

                                        <div v-if="['in', 'contains_any'].includes(condition.operator)"
                                            class="absolute -bottom-5 left-1 flex items-center gap-1">
                                            <span
                                                class="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Use
                                                commas for multiple values</span>
                                        </div>
                                    </div>

                                    <button @click="removeCondition(index)"
                                        class="p-2.5 text-slate-300 hover:text-rose-500 transition-colors">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div v-if="testResults"
                        class="mt-8 p-6 bg-indigo-900 rounded-[32px] text-white animate-in zoom-in-95 duration-300">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 class="text-sm font-black uppercase tracking-widest text-indigo-300">Simulation
                                    Results</h4>
                                <p class="text-[10px] text-indigo-200 opacity-70">Impact analysis based on last 50
                                    transactions</p>
                            </div>
                            <button @click="testResults = null"
                                class="text-indigo-300 hover:text-white">&times;</button>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-indigo-800/50 p-4 rounded-2xl text-center">
                                <p class="text-[9px] font-bold text-indigo-300 uppercase">Hit Rate</p>
                                <p class="text-2xl font-black">{{ testResults.hitRate }}</p>
                            </div>
                            <div class="bg-indigo-800/50 p-4 rounded-2xl text-center">
                                <p class="text-[9px] font-bold text-indigo-300 uppercase">Total Hits</p>
                                <p class="text-2xl font-black text-rose-400">{{ testResults.totalHits }}</p>
                            </div>
                            <div class="bg-indigo-800/50 p-4 rounded-2xl text-center">
                                <p class="text-[9px] font-bold text-indigo-300 uppercase">Analyzed</p>
                                <p class="text-2xl font-black">{{ testResults.totalChecked }}</p>
                            </div>
                        </div>
                    </div>

                    <section class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">System
                                Action</label>
                            <select v-model="form.action"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white font-bold">
                                <option value="APPROVE">APPROVE</option>
                                <option value="REVIEW">REVIEW</option>
                                <option value="DECLINE">DECLINE</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Score
                                Impact</label>
                            <input v-model.number="form.score" type="number"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-black text-rose-600" />
                        </div>
                    </section>
                </div>

                <div class="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button @click="deleteRule"
                        class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Delete Rule</button>

                    <div class="flex items-center gap-4">
                        <button @click="testRule" :disabled="isTesting"
                            class="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-50 transition-all disabled:opacity-50">
                            {{ isTesting ? 'Testing...' : 'Test Logic' }}
                        </button>
                        <button @click="updateRule" :disabled="isSaving"
                            class="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50">
                            {{ isSaving ? 'Updating...' : 'Save Changes' }}
                        </button>
                    </div>
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
const isTesting = ref(false);
const testResults = ref(null);
const systemLists = ref([]);
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

        { label: "Device ID", path: "deviceId" },

        { label: "Payload Description/Narrative", path: "payload.description" },

        { label: "Is Remittance", path: "internal.isRemittance" }

    ],

    "Financials": [

        { label: "Tx Amount", path: "payload.amount" },

        { label: "Tx Currency", path: "transaction_currency" },

        { label: "Tx Type", path: "transaction_type" },

        { label: "Payment Mode", path: "payment_mode" },

        { label: "Gateway/Provider", path: "payment_provider" }

    ],

    "Velocity & Metrics": [

        { label: "Daily Volume", path: "metrics.currentDayVolume" },

        { label: "3-Month Daily Avg", path: "metrics.threeMonthDailyAvg" },

        { label: "15-Day Sum", path: "metrics.fifteenDaySum" },

        { label: "5-Day Debit Sum", path: "metrics.fiveDayDebitSum" },

        { label: "7-Day Credit Sum", path: "metrics.creditSum7d" },

        { label: "Daily Debit Ratio (0-1)", path: "metrics.dailyDebitRatio" },

        { label: "30-Day Cumulative Sum", path: "metrics.cumulative30d" },

        { label: "Pass-Through Ratio (4h)", path: "metrics.passThroughRatio4h" }

    ],

    "Frequency & Patterns": [

        { label: "Similar Amount Count (5d)", path: "metrics.similarAmountCount5d" },

        { label: "Unique Outbound Accounts (5d)", path: "metrics.uniqueOutboundCount5d" },

        { label: "Unique Senders to Beneficiary (72h)", path: "metrics.uniqueSendersToBeneficiary72h" },

        { label: "Unique Corridors (7d)", path: "metrics.uniqueCorridors7d" },

        { label: "7-Day Frequency Spike", path: "metrics.sevenDayFrequency" }

    ],

    "Customer & Compliance": [

        { label: "Customer Risk Level", path: "customer.riskLevel" },

        { label: "Account Status", path: "customer.status" },

        { label: "Previous Status (Dormancy)", path: "metrics.previousStatus" },

        { label: "Business Type", path: "customer.complianceData.busType" },

        { label: "Account Age (Days)", path: "customer.createdAt" }, // Note: Seeder uses diff_days on this

        { label: "Sender Country (ISO)", path: "actors.senderCountry" },

        { label: "Country Risk Tier", path: "metrics.countryRiskTier" },

        { label: "Conflict Risk Tier", path: "metrics.conflictRiskTier" }

    ],

    "Identity & Intelligence": [

        { label: "User Email", path: "user.userEmail" },

        { label: "User Phone", path: "user.userPhone" },

        { label: "Sanctions Hit", path: "internal.sanctionsHit" },

        { label: "Identity Match Type", path: "internal.identityInfo.matchType" },

        { label: "IP Country Code", path: "enrichedData.ipDetails.countryCode" },

        { label: "Is Proxy/VPN", path: "enrichedData.ipDetails.isProxy" },

        { label: "IP Risk Score", path: "enrichedData.ipDetails.score" }

    ]

};

// --- LOGIC REVERSE PARSER ---
const simplifyLogic = (logic) => {
    if (typeof logic !== 'object' || logic === null) return logic;
    const op = Object.keys(logic)[0];
    const values = logic[op];
    if (op === 'var') return values.split('.').pop();
    if (['*', '/', '+', '-'].includes(op)) {
        return `${simplifyLogic(values[0])} ${op} ${simplifyLogic(values[1])}`;
    }
    return 'Calculated Logic';
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

        let rawLogic = rule.logic;
        if (!rawLogic) return isLoading.value = false;

        let logicArray = [];
        if (rawLogic.and) {
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
            const rawValue = item[operator][1];
            const isComplex = typeof rawValue === 'object' && rawValue !== null && !rawValue.hasOwnProperty('var');

            return {
                field,
                operator,
                value: isComplex ? '' : (Array.isArray(rawValue) ? rawValue.join(', ') : rawValue),
                isComplex,
                readableValue: isComplex ? simplifyLogic(rawValue) : ''
            };
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
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(val) && val.trim() !== '') val = Number(val);

        if (['in', 'contains_any'].includes(c.operator) && typeof val === 'string') {
            val = val.split(',').map(item => item.trim());
        }

        if (c.operator === 'in_list') {
            return { "in_list": [{ "var": c.field }, c.value, { "var": "internal.listHits" }] };
        }
        return { [c.operator]: [{ "var": c.field }, val] };
    });

    if (form.domain && form.domain !== 'ALL') {
        logicArray.push({ "==": [{ "var": "domain" }, form.domain] });
    }
    return logicArray.length > 1 ? { "and": logicArray } : (logicArray[0] || {});
};

const testRule = async () => {
    isTesting.value = true;
    try {
        const res = await axios.post('/rules/test-logic', { logic: buildLogicJson() });
        testResults.value = res.data.data;
    } catch (err) {
        alert("Simulation failed.");
    } finally {
        isTesting.value = false;
    }
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
    try {
        await axios.delete(`/rules/${route.params.id}`);
        router.push('/rules');
    } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
    }
};

const addCondition = () => {
    conditions.value.push({ field: 'payload.amount', operator: '>', value: '', isComplex: false, readableValue: '' });
};

const removeCondition = (index) => {
    if (conditions.value.length > 1) conditions.value.splice(index, 1);
};

const fetchSystemLists = async () => {
    try {
        const res = await axios.post('/get-lists');
        const types = res.data.data.map(l => l.listType);
        systemLists.value = [...new Set(types)];
    } catch (e) {
        console.error("List sync failed");
    }
};

onMounted(() => {
    fetchSystemLists();
    fetchRule();
});
</script>