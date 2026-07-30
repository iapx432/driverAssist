import { Catalogue } from "../../../model/catalogue.js";
import { Feature } from "../../../model/feature.js";
import { Property } from "../../../model/property.js";
import { PropertyValue } from "../../../model/property-value.js";
import { ProviderSpatialReference } from "../../../spatial/provider/spatial-reference.js";
import { getEffectiveProvider } from "../definitions.js";

/**
 * @dal_entityType Provider
 */

export class MapTilerVectorTileProvider {
    constructor() {
        this.map = null;
        this.#providerId = null;
        this.#vectorLayer = null;
    }

    #providerId;
    #vectorLayer;

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
    getZoomLevel(){
        return ({
            acquisitionZoom: this.#vectorLayer._map.getZoom(),
            maxNativeZoom: this.#vectorLayer.options.maxNativeZoom
        });
    }
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
    acquireVisibleFeatureTileIds() {
        const featureTileIds = [];
        const ids = Object.keys(this.#vectorLayer._vectorTiles);
        return ids;
    }
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

                // // if 
                // if (entry.layerName.startsWith('road')) {
                //     console.log(`Feature ${entry.layerName} has properties:`, entry.feature.properties);
                // }

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
