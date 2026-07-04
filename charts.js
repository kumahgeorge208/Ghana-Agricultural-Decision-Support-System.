/**
 * charts.js
 * Instantiates Chart instances and mutates datasets on dynamic updates.
 */

document.addEventListener("DOMContentLoaded", () => {
    let trendChart = null;
    let mixChart = null;
    let regionalChart = null;
    let yieldChart = null;

    // Chart global configuration overrides to look flawless over the background wallpaper
    Chart.defaults.color = '#1e293b';
    Chart.defaults.font.family = "'Inter', sans-serif";

    function initAllCharts() {
        const trendCtx = document.getElementById("chart-production-trends");
        if (trendCtx) {
            trendChart = new Chart(trendCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['1996', '2006', '2016', '2026'],
                    datasets: [{
                        label: 'Tonnage Yield (MT)',
                        data: [12000000, 18500000, 28000000, 34892110],
                        borderColor: '#2e5a44',
                        backgroundColor: 'rgba(46, 90, 68, 0.08)',
                        fill: true,
                        tension: 0.2
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const mixCtx = document.getElementById("chart-commodity-mix");
        if (mixCtx) {
            mixChart = new Chart(mixCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Cereals', 'Roots & Tubers', 'Cash Crops', 'Horticulture'],
                    datasets: [{
                        data: [22, 45, 20, 13],
                        backgroundColor: ['#2e5a44', '#e5a93b', '#10b981', '#2563eb']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const regCtx = document.getElementById("chart-regional-comparison");
        if (regCtx) {
            regionalChart = new Chart(regCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Ashanti', 'Eastern', 'Bono East', 'Northern', 'Western North'],
                    datasets: [{
                        label: 'Output Production (MT)',
                        data: [8421000, 7112500, 5984300, 4120900, 3890200],
                        backgroundColor: 'rgba(61, 121, 90, 0.85)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const yieldCtx = document.getElementById("chart-yield-histogram");
        if (yieldCtx) {
            yieldChart = new Chart(yieldCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['0-2 MT/Ha', '2-5 MT/Ha', '5-10 MT/Ha', '10+ MT/Ha'],
                    datasets: [{
                        label: 'District Densities Count',
                        data: [14, 42, 28, 7],
                        backgroundColor: 'rgba(194, 130, 27, 0.85)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    function applyChartDataFilters(filters) {
        if (!trendChart) return;

        if (filters.selectedSector === "CEREALS") {
            trendChart.data.datasets[0].data = [3000000, 5000000, 8000000, 11000000];
            mixChart.data.datasets[0].data = [100, 0, 0, 0];
        } else if (filters.selectedSector === "ROOTS_TUBERS") {
            trendChart.data.datasets[0].data = [6000000, 9000000, 13000000, 15800000];
            mixChart.data.datasets[0].data = [0, 100, 0, 0];
        } else {
            trendChart.data.datasets[0].data = [12000000, 18500000, 28000000, 34892110];
            mixChart.data.datasets[0].data = [22, 45, 20, 13];
        }

        if (filters.selectedRegion !== "ALL") {
            regionalChart.data.labels = [filters.selectedRegion];
            regionalChart.data.datasets[0].data = [12500000];
        } else {
            regionalChart.data.labels = ['Ashanti', 'Eastern', 'Bono East', 'Northern', 'Western North'];
            regionalChart.data.datasets[0].data = [8421000, 7112500, 5984300, 4120900, 3890200];
        }

        trendChart.update();
        mixChart.update();
        regionalChart.update();
    }

    initAllCharts();

    document.addEventListener("fieldbridge:filterChange", (e) => {
        applyChartDataFilters(e.detail);
    });
});