// map.js
// A simple wrapper around Leaflet.js to create and manage the map.
// This module provides a function to create a map and handle click events to display coordinates.

import { formatLatitudeLongitude } 
from '../utils/format.js';

import { setStatusCursor, setStatusGuidance }
from '../status-bar/status-bar.js';

import { getAddressFromLatitudeLongitude } 
from '../location-services/location-services.js'

import { distanceBetween } 
from '../geometry/geometry.js';

// limit reverse geocode rate to stay within free quota
let hoverTimeoutId = null;

// only update if location moved
let lastAnalysedPosition = null;

const CURSOR_MOVE_DISTANCE_THRESHOLD = 5;

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

export function initialiseMouseTracking(map) {

    // add mouse move listener to update status bar with latitude and longitude

    map.on(
        'mousemove',
        event => {

            clearTimeout(
                hoverTimeoutId
            );

            hoverTimeoutId = setTimeout(
                async () => {

                    const {
                        lat,
                        lng
                    } =
                        event.latlng;

                    if (
                        lastAnalysedPosition &&
                        distanceBetween(
                            lastAnalysedPosition,
                            event.latlng
                        ) < CURSOR_MOVE_DISTANCE_THRESHOLD
                    ) {
                        return;
                    }

                    lastAnalysedPosition = event.latlng;

                    const address = await getAddressFromLatitudeLongitude(lat, lng);
                    setStatusGuidance(address.display_name);
                    console.log(address);
                },
                500
            );

            const {
                lat,
                lng
            } =
                event.latlng;

            setStatusCursor(formatLatitudeLongitude(lat, lng, 5, false));
        }
    );    
}