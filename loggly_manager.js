"use strict";

const Component = require("@yesboss/merapi/component");
const winston   = require("winston");
require("winston-loggly-bulk");

class LogglyManager extends Component {
    constructor(config) {
        super();
        let logglyConfig = {};

        logglyConfig.level = config.default("logglyLogger.level", "verbose");
        logglyConfig.subdomain = config.default("logglyLogger.subdomain", undefined); // required
        logglyConfig.auth = config.default("logglyLogger.auth", undefined); // required if inputName is not empty
        logglyConfig.name = config.default("logglyLogger.name", undefined); // required
        logglyConfig.token = config.default("logglyLogger.token", undefined);
        logglyConfig.json = config.default("logglyLogger.json", true);
        logglyConfig.tags = config.default("logglyLogger.tags", []);
        logglyConfig.isBulk = config.default("logglyLogger.isBulk", true);
        logglyConfig.stripColors = config.default("logglyLogger.stripColors", false);

        this.name = config.get("name") || config.get("service.name");
        this.logglyConfig = logglyConfig;
    }

    createLogger(component) {
        let self = this;
        let logger = new (winston.Logger)({
            transports: [
                new winston.transports.Loggly(self.logglyConfig),
                new winston.transports.Console({
                    level: self.logglyConfig.level,
                    colorize: true,
                    label: self.name + "/" + component
                })
            ]
        });

        return logger;
    }
}

module.exports = LogglyManager;