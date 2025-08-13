// utils/getCaller.js
const callsites = require('callsites');

function getCaller() {
    const sites = callsites();
    // Skip 2 frame (1 untuk getCaller, 1 untuk logger)
    if (sites.length > 2) {
        const fn = sites[2].getFunctionName();
        const methodName = sites[2].getMethodName();
        return fn || methodName || 'anonymous';
    }
    return 'unknown';
}

module.exports = getCaller;