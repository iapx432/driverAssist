// ors.js
// A simple module to interact with the Open Route Service API to get route data.
// This module provides a function to get a route between two points, including elevation and steepness data.
// Note: You need to set your ORS API key in the config.js file for this to work.

import { getEffectiveProvider } from '../providers/provider-definitions.js';

import { httpRequest}
from '../http/httpRequest.js';

const ORS_ROUTE_URL =
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

export async function getRoute(
    start,
    end
) {
    try {
        const provider = getEffectiveProvider("ors");
        const url = provider.profiles.find(profile => profile.id === "driving-car").url;

        const response =  await httpRequest(
            url,
            {
                method: 'POST',
                headers: {
                    Authorization:
                    provider.apiKey,
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

export async function testProviderConnection() {

    try {
        const provider = getEffectiveProvider("ors");
        const url = provider.profiles.find(profile => profile.id === "driving-car").url;

        await httpRequest(
            url,
            {
                method: 'POST',
                headers: {
                    Authorization: provider.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        coordinates: [
                            [8.681495, 49.41461],
                            [8.687872, 49.420318]
                        ]
                    }
                )
            }
        );

        return {
            success: true,
            status: 200,
            message: 'Connected',
            details: null
        };
    }
    catch (error) {

        return {
            success: false,
            status: error.status ?? null,
            message: error.message,
            details: null
        };
    }
}