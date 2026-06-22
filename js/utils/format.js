export function formatJourneyDistance(
    distanceM
) {

    if (distanceM >= 1000) {

        return `${Number(
            distanceM / 1000
        ).toFixed(3)}km`;
    }

    return `${Number(
        distanceM
    ).toFixed(0)}m`;
}