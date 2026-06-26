// route-selection.js
// A simple module to handle route selection on the map.
// This module allows users to click on the map to select a start and end point for their route. It manages the state of the selected points and updates the map with markers for the start and end locations. If both points are already selected, clicking on the map will reset the selection and allow the user to choose new points.
// The initialiseRouteSelection function sets up a click event listener on the map to handle the selection of start and end points. The getRoutePoints function returns the currently selected start and end points.
// Note: The current implementation uses hardcoded coordinates for the start and end points when the user clicks on the map for the first and second time, respectively. This is for testing purposes and should be replaced with the actual clicked coordinates in a production environment.

let startMarker = null;
let endMarker = null;

let startPoint = null;
let endPoint = null;

export function initialiseRouteSelection(map, setStatusGuidance) {

    map.on('click', (e) => {

        let { lat, lng } = e.latlng;

        if (!startPoint) {

            // lat = 54.482057;
            // lng = -0.620899;
            startPoint = { lat, lng };

            startMarker = L.marker(
                [lat, lng]
            ).addTo(map);

            startMarker.bindPopup(
                'Journey Start'
            );

            setStatusGuidance('Click end point on map');
            return;
        }

        if (!endPoint) {

            // lat = 54.306509;
            // lng = -0.696259;
            endPoint = { lat, lng };

            endMarker = L.marker(
                [lat, lng]
            ).addTo(map);

            endMarker.bindPopup(
                'Journey End'
            );

            setStatusGuidance('Press [Find Route] button to request the route or click on a new start point');
            return;
        }

        if (startMarker) {
            map.removeLayer(startMarker);
        }

        if (endMarker) {
            map.removeLayer(endMarker);
        }

        startMarker = null;
        endMarker = null;

        startPoint = {
            lat,
            lng
        };

        endPoint = null;

        startMarker = L.marker(
            [lat, lng]
        ).addTo(map);

        startMarker.bindPopup(
            'Journey Start'
        );
    });
}

export function getRoutePoints() {

    return {
        start: startPoint,
        end: endPoint
    };
}