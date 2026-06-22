// httpRequest.js
// A simple wrapper around the Fetch API to handle HTTP requests and responses.

export async function httpRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            options
        );

    if (!response.ok) {
        throw new Error(
            `HTTP [${response.status}]: ${response.statusText}`
        );
    }

    return await response.json();
}