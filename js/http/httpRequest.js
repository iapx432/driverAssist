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
        throw response;
    }

    return await response.json();
}