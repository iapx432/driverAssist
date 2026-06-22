// map.js
// A simple wrapper around Leaflet.js to create and manage the map.
// This module provides a function to create a map and handle click events to display coordinates.

export function createMap() {

    const map = L.map('map')
        .setView([54.5, -2.5], 6);

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    let marker = null;

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(
                `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            )
            .openPopup();
    });

    return map;
}