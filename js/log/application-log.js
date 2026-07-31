// application-log.js
// A simple module to log application events and messages to the application log in the UI.
// This module provides functions to log messages with different levels (info, warning, error) and to format timestamps for log entries.

// begin log

// const started =
//     performance.now();

// end log
// const durationS =
//     (
//         performance.now()
//         - started
//     ) / 1000;

/**
 * Logs an informational message to the application log.
 *
 * @param {Object} logEntry - The log entry object.
 * @param {string} logEntry.message - The log message.
 * @param {boolean} [logEntry.duration] - Whether to include the duration.
 * @param {number} [logEntry.startTime] - The start time for duration calculation.
 * @returns {Object} The log entry object.
 */
export function logInfo(
    logEntry
) {
    logEntry.level = 'info';

    if (logEntry.duration === true) {
        if (logEntry.startTime === undefined) {
            logEntry.startTime = performance.now();
        } else {
            const durationS =
                (
                    performance.now()
                    - logEntry.startTime
                ) / 1000;
            logEntry.message += ` (Duration: ${durationS.toFixed(3)}s)`;
        }
    }

    log(logEntry);
    
    return logEntry;
}

/**
 * Logs a message to the application log.
 *
 * @param {Object} logEntry - The log entry object.
 * @param {string} logEntry.message - The log message.
 * @param {string} logEntry.level - The log level (info, warning, error).
 */
function log(
    logEntry
) {
    const log = document.getElementById('applicationLog');
    const div = document.createElement('div');

    let logMessage = logEntry.message;

    if (logEntry.message.length > 0) {
        logMessage = formatTimestamp() + ' ' + logMessage;
    } else {
        logMessage = '.';
    }

    div.textContent = logMessage;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

/**
 * Formats a timestamp into a human-readable string.
 * @param {number} [timestamp=Date.now()] - The timestamp to format (in milliseconds).
 * @returns {string} The formatted timestamp in the format "HH:MM:SS.mmm".
 */

export function formatTimestamp(
    timestamp = Date.now()
) {
    const d = new Date(timestamp);

    const hh =
        String(d.getHours())
            .padStart(2, '0');

    const mm =
        String(d.getMinutes())
            .padStart(2, '0');

    const ss =
        String(d.getSeconds())
            .padStart(2, '0');

    const ms =
        String(d.getMilliseconds())
            .padStart(3, '0');

    return `${hh}:${mm}:${ss}.${ms}`;
}