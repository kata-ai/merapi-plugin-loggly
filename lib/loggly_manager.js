"use strict";

const Component = require("@yesboss/merapi/component");
const winston = require("winston");
require("winston-loggly-bulk");
const os = require("os");

class LogglyManager extends Component {
    constructor(config) {
        super();
        this.config = config;
    }

    createLogger(component) {
        let stack = this.config.default("logging.loggly.stack-name", "no-stack");
        let hostname = os.hostname();
        let name = this.config.default("name", this.config("package.name"));

        let tags = [stack, hostname, name];
        // if component is undefined 
        // dont add it to the tags
        // to prevent error on loggly
        if (component)
            tags.push(component);


        let logConfig = {
            timestamp: true,
            level: this.config.default("logging.loggly.level", "verbose"),
            subdomain: this.config.default("logging.loggly.subdomain", undefined), // required
            inputToken: this.config.default("logging.loggly.token", undefined), // require
            json: this.config.default("logging.loggly.json", true),
            tags: tags,
            name: "loggly"
        };

        let logger = new winston.Logger({
            transports: [
                new winston.transports.Loggly(logConfig),
                new winston.transports.Console({
                    timestamp: true,
                    name: "console",
                    level: logConfig.level,
                    colorize: true,
                    label: component ? name + "/" + component : name
                })
            ]
        });

        return logger;
    }
}

module.exports = LogglyManager;