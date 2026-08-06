/**
 * Represents where a feature or location is in the real world.
 *
 * A Canonical SpatialReference encapsulates the driverAssist representation
 * of a ProviderSpatialReference and provides the basis for additional interpretation.
 *
 * @al_contains Point
 * @al_contains PolyLine
 *
 */
export class CanonicalSpatialReference {

    /**
     * Provenance.
     *
     * The ProviderSpatialReference or null if not derived from a provider for example
     * the user's location.
     *
     */
    providerSpatialReference = null;

    /**
     * The recursive items array can hold arbitrary collections of Points and Polylines.
     * 
     * This is pure geometry and does not include any additional information such as a feature's properties or metadata. 
     * 
     * Examples:
     * 
     *   A single point: [Point]
     *   A single polyline: [Polyline] which may have one or more lines present and be open or closed.
     *   An array of points: [Point, Point, ...]
     *   An array of points or polylines: [Point, Polyline, Point, Polyline, ...]
     *   An array of polylines: [Polyline, Polyline, ...]
     *   An array of Arrays of points: [[Point, Point], [Point, Point], ...] for use as a point field for example a weather grid cell
     *   An array of Arrays of polylines: [[Polyline, Polyline], [Polyline, Polyline], ...] for use as a polyline field for example a route geometry
     */
    items = [];
}