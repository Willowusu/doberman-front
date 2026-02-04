<template>
    <div class="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Score Velocity</h3>
            <span class="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Last {{
                series[0].data.length }} Transactions</span>
        </div>

        <apexchart type="area" height="160" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    history: Array
});

// We need to reverse the history because it's usually [newest...oldest] 
// and the chart needs [oldest...newest]
const series = computed(() => [{
    name: 'Risk Score',
    data: [...props.history].reverse().map(d => d.score)
}]);

const chartOptions = computed(() => ({
    chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3, colors: ['#4f46e5'] },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100]
        }
    },
    grid: { show: false },
    xaxis: {
        categories: [...props.history].reverse().map(d => new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })),
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        max: 100,
        min: 0,
        labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    tooltip: {
        theme: 'light',
        x: { show: true },
        y: { title: { formatter: () => 'Score:' } }
    }
}));
</script>