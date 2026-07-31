// osm.js
// A simple module to interact with the Open Street Map API to get road data.
// This module provides functions to get road information around a given coordinate and extract relevant details from the response.
// Note: The Overpass API is used to query OSM data, and it has usage limits. Be mindful of the number of requests you make.
// The getRoadInfo function sends a query to the Overpass API to find roads (highways) within a 20-meter radius of the given latitude and longitude.
// The extractRoadInfo function processes the response from the Overpass API to extract relevant information about the roads, such as the highway type, name, reference, number of lanes, incline, and maximum speed.

import { 
    httpRequest,
    HTTP_STATUS_TOO_MANY_REQUESTS,
    HTTP_STATUS_GATEWAY_TIMEOUT
}
from '../../../http/httpRequest.js';

import { logInfo }
from '../../../log/application-log.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Fetches road information from the Open Street Map (OSM) Overpass API for a given latitude and longitude.
 * @param {number} lat - The latitude of the location to query.
 * @param {number} lng - The longitude of the location to query.
 * @param {boolean} [enableLogging=true] - Whether to enable logging of the request and response.
 * @returns {Promise<Object>} The response from the Overpass API.
 */
export async function getRoadInfo(
    lat,
    lng,
    enableLogging = true
) {
    const query = `
[out:json][timeout:25];

way(around:20,${lat},${lng})
["highway"];

out tags;
`;

    const response = await overpassRequest(
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain'},
            body: query
        },
        enableLogging
    );
    return response;
}

/**
 * Sends a request to the Overpass API with the specified query and handles rate limiting and retry logic.
 * @param {Object} query - The query object containing method, headers, and body for the request.
 * @param {boolean} [enableLogging=true] - Whether to enable logging of the request and response.
 * @returns {Promise<Object>} The response from the Overpass API.
 */
async function overpassRequest(
    query,
    enableLogging = true
) {

    while (true) {

        try {

            const response = await httpRequest(
                OVERPASS_URL,
                query
            );

            return response;
        }
        catch (error) {
            let statusDescription = ''; 
            if (
                error.status === HTTP_STATUS_TOO_MANY_REQUESTS
            ) {
                statusDescription = 'rate limited: Too Many Requests';
            } else {
                if (
                    error.status === HTTP_STATUS_GATEWAY_TIMEOUT
                ) {
                    statusDescription = 'request delayed: Gateway Timeout';
                } else {
                    throw error;
                }
            }
            
            const delayMs = await getOverpassRetryDelayMs(enableLogging);

            const logMessage = `Overpass API ${statusDescription}. Retrying in ${delayMs / 1000}s`;
            if (enableLogging) {
                logInfo({ message: logMessage });
            } else {
                console.warn(logMessage);
            }

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        delayMs
                    )
            );
        }
    }
}

/**
 * Retrieves the recommended retry delay from the Overpass API status endpoint.
 * If the status endpoint is unavailable, a fallback delay of 5 seconds is used.
 * @param {boolean} [enableLogging=true] - Whether to enable logging of the request and response.
 * @returns {Promise<number>} The recommended retry delay in milliseconds.
 */
async function getOverpassRetryDelayMs(enableLogging = true) {

    try {

        const response =
            await fetch(
                'https://overpass-api.de/api/status'
            );

        const text =
            await response.text();

        return parseRetryDelayMs(
            text
        );
    }
    catch {
        const logMessage = 'Overpass status unavailable. Using fallback retry delay of 5s';
        if (enableLogging) {
            logInfo({ message: logMessage });
        } else {
            console.warn(logMessage);
        }
        return 5000;
    }
}

/**
 * Parses the Overpass API status text to extract the recommended retry delay in milliseconds.
 * If the status text does not contain a valid delay, a fallback delay of 5 seconds is returned.
 * @param {string} statusText - The status text from the Overpass API.
 * @returns {number} The recommended retry delay in milliseconds.
 */
function parseRetryDelayMs(
    statusText
) {
    const match =
        statusText.match(
            /in (\d+) seconds/
        );

    if (!match) {
        return 5000;
    }

    return (
        Number(match[1]) + 1
    ) * 1000;
}

/**
 * Extracts relevant road information from the response received from the Overpass API.
 * @param {Object} osmResponse - The response object from the Overpass API.
 * @returns {Array<Object>} An array of road information objects, each containing details about a road.
 */
export function extractRoadInfo(
    osmResponse
) {
    const roads =
        osmResponse.elements
            .filter(
                e =>
                    e.type === 'way' &&
                    e.tags?.highway
            )
            .map(
                e => ({
                    wayId: e.id,
                    highway:
                        e.tags.highway,
                    name:
                        e.tags.name ?? null,
                    ref:
                        e.tags.ref ?? null,
                    lanes:
                        e.tags.lanes ?? null,
                    incline:
                        e.tags.incline ?? null,
                    maxspeed:
                        e.tags.maxspeed ?? null
                })
            );

    return roads;
}

/**
 * Tests the connection to the Open Street Map (OSM) Overpass API by attempting to fetch a known tile.
 * @returns {Promise<Object>} An object containing the success status, HTTP status code, message, and any additional details.
 */
export async function testProviderConnection() {

    try {
        const response =
            await fetch(
                'https://overpass-api.de/api/status',
                {
                    method: 'GET',
                    cache: 'no-cache'
                }
            );

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: `HTTP ${response.status}`
            };
        }

        const status = await response.text();

        return {
            success: true,
            status: response.status,
            message: 'Connected',
            details: status
        };

    }
    catch (error) {

        return {
            success: false,
            status: null,
            message: error.message,
            details: null
        };
    }
}