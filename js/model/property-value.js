/**
 * Represents a single observed value of a property on a feature.
 *
 * Examples:
 *   surface = "asphalt"
 *   oneway = true
 *   network = "gb-primary"
 */
export class PropertyValue {

    /**
     * Stable identifier within the catalogue.
     */
    id = crypto.randomUUID();

    /**
     * Provenance.
     *
     * e.g. "maptiler", "osm", "ors", "weather"
     */
    source = null;

    /**
     * Provider-specific identifier.
     */
    sourceId = null;

    /**
     * The feature this observation belongs to.
     *
     * Feature
     */
    feature = null;

    /**
     * The property being observed.
     *
     * Property
     */
    property = null;

    /**
     * The observed value.
     *
     * May be a string, number, boolean or null.
     */
    value = null;
}