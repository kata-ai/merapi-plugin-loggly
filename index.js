"use strict";

const LogglyManager = require("./lib/loggly_manager");

module.exports = function () {
    return {
        dependencies: [],

        *onBeforeComponentsRegister(container) {
            container.register("osStats", require("./lib/os_stats"));
        },

        *onAfterComponentsRegister(container) {
            container.register("logglyManager", LogglyManager);
            container.injector.register("logger", require("./lib/logger"));
        },

        *onInit(container) {
            yield container.resolve("osStats");
        }
    };
};