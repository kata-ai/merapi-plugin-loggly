"use strict";

const LogglyManager = require("./loggly_manager");

module.exports = function () {
    return {
        dependencies: [],

        *onBeforeComponentsRegister(container) {
            container.register("logglyManager", LogglyManager);
            container.register("logger", require("./lib/logger"));
        }
    };
};