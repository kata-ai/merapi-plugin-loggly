"use strict";

const LogglyManager = require("./lib/loggly_manager");

module.exports = function () {
    return {
        dependencies: [],

        *onAfterComponentsRegister(container) {
            container.register("logglyManager", LogglyManager);
            container.injector.register("logger", require("./lib/logger"));
        }
    };
};