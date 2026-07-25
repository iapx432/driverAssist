import { Property } from "./property.js";
import { Feature } from "./feature.js";

/**
 * Owns the DriverAssist model.
 *
 * A Catalogue stores and indexes the first-class objects that make up
 * the observed world.
 */
export class Catalogue {

    #features = new Map();
    #properties = new Map();

    /**
     * Registers a feature.
     *
     * @param {Feature} feature
     */
    addFeature(feature) {
        this.#features.set(feature.id, feature);
    }

    /**
     * Registers a property.
     *
     * @param {Property} property
     */
    addProperty(property) {
        this.#properties.set(property.name, property);
    }

    /**
     * Finds a feature by id.
     *
     * @param {string} id
     * @returns {Feature|null}
     */
    feature(id) {
        return this.#features.get(id) ?? null;
    }

    /**
     * Finds a property by name.
     *
     * @param {string} name
     * @returns {Property|null}
     */
    property(name) {
        return this.#properties.get(name) ?? null;
    }

    /**
     * Returns all registered features.
     *
     * @returns {Feature[]}
     */
    features() {
        return Array.from(this.#features.values());
    }

    /**
     * Returns all registered properties.
     *
     * @returns {Property[]}
     */
    properties() {
        return Array.from(this.#properties.values());
    }
    /**
     * 
     * @param {string} name 
     * @returns {Property|null}
     */
    findOrCreateProperty(name) {

        let property = this.property(name);

        if (!property) {
            property = new Property();
            property.name = name;
            this.addProperty(property);
        }

        return property;
    }
    /**
     * 
     * @param {Property} property 
     * @returns {Feature[]}
     */
    featuresHavingProperty(property) {

        const features = [];

        for (const feature of this.features()) {
            for (const propertyValue of feature.propertyValues) {
                if (propertyValue.property === property) {
                    features.push(feature);
                    break;
                }
            }
        }

        return features;
    }
}