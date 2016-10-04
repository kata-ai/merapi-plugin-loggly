"use strict";

// exports.factory
module.exports = function($meta, logglyManager) {
    return logglyManager.createLogger($meta.caller);
};
