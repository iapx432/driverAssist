// route-inspector.js
// A simple module to inspect route data and evidence at specific distances along the route.

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