/**
 * Represents where a feature exists in the real world.
 *
 * A SpatialReference encapsulates the provider-specific representation
 * of a feature's location without interpreting it.
 *
 * Examples:
 *   - Vector tile geometry
 *   - Latitude / longitude
 *   - Route geometry
 *   - Weather grid cell
 * 
 * @al_entityType ProviderSpatialReference
 * 
 */
export class ProviderSpatialReference {

    /**
     * Provenance.
     *
     * e.g. "maptiler", "osm", "ors", "weather"
     */
    source = null;

    /**
     * Provider-specific spatial representation.
     *
     * The structure is defined by the acquisition source.
     */
    representation = null;
}