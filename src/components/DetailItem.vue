<template>
    <div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{{ label }}</p>
        <p class="text-sm font-semibold text-gray-900 mt-0.5 truncate" :title="value">
            {{ value || '—' }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number]
});
</script>