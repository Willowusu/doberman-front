<template>
    <AppLayout pageTitle="Create New Rule">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-8 space-y-8">
                    <section class="grid grid-cols-1 gap-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Rule
                                    Name</label>
                                <input v-model="form.name" type="text" placeholder="e.g., High-Value Payout Check"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Domain
                                    Context</label>
                                <select v-model="form.domain"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                    <option value="ALL">All Domains</option>
                                    <option value="PSP">PSP / Collections</option>
                                    <option value="REMITTANCE">Remittance</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label
                                class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                            <textarea v-model="form.description" rows="2"
                                placeholder="Describe the fraud pattern this rule targets..."
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
                        </div>
                    </section>

                    <hr class="border-gray-50" />

                    <section>
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h3 class="font-bold text-gray-900 text-sm">Logic Conditions</h3>
                                <p class="text-xs text-gray-400">Add conditions that must be met to trigger this rule.
                                </p>
                            </div>
                            <button @click="addCondition"
                                class="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100">
                                + Add Condition
                            </button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(condition, index) in conditions" :key="index"
                                class="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative">

                                <select v-model="condition.field"
                                    class="flex-[2] min-w-[200px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <optgroup v-for="(fields, category) in fieldOptions" :key="category"
                                        :label="category">
                                        <option v-for="f in fields" :key="f.path" :value="f.path">{{ f.label }}</option>
                                    </optgroup>
                                </select>

                                <select v-model="condition.operator"
                                    class="flex-1 min-w-[100px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none font-mono font-bold text-indigo-600 text-center">
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="==">==</option>
                                    <option value="!=">!=</option>
                                    <option value="in_list">IN LIST</option>
                                </select>

                                <input v-if="condition.operator !== 'in_list'" v-model="condition.value" type="text"
                                    placeholder="Value"
                                    class="flex-[1.5] min-w-[150px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />

                                <select v-else v-model="condition.value"
                                    class="flex-[1.5] min-w-[150px] bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="BLACKLIST">Blacklist</option>
                                    <option value="SUSPICIOUS_ENTITIES">Suspicious Entities</option>
                                    <option value="HIGH_RISK_COUNTRIES">High Risk Countries</option>
                                </select>

                                <button @click="removeCondition(index)"
                                    class="p-2 text-gray-300 hover:text-rose-500 transition-colors">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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

                    <div class="mt-4 p-4 bg-slate-900 rounded-2xl overflow-hidden">
                        <p class="text-[9px] text-indigo-400 uppercase font-black mb-2 tracking-widest">Live JSONLogic
                            Preview</p>
                        <pre class="text-[10px] text-indigo-200 font-mono opacity-80">{{ buildLogicJson() }}</pre>
                    </div>
                </div>

                <div class="p-8 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-4">
                    <button @click="saveRule" :disabled="isSaving"
                        class="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50">
                        {{ isSaving ? 'Deploying...' : 'Deploy Rule' }}
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout.vue';

const router = useRouter();
const isSaving = ref(false);

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

const conditions = ref([{ field: 'transaction_amount', operator: '>', value: '5000' }]);

const form = reactive({
    name: '',
    description: '',
    domain: 'ALL',
    action: 'REVIEW',
    score: 10
});

const addCondition = () => {
    conditions.value.push({ field: 'transaction_amount', operator: '==', value: '' });
};

const removeCondition = (index) => {
    if (conditions.value.length > 1) conditions.value.splice(index, 1);
};

const buildLogicJson = () => {
    const logicArray = conditions.value.map(c => {
        let val = c.value;
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(val) && val.trim() !== '') val = Number(val);

        if (c.operator === 'in_list') {
            return { "in_list": [{ "var": c.field }, c.value, { "var": "listData" }] };
        }
        return { [c.operator]: [{ "var": c.field }, val] };
    });

    if (form.domain !== 'ALL') {
        logicArray.push({ "==": [{ "var": "domain" }, form.domain] });
    }

    return logicArray.length > 1 ? { "and": logicArray } : logicArray[0];
};

const saveRule = async () => {
    if (!form.name) return alert("Rule name is required");
    isSaving.value = true;
    try {
        const payload = { ...form, logic: buildLogicJson(), isActive: true };
        await axios.post('/rules', payload);
        router.push('/rules');
    } catch (err) {
        alert("Failed to deploy rule.");
    } finally {
        isSaving.value = false;
    }
};
</script>