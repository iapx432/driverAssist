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
from '../http/httpRequest.js';

import { logInfo }
from '../log/application-log.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

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