
/**
 * Updates the status bar with the provided message.
 * @param {string} message - The message to display in the status bar.
 */
export function setStatusCursor(message) {
    const statusCursor = document.getElementById('statusCursor');
    statusCursor.textContent = message;
}

/**
 * Updates the status bar with the provided message.
 * @param {string} message - The message to display in the status bar.
 */
export function setStatusInferenceEngine(message) {
    const statusInferenceEngine = document.getElementById('statusInferenceEngine');
    statusInferenceEngine.textContent = message;
}

/**
 * Updates the status bar with the provided message.
 * @param {string} message - The message to display in the status bar.
 */
export function setStatusGuidance(message) {
    const statusGuidance = document.getElementById('statusGuidance');
    statusGuidance.textContent = message;
}

/**
 * Updates the status guidance message with an additional update.
 * @param {string} message - The original guidance message.
 * @param {string} update - The additional update to append to the guidance message.
 */
export function updateStatusGuidance(message, update) {
    const statusGuidance = document.getElementById('statusGuidance');

    // only extend the guidance message with the update if the guidance message has the expected value
    // this can happen if mouse has moved significantly and the address shown is now different
    if (statusGuidance.textContent == message) {
        statusGuidance.textContent = message + " | " + update;
    }
}