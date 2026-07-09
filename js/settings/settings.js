export function setSettingValue(id, value) {
    localStorage.setItem(
        id,
        value
    );

    return value;
}

export function getSettingValue(id) {
    return localStorage.getItem(
        id
    );
}

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

export function saveProviderSettings(
    providerSettings
) {
    setSettingValue(
        'driverAssist.providers',
        JSON.stringify(providerSettings)
    );
}

export function getProviderApiKey(
    providerId
) {
    const providerSettings = loadProviderSettings();

    return providerSettings
        .providers[providerId]
        ?.apiKey ?? "";
}

export function setProviderApiKey(
    providerId,
    apiKey
) {
    const providerSettings = loadProviderSettings();

    providerSettings.providers[providerId] ??= {};
    providerSettings.providers[providerId].apiKey = apiKey;
    saveProviderSettings(providerSettings);
}