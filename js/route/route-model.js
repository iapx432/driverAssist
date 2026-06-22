// route-model.js
// A simple module to manage the route model, including processing GeoJSON data from the ORS API and providing utility functions to access route information such as coordinates, steepness segments, and distance calculations.
// The createRouteModel function takes GeoJSON data from the ORS API and constructs a route model object that includes distance, duration, ascent, descent, coordinates, coordinate data with cumulative distance, steepness segments, and an evidence array.
// The getCoordinate function retrieves the longitude, latitude, and elevation for a specific index in the coordinates array.
// The getSteepnessSegment function retrieves the steepness segment information for a given index.
// The distanceBetweenCoordinates function calculates the distance in meters between two geographic points using the Haversine formula.
// The buildCoordinateData function processes the coordinates array to create an array of coordinate data objects that include longitude, latitude, elevation, and cumulative distance from the start of the route.
// The getSteepnessInterval function retrieves the steepness interval information for a given index, including start and end indices, distances, length, and category.
// The getSteepnessIntervals function returns an array of all steepness intervals for the route.
// The getCoordinateAtDistance function retrieves the coordinate data for the point along the route that is at or just after a specified distance in meters.

export function createRouteModel(geojson) {

    const feature =
        geojson.features[0];

    const properties =
        feature.properties;

    const geometry =
        feature.geometry;

    const coordinates =
        geometry.coordinates;

    const summary =
        properties.summary;

    const steepnessValues =
        properties.extras?.steepness?.values ?? [];

    const steepnessSegments =
        steepnessValues.map(
            ([startIndex, endIndex, category]) => ({

                startIndex,

                endIndex,

                category

            })
        );

    const coordinateData =
        buildCoordinateData(
            coordinates
        );

    return {
        distanceM: summary.distance,
        durationS: summary.duration,
        ascentM: properties.ascent,
        descentM: properties.descent,
        coordinates,
        coordinateData,
        steepnessSegments,
        steepnessSummary: properties.extras?.steepness?.summary ?? [],
        evidence: [],
        inferenceNodes: [],
        acquisitionRequests: []
    };
}

export function getCoordinate(
    coordinates,
    index
) {

    const [lng, lat, elevation] =
        coordinates[index];

    return {

        lng,
        lat,
        elevation
    };
}

export function getSteepnessSegment(
    route,
    index
) {

    return route.steepnessSegments[index];
}

export function distanceBetweenCoordinates(
    pointA,
    pointB
) {

    const R = 6371000;

    const lat1 =
        pointA.lat * Math.PI / 180;

    const lat2 =
        pointB.lat * Math.PI / 180;

    const dLat =
        (pointB.lat - pointA.lat)
        * Math.PI / 180;

    const dLng =
        (pointB.lng - pointA.lng)
        * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(lat1) *
        Math.cos(lat2) *

        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

function buildCoordinateData(
    coordinates
) {

    const coordinateData = [];

    let cumulativeDistance = 0;

    for (
        let i = 0;
        i < coordinates.length;
        i++
    ) {

        const [lng, lat, elevation] =
            coordinates[i];

        if (i > 0) {

            const previous =
                coordinateData[i - 1];

            cumulativeDistance +=
                distanceBetweenCoordinates(
                    previous,
                    {
                        lat,
                        lng
                    }
                );
        }

        coordinateData.push({

            index: i,

            lng,
            lat,

            elevation,

            distanceM:
                cumulativeDistance
        });
    }

    return coordinateData;
}

export function getSteepnessInterval(
    route,
    index
) {

    const segment =
        route.steepnessSegments[index];

    const start =
        route.coordinateData[
            segment.startIndex
        ];

    const end =
        route.coordinateData[
            segment.endIndex
        ];

    return {

        startIndex:
            segment.startIndex,

        endIndex:
            segment.endIndex,

        startM:
            start.distanceM,

        endM:
            end.distanceM,

        lengthM:
            end.distanceM -
            start.distanceM,

        category:
            segment.category
    };
}

export function getSteepnessIntervals(route) {

    return route.steepnessSegments.map(
        segment => {

            const start =
                route.coordinateData[
                    segment.startIndex
                ];

            const end =
                route.coordinateData[
                    segment.endIndex
                ];

            return {

                startIndex:
                    segment.startIndex,

                endIndex:
                    segment.endIndex,

                startM:
                    start.distanceM,

                endM:
                    end.distanceM,

                lengthM:
                    end.distanceM -
                    start.distanceM,

                category:
                    segment.category
            };
        }
    );
}

export function getCoordinateAtDistance(
    route,
    distanceM
) {

    return route.coordinateData.find(
        point =>
            point.distanceM >= distanceM
    );
}
