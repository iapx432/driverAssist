import { Catalogue } from "../../../model/catalogue.js";
import { Feature } from "../../../model/feature.js";
import { Property } from "../../../model/property.js";
import { PropertyValue } from "../../../model/property-value.js";
import { ProviderSpatialReference } from "../../../spatial/provider/spatial-reference.js";
import { getEffectiveProvider } from "../definitions.js";


/**
 * Driver Assist acquisition provider: MapTiler Vector Tile Provider.
 *
 * This provider is responsible for acquiring vector tile data from the MapTiler service.
 * It uses the Leaflet VectorGrid plugin to render and interact with vector tiles on a Leaflet map.
 *
 * The provider supports acquiring visible features, their layer names, properties, and structure usage from the currently visible tiles on the map.    
 * It also provides methods to catalogue the visible features and their properties into a Catalogue object for further analysis and processing.
 */

/**
 * @dal_entityType Provider
 */

/**
 * Represents the MapTiler Vector Tile Provider for acquiring vector tile data.
 */
export class MapTilerVectorTileProvider {
    constructor() {
        this.map = null;
        this.#providerId = null;
        this.#vectorLayer = null;
    }

    #providerId;
    #vectorLayer;

    /**
     * Initializes the MapTiler Vector Tile Provider with the specified map and provider ID.
     * This method sets up the vector tile layer on the provided Leaflet map using the MapTiler API.
     * @param {Object} map - The Leaflet map instance.
     * @param {string} providerId - The ID of the MapTiler provider.
     */
    initialise(map, providerId) {

        const provider = getEffectiveProvider(providerId);

        const url =
            `${provider.apiUrl}` +
            `/{z}` +
            `/{x}` +
            `/{y}` +
            `.pbf` +
            `?key=${provider.apiKey}`;

        this.map = map; 
        this.#providerId = providerId;
        this.#vectorLayer =
            L.vectorGrid.protobuf(
                url,
                {
                    interactive: true,
                    getFeatureId: function (feat) {
                        return JSON.stringify(feat.geometry);
                    },
                    maxNativeZoom: 15,
                    vectorTileLayerStyles: {
                        road: [],
                        building: [],
                        water: [],
                        landcover: [],
                        landuse: [],
                        road_label: {
                            color: "red",
                            weight: 2
                        },
                        boundary: [],
                        place: [],
                        poi: []
                    }
                }
            );
        this.#vectorLayer.addTo(map);        
    }

    /**
     * Retrieves the current zoom level of the map and the maximum native zoom level of the vector tiles.
     * @returns {Object} An object containing the current acquisition zoom level and the maximum native zoom level.
     */
    getZoomLevel(){
        return ({
            acquisitionZoom: this.#vectorLayer._map.getZoom(),
            maxNativeZoom: this.#vectorLayer.options.maxNativeZoom
        });
    }

    /**
     * Acquires the visible features from the vector tiles for a specific layer name.
     * This method iterates through the visible tiles and collects features that match the specified layer name.
     * @param {string} layerName - The name of the layer to acquire features from.
     * @returns {Array} An array of visible features for the specified layer name.
     */
    acquireVisibleFeatures(layerName) {
        const features = [];
        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {
            for (const entry of Object.values(tile._features)) {
                if (entry.layerName === layerName) {
                    features.push(entry.feature);
                }
            }
        }
        return features;
    }

    /**
     * Acquires the names of the visible feature layers from the vector tiles.
     * This method creates a map of unique entry.layerName values for each tile.
     * @returns {Map} A map where the keys are tile coordinates and the values are arrays of layer names.
     */
    acquireVisibleFeatureLayerNames() {
        const featureLayerNames = new Map();


        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {
            const tileLayerNames = [];


            for (const entry of Object.values(tile._features)) {
                if (!tileLayerNames.includes(entry.layerName)) {
                    tileLayerNames.push(entry.layerName);
                }
            }
            featureLayerNames.set(`${tile._tileCoord.x}:${tile._tileCoord.y}:${tile._tileCoord.z}`, tileLayerNames);
        }

        return featureLayerNames;
    }

    /**
     * Acquires the names of the properties for each visible feature layer from the vector tiles.
     * This method creates a map of unique entry.feature.properties object member property names for each layer.
     * @returns {Map} A map where the keys are layer names and the values are objects containing property names.
     */
    acquireVisibleFeatureLayerNameProperties() {
        const featureNames = new Map();

        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {
            const layerProperties = [];
            for (const entry of Object.values(tile._features)) {
                let layer = featureNames.get(entry.layerName);
                if (!featureNames.has(entry.layerName)) {
                    layer = {
                        propertyNames: []
                    };
                    featureNames.set(entry.layerName, layer);
                }
                for (const propertyName of Object.keys(entry.feature.properties)) {
                    if (!layer.propertyNames.includes(propertyName)) {
                        layer.propertyNames.push(propertyName);
                    }
                }
            }
        }

        return featureNames;
    }

