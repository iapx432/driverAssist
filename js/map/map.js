// map.js
// A simple wrapper around Leaflet.js to create and manage the map.
// This module provides a function to create a map and handle click events to display coordinates.

import { formatLatitudeLongitude } 
from '../utils/format.js';

import { setStatusCursor }
from '../status-bar/status-bar.js';

let hoverTimeoutId = null;

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

    map.on(
        'click', 
        (e) => {
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
        }
    );

    return map;
}

export function addMouseMoveListener(map) {
    map.on(
        'mousemove',
        event => {

            // clearTimeout(
            //     hoverTimeoutId
            // );

            // hoverTimeoutId = setTimeout(
            //     () => {

            //         const {
            //             lat,
            //             lng
            //         } =
            //             event.latlng;

            //         setStatusCursor(formatLatitudeLongitude(lat, lng, 5, false));
            //     },
            //     500
            // );
            const {
                lat,
                lng
            } =
                event.latlng;

            setStatusCursor(formatLatitudeLongitude(lat, lng, 5, false));
        }
    );    
}