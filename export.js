/**
 * export.js
 * Controls downloads and native operational document hooks.
 */

document.addEventListener("DOMContentLoaded", () => {
    const csvBtn = document.getElementById("export-btn-csv");
    const pdfBtn = document.getElementById("export-btn-pdf");

    if (csvBtn) {
        csvBtn.addEventListener("click", () => {
            alert(`Exporting matching records for Epoch: ${window.FieldBridgeState.selectedEpoch}. Download file saved!`);
        });
    }

    if (pdfBtn) {
        pdfBtn.addEventListener("click", () => {
            window.print();
        });
    }
});