    /**
     * Acquires the usage of visible feature properties from the vector tiles.
     * This method creates a map of unique entry.feature.properties object member property names and their values.
     * @returns {Map} A map where the keys are layer names and the values are objects containing property usage information.
     */
    acquireVisibleFeaturePropertyUsage() {
        const features = new Map();
        const propertyNames = [];

        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {
            for (const entry of Object.values(tile._features)) {
                let feature = features.get(entry.layerName);
                if (!feature) {
                    feature = {
                        properties: new Map(),
                        instanceCount: 0
                    };
                    features.set(entry.layerName, feature);
                }
                for (const [propertyName, propertyValue] of Object.entries(entry.feature.properties)) {
                    if (!propertyNames.includes(propertyName)) {
                        propertyNames.push(propertyName);
                    }
                    let property = feature.properties.get(propertyName);
                    if (!property) {
                        property = {
                            instanceCount: 0,
                            values: new Map()   // map of value and associated meaning
                        };
                        feature.properties.set(propertyName, property);
                    }
                    property.instanceCount++;
                    property.values.set(propertyValue, (property.values.get(propertyValue) || 0) + 1);
                }
                feature.instanceCount++;
            }
        }

        return features;
    }

    /**
     * Acquires the IDs of the visible vector tiles on the map.
     * This method returns an array of tile IDs in the format "x:y:z" for each visible tile.
     * @returns {Array} An array of visible vector tile IDs.
     */
    acquireVisibleFeatureTileIds() {
        const featureTileIds = [];
        const ids = Object.keys(this.#vectorLayer._vectorTiles);
        return ids;
    }

    /**
     * Catalogues the visible features from the vector tiles into a Catalogue object.
     * This method creates Feature objects for each visible feature, along with their associated properties and spatial references.
     * @param {Catalogue} catalogue - The Catalogue object to populate with the visible features.
     * @returns {void}
     */
    catalogueVisibleFeatureProperties(catalogue) {

        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {

            for (const entry of Object.values(tile._features)) {

                // build a feature for the catalogue
                const feature = new Feature();

                feature.source = "maptiler";
                
                feature.sourceObservations.layerName = entry.layerName;

                // build a spatial reference for the catalogue
                const spatialReference = new ProviderSpatialReference();

                spatialReference.source = this.#providerId;

                spatialReference.representation = {
                    tile: tile._tileCoord
                };

                if (entry.feature._point) {
                    spatialReference.representation.point = entry.feature._point;
                }    
                if (entry.feature._parts) {
                    spatialReference.representation.parts = entry.feature._parts;
                }

                // check that spatialReference.representation has either a point or parts property
                if (!spatialReference.representation.point && !spatialReference.representation.parts) {
                    console.warn(`Feature ${entry.layerName} has no point or parts property in spatial reference representation`);
                }

                feature.spatialReference = spatialReference;

                // add the properties to the feature
                for (const [propertyName, sourceValue] of Object.entries(entry.feature.properties)) {
                    const property = catalogue.findOrCreateProperty(propertyName);
                    property.source = this.#providerId;
                    const propertyValue = new PropertyValue();

                    propertyValue.source = this.#providerId;
                    propertyValue.feature = feature;
                    propertyValue.property = property;
                    propertyValue.value = sourceValue;

                    feature.addPropertyValue(propertyValue);                    
                }

                // catalogue the feature 
                catalogue.addFeature(feature);
            }
        }
    }

    /**
     * Acquires the structure usage of visible features from the vector tiles.
     * This method creates a map of unique entry.feature object member property names and their types.
     * 
     * @returns {Map} A map where the keys are archetypes (e.g., "point", "geometry") and the values are objects containing layer names and property names.
     */
    acquireVisibleFeatureStructureUsage() {

        // create a map of unique entry.feature object member property names and their types

        const featureStructureUsage = new Map();
        for (const tile of Object.values(this.#vectorLayer._vectorTiles)) {

            for (const entry of Object.values(tile._features)) {

                const featureObjectMemberPropertyNames = [];
                for (const [propertyName, propertyValue] of Object.entries(entry.feature)) {
                    if (!featureObjectMemberPropertyNames.includes(propertyName)) {
                        featureObjectMemberPropertyNames.push(propertyName);
                    }
                }
                const featureStructureKey = `${featureObjectMemberPropertyNames.sort().join("|")}`;
                let archetype;

                if (entry.feature._point) {
                    archetype = "point";
                }

                if (entry.feature._parts) {
                    archetype = "geometry";
                }

                if (!featureStructureUsage.has(archetype)) {
                    featureStructureUsage.set(archetype, {
                        layerNames: [entry.layerName],
                        propertyNames: featureObjectMemberPropertyNames
                    });
                } else {
                    const featureStructure = featureStructureUsage.get(archetype);
                    if (!featureStructure.layerNames.includes(entry.layerName)) {
                        featureStructure.layerNames.push(entry.layerName);
                    }
                }
            }
        }
        console.log("Feature structure usage:", featureStructureUsage);
    }
}
