/**
 * app.js
 * Core central state management engine containing mockup records.
 */

window.FieldBridgeState = {
    selectedEpoch: "2016-2026",
    selectedRegion: "ALL",
    selectedSector: "ALL"
};

// Raw database records simulating MoFA/SRID pipeline outputs
window.FieldBridgeDatabase = [
    { year: "2026", region: "Ashanti", sector: "CEREALS", commodity: "Maize (White)", area: 45000, production: 98000, yield: 2.18, status: "MoFA Confirmed" },
    { year: "2026", region: "Ashanti", sector: "CASH_CROPS", commodity: "Cocoa beans", area: 185000, production: 148000, yield: 0.80, status: "MoFA Confirmed" },
    { year: "2026", region: "Eastern", sector: "HORTICULTURE", commodity: "Pineapple (MD2)", area: 89000, production: 195800, yield: 2.20, status: "MoFA Confirmed" },
    { year: "2026", region: "Eastern", sector: "CASH_CROPS", commodity: "Cocoa beans", area: 120000, production: 91200, yield: 0.76, status: "MoFA Confirmed" },
    { year: "2026", region: "Bono East", sector: "ROOTS_TUBERS", commodity: "Yam Varieties", area: 78000, production: 624000, yield: 8.00, status: "MoFA Confirmed" },
    { year: "2026", region: "Northern", sector: "CEREALS", commodity: "Rice (Granular)", area: 55000, production: 115500, yield: 2.10, status: "MoFA Confirmed" },
    { year: "2026", region: "Western North", sector: "CASH_CROPS", commodity: "Cocoa beans", area: 140000, production: 109200, yield: 0.78, status: "MoFA Confirmed" },
    
    { year: "2016", region: "Ashanti", sector: "CEREALS", commodity: "Maize (White)", area: 41000, production: 82000, yield: 2.00, status: "GSS Reconciled" },
    { year: "2016", region: "Eastern", sector: "HORTICULTURE", commodity: "Sugar-loaf Pineapple", area: 75000, production: 112500, yield: 1.50, status: "GSS Reconciled" },
    { year: "2016", region: "Northern", sector: "CEREALS", commodity: "White Sorghum", area: 98400, production: 118080, yield: 1.20, status: "Historical Record" },
    
    { year: "2001", region: "Ashanti", sector: "ROOTS_TUBERS", commodity: "Cassava Legacy", area: 32000, production: 480000, yield: 15.00, status: "Historical Record" }
];

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupSmoothScrollingLinks();
});

function setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const sidebar = document.querySelector(".enterprise-sidebar");
    if (toggle && sidebar) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
        });
        document.addEventListener("click", () => sidebar.classList.remove("active"));
    }
}

function setupSmoothScrollingLinks() {
    document.querySelectorAll('.sidebar-nav a, .top-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const element = document.querySelector(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    
                    this.closest('ul').querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
}