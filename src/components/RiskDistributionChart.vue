<template>
    <div class="h-64 flex flex-col items-center justify-center">
        <div class="space-y-2 w-full">
            <div v-for="item in data" :key="item.label" class="flex justify-between items-center text-xs">
                <span class="font-bold text-gray-500 uppercase">{{ item.label }}</span>
                <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ item.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['data']);
</script>