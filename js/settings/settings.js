
/**
 * Sets a setting value in localStorage.
 * @param {string} id - The identifier for the setting.
 * @param {string} value - The value to set for the setting.
 * @returns {string} - The value that was set.
 */
export function setSettingValue(id, value) {
    localStorage.setItem(
        id,
        value
    );

    return value;
}

/**
 * Retrieves a setting value from localStorage.
 * @param {string} id - The identifier for the setting.
 * @returns {string|null} - The value of the setting, or null if not found.
 */
export function getSettingValue(id) {
    return localStorage.getItem(
        id
    );
}

/**
 * Loads the provider settings from localStorage.
 * If no settings are found, returns a default settings object.
 * @returns {Object} - The provider settings object.
 */
export function loadProviderSettings() {
    let providerSettings = getSettingValue('driverAssist.providers');

    if (providerSettings) {
        providerSettings = JSON.parse(providerSettings);
    } else {
        providerSettings = {
            version: 1,
            providers: {}
        };
    }
    return providerSettings;
}

/**
 * Saves the provider settings to localStorage.
 * @param {Object} providerSettings - The provider settings object to save.
 * @returns {void}
 */
export function saveProviderSettings(
    providerSettings
) {
    setSettingValue(
        'driverAssist.providers',
        JSON.stringify(providerSettings)
    );
}

/**
 * Retrieves the API key for a specific provider from the provider settings.
 * @param {string} providerId - The identifier for the provider.
 * @returns {string} - The API key for the provider, or an empty string if not found.
 */
export function getProviderApiKey(
    providerId
) {
    const providerSettings = loadProviderSettings();

    return providerSettings
        .providers[providerId]
        ?.apiKey ?? "";
}

/**
 * Sets the API key for a specific provider in the provider settings.
 * @param {string} providerId - The identifier for the provider.
 * @param {string} apiKey - The API key to set for the provider.
 * @returns {void}
 */
export function setProviderApiKey(
    providerId,
    apiKey
) {
    const providerSettings = loadProviderSettings();

    providerSettings.providers[providerId] ??= {};
    providerSettings.providers[providerId].apiKey = apiKey;
    saveProviderSettings(providerSettings);
}