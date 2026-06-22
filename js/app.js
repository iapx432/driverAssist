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

import { formatJourneyDistance }
from './utils/format.js';

import { processAcquisitionRequests }
from './acquisition/acquisition-engine.js';

import { logInfo }
from './log/application-log.js';

const map = createMap();

// set defaults
let route = null;

initialiseRouteSelection(map);

logInfo({message: 'openmatrixproject Driver Assist application started.'});
logInfo({message: ''});
logInfo({message: 'Click on the map to select journey start point'});
logInfo({message: 'Click on the map to select journey end point'});
logInfo({message: 'Click [Calculate Route] button to request the route'});
logInfo({message: 'Tick steepness tickbox to show coloured gradient segments on the route'});

// route planner button click handler
document
    .getElementById('btnRoute')
    .addEventListener('click', async () => {
        const { start, end } = getRoutePoints();

        if (!start || !end) {
            alert('Please click on journey start and end points.');
            return;
        }

        try {
            // route request
            logInfo({message: 'Route request from Open Route Service API Started'});
            const geojson = await getRoute(start, end);
            logInfo({message: 'Route request from Open Route Service API Completed'});

            drawRoute(map, geojson);
            route = createRouteModel(geojson);
            route.inferenceNodes.push(new SteepRoadInferenceNode());
            addSteepnessEvidence(route);
            runInference(route);
            refreshAcquisitionRequestsUi(route);
            logInfo({message: 'Processing acquisition requests: Started'});
            await processAcquisitionRequests(route);
            logInfo({message: 'Processing acquisition requests: Completed'});
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
