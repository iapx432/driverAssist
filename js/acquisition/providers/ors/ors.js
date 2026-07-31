// ors.js
// A simple module to interact with the Open Route Service API to get route data.
// This module provides a function to get a route between two points, including elevation and steepness data.

import { getEffectiveProvider } from '../../providers/definitions.js';

import { httpRequest} from '../../../http/httpRequest.js';


export const OrsProviderId = "ors";

/**
 * 
 * @param {{lng,lat}} start 
 * @param {{lng,lat}} end 
 * @returns http response from Open Route Service API containing route data between start and end points.
 * 
 * @dal_entityType Provider
 */
export async function getRoute(
    start,
    end
) {
    try {
        const provider = getEffectiveProvider(OrsProviderId);
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


/** 
 * Tests the connection to the Open Route Service API by attempting to fetch a known route.
 * @returns {Promise<Object>} An object containing the success status, HTTP status code, message, and any additional details.
 */
export async function testProviderConnection() {

    try {
        const provider = getEffectiveProvider(OrsProviderId);
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