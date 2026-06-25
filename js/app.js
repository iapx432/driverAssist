import { createMap }
from './map/map.js';

import {
    initialiseRouteSelection,
    getRoutePoints
}
from './route/route-selection.js';

// ors (open route service) data
import { getRoute }
from './ors/ors.js';

import { drawRoute }
from './route/route-layer.js';

import {
    createRouteModel,
    getCoordinate,
    getSteepnessSegment,
    getCoordinateAtDistance,
    distanceBetweenCoordinates
}
from './route/route-model.js';

import {
    addEvidence,
    addSteepnessEvidence,
    getEvidenceIntersectingSpan,
    getEvidenceBySource,
    getEvidenceByType,
    getEvidenceTypes,
    getEvidenceSources
}
from './route/evidence.js';

import { getIntervalAtDistance}
from './route/route-inspector.js';

// osm (open street map) data
import { 
    getRoadInfo,
    extractRoadInfo
}
from './osm/osm.js';

import {
    renderSteepnessEvidence,
    clearSteepnessEvidence
}
from './render/steepness-renderer.js';

import { SteepRoadInferenceNode }
from './inference/steep-road-inference-node.js';

import { runInference }
from './inference/inference-engine.js';

import { 
    formatJourneyDistance,
    formatLatitudeLongitude
} 
from './utils/format.js';

import { processAcquisitionRequests }
from './acquisition/acquisition-engine.js';

import { logInfo }
from './log/application-log.js';

import { addMouseMoveListener }
from './map/map.js';

import { setStatusInferenceEngine }
from './status-bar/status-bar.js';

const map = createMap();

// set defaults
let route = null;

initialiseRouteSelection(map);

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

let dragging = false;    

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

logInfo({message: 'openmatrixproject driverAssist started'});
logInfo({message: ''});
logInfo({message: 'Click on the map to select journey start point'});
logInfo({message: 'Click on the map to select journey end point'});
logInfo({message: 'Click [Calculate Route] button to request the route'});
logInfo({message: 'Check the steepness tickbox to show coloured gradient segments on the route'});

// add mouse move listener to update status bar with latitude and longitude
addMouseMoveListener(map);

// route planner button click handler
document
    .getElementById('btnRoute')
    .addEventListener('click', async () => {
        const { start, end } = getRoutePoints();

        if (!start || !end) {
            alert('Please click on journey start and end points.');
            return;
        }

        const btnRoute = document.getElementById('btnRoute');
        btnRoute.disabled = true;
        setStatusInferenceEngine('Running');

        try {
            // request route
            let logEntry = logInfo({
                duration: true, 
                message: `Request: environment.map.route from ${formatLatitudeLongitude(start.lat, start.lng)} to ${formatLatitudeLongitude(end.lat, end.lng)}`
            });
            const geojson = await getRoute(start, end);
            logInfo(logEntry);

            // draw route on map
            drawRoute(map, geojson);

            // create route model from route geojson
            route = createRouteModel(geojson);

            // add steepness inference nodes to the route model from the route's coordinate data and add corresponding evidence entries to the route.
            route.inferenceNodes.push(new SteepRoadInferenceNode());
            addSteepnessEvidence(route);

            // run inference engine to process route evidence and update route model
            runInference(route);

            // update side-bar UI with route acquisition requests
            refreshAcquisitionRequestsUi(route);

            // process acquisition requests
            const plural = route.acquisitionRequests.length === 1 ? '' : 's';
            logEntry = logInfo({
                duration: true, 
                message: `Acquisition: Process ${route.acquisitionRequests.length} request${plural}`
            });
            await processAcquisitionRequests(route);
            logInfo(logEntry);

            // update side-bar UI with route evidence and metrics
            refreshEvidenceUi(route);
            refreshEvidenceMetricsUi(route);

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
        }
    });

function refreshEvidenceUi(route) {

    const evidenceTypes =
        getEvidenceTypes(route);

    const showContent =
        document.getElementById(
            'showContent'
        );

    showContent.innerHTML = '';

    evidenceTypes.forEach(type => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = type;

        checkbox.addEventListener(
            'change',
            event => {
                if (
                    event.target.value ===
                    'steepness'
                ) {
                    if (
                        event.target.checked
                    ) {
                        renderSteepnessEvidence(
                            map,
                            route
                        );
                    }
                    else {
                        clearSteepnessEvidence();
                    }
                }
            }
        );

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.append(` ${type}`);
        label.className = 'details-level-1';
        showContent.appendChild(label);
        showContent.appendChild(document.createElement('br'));
    });
}

function refreshEvidenceMetricsUi(
    route
) {
    const evidenceTypes = getEvidenceTypes(route);
    const evidenceSources = getEvidenceSources(route);
    const evidenceMetricsContent = document.getElementById('evidenceMetricsContent');

    evidenceMetricsContent.innerHTML = '';

    let evidenceHeading = document.createElement('div');
    evidenceHeading.className = 'details-level-1';
    evidenceHeading.textContent = 'Types';
    evidenceMetricsContent.appendChild(evidenceHeading);

    evidenceTypes.forEach(type => {
        const count =
        getEvidenceByType(
            route,
            type
        ).length;

        const div = document.createElement('div');
        div.className = 'details-level-2';
        div.textContent = `${type}: ${count}`;
        evidenceMetricsContent.appendChild(div);
    });

    evidenceHeading = document.createElement('div');
    evidenceHeading.className = 'details-level-1';
    evidenceHeading.textContent = 'Sources';
    evidenceMetricsContent.appendChild(evidenceHeading);

    evidenceSources.forEach(source => {
        const count =
        getEvidenceBySource(
            route,
            source
        ).length;

        const div = document.createElement('div');
        div.className = 'details-level-2';
        div.textContent = `${source}: ${count}`;
        evidenceMetricsContent.appendChild(div);
    });
}

function refreshAcquisitionRequestsUi(
    route
) {

    const acquisitionRequestsContent =
        document.getElementById(
            'acquisitionRequestsContent'
        );

    acquisitionRequestsContent.innerHTML = '';

    document.getElementById(
        'acquisitionRequestsSummary'
    ).textContent =

        `Acquisition Requests (${
            route.acquisitionRequests.length
        })`;

    const requestCounts = {};

    route.acquisitionRequests.forEach(
        request => {

            requestCounts[
                request.type
            ] =

                (
                    requestCounts[
                        request.type
                    ] ?? 0
                ) + 1;
        }
    );

    Object.keys(
        requestCounts
    )
    .sort()
    .forEach(
        type => {

            const p =
                document.createElement(
                    'p'
                );

            p.className =
                'details-level-1';

            p.textContent =
                `${type}: ${
                    requestCounts[type]
                }`;

            acquisitionRequestsContent
                .appendChild(
                    p
                );
        }
    );
}
