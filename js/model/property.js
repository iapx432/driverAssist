/**
 * Represents a property that can be observed on one or more features.
 *
 * Examples:
 *   "surface"
 *   "oneway"
 *   "network"
 *   "name"
 *
 * A Property defines the observation itself. It does not contain
 * individual values; those are represented by PropertyValue.
 */

/**
 * @typedef Property
 * @property {string} id - Stable identifier within the catalogue.
 * @property {string|null} source - Provenance (e.g. "maptiler", "osm", "ors", "weather").
 * @property {string|null} sourceId - Provider-specific identifier.
 * @property {string|null} name - Canonical property name.
 * @property {Array<string>} annotations - Optional notes or annotations added during curation.
 */
export class Property {

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
     * Canonical property name.
     */
    name = null;

    /**
     * Optional notes or annotations added during curation.
     */
    annotations = [];

    /**
     * Adds an annotation.
     *
     * @param {string} annotation
     * @returns {void}
     */
    addAnnotation(annotation) {
        this.annotations.push(annotation);
    }
}