<template>
    <div class="flex items-center justify-between py-2 border-b border-gray-50">
        <span class="text-xs text-gray-400 font-medium">{{ label }}</span>
        <span class="text-xs text-gray-800 font-semibold text-right">{{ value || 'N/A' }}</span>
    </div>
</template>

<script setup>
defineProps(['label', 'value']);
</script>