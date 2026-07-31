// route-inspector.js
// A simple module to inspect route data and evidence at specific distances along the route.

/**
 * Get the interval that contains the given distance.
 * @param {Array} intervals - An array of interval objects with startM and endM properties.
 * @param {number} distanceM - The distance in meters.
 * @returns {Object|undefined} - The interval containing the distance, or undefined if none found.
 */
export function getIntervalAtDistance(
    intervals,
    distanceM
) {

    return intervals.find(
        interval =>
            distanceM >= interval.startM &&
            distanceM <= interval.endM
    );
}