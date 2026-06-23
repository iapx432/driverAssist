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

            case 'environment.map.road.probe':

                const point =
                getCoordinateAtDistance(
                    route,
                    request.startM
                );

                logInfo({message: `Acquisition: environment.map.road.probe at ${formatJourneyDistance(request.startM, 1)} ${formatLatitudeLongitude(point.lat, point.lng)} Started`});

                const osm =
                    await getRoadInfo(
                        point.lat,
                        point.lng
                    );

                logInfo({message: `Acquisition: environment.map.road.probe at ${formatJourneyDistance(request.startM, 1)} ${formatLatitudeLongitude(point.lat, point.lng)} Completed`});

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
                            'environment.map.road.probe',

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