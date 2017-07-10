"use strict";

exports.factory = function ($meta, logglyManager) {
    return logglyManager.createLogger($meta.caller);
};