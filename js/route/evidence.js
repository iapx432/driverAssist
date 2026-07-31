// evidence.js
// A simple module to manage evidence related to a route.
// This module provides functions to add evidence to a route, retrieve evidence based on distance or type, and specifically to add steepness evidence based on the route's coordinate data.

import { getSteepnessIntervals }
from './route-model.js';

/**
 * Adds a new piece of evidence to the route's evidence array.
 *
 * @param {Object} route - The route object.
 * @param {Object} evidence - The evidence to add.
 */
export function addEvidence(
    route,
    evidence
) {

    route.evidence.push(
        evidence
    );
}

/**
 * Retrieves evidence that intersects with a specific distance along the route.
 *
 * @param {Object} route - The route object.
 * @param {number} distanceM - The distance along the route in meters.
 * @returns {Array<Object>} - The evidence intersecting the specified distance.
 */
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

/**
 * Retrieves evidence that intersects with a specified distance range along the route.
 * @param {Object} route - The route object.
 * @param {number} startM - The starting distance in meters.
 * @param {number} endM - The ending distance in meters.
 * @returns {Array<Object>} - The evidence intersecting the specified distance range.
 */
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

/**
 * Analyzes the route's coordinate data to identify intervals of steepness and adds corresponding evidence entries to the route.
 *
 * @param {Object} route - The route object.
 * @returns {void}
 */
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

/**
 * Retrieves evidence of a specific type from the route's evidence array.
 *
 * @param {Object} route - The route object.
 * @param {string} type - The type of evidence to filter by.
 * @returns {Array<Object>} - The evidence of the specified type.
 */
export function getEvidenceByType(
    route,
    type
) {

    return route.evidence.filter(

        evidence =>

            evidence.type === type
    );
}

/**
 * Retrieves evidence from the route's evidence array based on the source.
 *
 * @param {Object} route - The route object.
 * @param {string} source - The source of evidence to filter by.
 * @returns {Array<Object>} - The evidence from the specified source.
 */
export function getEvidenceBySource(
    route,
    source
) {

    return route.evidence.filter(

        evidence =>

            evidence.source === source
    );
}

/**
 * Retrieves a sorted list of unique evidence types present in the route's evidence array.
 *
 * @param {Object} route - The route object.
 * @returns {Array<string>} - The sorted list of unique evidence types.
 */
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

/**
 * Retrieves a sorted list of unique evidence sources present in the route's evidence array.
 *
 * @param {Object} route - The route object.
 * @returns {Array<string>} - The sorted list of unique evidence sources.
 */
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