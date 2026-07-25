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
     */
    addAnnotation(annotation) {
        this.annotations.push(annotation);
    }
}