// httpRequest.js
// A simple wrapper around the Fetch API to handle HTTP requests and responses.

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_ACCEPTED = 202;
export const HTTP_STATUS_NO_CONTENT = 204;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_GATEWAY_TIMEOUT = 504;
    

export async function httpRequest(
    url,
    options = {}
) {

    try {
        const response =
            await fetch(
                url,
                options
            );
    
        if (response.status !== HTTP_STATUS_OK) {
            throw response;
        }
    
        return response.json();
    } catch (error) {
        console.error('HTTP request failed:', error);
        throw error;
    }
}