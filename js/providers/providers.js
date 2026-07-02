export const providers = [
    {
        "id": "osm",
        "name": "OpenStreetMap",
        "api": {
            "url": "https://overpass-api.de/api/interpreter",
            "testFunction": "testOsmConnection",
            "requiresApiKey": false
        },
        "websites": [
            {
                "description": "Main OpenStreetMap website",
                "url": "https://www.openstreetmap.org/"
            },
            {
                "description": "Overpass Turbo query tool",
                "url": "https://overpass-turbo.eu/"
            }
        ],
    },
    {
        "id": "ors",
        "name": "OpenRouteService",
        "api": {
            "url": "https://api.openrouteservice.org/v2/directions",
            "testFunction": "testOrsConnection",
            "registrationUrl": "https://api.openrouteservice.org/",
            "requiresApiKey": true
        },
        "websites": [
            {
                "description": "Main OpenRouteService website",
                "url": "https://openrouteservice.org/"
            }
        ],
        "profiles": [
            {
                "id": "driving-car",
                "name": "Driving Car",
                "description": "Optimized for car travel, avoiding unpaved roads and ferries.",
                "parameters": {
                    "avoid_features": ["unpavedroads", "ferries"]
                }
            },
            {
                "id": "driving-hgv",
                "name": "Heavy Goods Vehicle",
                "description": "Optimized for heavy goods vehicles with size/weight restrictions.",
                "parameters": {
                    "avoid_features": ["unpavedroads", "ferries"] 
                }
            }

            /*  profiles available from OpenRouteService:

                driving-car: Standard car routing
                driving-hgv: Heavy goods vehicles with size/weight restrictions
                cycling-regular: Standard bicycle routing
                cycling-mountain: Mountain biking with preference for suitable trails
                cycling-road: Road cycling optimized for paved surfaces
                cycling-electric: Electric bicycles with adjusted climbing capabilities
                foot-walking: Pedestrian routing
                foot-hiking: Hiking with consideration for trails and paths
                wheelchair: Wheelchair routing with accessibility considerations
                public-transport: Public transportation routing (where data is available)            
            */

        ]
    },
    {
        "id": "locationIq",
        "name": "LocationIQ",
        "api": {
            "url": "https://us1.locationiq.com/v1/search.php",
            "testFunction": "testLocationIqConnection",
            "requiresKey": true,
            "registrationUrl": "https://my.locationiq.com/register"
        },
        "websites": [
            {
                "description": "Main LocationIQ website",
                "url": "https://locationiq.com/"
            }
        ]
    }
];

