import { MapTilerVectorTileProvider } from "../../js/acquisition/providers/maptiler/maptiler-vector-tile-provider.js";
import { getEffectiveProvider }from '../../js/acquisition/providers/definitions.js';

import { Request } from "../../js/exchange/protocol/request.js";
import { Response } from "../../js/exchange/protocol/response.js";
import exchangeLanguage from "../../js/exchange/language/exchange-language.design.json" with { type: "json" };

const btnRun = document.getElementById("btnRun");
const output = document.getElementById("output");

import { Catalogue } from "../../js/model/catalogue.js";
import { ExchangeProcessor } from "../../js/exchange/protocol/processor.js"

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
    // const featureLayerNames = mapTileProvider.acquireVisibleFeatureLayerNames();
    console.log({
        viewZoom: map.getZoom(),
        layerNames: mapTileProvider.acquireVisibleFeatureLayerNames(),
        layerProperties: mapTileProvider.acquireVisibleFeaturePropertyUsage(),
        providerZoom: mapTileProvider.getZoomLevel()
    });

    // populate the catalogue
    const catalogue = new Catalogue();
    mapTileProvider.catalogueVisibleFeatureProperties(catalogue);
    console.log(catalogue);

    // load the exchange language
    console.log(exchangeLanguage);

    // create an exchange processor instance
    const exchangeProcessor = new ExchangeProcessor(catalogue, exchangeLanguage);

    // create a new request
    const request = new Request();
    request.request = "set.get";
    request.name = "property";
    const response = exchangeProcessor.execute(request);

    console.log(response);
}, 3000);
