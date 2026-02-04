<template>
    <Transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div
                class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 class="font-bold text-gray-900">Manual Resolution</h3>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">

                    <div v-if="history?.length" class="space-y-3">
                        <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Previous
                            Actions</label>
                        <div class="space-y-2">
                            <div v-for="(log, idx) in history.slice(-2)" :key="idx"
                                class="p-3 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden">
                                <div :class="log.status === 'APPROVE' ? 'bg-emerald-500' : 'bg-rose-500'"
                                    class="absolute left-0 top-0 bottom-0 w-1"></div>
                                <div class="flex justify-between text-[10px] mb-1">
                                    <span class="font-bold text-gray-700">{{ log.adminName }}</span>
                                    <span class="text-gray-400">{{ formatDate(log.createdAt) }}</span>
                                </div>
                                <p class="text-[11px] text-gray-500 italic line-clamp-2">"{{ log.reason }}"</p>
                            </div>
                            <p v-if="history.length > 2" class="text-[10px] text-center text-indigo-500 font-medium">+
                                {{ history.length - 2 }} more in history</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Update
                            Verdict</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button @click="form.status = 'APPROVE'"
                                :class="form.status === 'APPROVE' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-50 text-gray-600 border border-gray-200'"
                                class="py-3 rounded-xl font-bold text-sm transition-all">
                                Approve
                            </button>
                            <button @click="form.status = 'DECLINE'"
                                :class="form.status === 'DECLINE' ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-gray-50 text-gray-600 border border-gray-200'"
                                class="py-3 rounded-xl font-bold text-sm transition-all">
                                Decline
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label
                            class="text-[10px] uppercase tracking-widest font-bold text-gray-400">Justification</label>
                        <textarea v-model="form.reason" rows="4" placeholder="Why are you changing this decision?"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                    </div>
                </div>

                <div class="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                    <button @click="$emit('close')" class="px-5 py-2 text-sm font-bold text-gray-400">Cancel</button>
                    <button @click="submitOverride" :disabled="!form.reason || isSubmitting"
                        class="px-8 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 transition-all">
                        {{ isSubmitting ? 'Updating...' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    isOpen: Boolean,
    decisionId: String,
    history: Array // Pass decision.manualOverrides here
});

const emit = defineEmits(['close', 'updated']);
const isSubmitting = ref(false);

const form = reactive({
    status: 'APPROVE',
    reason: ''
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const submitOverride = async () => {
    isSubmitting.value = true;
    try {
        const res = await axios.patch(`/${props.decisionId}/override`, {
            status: form.status,
            overrideReason: form.reason
        });

        emit('updated', res.data.data);
        emit('close');
        form.reason = '';
    } catch (err) {
        alert("Override failed.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>