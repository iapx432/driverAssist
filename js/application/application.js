// application.js

import { createMap }
from '../map/map.js';

import { initialiseRouteSelection }
from '../route/route-selection.js';

import { logInfo }
from '../log/application-log.js';

import { setStatusGuidance }
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

import { 
    getRoadInfo,
    extractRoadInfo
}
from '../osm/osm.js';

import { showCurrentLocationOnMap }
from '../map/map.js';

export async function initialiseApplication() {

    const map = createMap();
    initialiseRouteSelection(map, setStatusGuidance);
    initialiseLogging();
    initialiseStatusBar();
    initialiseMouseTracking(map, updateStatusGuidanceOnMouseMove);
    initialiseWindowLayout();
    registerApplicationEvents(map);

    // Get the current position of the user and show on map
    const position = await getCurrentPosition();
    showCurrentLocationOnMap(map, position);
}

function initialiseLogging() {

    logInfo({ message: 'openmatrixproject driverAssist started.' });
    logInfo({ message: '' });
    logInfo({ message: 'Click on the map to select the journey start and end points.' });
    logInfo({ message: 'Press [Find Route].' });
    logInfo({ message: 'Tick the Steepness checkbox to display gradient colouring.' });
    logInfo({ message: '' });
}

function initialiseStatusBar() {
    setStatusGuidance('Click start point on map');
}

async function updateStatusGuidanceOnMouseMove(lat, lng) {

    // street address
    let address = await getAddressFromLatitudeLongitude(lat, lng);

    updateStatusGuidanceOnMouseMoveWithRoadInfo(lat, lng, address.display_name).then(
        roads => {
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

                    setStatusGuidance(address.display_name + " | " + detailedRoadInfo.join(", "));
                }
            }
        }
    )
    
    // address information
    setStatusGuidance(address.display_name);
}

async function updateStatusGuidanceOnMouseMoveWithRoadInfo(lat, lng, message) {

    let roads = null;

    try {
    
        // road information
        const osmOverpassResponce = await getRoadInfo(lat,lng, false);
        roads = extractRoadInfo(osmOverpassResponce);
    }
    catch (error) {

    }

    return roads;
}