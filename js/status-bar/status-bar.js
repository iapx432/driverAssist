export function setStatusCursor(message) {
    const statusCursor = document.getElementById('statusCursor');
    statusCursor.textContent = message;
}

export function setStatusInferenceEngine(message) {
    const statusInferenceEngine = document.getElementById('statusInferenceEngine');
    statusInferenceEngine.textContent = message;
}