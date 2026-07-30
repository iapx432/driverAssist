/**
 * canonical point representation
 * 
 * A point is a single location in space, represented by a latitude and longitude coordinate pair.
 * 
 * A point with no coordinates is invalid and should be represented as null.
 *
 * @dal_entityType Point
 */

export class Point {
    latitude = 0;
    longitude = 0;
}