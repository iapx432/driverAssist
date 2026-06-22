// steepness-renderer.js
// A simple module to render steepness evidence on the map.
// This module provides functions to render steepness evidence as colored polylines on the map and to clear existing steepness evidence layers.
// The renderSteepnessEvidence function takes the map and the route as input, filters the evidence for steepness type, and renders each steepness span as a colored polyline on the map.

import {
    formatJourneyDistance
}
from '../utils/format.js';

let steepnessLayers = [];

export function clearSteepnessEvidence() {

    steepnessLayers.forEach(
        layer => layer.remove()
    );

    steepnessLayers = [];
}

export function renderSteepnessEvidence(
    map,
    route
) {

    clearSteepnessEvidence();

    const steepnessEvidence =
        route.evidence.filter(
            evidence =>
                evidence.type === 'steepness'
        );

    steepnessEvidence.forEach(
        (evidence, index) => {
            renderSteepnessSpan(
                map,
                route,
                evidence,
                index
            );
        }
    );
}

function renderSteepnessSpan(
    map,
    route,
    evidence,
    index
) {
    const points =
        route.coordinateData.filter(
            point =>
                point.distanceM >= evidence.startM &&
                point.distanceM <= evidence.endM
        );
    
    const latLngs =
        points.map(
            point => [
                point.lat,
                point.lng
            ]
        );
    
    const colours = {

        '-5': '#00008b',
        '-4': '#0000ff',
        '-3': '#4169e1',
        '-2': '#87cefa',
        '-1': '#b0e0e6',

        '0': '#808080',

        '1': '#ffd700',
        '2': '#ffa500',
        '3': '#ff8c00',
        '4': '#ff4500',
        '5': '#8b0000'
    };

    const colour =

        colours[evidence.category]

        ?? '#000000';

    console.log(
        evidence.startM,
        evidence.endM,
        latLngs.length
    );

    const layer =
        L.polyline(
            latLngs,
            {
                color: colour,
                weight: 8
            }
        ).addTo(map);
    
    layer.bindPopup(
        `
        <b>Journey Distance Start:</b> ${formatJourneyDistance(evidence.startM)}<br>
        <b>Journey Distance End:</b> ${formatJourneyDistance(evidence.endM)}<br>
        <b>Steepness Category:</b> ${evidence.category}<br>
        <b>Gradient Range:</b> ${getSteepnessRange(evidence.category)}<br>
        <b>Span Length:</b> ${formatJourneyDistance(evidence.endM - evidence.startM)}
        `
    );

    steepnessLayers.push(layer);
}

function getSteepnessRange(
    category
) {

    const ranges = {

        '-5': '>16% descent',
        '-4': '10-16% descent',
        '-3': '7-10% descent',
        '-2': '4-7% descent',
        '-1': '1-4% descent',

         '0': '+-1% gradient',

         '1': '1-4% ascent',
         '2': '4-7% ascent',
         '3': '7-10% ascent',
         '4': '10-16% ascent',
         '5': '>16% ascent'
    };

    return ranges[category]
        ?? 'Unknown';
}