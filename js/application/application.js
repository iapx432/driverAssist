// application.js

import { 
    refreshEvidenceUi,
    refreshEvidenceMetricsUi,
    refreshAcquisitionRequestsUi 
} from './side-bar.js';

// set defaults
let route = null;
let dragging = false;    


// createMap();

    const map = createMap();

// initialiseRouteSelection();

    initialiseRouteSelection(map, setStatusGuidance);

// initialiseLogging();

    logInfo({message: 'openmatrixproject driverAssist started'});
    logInfo({message: ''});
    logInfo({message: 'Click on the map to select journey start + end points, press [Find Route] button and tick steepness checkbox'});

// initialiseStatusBar();

    setStatusGuidance('Click start point on map');

// initialiseMouseTracking();

    // add mouse move listener to update status bar with latitude and longitude
    addMouseMoveListener(map);

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

// registerApplicationEvents();

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

                // create route model from route geojson
                route = createRouteModel(geojson);

                // add steepness inference nodes to the route model from the route's coordinate data and add corresponding evidence entries to the route.
                route.inferenceNodes.push(new SteepRoadInferenceNode());
                addSteepnessEvidence(route);

                // run inference engine to process route evidence and update route model
                setStatusInferenceEngine('Analysing');
                setStatusGuidance('Acquiring Evidence...');
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
                setStatusGuidance('Click on steepness checkbox then click of steep segment');
            }
        });

