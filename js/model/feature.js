/**
 * Represents something that exists in the real world.
 *
 * A Feature is an immutable observation target. It owns no domain
 * intelligence; it simply relates a spatial reference and a set of
 * observed property values.
 */
export class Feature {

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
     * Where this feature exists.
     */
    spatialReference = null;

    /**
     * Observed property values.
     *
     * Array<PropertyValue>
     */
    propertyValues = [];

    /**
     * Provider-specific observations about this feature.
     */
    sourceObservations = {};

    /**
     * Adds an observed property value.
     *
     * @param {PropertyValue} propertyValue
     */
    addPropertyValue(propertyValue) {
        this.propertyValues.push(propertyValue);
    }
}