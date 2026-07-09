// application.js

import { createMap }
from '../map/map.js';

import { initialiseRouteSelection }
from '../route/route-selection.js';

import { logInfo }
from '../log/application-log.js';

import { 
    setStatusGuidance,
    updateStatusGuidance
 }
from '../status-bar/status-bar.js';

import { initialiseMouseTracking }
from '../map/map.js';

import { initialiseWindowLayout }
from './window-layout.js';

import { registerApplicationEvents } 
from './application-events.js';

import { 
    getCurrentPosition,
    getAddressFromLatitudeLongitude
 } 
from '../location-services/location-services.js';

import { formatLatitudeLongitude } 
from '../utils/format.js';

import { 
    getRoadInfo,
    extractRoadInfo
}
from '../osm/osm.js';

import { showCurrentLocationOnMap }
from '../map/map.js';

import { testProviderConnections }
from '../providers/provider-definitions.js';

import { showStartupScreen, hideStartupScreen, updateProviderStatus }
from '../startup/startup-screen.js';

export async function initialiseApplication() {

    showStartupScreen();
    initialiseLogging("connectionTests");
    await testAllProviderConnections();
}

export async function continueApplicationStartup() {

    hideStartupScreen();
    
    const map = createMap();

    initialiseRouteSelection(map, setStatusGuidance);
    initialiseLogging('initialiseApplication');
    initialiseStatusBar();
    initialiseMouseTracking(map, updateStatusGuidanceOnMouseMove);
    initialiseWindowLayout();
    registerApplicationEvents(map);

    // Get the current position of the user and show on map
    const position = await getCurrentPosition();
    showCurrentLocationOnMap(map, position);
}

async function testAllProviderConnections() {

    await testProviderConnections(

        result => {

            updateProviderStatus(
                result.providerId,
                result
            );

            logInfo({
                message:
                    `Provider connection test: ${result.providerName} - ${result.success ? 'Success' : 'Failed'} - ${result.message}`
            });

        }

    );
}

function initialiseLogging(phase) {

    switch (phase) {
        case 'connectionTests':
            logInfo({ message: 'openmatrixproject driverAssist' });
            logInfo({ message: '' });
            logInfo({ message: 'Testing provider connections...' });
            break;
        case 'initialiseApplication':
            logInfo({ message: '' });
            logInfo({ message: 'Click on the map to select the journey start and end points.' });
            logInfo({ message: 'Press [Find Route].' });
            logInfo({ message: 'Tick the Steepness checkbox to display gradient colouring.' });
            logInfo({ message: '' });
    }
}

function initialiseStatusBar() {
    setStatusGuidance('Click start point on map');
}

async function updateStatusGuidanceOnMouseMove(lat, lng) {

    let address;

    try {

        address =
            await getAddressFromLatitudeLongitude(
                lat,
                lng
            );

    }
    catch (error) {

        console.error(
            "Address lookup failed: " + formatLatitudeLongitude(lat, lng, 5, false),
            error
        );

        return;
    }

    if (address) {
        setStatusGuidance(address.display_name);

        // add road feature information when this is returned
        updateStatusGuidanceOnMouseMoveWithRoadInfo(lat, lng, address.display_name)
            .then(
                (roads) => {
                    if (roads && roads.length > 0) { 
                        // create an array of distinct non-null road names from roads[].name 
                        const distinctRoadNames = [...new Set(roads.map(road => road.name).filter(name => name))];
                        if (distinctRoadNames.length > 0) {

                            // for each distinct road name, create an array of road names with road.highway, road.incline, road.lanes, road.maxspeed, road.ref appended if non-null, separated by commas, and join the array with a comma and space
                            const detailedRoadInfo = distinctRoadNames.map(name => {
                                const road = roads.find(r => r.name === name);
                                const details = [];
                                if (road.highway) details.push(road.highway);
                                if (road.incline) details.push(road.incline);
                                if (road.lanes) details.push("lanes:" + road.lanes);
                                if (road.maxspeed) details.push(road.maxspeed);
                                if (road.ref) details.push(road.ref);
                                return `${name} (${details.join(", ")})`;
                            });

                            // the mouse may have moved since the request was made, so check if the lat/lng is still the same before updating the status guidance
                            updateStatusGuidance(address.display_name, detailedRoadInfo.join(", "));
                        }
                    }
                },
                (reason) => {
                    // handle thrown exception
                    console.log(reason);
                }
            );
    }
    else {
        setStatusGuidance("No postal address");
    }
}

async function updateStatusGuidanceOnMouseMoveWithRoadInfo(lat, lng, message) {

    let roads = null;

    try {
    
        // road information
        const osmOverpassResponce = await getRoadInfo(lat,lng, false);
        roads = extractRoadInfo(osmOverpassResponce);
    }
    catch (error) {
        console.error(
            "Road information lookup failed: " + formatLatitudeLongitude(lat, lng, 5, false),
            error
        );
    }

    return roads;
}