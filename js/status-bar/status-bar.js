export function setStatusCursor(message) {
    const statusCursor = document.getElementById('statusCursor');
    statusCursor.textContent = message;
}

export function setStatusInferenceEngine(message) {
    const statusInferenceEngine = document.getElementById('statusInferenceEngine');
    statusInferenceEngine.textContent = message;
}

export function setStatusGuidance(message) {
    const statusGuidance = document.getElementById('statusGuidance');
    statusGuidance.textContent = message;
}

export function updateStatusGuidance(message, update) {
    const statusGuidance = document.getElementById('statusGuidance');

    // only extend the guidance message with the update if the guidance message has the expected value
    // this can happen if mouse has moved significantly and the address shown is now different
    if (statusGuidance.textContent == message) {
        statusGuidance.textContent = message + " | " + update;
    }
}