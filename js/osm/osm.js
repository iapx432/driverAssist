// osm.js
// A simple module to interact with the Open Street Map API to get road data.
// This module provides functions to get road information around a given coordinate and extract relevant details from the response.
// Note: The Overpass API is used to query OSM data, and it has usage limits. Be mindful of the number of requests you make.
// The getRoadInfo function sends a query to the Overpass API to find roads (highways) within a 20-meter radius of the given latitude and longitude.
// The extractRoadInfo function processes the response from the Overpass API to extract relevant information about the roads, such as the highway type, name, reference, number of lanes, incline, and maximum speed.

import { httpRequest }
from '../http/httpRequest.js';

const OSM_API_URL = 'https://overpass-api.de/api/interpreter';

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

    return await httpRequest(

        OSM_API_URL,
        {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain'},
            body: query
        }
    );
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