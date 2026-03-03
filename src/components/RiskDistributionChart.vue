<template>
    <div class="space-y-5 py-2">
        <div v-for="item in sortedData" :key="item.label" class="group">
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                    <div :class="statusColor(item.label).dot" class="w-2 h-2 rounded-full animate-pulse"></div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {{ item.label }} Risk
                    </span>
                </div>
                <span
                    class="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    {{ item.value }}
                </span>
            </div>

            <div class="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                    :class="statusColor(item.label).bar" :style="{ width: `${calculatePercentage(item.value)}%` }">
                    <div class="w-full h-full bg-white/20 opacity-50 italic"></div>
                </div>
            </div>
        </div>

        <div v-if="!data || data.length === 0" class="h-40 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                <ChartBarIcon class="h-6 w-6 text-slate-300" />
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Distribution Data</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChartBarIcon } from '@heroicons/vue/24/outline';

const props = defineProps(['data']);

// Sort data so High Risk is always at the top
const sortedData = computed(() => {
    if (!props.data) return [];
    const order = { 'HIGH': 1, 'MEDIUM-HIGH': 2, 'MEDIUM': 3, 'LOW': 4 };
    return [...props.data].sort((a, b) => (order[a.label] || 99) - (order[b.label] || 99));
});

// Calculate width relative to the highest value in the set
const calculatePercentage = (val) => {
    if (!props.data || props.data.length === 0) return 0;
    const max = Math.max(...props.data.map(i => i.value));
    return max > 0 ? (val / max) * 100 : 0;
};

// Map labels to your RiskGuard color palette
const statusColor = (label) => {
    const colors = {
        'HIGH': {
            bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
            dot: 'bg-rose-500'
        },
        'MEDIUM-HIGH': {
            bar: 'bg-gradient-to-r from-orange-500 to-orange-400',
            dot: 'bg-orange-500'
        },
        'MEDIUM': {
            bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
            dot: 'bg-amber-500'
        },
        'LOW': {
            bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
            dot: 'bg-emerald-500'
        }
    };
    return colors[label] || { bar: 'bg-slate-400', dot: 'bg-slate-400' };
};
</script>