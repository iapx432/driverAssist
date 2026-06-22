// route-layer.js
// A simple module to manage the route layer on the map.
// This module provides a function to draw the route on the map using GeoJSON data. It also handles removing the existing route layer before drawing a new one to ensure that only one route is displayed at a time.

let routeLayer = null;

export function drawRoute(
    map,
    geojson
) {

    if (routeLayer) {
        map.removeLayer(routeLayer);
    }

    routeLayer = L.geoJSON(
        geojson,
        {
            style: {
                color: '#0066cc',
                weight: 5
            }
        }
    );

    routeLayer.addTo(map);

    map.fitBounds(
        routeLayer.getBounds()
    );
}