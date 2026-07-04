/**
 * filters.js
 * Orchestrates event handling and triggers interactive reactive updates.
 */

document.addEventListener("DOMContentLoaded", () => {
    const applyBtn = document.getElementById("btn-apply-filters");
    const resetBtn = document.getElementById("btn-reset-filters");

    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            window.FieldBridgeState.selectedEpoch = document.getElementById("filter-year-interval").value;
            window.FieldBridgeState.selectedRegion = document.getElementById("filter-region").value;
            window.FieldBridgeState.selectedSector = document.getElementById("filter-commodity-type").value;
            
            document.dispatchEvent(new CustomEvent("fieldbridge:filterChange", {
                detail: window.FieldBridgeState
            }));
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.getElementById("filter-year-interval").value = "2016-2026";
            document.getElementById("filter-region").value = "ALL";
            document.getElementById("filter-commodity-type").value = "ALL";
            applyBtn.click();
        });
    }
});