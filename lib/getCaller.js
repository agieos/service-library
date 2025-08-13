const callsites = require('callsites');

module.exports = {
    getCaller: function() {
        try {
            const sites = callsites();
            // Skip 2 frame (1 untuk callerUtil.js, 1 untuk logger)
            if (sites.length > 2) {
                const fn = sites[2].getFunctionName();
                const methodName = sites[2].getMethodName();
                const typeName = sites[2].getTypeName();
                
                return fn || methodName || typeName || 'anonymous';
            }
            return 'unknown';
        } catch (e) {
            return 'error_getting_caller';
        }
    }
};
