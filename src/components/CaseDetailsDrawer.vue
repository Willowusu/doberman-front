<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
        <div class="w-1/3 bg-white h-full shadow-xl p-6 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Investigation: {{ caseData.caseReference }}</h2>
                <button @click="$emit('close')" class="text-gray-500">✕</button>
            </div>

            <div class="bg-gray-50 p-4 rounded mb-6 border-l-4"
                :class="caseData.severity === 'CRITICAL' ? 'border-red-500' : 'border-orange-500'">
                <div class="text-sm text-gray-500">Total Decision Score</div>
                <div class="text-2xl font-bold">{{ caseData.totalRiskScore }}</div>
            </div>

            <div class="mb-6">
                <h3 class="font-semibold mb-2 text-gray-600 uppercase text-xs">Rules Triggered</h3>
                <div v-for="rule in caseData.triggeredRules" :key="rule.name"
                    class="bg-blue-50 text-blue-800 p-2 rounded mb-2 text-sm">
                    <strong>{{ rule.name }}</strong> (+{{ rule.score }} points)
                </div>
            </div>

            <div class="mt-8 border-t pt-6">
                <label class="block text-sm font-medium mb-2">Investigation Notes</label>
                <textarea v-model="notes" rows="4" class="w-full border rounded p-2 mb-4"
                    placeholder="Enter findings..."></textarea>

                <div class="flex gap-2">
                    <button @click="resolve('RESOLVED')"
                        class="flex-1 bg-green-600 text-white py-2 rounded font-medium">Clear / Resolve</button>
                    <button @click="resolve('REJECTED')"
                        class="flex-1 border border-red-600 text-red-600 py-2 rounded font-medium">Escalate /
                        Reject</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['case']);
const emit = defineEmits(['close', 'updated']);
const notes = ref('');
const caseData = props.case;

const resolve = async (status) => {
    await axios.patch(`/cases/${caseData._id}/resolve`, {
        status,
        resolutionNotes: notes.value
    });
    emit('updated');
    emit('close');
};
</script>