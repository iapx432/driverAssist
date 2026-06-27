import { getRoutePoints } 
from "../route/route-selection.js";

import { logInfo }
from '../log/application-log.js';

import { 
    formatJourneyDistance,
    formatLatitudeLongitude
} 
from '../utils/format.js';

import { 
    setStatusInferenceEngine,
    setStatusGuidance
} from '../status-bar/status-bar.js';

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

import { SteepRoadInferenceNode }
from '../inference/steep-road-inference-node.js';

import { runInference }
from '../inference/inference-engine.js';

import { processAcquisitionRequests }
from '../acquisition/acquisition-engine.js';

import { 
    refreshShowPanel,
    refreshEvidenceUi,
    refreshAcquisitionRequestsUi,
} from './side-bar.js';

// set defaults
let route = null;
let dragging = false;    


export function registerApplicationEvents(map) {

    // add log pane splitter drag functionality
    const splitter =
        document.getElementById(
            'splitter'
        );

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
