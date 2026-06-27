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

export function initialiseApplication() {

    const map = createMap();
    initialiseRouteSelection(map, setStatusGuidance);
    initialiseLogging();
    initialiseStatusBar();
    initialiseMouseTracking(map);
    initialiseWindowLayout();
    registerApplicationEvents(map);
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