// locationIq.js

// A simple module to convert a [lat, lng] into a street address.
// Note: You need to set your LOCATIONIQ_API_KEY in the config.js file for this to work.

import { httpRequest}
from '../http/httpRequest.js';

import {
    getEffectiveProvider
}
from '../providers/provider-definitions.js';

export async function getAddressFromLatitudeLongitude(
    lat,
    lng
) {
    try {
        const provider = getEffectiveProvider("locationIq");

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

// from browser geolocation API
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
export async function testProviderConnection() {

    try {
        const provider = getEffectiveProvider("locationIq");

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
