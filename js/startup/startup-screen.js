
import { providers }
from '../providers/provider-definitions.js';

import { 
    getProviderApiKey,
    setProviderApiKey
 } 
from '../settings/settings.js';

import { continueApplicationStartup }
from '../application/application.js';

const providerConnectionStatus = {};

export function showStartupScreen() {

    const startupScreen =
        document.getElementById(
            'startupScreen'
        );

    startupScreen.innerHTML = '';

    for (const provider of providers) {

        renderProvider(provider);

    }

    renderContinueButton();
}

export function renderProvider(
    provider
) {

    const startupScreen =
        document.getElementById(
            'startupScreen'
        );

    const card = document.createElement("div");
    card.id = `provider-${provider.id}`;

    const heading = document.createElement("h3");
    heading.textContent = provider.name;
    card.appendChild(heading);
    
    const description = document.createElement("p");
    description.textContent = provider.description;
    card.appendChild(description);

    if (provider.requiresApiKey) {
        const apiKeyDiv = document.createElement("div");

            const keyLabel = document.createElement("label");
            keyLabel.textContent = "API Key: ";
            apiKeyDiv.appendChild(keyLabel);

            const keyInput = document.createElement("input");
            keyInput.type = "password";
            keyInput.id = `provider-key-${provider.id}`;
            keyInput.placeholder = "Enter API key";

            keyInput.value = getProviderApiKey(provider.id);            
            keyInput.addEventListener(
                "change",
                () => {
            
                    setProviderApiKey(
                        provider.id,
                        keyInput.value
                    );
            
                    console.log(
                        `Saved API key for ${provider.id}`
                    );
            
                }
            );
            apiKeyDiv.appendChild(keyInput);
            
            const testButton = document.createElement("button");
            testButton.textContent = "Test Connection";
            testButton.id = `provider-test-${provider.id}`;
            apiKeyDiv.appendChild(testButton);
        
            card.appendChild(apiKeyDiv);

        const getApiKeyDiv = document.createElement("div");

            const getApiKeyLabel = document.createElement("label");
            getApiKeyLabel.textContent = provider.registrationUrl + " ";
            getApiKeyDiv.appendChild(getApiKeyLabel);
            
            const getApiKeyButton = document.createElement("button");
            getApiKeyButton.textContent = "Register";
            getApiKeyButton.id = `provider-getApiKey-${provider.id}`;
            getApiKeyButton.addEventListener(
                "click",
                () => {
                    window.open(
                        provider.registrationUrl,
                        "_blank"
                    );
                }
            );
            getApiKeyDiv.appendChild(getApiKeyButton);
            
            card.appendChild(getApiKeyDiv);
    }

    const status = document.createElement("div");
    status.id = `provider-status-${provider.id}`;
    status.textContent = "Waiting...";
    card.appendChild(status);

    // card.innerHTML = `
    //     <h3>${provider.name}</h3>
    //     <div>${provider.description}</div>
    //     <div>${provider.apiUrl}</div>
    //     <div id="provider-status-${provider.id}">
    //         Waiting...
    //     </div>
    //     <hr>
    // `;

    startupScreen.appendChild(card);
}

export function updateProviderStatus(
    providerId,
    result
) {

    const statusDiv =
        document.getElementById(
            `provider-status-${providerId}`
        );

    if (!statusDiv)
        return;

    statusDiv.textContent =
        result.success
            ? `✓ ${result.message}`
            : `✗ ${result.message}`;

    providerConnectionStatus[providerId] = result.success;

    updateContinueButton();

}

export function hideStartupScreen() {

    // make map visible after all provider connection tests have completed
    document.getElementById("startupScreen").style.display = "none";
    document.getElementById("map").style.display = "block";



}

function renderContinueButton() {

    const startupScreen =
        document.getElementById(
            "startupScreen"
        );

    const button =
        document.createElement("button");

    button.id = "btnContinue";
    button.textContent = "Continue";
    button.disabled = true;
    
    // the button only becomes enabled when all required startup conditions have been met:
    // - required providers have been successfully connected
    // - all choices have been provided by the user (e.g., API keys), profile selection etc.

    button.addEventListener(
        "click",
        () => {
            continueApplicationStartup();
        }
    );    
    startupScreen.appendChild(button);
}

function updateContinueButton() {

    const ready = providers.every(
        provider =>
            !provider.requireAtStartup ||
            providerConnectionStatus[provider.id] === true
    );

    const button =
        document.getElementById(
            "btnContinue"
        );

    button.disabled = !ready;
}