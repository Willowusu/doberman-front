<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
            <div>
                <h3 class="text-sm font-bold text-gray-900">Precision Monitoring</h3>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest">Stateful tripwires and velocity alerts
                </p>
            </div>
            <button @click="showModal = true"
                class="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Alert
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="alert in alerts" :key="alert._id"
                class="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:border-indigo-100 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="space-y-1">
                        <p class="text-xs font-black text-gray-900 uppercase tracking-tight">{{ alert.name }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span
                                class="text-[8px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-bold uppercase">
                                {{ alert.type || 'SIMPLE' }}
                            </span>
                            <span
                                class="text-[8px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-bold italic">
                                {{ formatDisplayLogic(alert) }}
                            </span>
                        </div>
                    </div>
                    <button @click="handleDelete(alert._id)"
                        class="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <svg v-if="alert.settings.channel === 'EMAIL'" class="w-3 h-3" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M6 15a2 2 0 100 4 2 2 0 000-4zm0 0V6a2 2 0 012-2h6m-8 11h12m-4-4V5a2 2 0 00-2-2H8a2 2 0 00-2 2v8" />
                            </svg>
                        </div>
                        <span class="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">{{
                            alert.settings.recipient }}</span>
                    </div>
                    <p class="text-[9px] text-gray-300 font-bold uppercase">Last Fired: {{ alert.lastFired ?
                        formatDate(alert.lastFired) : 'Never' }}</p>
                </div>
            </div>
        </div>

        <div class="mt-12 space-y-4">
            <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Alert Activity History</h4>
            <div class="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 text-[9px] uppercase font-bold text-gray-400 border-b border-gray-100">
                        <tr>
                            <th class="px-6 py-4">Timestamp</th>
                            <th class="px-6 py-4">Triggered Alert</th>
                            <th class="px-6 py-4">Channel</th>
                            <th class="px-6 py-4 text-right">Value at Trigger</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4 text-[10px] font-mono text-gray-500">{{ formatDate(log.createdAt) }}
                            </td>
                            <td class="px-6 py-4 text-xs font-bold text-gray-900">{{ log.triggerName }}</td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[8px] font-black uppercase">{{
                                    log.channel }}</span>
                            </td>
                            <td class="px-6 py-4 text-right text-xs font-black text-indigo-600">GHS {{
                                log.triggerValue.toLocaleString() }}</td>
                        </tr>
                        <tr v-if="!logs.length">
                            <td colspan="4" class="px-6 py-10 text-center text-gray-300 text-xs italic">No alerts have
                                been recorded for this customer yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Transition name="modal">
            <div v-if="showModal"
                class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                <div class="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden border border-white">
                    <div class="p-8 space-y-8">
                        <header class="flex justify-between items-center">
                            <h4 class="text-xl font-black text-gray-900">New Alert Configuration</h4>
                            <button @click="showModal = false"
                                class="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><svg class="w-5 h-5 text-gray-400"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg></button>
                        </header>

                        <div class="space-y-6">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alert
                                    Title</label>
                                <input v-model="form.name" type="text" placeholder="e.g. Daily Limit Warning"
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>

                            <div class="flex p-1 bg-gray-100 rounded-2xl">
                                <button @click="form.type = 'SIMPLE'"
                                    :class="form.type === 'SIMPLE' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'"
                                    class="flex-1 py-2 text-[10px] font-black rounded-xl transition-all uppercase">Simple
                                    Tripwire</button>
                                <button @click="form.type = 'AGGREGATE'"
                                    :class="form.type === 'AGGREGATE' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'"
                                    class="flex-1 py-2 text-[10px] font-black rounded-xl transition-all uppercase">Behavioral
                                    (Sum/Count)</button>
                            </div>

                            <div v-if="form.type === 'SIMPLE'"
                                class="grid grid-cols-1 md:grid-cols-3 gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <select v-model="form.simple.field"
                                    class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none">
                                    <optgroup label="Financials">
                                        <option value="transaction_amount">Transaction Amount</option>
                                        <option value="transaction_currency">Currency</option>
                                        <option value="payment_mode">Payment Mode (Momo, Card)</option>
                                        <option value="payment_provider">Gateway/Provider</option>
                                    </optgroup>
                                    <optgroup label="Geography">
                                        <option value="sender_country">Sender Country</option>
                                        <option value="receiver_country">Receiver Country</option>
                                        <option value="ipAddress">IP Address</option>
                                    </optgroup>
                                    <optgroup label="Device & Identity">
                                        <option value="deviceId">Device ID (Fingerprint)</option>
                                        <option value="user_email">User Email</option>
                                        <option value="user_phone_number">User Phone</option>
                                    </optgroup>
                                    <optgroup label="Risk Intelligence">
                                        <option value="enrichedData.ipDetails.privacy.is_vpn">Is using VPN</option>
                                        <option value="enrichedData.ipDetails.score">IP Risk Score</option>
                                        <option value="enrichedData.emailDetails.validation_details.disposable">Is
                                            Disposable Email</option>
                                    </optgroup>
                                </select>
                                <select v-model="form.simple.operator"
                                    class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-center">
                                    <option value=">">></option>
                                    <option value="==">is</option>
                                    <option value="!=">is not</option>
                                </select>
                                <input v-model="form.simple.value" type="text" placeholder="Value"
                                    class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none">
                            </div>

                            <div v-if="form.type === 'AGGREGATE'"
                                class="space-y-4 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label
                                            class="text-[9px] font-black text-indigo-400 uppercase">Calculation</label>
                                        <div v-if="form.type === 'AGGREGATE'"
                                            class="space-y-4 p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100">
                                            <div class="grid grid-cols-2 gap-4">
                                                <div class="space-y-1">
                                                    <label
                                                        class="text-[9px] font-black text-indigo-400 uppercase">Metric</label>
                                                    <select v-model="form.aggregate.metric"
                                                        class="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-xs outline-none">
                                                        <option value="SUM">Total Volume (Sum)</option>
                                                        <option value="COUNT">Frequency (Count)</option>
                                                        <option value="DISTINCT_COUNT">Distinct Count (Unique)</option>
                                                    </select>
                                                </div>
                                                <div class="space-y-1">
                                                    <label
                                                        class="text-[9px] font-black text-indigo-400 uppercase">Target
                                                        Field</label>
                                                    <select v-model="form.aggregate.field"
                                                        class="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-xs outline-none">
                                                        <option value="transaction_amount">Transaction Amount</option>
                                                        <option value="deviceId">Device IDs</option>
                                                        <option value="ipAddress">IP Addresses</option>
                                                        <option value="sender_id">Unique Senders</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[9px] font-black text-indigo-400 uppercase">Time
                                            Window</label>
                                        <select v-model="form.aggregate.windowHours"
                                            class="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-xs outline-none">
                                            <option :value="1">Past 1 Hour</option>
                                            <option :value="24">Past 24 Hours</option>
                                            <option :value="168">Past 7 Days</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[9px] font-black text-indigo-400 uppercase">Trigger
                                        Threshold</label>
                                    <input v-model.number="form.aggregate.threshold" type="number"
                                        placeholder="Value to exceed"
                                        class="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-xs outline-none">
                                </div>
                            </div>

                            <div class="space-y-4">
                                <label
                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification
                                    Channel</label>
                                <div class="flex gap-4">
                                    <button v-for="ch in ['EMAIL', 'SLACK']" :key="ch" @click="form.channel = ch"
                                        :class="form.channel === ch ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white border border-gray-200 text-gray-400'"
                                        class="flex-1 py-3 rounded-2xl text-[10px] font-black transition-all">{{ ch
                                        }}</button>
                                </div>
                                <input v-model="form.recipient" type="text"
                                    :placeholder="form.channel === 'EMAIL' ? 'analyst@domain.com' : 'Slack Webhook URL'"
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-[10px] font-mono outline-none">
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <button @click="showModal = false"
                                class="flex-1 py-4 text-xs font-bold text-gray-400">Cancel</button>
                            <button @click="handleSave" :disabled="isSaving"
                                class="flex-[2] py-4 bg-indigo-600 text-white rounded-[20px] text-xs font-black shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                                {{ isSaving ? 'Activating...' : 'Activate Alert' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({ customerId: String, businessId: String });
