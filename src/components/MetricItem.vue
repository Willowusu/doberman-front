<template>
    <div class="px-8 py-6 flex flex-col items-center md:items-start">
        <span class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
            {{ label }}
        </span>
        <span class="text-xl font-black text-slate-900 tabular-nums">
            {{ value }}
        </span>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number]
});
</script>