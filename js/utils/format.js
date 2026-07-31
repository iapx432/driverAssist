/**
 * Formats a journey distance in meters to a human-readable string.
 * @param {number} distanceM - The distance in meters.
 * @param {number} [kmPrecision=3] - The number of decimal places for kilometers.
 * @returns {string} The formatted distance string.
 */
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

/**
 * Formats a latitude and longitude pair to a human-readable string.
 * @param {number} latitude - The latitude value.
 * @param {number} longitude - The longitude value.
 * @param {number} [precision=5] - The number of decimal places for both latitude and longitude.
 * @param {boolean} [brackets=true] - Whether to enclose the coordinates in brackets.
 * @returns {string} The formatted latitude and longitude string.
 */
export function formatLatitudeLongitude(
    latitude,
    longitude,
    precision = 5,
    brackets = true
) {
    return `${brackets ? '[' : ''}lat:${Number(
        latitude
    ).toFixed(precision)}, lng:${Number(
        longitude
    ).toFixed(precision)}${brackets ? ']' : ''}`;
}

