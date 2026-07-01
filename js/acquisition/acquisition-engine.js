import {
    getCoordinateAtDistance
}
from '../route/route-model.js';

import { 
    getRoadInfo,
    extractRoadInfo
}
from '../osm/osm.js';

import {
    addEvidence
}
from '../route/evidence.js';

import { logInfo }
from '../log/application-log.js';

import { 
    formatJourneyDistance,
    formatLatitudeLongitude
} 
from '../utils/format.js';

// this is a brittle imlementation, later requests will be sent to the domain handlers they are intended for, rather than being processed here in the acquisition engine. This is a temporary solution to get the acquisition engine working with the current code structure.
// the domain handlers will decide how to fulful the requests and choose sources according to policies they implement.

export const providers = [
    {
        "id": "openStreetMap",
        "name": "OpenStreetMap",
        "requiresApiKey": false
    },
    {
        "id": "ors",
        "name": "OpenRouteService",
        "requiresApiKey": true,
        "registrationUrl": "https://api.openrouteservice.org/",
        "test": "testOrsConnection"
    },
    {
        "id": "locationIq",
        "name": "LocationIQ",
        "requiresApiKey": true,
        "registrationUrl": "https://my.locationiq.com/register",
        "test": "testLocationIqConnection"
    }
];

export async function processAcquisitionRequests(
    route
) {

    for (
        const request
        of route.acquisitionRequests
    ) {

        switch (
            request.type
        ) {

            case 'environment.map.road.features':

                const point =
                getCoordinateAtDistance(
                    route,
                    request.startM
                );

                const logEntry = logInfo({
                    duration: true, 
                    message: `Acquisition: environment.map.road.features at ${formatJourneyDistance(request.startM, 1)} ${formatLatitudeLongitude(point.lat, point.lng)}`
                });

                const osm =
                    await getRoadInfo(
                        point.lat,
                        point.lng
                    );

                // log the acquisition request finishing with the duration of the request
                logInfo(logEntry);

                const roads =
                    extractRoadInfo(
                        osm
                    );

                addEvidence(
                    route,
                    {
                        id:
                            crypto.randomUUID(),

                        source:
                            'osm',

                        type:
                            'environment.map.road.features',

                        startM:
                            point.distanceM,

                        endM:
                            point.distanceM,

                        roads
                    }
                );

                break;
        }
    }
}