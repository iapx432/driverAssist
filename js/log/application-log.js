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

export function logInfo(
    logEntry
) {
    logEntry.level = 'info';
    log(logEntry);
}

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