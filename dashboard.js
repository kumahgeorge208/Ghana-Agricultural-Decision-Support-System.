/**
 * dashboard.js
 * Coordinates data structures between elements and forces visual updates.
 */

document.addEventListener("DOMContentLoaded", () => {
    triggerGlobalInterfaceRebuild();

    document.addEventListener("fieldbridge:filterChange", () => {
        triggerGlobalInterfaceRebuild();
    });

    const searchInput = document.getElementById("explorer-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderExplorerGrid(e.target.value.toLowerCase());
        });
    }
});

function triggerGlobalInterfaceRebuild() {
    const filters = window.FieldBridgeState;
    
    let filteredRecords = window.FieldBridgeDatabase.filter(row => {
        const matchesYear = (filters.selectedEpoch === "2016-2026" && (row.year === "2026" || row.year === "2021")) ||
                            (filters.selectedEpoch === "2006-2016" && row.year === "2016") ||
                            (filters.selectedEpoch === "1996-2006" && row.year === "2001");
        
        const matchesReg = (filters.selectedRegion === "ALL") || (row.region.toUpperCase() === filters.selectedRegion);
        const matchesSec = (filters.selectedSector === "ALL") || (row.sector === filters.selectedSector);
        
        return matchesYear && matchesReg && matchesSec;
    });

    let totalProd = 0;
    let totalArea = 0;
    let avgYield = 0;

    filteredRecords.forEach(r => {
        totalProd += r.production;
        totalArea += r.area;
    });

    if (totalArea > 0) {
        avgYield = (totalProd / totalArea).toFixed(2);
    } else {
        avgYield = "0.00";
    }

    updateKpiCounter("kpi-total-production", totalProd > 0 ? `${totalProd.toLocaleString()} MT` : "0 MT");
    updateKpiCounter("kpi-total-area", totalArea > 0 ? `${totalArea.toLocaleString()} Ha` : "0 Ha");
    updateKpiCounter("kpi-avg-yield", `${avgYield} MT/Ha`);

    const trendText = document.getElementById("trend-production").querySelector("span");
    if (filters.selectedSector !== "ALL") {
        trendText.textContent = "+3.1%";
        document.getElementById("trend-production").className = "kpi-trend stable";
    } else {
        trendText.textContent = "+14.2%";
        document.getElementById("trend-production").className = "kpi-trend positive";
    }

    renderExplorerGrid("");
    renderRankingsGrid(filteredRecords);
}

function updateKpiCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = "0.3";
        setTimeout(() => {
            element.childNodes[0].nodeValue = value + " ";
            element.style.opacity = "1";
        }, 150);
    }
}

function renderExplorerGrid(searchFilter) {
    const tbody = document.getElementById("explorer-table-body");
    if (!tbody) return;

    const filters = window.FieldBridgeState;
    tbody.innerHTML = "";

    let rows = window.FieldBridgeDatabase.filter(row => {
        const matchesYear = (filters.selectedEpoch === "2016-2026" && (row.year === "2026" || row.year === "2021")) ||
                            (filters.selectedEpoch === "2006-2016" && row.year === "2016") ||
                            (filters.selectedEpoch === "1996-2006" && row.year === "2001");
        const matchesReg = (filters.selectedRegion === "ALL") || (row.region.toUpperCase() === filters.selectedRegion);
        return matchesYear && matchesReg;
    });

    if (searchFilter) {
        rows = rows.filter(r => r.commodity.toLowerCase().includes(searchFilter) || r.region.toLowerCase().includes(searchFilter));
    }

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:gray;">No database parameters match this selection query.</td></tr>`;
        return;
    }

    rows.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.year}</td>
            <td><strong>${r.region} Region</strong></td>
            <td>${r.commodity}</td>
            <td class="font-tabular">${r.area.toLocaleString()}</td>
            <td class="font-tabular">${r.production.toLocaleString()}</td>
            <td class="font-tabular text-bold">${r.yield}</td>
            <td><span class="status-badge ${r.status.includes('Confirmed') ? 'status-verified' : 'status-archived'}">${r.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRankingsGrid(records) {
    const tbody = document.getElementById("rankings-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    
    let dataGroup = {};
    records.forEach(r => {
        if (!dataGroup[r.region]) dataGroup[r.region] = 0;
        dataGroup[r.region] += r.production;
    });

    let sorted = Object.keys(dataGroup).map(key => ({ region: key, val: dataGroup[key] }))
                        .sort((a, b) => b.val - a.val);

    if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No values mapped.</td></tr>`;
        return;
    }

    let grandTotal = sorted.reduce((a, b) => a + b.val, 0);

    sorted.forEach((item, index) => {
        const pct = grandTotal > 0 ? ((item.val / grandTotal) * 100).toFixed(2) : "0.00";
        const tr = document.createElement("tr");
        const rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "";
        
        tr.innerHTML = `
            <td><span class="badge-rank ${rankClass}">${index + 1}</span></td>
            <td><strong>${item.region} Region</strong></td>
            <td class="numeric-column font-tabular">${item.val.toLocaleString()}</td>
            <td class="numeric-column text-bold green-cell">${pct}%</td>
        `;
        tbody.appendChild(tr);
    });
}