/**
 * Represents a single observed value of a property on a feature.
 *
 * Examples:
 *   surface = "asphalt"
 *   oneway = true
 *   network = "gb-primary"
 */

/**
 * @typedef {Object} PropertyValue
 * @property {string} id - Stable identifier within the catalogue.
 * @property {string|null} source - Provenance. e.g. "maptiler", "osm", "ors", "weather"
 * @property {string|null} sourceId - Provider-specific identifier.
 * @property {Feature|null} feature - The feature this observation belongs to.
 * @property {Property|null} property - The property being observed.
 * @property {string|number|boolean|null} value - The observed value. May be a string, number, boolean or null.
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