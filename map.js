/**
 * map.js
 * Controls Leaflet map nodes and updates unique regional polygon color schemes on filter interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    let mapInstance = null;
    let geojsonLayer = null;

    // Production configuration mapping spatial coordinates to their respective macro regions
    const regionConfigs = {
        "ASHANTI": {
            coords: [6.75, -1.6],
            color: "#2e5a44",      // Forest Green
            fillColor: "#3d795a",
            name: "Ashanti Region"
        },
        "EASTERN": {
            coords: [6.3, -0.3],
            color: "#1d4ed8",      // Deep Cobalt Blue
            fillColor: "#3b82f6",
            name: "Eastern Region"
        },
        "BONO_EAST": {
            coords: [7.7, -1.0],
            color: "#b27b16",      // Warm Amber Gold
            fillColor: "#e5a93b",
            name: "Bono East Region"
        },
        "NORTHERN": {
            coords: [9.4, -0.8],
            color: "#c2410c",      // Burnt Terracotta Orange
            fillColor: "#ea580c",
            name: "Northern Region"
        },
        "WESTERN_NORTH": {
            coords: [6.3, -2.8],
            color: "#0369a1",      // Ocean Teal
            fillColor: "#0ea5e9",
            name: "Western North Region"
        }
    };

    function initMap() {
        const container = document.getElementById("ghana-choropleth-map");
        if (!container) return;

        // Initialize the Leaflet map view focused centrally on Ghana
        mapInstance = L.map('ghana-choropleth-map', {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([7.9465, -1.0232], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        updateMapHighlights();
    }

    function updateMapHighlights() {
        if (!mapInstance) return;
        
        // Wipe existing layer groups before rendering filtered matrices to prevent duplication memory leaks
        if (geojsonLayer) {
            mapInstance.removeLayer(geojsonLayer);
        }

        geojsonLayer = L.layerGroup();
        const selectedReg = window.FieldBridgeState.selectedRegion;

        Object.keys(regionConfigs).forEach(key => {
            // Render all regions if "ALL" is active, otherwise render only the selected node
            if (selectedReg === "ALL" || selectedReg === key) {
                const config = regionConfigs[key];
                
                // Construct beautiful, uniquely colored vectors representing each region
                L.circle(config.coords, {
                    color: config.color,
                    fillColor: config.fillColor,
                    fillOpacity: 0.55,
                    weight: 3,
                    radius: key === "ASHANTI" || key === "EASTERN" ? 35000 : 25000
                }).bindPopup(`
                    <div style="font-family: 'Inter', sans-serif; color: #0f172a; padding: 2px;">
                        <h4 style="margin: 0 0 4px 0; color: ${config.color}; font-size: 0.95rem;">${config.name}</h4>
                        <p style="margin: 0; font-size: 0.8rem; color: #475569;">Active yield parameters synchronized via MoFA data pipelines.</p>
                    </div>
                `)
                .addTo(geojsonLayer);
            }
        });

        geojsonLayer.addTo(mapInstance);
        
        // Dynamically fly to the focal point if a specific region is queried
        if (selectedReg !== "ALL" && regionConfigs[selectedReg]) {
            mapInstance.flyTo(regionConfigs[selectedReg].coords, 7.5, {
                animate: true,
                duration: 1.2
            });
        } else if (selectedReg === "ALL") {
            mapInstance.setView([7.9465, -1.0232], 6);
        }
    }

    initMap();

    // Re-render and adjust layout when users apply toolbar matrix choices
    document.addEventListener("fieldbridge:filterChange", () => {
        updateMapHighlights();
    });
});