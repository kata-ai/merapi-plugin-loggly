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
        let self = this;

        let stack = self.config.default("logging.loggly.stack-name", "no-stack");
        let hostname = os.hostname();
        let name = self.config.default("name", self.config("package.name"));

        let tags = [stack, hostname, name];
        // if component undefined 
        // dont add it to the tags
        // to prevent error on loggly
        if (component)
            tags.push(component);


        let logConfig = {
            timestamp: true,
            level: self.config.default("logging.loggly.level", "verbose"),
            subdomain: self.config.default("logging.loggly.subdomain", undefined), // required
            token: self.config.default("logging.loggly.token", undefined), // require
            json: self.config.default("logging.loggly.json", true),
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

        // let logger = require("winston");
        // logger.add(logger.transports.Loggly, logConfig);
        // logger.add(logger.transports.Console, {
        //     name: "Console",
        //     level: logConfig.level,
        //     colorize: true,
        //     label: component ? name + "/" + component : name
        // });
        return logger;
    }
}

module.exports = LogglyManager;