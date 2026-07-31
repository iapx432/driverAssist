import { Feature } from "../spatial/feature.js";

/**
 * Driver Assist vocabulary concept: Road.
 *
 * Determines whether a Feature can be interpreted as a road,
 * regardless of which acquisition provider supplied it.
 */

/**
 * Represents a road in the Driver Assist vocabulary.
 */
export class Road {

    /**
     * Determines whether the supplied Feature represents a road.
     *
     * @param {Feature} feature
     * @returns {boolean}
     */
    static matches(feature) {

        if (!feature) {
            return false;
        }

        switch (feature.source) {

            case "maptiler":
                return Road.#matchesMapTiler(feature);

            case "osm":
                return Road.#matchesOsm(feature);

            default:
                return false;
        }
    }

    /**
     * MapTiler interpretation.
     *
     * @param {Feature} feature
     * @returns {boolean}
     */
    static #matchesMapTiler(feature) {

        return feature.sourceLayer === "road";
    }

    /**
     * OSM interpretation.
     *
     * @param {Feature} feature
     * @returns {boolean}
     */
    static #matchesOsm(feature) {

        return feature.properties?.highway !== undefined;
    }

}