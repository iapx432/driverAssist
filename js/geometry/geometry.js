/**
 * Calculates the distance between two points.
 *
 * @param {Object} point1 - The first point.
 * @param {Object} point2 - The second point.
 * @returns {number} The distance between the two points.
 * 
 */
export function distanceBetween(
    point1,
    point2
) {
    return point1.distanceTo(
        point2
    );
}