// locationIq.js

// A simple module to convert a [lat, lng] into a street address.
// Note: You need to set your LOCATIONIQ_GEOCODE_URL in the config.js file for this to work.

import { LOCATIONIQ_API_KEY }
from '../config.js';

import { httpRequest}
from '../http/httpRequest.js';

const LOCATIONIQ_GEOCODE_URL = `https://us1.locationiq.com/v1/reverse`

export async function getAddressFromLatitudeLongitude(
    lat,
    lng
) {
    try {

        const url =
            `${LOCATIONIQ_GEOCODE_URL}` +
            `?key=${LOCATIONIQ_API_KEY}` +
            `&lat=${lat}` +
            `&lon=${lng}` +
            `&format=json`;        

        const response =  await httpRequest(
            url,
            {
                method: 'GET'
            }
        );

        return response;

    } catch (error) {
        console.error('Error fetching AddressFromLatitudeLongitude:', error);
        throw error;
    }
}
