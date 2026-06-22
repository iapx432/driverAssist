// ors.js
// A simple module to interact with the Open Route Service API to get route data.
// This module provides a function to get a route between two points, including elevation and steepness data.
// Note: You need to set your ORS API key in the config.js file for this to work.

import { ORS_API_KEY }
from '../config.js';

import { httpRequest}
from '../http/httpRequest.js';

const ORS_ROUTE_URL =
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

export async function getRoute(
    start,
    end
) {
    try {

        const response =  await httpRequest(
            ORS_ROUTE_URL,
            {
                method: 'POST',
                headers: {
                    Authorization:
                    ORS_API_KEY,
                    'Content-Type':
                    'application/json'
                },
                body: JSON.stringify({
                    coordinates: [
                        [start.lng, start.lat],
                        [end.lng, end.lat]
                    ],
                    elevation: true,
                    extra_info: [
                        'steepness'
                    ]
                })
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching route:', error);
        throw error;
    }
}
