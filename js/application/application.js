// application.js

import { createMap }
from '../map/map.js';

import {
    initialiseRouteSelection,
    getRoutePoints
}
from '../route/route-selection.js';

// ors (open route service) data
import { getRoute }
from '../ors/ors.js';

import { drawRoute }
from '../route/route-layer.js';

import {
    createRouteModel,
    getCoordinate,
    getSteepnessSegment,
    getCoordinateAtDistance,
    distanceBetweenCoordinates
}
from '../route/route-model.js';

import {
    addEvidence,
    addSteepnessEvidence,
    getEvidenceIntersectingSpan,
    getEvidenceBySource,
    getEvidenceByType,
    getEvidenceTypes,
    getEvidenceSources
}
from '../route/evidence.js';

import { getIntervalAtDistance}
from '../route/route-inspector.js';

// osm (open street map) data
import { 
    getRoadInfo,
    extractRoadInfo
}
from '../osm/osm.js';

import {
    renderSteepnessEvidence,
    clearSteepnessEvidence
}
from '../render/steepness-renderer.js';

import { SteepRoadInferenceNode }
from '../inference/steep-road-inference-node.js';

import { runInference }
from '../inference/inference-engine.js';

import { 
    formatJourneyDistance,
    formatLatitudeLongitude
} 
from '../utils/format.js';

import { processAcquisitionRequests }
from '../acquisition/acquisition-engine.js';

import { logInfo }
from '../log/application-log.js';

import { addMouseMoveListener }
from '../map/map.js';

import { 
    setStatusInferenceEngine,
    setStatusGuidance
} from '../status-bar/status-bar.js';


import { 
    refreshShowPanel,
    refreshEvidenceUi,
    refreshAcquisitionRequestsUi,
} from './side-bar.js';

// set defaults
let route = null;
let dragging = false;    


// initialise application

// ------------------------------------------------------------------
// initialiseApplication()
// ------------------------------------------------------------------

export function initialiseApplication() {

    // map

        const map = createMap();

    // route selection

        initialiseRouteSelection(map, setStatusGuidance);

    // logging

        initialiseLogging();

        // logInfo({message: 'openmatrixproject driverAssist started'});
        // logInfo({message: ''});
        // logInfo({message: 'Click on the map to select journey start + end points, press [Find Route] button and tick steepness checkbox'});

    // status bar

        // initialiseStatusBar();

        setStatusGuidance('Click start point on map');

    // mouse tracking

        // initialiseMouseTracking();

        // add mouse move listener to update status bar with latitude and longitude
        addMouseMoveListener(map);

    // window layout

        // initialiseWindowLayout();

        // add log pane splitter drag functionality
        const splitter =
            document.getElementById(
                'splitter'
            );

        const bottomPane =
            document.getElementById(
                'bottomPane'
            );

        // set initial height of bottom pane from local storage or default to 150px
        bottomPane.style.height =
            localStorage.getItem(
                'bottomPaneHeight'
            ) ?? '150px';

        splitter.addEventListener(
            'mousedown',
            () => {
                dragging = true;
            }    
        );    

        document.addEventListener(
            'mouseup',
            () => {
                dragging = false;
            }    
        );    

        document.addEventListener(
            'mousemove',
            event => {

                if (!dragging) {
                    return;
                }

                const newHeight =
                    Math.max(
                        50,
                        Math.min(
                            800,
                            window.innerHeight -
                            event.clientY
                        )
                    );

                // save new height to local storage
                localStorage.setItem(
                    'bottomPaneHeight',
                    newHeight
                );

                bottomPane.style.height =
                    `${newHeight}px`;
            }
        );

    // application events

        // registerApplicationEvents();

        // route planner button click handler

        document
            .getElementById('btnRoute')
            .addEventListener('click', async () => {
                const { start, end } = getRoutePoints();

                // validate route request
                if (!start || !end) {
                    alert('Please click on journey start and end points.');
                    return;
                }

                const btnRoute = document.getElementById('btnRoute');
                btnRoute.disabled = true;

                try {
                    // request route
                    let logEntry = logInfo({
                        duration: true, 
                        message: `Request: environment.map.route from ${formatLatitudeLongitude(start.lat, start.lng)} to ${formatLatitudeLongitude(end.lat, end.lng)}`
                    });
                    setStatusInferenceEngine('Routing');
                    setStatusGuidance('Finding Route...');
                    const geojson = await getRoute(start, end);
                    logInfo(logEntry);

                    // draw route on map
                    drawRoute(map, geojson);

                    // Build Route Model
                    route = createRouteModel(geojson);

                    // add steepness inference nodes to the route model from the route's coordinate data and add corresponding evidence entries to the route.
                    route.inferenceNodes.push(new SteepRoadInferenceNode());
                    addSteepnessEvidence(route);

                    // run inference
                    setStatusInferenceEngine('Analysing');
                    setStatusGuidance('Acquiring Evidence...');
                    runInference(route);

                    // update side-bar UI with route acquisition requests
                    refreshAcquisitionRequestsUi(route);

                    // acquire additional evidence
                    const plural = route.acquisitionRequests.length === 1 ? '' : 's';
                    logEntry = logInfo({
                        duration: true, 
                        message: `Acquisition: Process ${route.acquisitionRequests.length} request${plural}`
                    });
                    await processAcquisitionRequests(route);
                    logInfo(logEntry);

                    // refresh UI
                    refreshEvidenceUi(route);
                    refreshShowPanel(map, route);

                    console.log(route);

                    // console.table(
                    //     geojson.features[0]
                    //         .properties
                    //         .segments[0]
                    //         .steps
                    // );
                }
                catch (err) {
                    console.error(err);
                    alert('Route request failed.');
                }
                finally {
                    btnRoute.disabled = false;
                    setStatusInferenceEngine('Idle');
                    setStatusGuidance('Click on steepness checkbox then click of steep segment');
                }
            });

}

function initialiseLogging() {

    logInfo({
        message:
            'openmatrixproject driverAssist started.'
    });

    logInfo({
        message: ''
    });

    logInfo({
        message:
            'Click on the map to select the journey start and end points.'
    });
    logInfo({
        message:
            'Press [Find Route].'
    });
    logInfo({
        message:
            'Tick the Steepness checkbox to display gradient colouring.'
    });
}