import { testProviderConnection as testOsmConnection }
from '../osm/osm.js';

import { testProviderConnection as testOrsConnection }
from '../ors/ors.js';

import { testProviderConnection as testLocationIqConnection }
from '../location-services/location-services.js';

import {
    getProviderApiKey
}
from '../settings/settings.js';

export const providers = [
    {
        "id": "ors",
        "name": "OpenRouteService",
        "description": "OpenRouteService is an OpenStreetMap based service that provides directions and route planning for various modes of transportation.",
        "documentation": [
            {
                "wiki": "https://openrouteservice.org/docs"
            }
        ],
        "apiUrl": "https://api.openrouteservice.org/v2/directions",
        "apiKey": "",
        "requireAtStartup": true,
        "connectionTestFunction": testOrsConnection,
        "registrationUrl": "https://api.openrouteservice.org/",
        "requiresApiKey": true,
        "websites": [
            {
                "description": "Main OpenRouteService website",
                "url": "https://openrouteservice.org/"
            }
        ],
        "profiles": [
            {
                "id": "driving-car",
                "url": "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                "name": "Driving Car",
                "description": "Optimized for car travel, avoiding unpaved roads and ferries."
            },
            {
                "id": "driving-hgv",
                "url": "https://api.openrouteservice.org/v2/directions/driving-hgv/geojson",
                "name": "Heavy Goods Vehicle",
                "description": "Optimized for heavy goods vehicles with size/weight restrictions."
            }

            /*  profiles available from OpenRouteService:

                driving-car: Standard car routing
                driving-hgv: Heavy goods vehicles with size/weight restrictions
                cycling-regular: Standard bicycle routing
                cycling-mountain: Mountain biking with preference for suitable trails
                cycling-road: Road cycling optimized for paved surfaces
                cycling-electric: Electric bicycles with adjusted climbing capabilities
                foot-walking: Pedestrian routing
                foot-hiking: Hiking with consideration for trails and paths
                wheelchair: Wheelchair routing with accessibility considerations
                public-transport: Public transportation routing (where data is available)            
            */

        ],
        "displayOrder": 0
    },
    {
        "id": "locationIq",
        "name": "LocationIQ",
        "description": "LocationIQ is a geocoding service that provides forward and reverse geocoding, as well as other location-based services.",
        "documentation": [
            {
                "wiki": "https://locationiq.com/docs"
            }
        ],
        "apiUrl": "https://us1.locationiq.com/v1/reverse",
        "apiKey": "",
        "requireAtStartup": true,
        "connectionTestFunction": testLocationIqConnection,
        "requiresApiKey": true,
        "registrationUrl": "https://my.locationiq.com/register",
        "websites": [
            {
                "description": "Main LocationIQ website",
                "url": "https://locationiq.com/"
            }
        ],
        "displayOrder": 1
    },
    {
        "id": "osm",
        "name": "OpenStreetMap",
        "description": "OpenStreetMap is a collaborative project to create a free editable map of the world.",
        "documentation": [
            {
                "wiki": "https://wiki.openstreetmap.org/wiki/Overpass_API"
            }
        ],
        "apiUrl": "https://overpass-api.de/api/interpreter",
        "apiKey": "",
        "requireAtStartup": false,
        "connectionTestFunction": testOsmConnection,
        "requiresApiKey": false,
        "websites": [
            {
                "description": "Main OpenStreetMap website",
                "url": "https://www.openstreetmap.org/"
            },
            {
                "description": "Overpass Turbo query tool",
                "url": "https://overpass-turbo.eu/"
            }
        ],
        "displayOrder": 2
    }
];

export async function testProviderConnections(
    onProviderCompleted
) {
    const results = [];

    for (const provider of providers) {
        let resultStatus;

        try {
            const result =
                await provider.connectionTestFunction();

            resultStatus = {
                providerId: provider.id,
                providerName: provider.name,
                ...result
            };

        }
        catch (error) {
            resultStatus = {
                providerId: provider.id,
                providerName: provider.name,
                success: false,
                message: error.message
            };

        }

        onProviderCompleted(
            resultStatus
        );

        results.push(
            resultStatus
        );
    }
    return results;
}

export function getProvider(
    providerId
) {
    return providers.find(
        provider => provider.id === providerId
    );
}


export function getEffectiveProvider(
    providerId
) {
    const provider = {
        ...getProvider(providerId)
    };

    if (provider.requiresApiKey) {
        provider.apiKey =
            getProviderApiKey(
                providerId
            );
    }

    return provider;
}
