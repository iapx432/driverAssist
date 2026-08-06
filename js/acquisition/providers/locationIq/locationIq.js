// locationIq.js

// A simple module to convert a [lat, lng] into a street address.

/**
 * @al_entityType Provider
 */

import { httpRequest}
from '../../../http/httpRequest.js';

import {
    getEffectiveProvider
}
from '../../providers/definitions.js';

export const LocationIqProviderId = "locationIq";

/**
 * Gets the address corresponding to the given latitude and longitude.
 *
 * @param {number} lat - The latitude.
 * @param {number} lng - The longitude.
 * @returns {Promise<Object|null>} The address object or null if not found.
 */

export async function getAddressFromLatitudeLongitude(
    lat,
    lng
) {
    try {
        const provider = getEffectiveProvider(LocationIqProviderId);

        const url =
            `${provider.apiUrl}` +
            `?key=${provider.apiKey}` +
            `&lat=${lat}` +
            `&lon=${lng}` +
            `&format=json`;

        const response =  await httpRequest(
            url,
            {
                method: 'GET'
            }
        );

        return response;

    } catch (error) {

        if (error.status === 404) {
            return null;        // no address available
        }

        console.error('Error fetching AddressFromLatitudeLongitude:', error);
        throw error;
    }
}

/**
 * Gets the current position from the browser's geolocation API.
 *
 * @returns {Promise<GeolocationPosition>} The current position from browser geolocation API
 */
 
export async function getCurrentPosition() {

    return new Promise(

        (resolve, reject) => {

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    );
}

/**
 * Tests the connection to the LocationIQ provider.
 *
 * @returns {Promise<Object>} The result of the connection test.
 */

export async function testProviderConnection() {

    try {
        const provider = getEffectiveProvider(LocationIqProviderId);

        const url =
            `${provider.apiUrl}` +
            `?key=${provider.apiKey}` +
            `&lat=51.507595` +          // Tate Modern London
            `&lon=-0.099523` +
            `&format=json`;

        await httpRequest(
            url,
            {
                method: 'GET'
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