const alerts = ref([]);
const logs = ref([]);
const showModal = ref(false);
const isSaving = ref(false);

const form = reactive({
    name: '',
    type: 'SIMPLE',
    channel: 'EMAIL',
    recipient: '',
    simple: {
        field: 'transaction_amount',
        operator: '>',
        value: ''
    },
    aggregate: {
        metric: 'SUM',
        field: 'transaction_amount',
        windowHours: 24,
        threshold: null
    }
});

const init = async () => {
    try {
        const [aRes, lRes] = await Promise.all([
            axios.get(`/customers/${props.customerId}/alerts`),
            axios.get(`/customers/${props.customerId}/alert-logs`)
        ]);
        alerts.value = aRes.data.data;
        logs.value = lRes.data.data;
    } catch (e) {
        console.error("Failed to load alerts data");
    }
};

const handleSave = async () => {
    if (!form.name || !form.recipient) return alert("Please fill in all fields");
    isSaving.value = true;

    const payload = {
        name: form.name,
        type: form.type,
        customer: props.customerId,
        business: props.businessId,
        settings: { channel: form.channel, recipient: form.recipient }
    };

    if (form.type === 'SIMPLE') {
        const val = isNaN(form.simple.value) ? form.simple.value : Number(form.simple.value);
        payload.logic = { [form.simple.operator]: [{ "var": form.simple.field }, val] };
    } else {
        payload.aggregation = { ...form.aggregate };
    }

    try {
        await axios.post('/alerts', payload);
        showModal.value = false;
        resetForm();
        init();
    } catch (e) {
        alert("Error creating alert");
    } finally {
        isSaving.value = false;
    }
};

const handleDelete = async (id) => {
    if (confirm('Permanently remove this alert?')) {
        await axios.delete(`/alerts/${id}`);
        init();
    }
};

const resetForm = () => {
    form.name = '';
    form.type = 'SIMPLE';
    form.recipient = '';
    form.simple.value = '';
    form.aggregate.threshold = null;
};

const formatDisplayLogic = (alert) => {
    if (alert.type === 'AGGREGATE') {
        return `${alert.aggregation.metric} over ${alert.aggregation.windowHours}h ≥ ${alert.aggregation.threshold}`;
    }
    const op = Object.keys(alert.logic || {})[0];
    if (!op) return 'Unknown logic';
    return `${alert.logic[op][0].var} ${op} ${alert.logic[op][1]}`;
};

const formatDate = (d) => new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

onMounted(init);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>