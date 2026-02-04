<template>
    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
            <div :class="[colorClasses, 'p-3 rounded-2xl']">
                <component :is="iconMap[icon]" class="h-6 w-6" />
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ title }}</span>
        </div>
        <div class="mt-4">
            <h2 class="text-2xl font-black text-gray-900">{{ value }}</h2>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import {
    ChartBarIcon,
    ShieldExclamationIcon,
    BellIcon,
    CpuChipIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
    title: String,
    value: [String, Number],
    icon: String,
    color: String
});

const iconMap = {
    'chart-bar': ChartBarIcon,
    'shield-exclamation': ShieldExclamationIcon,
    'bell': BellIcon,
    'cpu-chip': CpuChipIcon
};

// Safer way to handle Tailwind colors so they don't get purged
const colorClasses = computed(() => {
    const mapping = {
        indigo: 'bg-indigo-50 text-indigo-600',
        rose: 'bg-rose-50 text-rose-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600'
    };
    return mapping[props.color] || 'bg-gray-50 text-gray-600';
});
</script>