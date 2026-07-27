import { MapTilerVectorTileProvider } from "../../js/acquisition/providers/maptiler/maptiler-vector-tile-provider.js";
import { getEffectiveProvider }from '../../js/acquisition/providers/definitions.js';

import { Catalogue } from "../../js/model/catalogue.js";
import exchangeLanguage from "../../js/exchange/language/exchange-language.design.json" with { type: "json" };
import { Request } from "../../js/exchange/protocol/request.js";
import { ExchangeProcessor } from "../../js/exchange/protocol/processor.js"

import { TileResolver } from "../../js/acquisition/tiles/tile-resolver.js";
import { TilingPolicy } from "../../js/acquisition/tiles/tiling-policy.js";

const map = L.map("map")
    .setView([54.4858, -0.6140], 15); 

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18
    }
).addTo(map);

const mapTilerProviderDefinition = getEffectiveProvider("maptiler");

const mapTileProvider = new MapTilerVectorTileProvider();
mapTileProvider.initialise(map, mapTilerProviderDefinition.id);

setTimeout(() => {

    // populate the catalogue
    const catalogue = new Catalogue();
    mapTileProvider.catalogueVisibleFeatureProperties(catalogue);

    // create an exchange processor instance
    const exchangeProcessor = new ExchangeProcessor(catalogue, exchangeLanguage);

    // request the names of all the available catalogue sets
    const request = new Request();
    request.request = "set.list";
    const response = exchangeProcessor.execute(request);
    console.log(response);

    // get the first feature from the visible features
    const feature = catalogue.features().at(0);
    const tileResolver = new TileResolver();
    const tilingPolicy = new TilingPolicy();
    const tileIds = tileResolver.resolve(feature.spatialReference, tilingPolicy);
    console.log(tileIds);

}, 1000);
