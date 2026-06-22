// evidence.js
// A simple module to manage evidence related to a route.
// This module provides functions to add evidence to a route, retrieve evidence based on distance or type, and specifically to add steepness evidence based on the route's coordinate data.
// The addEvidence function adds a new piece of evidence to the route's evidence array.
// The getEvidenceAtDistance function retrieves evidence that intersects with a specific distance along the route.
// The getEvidenceIntersectingSpan function retrieves evidence that intersects with a specified distance range along the route.
// The addSteepnessEvidence function analyzes the route's coordinate data to identify intervals of steepness and adds corresponding evidence entries to the route.
// The getEvidenceByType and getEvidenceBySource functions allow filtering evidence based on type or source, respectively.
// The getEvidenceTypes and getEvidenceSources functions return sorted lists of unique evidence types and sources present in the route's evidence array.

import { getSteepnessIntervals }
from './route-model.js';

export function addEvidence(
    route,
    evidence
) {

    route.evidence.push(
        evidence
    );
}

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

export function getEvidenceByType(
    route,
    type
) {

    return route.evidence.filter(

        evidence =>

            evidence.type === type
    );
}

export function getEvidenceBySource(
    route,
    source
) {

    return route.evidence.filter(

        evidence =>

            evidence.source === source
    );
}

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