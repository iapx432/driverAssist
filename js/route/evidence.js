// evidence.js
// A simple module to manage evidence related to a route.
// This module provides functions to add evidence to a route, retrieve evidence based on distance or type, and specifically to add steepness evidence based on the route's coordinate data.

import { getSteepnessIntervals }
from './route-model.js';

// adds a new piece of evidence to the route's evidence array.
export function addEvidence(
    route,
    evidence
) {

    route.evidence.push(
        evidence
    );
}

// retrieves evidence that intersects with a specific distance along the route.
export function getEvidenceAtDistance(
    route,
    distanceM
) {

    return getEvidenceIntersectingSpan(
        route,
        distanceM,
        distanceM
    );
}

// retrieves evidence that intersects with a specified distance range along the route.
export function getEvidenceIntersectingSpan(
    route,
    startM,
    endM
) {
    return route.evidence.filter(
        evidence =>
            evidence.endM >= startM &&
            evidence.startM <= endM
    );
}

// analyzes the route's coordinate data to identify intervals of steepness and adds corresponding evidence entries to the route.
export function addSteepnessEvidence(
    route
) {

    const intervals =
        getSteepnessIntervals(
            route
        );

    intervals.forEach(
        interval => {

            addEvidence(
                route,
                {
                    id:
                        crypto.randomUUID(),

                    source: 'ors',

                    type: 'steepness',

                    startM:
                        interval.startM,

                    endM:
                        interval.endM,

                    category:
                        interval.category
                }
            );
        }
    );
}

// allows filtering evidence based on type.
export function getEvidenceByType(
    route,
    type
) {

    return route.evidence.filter(

        evidence =>

            evidence.type === type
    );
}

// allows filtering evidence based on source.
export function getEvidenceBySource(
    route,
    source
) {

    return route.evidence.filter(

        evidence =>

            evidence.source === source
    );
}

// returns a sorted list of unique evidence types present in the route's evidence array.
export function getEvidenceTypes(
    route
) {

    return [

        ...new Set(

            route.evidence.map(

                evidence => evidence.type
            )
        )

    ].sort();
}

// returns a sorted list of unique evidence sources present in the route's evidence array.
export function getEvidenceSources(
    route
) {

    return [

        ...new Set(

            route.evidence.map(

                evidence => evidence.source
            )
        )
    ].sort();
}