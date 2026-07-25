// maptiler.js

// A simple module to convert a tile coordinate [x, y, z] into a Protocol Buffer.
// where x = tile x coordinate, y = tile y coordinate, z = zoom level

import { httpRequest}
from '../../../http/httpRequest.js';

import { getEffectiveProvider }
from '../definitions.js';

export async function getProtocolBuffer(
    x,
    y,
    z
) {
    try {
        const provider = getEffectiveProvider("maptiler");  

        const url =
            `${provider.apiUrl}` +
            `/${z}` +
            `/${x}` +
            `/${y}` +
            `.pbf` +
            `?key=${provider.apiKey}`;

        const response =  await httpRequest(
            url,
            {
                method: 'GET'
            },
            true  // raw response - don't parse as JSON
        );

        return response;

    } catch (error) {

        if (error.status === 404) {
            return null;        // no address available
        }

        console.error('Error fetching Maptiler Protocol Buffer:', error);
        throw error;
    }
}

export async function testProviderConnection() {

    try {
        await getProtocolBuffer(0, 0, 0);  // test with a known tile coordinate

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
