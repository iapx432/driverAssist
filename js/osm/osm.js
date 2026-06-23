// osm.js
// A simple module to interact with the Open Street Map API to get road data.
// This module provides functions to get road information around a given coordinate and extract relevant details from the response.
// Note: The Overpass API is used to query OSM data, and it has usage limits. Be mindful of the number of requests you make.
// The getRoadInfo function sends a query to the Overpass API to find roads (highways) within a 20-meter radius of the given latitude and longitude.
// The extractRoadInfo function processes the response from the Overpass API to extract relevant information about the roads, such as the highway type, name, reference, number of lanes, incline, and maximum speed.

import { httpRequest }
from '../http/httpRequest.js';

import { logInfo }
from '../log/application-log.js';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export async function getRoadInfo(
    lat,
    lng
) {
    const query = `
[out:json][timeout:25];

way(around:20,${lat},${lng})
["highway"];

out tags;
`;

    return await overpassRequest(
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain'},
            body: query
        }
    );
}

async function overpassRequest(
    query
) {

    while (true) {

        try {

            return await httpRequest(
                OVERPASS_URL,
                query
            );

        }
        catch (error) {

            if (
                error.status !== 429
            ) {
                throw error;
            }

            const delayMs =
                await getOverpassRetryDelayMs();

            logInfo({message: `Overpass rate limited. Retrying in ${delayMs / 1000}s`});

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

async function getOverpassRetryDelayMs() {
    const response =
        await fetch(
            'https://overpass-api.de/api/status'
        );

    const text =
        await response.text();

    console.log(text);

    return parseRetryDelayMs(text);
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