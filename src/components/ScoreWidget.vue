<template>
    <div class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
        <span class="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">{{ label }}</span>
        <span class="text-lg font-black tabular-nums leading-none" :class="color">
            {{ value.toFixed(2) }}
        </span>
    </div>
</template>

<script setup>
defineProps(['label', 'value', 'color']);
</script>