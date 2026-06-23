export function formatJourneyDistance(
    distanceM,
    kmPrecision = 3
) {
    if (distanceM >= 1000) {

        return `${Number(
            distanceM / 1000
        ).toFixed(kmPrecision)}km`;
    }

    return `${Number(
        distanceM
    ).toFixed(0)}m`;
}

export function formatLatitudeLongitude(
    latitude,
    longitude,
    precision = 5
) {
    return `[lat:${Number(
        latitude
    ).toFixed(precision)}, lng:${Number(
        longitude
    ).toFixed(precision)}]`;
}

