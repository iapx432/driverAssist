// maptiler.js

// A simple module to convert a tile coordinate [x, y, z] into a Protocol Buffer.
// where x = tile x coordinate, y = tile y coordinate, z = zoom level

import { httpRequest}
from '../../../http/httpRequest.js';

import { getEffectiveProvider }
from '../definitions.js';

export const MapTilerProviderId = "maptiler";

/**
 * Fetches the Protocol Buffer data for a specific tile coordinate from the MapTiler API.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 * @param {number} z - The zoom level of the tile.
 * @returns {Promise<Uint8Array|null>} The Protocol Buffer data for the tile, or null if not found.
 */
export async function getProtocolBuffer(
    x,
    y,
    z
) {
    try {
        const provider = getEffectiveProvider(MapTilerProviderId);

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

/**
 * Tests the connection to the MapTiler API by attempting to fetch a known tile.
 * @returns {Promise<Object>} An object containing the success status, HTTP status code, message, and any additional details.
 */
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
